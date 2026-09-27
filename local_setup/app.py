import os
import json
import uuid
import logging
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import oracledb
import google.generativeai as genai
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load local environment variables
load_dotenv()

app = FastAPI(
    title="AI Career Switch Roadmap Advisor API",
    description="Python & Oracle backend for generating and saving career transition plans using Google Gemini AI",
    version="1.0.0"
)

# Enable CORS for local React frontend development (typically port 5173 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to match your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini AI successfully configured.")
else:
    logger.warning("GEMINI_API_KEY environment variable is missing. Generation will fail until configured.")

# Setup Oracle Database Connection details
ORACLE_USER = os.getenv("ORACLE_USER")
ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD")
ORACLE_DSN = os.getenv("ORACLE_DSN")  # e.g. "localhost:1521/ORCL" or ADB Connection String

# Connection pool
db_pool = None
use_fallback_storage = True
local_cache = {}  # In-memory storage fallback for easier local development without DB setup

def initialize_oracle():
    global db_pool, use_fallback_storage
    if not (ORACLE_USER and ORACLE_PASSWORD and ORACLE_DSN):
        logger.warning("Oracle Database credentials not fully configured. Using local in-memory storage fallback.")
        use_fallback_storage = True
        return

    try:
        # Enable thin mode explicitly (this is the default in python-oracledb, requires no Instant Client)
        oracledb.init_oracle_client() # Thick mode if initialized, but we default to thin mode
    except Exception:
        # Ignore client init if thin mode is preferred or already initialized
        pass

    try:
        logger.info(f"Connecting to Oracle Database DSN: {ORACLE_DSN} as {ORACLE_USER}...")
        db_pool = oracledb.create_pool(
            user=ORACLE_USER,
            password=ORACLE_PASSWORD,
            dsn=ORACLE_DSN,
            min=1,
            max=5,
            increment=1
        )
        use_fallback_storage = False
        logger.info("Successfully established connection pool to Oracle Database.")
    except Exception as e:
        logger.error(f"Failed to initialize Oracle connection pool: {e}")
        logger.warning("Falling back to local in-memory storage for development.")
        use_fallback_storage = True

@app.on_event("startup")
def startup_event():
    initialize_oracle()

# Pydantic schema for Roadmap Request
class RoadmapRequest(BaseModel):
    currentRole: str
    targetRole: str
    yearsExperience: int
    hoursPerWeek: int
    learningBudget: int

# Oracle DB Helper functions
def save_roadmap_to_db(roadmap_id: str, title: str, req: RoadmapRequest, created_at: str, json_str: str) -> bool:
    if use_fallback_storage or not db_pool:
        local_cache[roadmap_id] = {
            "id": roadmap_id,
            "title": title,
            "currentRole": req.currentRole,
            "targetRole": req.targetRole,
            "yearsExperience": req.yearsExperience,
            "hoursPerWeek": req.hoursPerWeek,
            "learningBudget": req.learningBudget,
            "createdAt": created_at,
            "roadmap_json": json_str
        }
        return True

    connection = None
    cursor = None
    try:
        connection = db_pool.acquire()
        cursor = connection.cursor()
        
        insert_sql = """
            INSERT INTO CAREER_ROADMAPS (
                ID, TITLE, CURRENT_ROLE, TARGET_ROLE, YEARS_EXPERIENCE, 
                HOURS_PER_WEEK, LEARNING_BUDGET, CREATED_AT, ROADMAP_JSON
            ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)
        """
        cursor.execute(insert_sql, [
            roadmap_id, title, req.currentRole, req.targetRole, 
            req.yearsExperience, req.hoursPerWeek, req.learningBudget, 
            created_at, json_str
        ])
        connection.commit()
        logger.info(f"Successfully saved roadmap {roadmap_id} to Oracle Database.")
        return True
    except Exception as e:
        logger.error(f"Error saving roadmap to Oracle DB: {e}")
        return False
    finally:
        if cursor: cursor.close()
        if connection: db_pool.release(connection)

def fetch_all_roadmaps_from_db() -> List[dict]:
    if use_fallback_storage or not db_pool:
        results = []
        for rm in local_cache.values():
            parsed_data = json.loads(rm["roadmap_json"])
            results.append({**rm, **parsed_data})
        return results

    connection = None
    cursor = None
    try:
        connection = db_pool.acquire()
        cursor = connection.cursor()
        cursor.execute("SELECT ID, CURRENT_ROLE, TARGET_ROLE, YEARS_EXPERIENCE, HOURS_PER_WEEK, LEARNING_BUDGET, CREATED_AT, ROADMAP_JSON FROM CAREER_ROADMAPS ORDER BY CREATED_AT DESC")
        
        roadmaps = []
        for row in cursor.fetchall():
            rm_id, current_role, target_role, exp, hours, budget, created_at, clob_data = row
            # If clob_data is an Oracle Lob object, read it
            if hasattr(clob_data, 'read'):
                clob_data = clob_data.read()
            
            parsed_json = json.loads(clob_data)
            roadmaps.append({
                "id": rm_id,
                "currentRole": current_role,
                "targetRole": target_role,
                "yearsExperience": exp,
                "hoursPerWeek": hours,
                "learningBudget": budget,
                "createdAt": created_at,
                **parsed_json
            })
        return roadmaps
    except Exception as e:
        logger.error(f"Error retrieving roadmaps from Oracle DB: {e}")
        return []
    finally:
        if cursor: cursor.close()
        if connection: db_pool.release(connection)

def delete_roadmap_from_db(roadmap_id: str) -> bool:
    if use_fallback_storage or not db_pool:
        if roadmap_id in local_cache:
            del local_cache[roadmap_id]
            return True
        return False

    connection = None
    cursor = None
    try:
        connection = db_pool.acquire()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM CAREER_ROADMAPS WHERE ID = :1", [roadmap_id])
        connection.commit()
        return cursor.rowcount > 0
    except Exception as e:
        logger.error(f"Error deleting roadmap from Oracle DB: {e}")
        return False
    finally:
        if cursor: cursor.close()
        if connection: db_pool.release(connection)

# JSON Schema definition for structured Gemini responses
roadmap_schema_dict = {
    "type": "OBJECT",
    "properties": {
        "title": {
            "type": "STRING",
            "description": "Tailored, encouraging title for this transition roadmap (e.g., 'From Marketing Specialist to Frontend Web Developer')"
        },
        "summary": {
            "type": "STRING",
            "description": "High-level visual summary explaining transition feasibility, transferable skills, and major hurdles."
        },
        "targetRoleOverview": {
            "type": "STRING",
            "description": "Brief definition of the target role, why it is exciting/valuable, and typical job market expectations."
        },
        "estimatedTimeMonths": {
            "type": "INTEGER",
            "description": "Total calendar duration in months based on study speed and skill requirements."
        },
        "difficulty": {
            "type": "STRING",
            "description": "Difficulty level: 'Beginner Friendly', 'Moderate', 'Challenging', or 'Expert Transition'."
        },
        "skillsGapAnalysis": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "skillName": {"type": "STRING"},
                    "category": {"type": "STRING", "description": "Classification: 'technical', 'soft', or 'domain'"},
                    "currentLevel": {"type": "STRING"},
                    "targetLevel": {"type": "STRING"},
                    "gapDescription": {"type": "STRING"},
                    "importance": {"type": "STRING", "description": "'high', 'medium', or 'low'"}
                },
                "required": ["skillName", "category", "currentLevel", "targetLevel", "gapDescription", "importance"]
            }
        },
        "phases": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "phaseNumber": {"type": "INTEGER"},
                    "title": {"type": "STRING"},
                    "description": {"type": "STRING"},
                    "durationWeeks": {"type": "INTEGER"},
                    "topics": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "id": {"type": "STRING"},
                                "name": {"type": "STRING"},
                                "description": {"type": "STRING"},
                                "estimatedHours": {"type": "INTEGER"},
                                "resources": {
                                    "type": "ARRAY",
                                    "items": {
                                        "type": "OBJECT",
                                        "properties": {
                                            "title": {"type": "STRING"},
                                            "type": {"type": "STRING"},
                                            "url": {"type": "STRING"},
                                            "priceEst": {"type": "STRING"},
                                            "isFree": {"type": "BOOLEAN"},
                                            "description": {"type": "STRING"}
                                        },
                                        "required": ["title", "type", "url", "priceEst", "isFree"]
                                    }
                                }
                            },
                            "required": ["id", "name", "description", "estimatedHours", "resources"]
                        }
                    },
                    "milestones": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "id": {"type": "STRING"},
                                "title": {"type": "STRING"},
                                "checklist": {
                                    "type": "ARRAY",
                                    "items": {"type": "STRING"}
                                },
                                "deliverable": {"type": "STRING"}
                            },
                            "required": ["id", "title", "checklist", "deliverable"]
                        }
                    }
                },
                "required": ["phaseNumber", "title", "description", "durationWeeks", "topics", "milestones"]
            }
        },
        "learningBudgetStrategy": {
            "type": "STRING",
            "description": "Advice explaining how to allocate their learning budget."
        },
        "weeklySchedule": {
            "type": "OBJECT",
            "properties": {
                "suggestedRoutine": {"type": "STRING"},
                "dailyBreakdown": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "weekday": {"type": "STRING"},
                            "focus": {"type": "STRING"},
                            "hours": {"type": "INTEGER"}
                        },
                        "required": ["weekday", "focus", "hours"]
                    }
                }
            },
            "required": ["suggestedRoutine", "dailyBreakdown"]
        },
        "jobSearchPreparation": {
            "type": "OBJECT",
            "properties": {
                "resumeAdvice": {"type": "ARRAY", "items": {"type": "STRING"}},
                "portfolioStrategy": {"type": "ARRAY", "items": {"type": "STRING"}},
                "networkingActions": {"type": "ARRAY", "items": {"type": "STRING"}},
                "interviewPrep": {"type": "ARRAY", "items": {"type": "STRING"}}
            },
            "required": ["resumeAdvice", "portfolioStrategy", "networkingActions", "interviewPrep"]
        }
    },
    "required": [
        "title", "summary", "targetRoleOverview", "estimatedTimeMonths", "difficulty",
        "skillsGapAnalysis", "phases", "learningBudgetStrategy", "weeklySchedule", "jobSearchPreparation"
    ]
}

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="GEMINI_API_KEY is not configured on the python server."
        )

    try:
        system_instruction = f"""You are an elite career transition advisor, workforce analyst, and curriculum designer. 
Your job is to build hyper-personalized, realistic, and highly actionable learning roadmaps for professionals switching careers.
Consider the user's details:
- Current Role: {request.currentRole}
- Target Role: {request.targetRole}
- Years of Professional Experience: {request.yearsExperience} years
- Hours available to study per week: {request.hoursPerWeek} hours
- Learning Budget: ${request.learningBudget}

Always be extremely tactical:
- For skillsGapAnalysis: Leverage the user's current role to identify transferable soft skills and domain insights.
- For resources: Recommend high-quality, reputable learning channels that strictly fit their budget.
- Ensure durationWeeks is mathematically logical based on study hours."""

        prompt = f"Generate a comprehensive career transition roadmap for a {request.currentRole} with {request.yearsExperience} years of experience who wants to switch to a {request.targetRole}. They have {request.hoursPerWeek} hours per week available and a learning budget of ${request.learningBudget}."

        # Connect to Gemini API using structured response format
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash", # or gemini-1.5-flash
            system_instruction=system_instruction
        )

        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=roadmap_schema_dict,
                temperature=0.7
            )
        )

        roadmap_data_text = response.text
        if not roadmap_data_text:
            raise HTTPException(status_code=502, detail="Empty response received from Gemini model.")

        roadmap_data = json.loads(roadmap_data_text.strip())

        # Finalize schema metadata
        roadmap_id = f"rm_{uuid.uuid4().hex[:9]}_{int(datetime.now().timestamp() * 1000)}"
        created_at = datetime.utcnow().isoformat() + "Z"

        finalized_roadmap = {
            "id": roadmap_id,
            "createdAt": created_at,
            "currentRole": request.currentRole,
            "targetRole": request.targetRole,
            "yearsExperience": request.yearsExperience,
            "hoursPerWeek": request.hoursPerWeek,
            "learningBudget": request.learningBudget,
            **roadmap_data
        }

        # Convert back to JSON string for database storage
        finalized_json_str = json.dumps(roadmap_data)

        # Save to database (or fallback)
        saved = save_roadmap_to_db(
            roadmap_id, 
            finalized_roadmap["title"], 
            request, 
            created_at, 
            finalized_json_str
        )

        if not saved:
            logger.warning("Roadmap was generated but failed to save to the database.")

        return finalized_roadmap

    except Exception as e:
        logger.error(f"Error during roadmap generation: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while generating your roadmap: {str(e)}"
        )

@app.get("/api/roadmaps")
async def get_roadmaps():
    """Retrieve all saved roadmaps"""
    return fetch_all_roadmaps_from_db()

@app.delete("/api/roadmaps/{roadmap_id}")
async def delete_roadmap(roadmap_id: str):
    """Delete a roadmap by ID"""
    deleted = delete_roadmap_from_db(roadmap_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Roadmap not found or could not be deleted.")
    return {"status": "success", "message": f"Roadmap {roadmap_id} deleted."}

@app.get("/api/health")
async def health_check():
    """Server health endpoint"""
    return {
        "status": "healthy",
        "oracle_db_connected": not use_fallback_storage,
        "storage_mode": "Oracle Database" if not use_fallback_storage else "Local In-Memory Fallback"
    }

if __name__ == "__main__":
    import uvicorn
    # In local development, the server can be run via: python app.py
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
