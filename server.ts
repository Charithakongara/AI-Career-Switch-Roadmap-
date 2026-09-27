import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON Schema for career roadmap generation
const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A tailored, encouraging title for this transition roadmap (e.g., 'From Marketing Specialist to Frontend Web Developer')"
    },
    summary: {
      type: Type.STRING,
      description: "High-level visual summary explaining the transition feasibility, transferrable skills, and major hurdles."
    },
    targetRoleOverview: {
      type: Type.STRING,
      description: "Brief definition of the target role, why it is exciting/valuable, and typical job market expectations."
    },
    estimatedTimeMonths: {
      type: Type.NUMBER,
      description: "Total calculated calendar duration of the career transition, in months, based on user's hours/week and target skill requirements."
    },
    difficulty: {
      type: Type.STRING,
      description: "Difficulty classification: must be one of 'Beginner Friendly', 'Moderate', 'Challenging', or 'Expert Transition'."
    },
    skillsGapAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skillName: { type: Type.STRING, description: "Name of the skill" },
          category: { type: Type.STRING, description: "Classification: 'technical', 'soft', or 'domain'" },
          currentLevel: { type: Type.STRING, description: "Assessment of their starting level, taking transferrable experience into account" },
          targetLevel: { type: Type.STRING, description: "Expected professional target level" },
          gapDescription: { type: Type.STRING, description: "Specific explanation of the gap and how their current role contrasts with the target" },
          importance: { type: Type.STRING, description: "Cruciality: 'high', 'medium', or 'low'" }
        },
        required: ["skillName", "category", "currentLevel", "targetLevel", "gapDescription", "importance"]
      },
      description: "Analysis of 4-6 key skills that must be closed, contrasting current role with target role."
    },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phaseNumber: { type: Type.INTEGER, description: "1-based order index of the phase" },
          title: { type: Type.STRING, description: "A distinct phase title, e.g. 'Foundations of UI/UX Design'" },
          description: { type: Type.STRING, description: "Core objective and focus of this phase" },
          durationWeeks: { type: Type.NUMBER, description: "Weeks required based on user's hours per week" },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Simple slug id, e.g., 'html-css-basics'" },
                name: { type: Type.STRING, description: "Topic title" },
                description: { type: Type.STRING, description: "A clear overview of what will be learned" },
                estimatedHours: { type: Type.NUMBER, description: "Estimated study hours" },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Course or resource name" },
                      type: { type: Type.STRING, description: "One of: 'course', 'book', 'article', 'video', 'tool', 'project', 'certification'" },
                      url: { type: Type.STRING, description: "Genuine or highly educational website URL (e.g. coursera.org, udemy.com, freecodecamp.org, youtube.com, developer.mozilla.org)" },
                      priceEst: { type: Type.STRING, description: "Price or 'Free'. Align strictly with user's Learning Budget" },
                      isFree: { type: Type.BOOLEAN, description: "True if resource is completely free" },
                      description: { type: Type.STRING, description: "Brief advice on how to use this resource" }
                    },
                    required: ["title", "type", "url", "priceEst", "isFree"]
                  }
                }
              },
              required: ["id", "name", "description", "estimatedHours", "resources"]
            }
          },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Slug id, e.g. 'm1-portfolio'" },
                title: { type: Type.STRING, description: "What milestone must be completed" },
                checklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Checklist of 3-5 specific sub-tasks to achieve this milestone"
                },
                deliverable: { type: Type.STRING, description: "A tangible, portfolio-ready project or artifact that serves as proof of mastery" }
              },
              required: ["id", "title", "checklist", "deliverable"]
}
          }
        },
        required: ["phaseNumber", "title", "description", "durationWeeks", "topics", "milestones"]
      },
      description: "Sequential progression (usually 3 or 4 phases) mapped from start to job-ready."
    },
    learningBudgetStrategy: {
      type: Type.STRING,
      description: "Tailored budget recommendation explaining how to allocate their dollars, highlighting high-quality free channels if budget is low/zero."
    },
    weeklySchedule: {
      type: Type.OBJECT,
      properties: {
        suggestedRoutine: { type: Type.STRING, description: "General pacing advice (e.g., '1.5 hours on weekdays before work, 4 hours on Saturday')" },
        dailyBreakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              weekday: { type: Type.STRING, description: "Monday, Tuesday, etc. or Weekdays vs Weekends" },
              focus: { type: Type.STRING, description: "Main target of study/practice" },
              hours: { type: Type.NUMBER, description: "Time to allocate" }
            },
            required: ["weekday", "focus", "hours"]
          }
        }
      },
      required: ["suggestedRoutine", "dailyBreakdown"]
    },
    jobSearchPreparation: {
      type: Type.OBJECT,
      properties: {
        resumeAdvice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 actionable rules for positioning past experience on resume" },
        portfolioStrategy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific ideas on what to host on GitHub/personal portfolio" },
        networkingActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "LinkedIn and community actions to find hidden roles" },
        interviewPrep: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key technical & behavioral concepts to master for interview" }
      },
      required: ["resumeAdvice", "portfolioStrategy", "networkingActions", "interviewPrep"]
    }
  },
  required: [
    "title",
    "summary",
    "targetRoleOverview",
    "estimatedTimeMonths",
    "difficulty",
    "skillsGapAnalysis",
    "phases",
    "learningBudgetStrategy",
    "weeklySchedule",
    "jobSearchPreparation"
  ]
};

// API Route for career switch roadmap generation
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { currentRole, targetRole, yearsExperience, hoursPerWeek, learningBudget } = req.body;

    if (!currentRole || !targetRole) {
      return res.status(400).json({ error: "Missing required fields: currentRole and targetRole" });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY under Settings > Secrets." 
      });
    }

    const systemInstruction = `You are an elite career transition advisor, workforce analyst, and curriculum designer. 
Your job is to build hyper-personalized, realistic, and highly actionable learning roadmaps for professionals switching careers.
Consider the user's details:
- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Years of Professional Experience: ${yearsExperience} years
- Hours available to study per week: ${hoursPerWeek} hours
- Learning Budget: $${learningBudget}

Always be extremely tactical:
- For skillsGapAnalysis: Leverage the user's current role to identify transferable soft skills and domain insights (e.g. if they are switching from Marketing to Software Engineering, highlight their marketing insights, communication, or analytics skills as transferable soft or domain skills!).
- For resources: Recommend high-quality, reputable resources that match the budget. If their budget is tight (e.g. $0 or < $100), prioritize free courses/docs like FreeCodeCamp, MDN, Khan Academy, Coursera (audit mode), YouTube, and open-source tutorials. If they have a higher budget, suggest books, premium bootcamps/specializations, and certifications.
- Ensure durationWeeks for each phase is mathematically logical based on hoursPerWeek and estimated hours of topics in that phase.
- Be encouraging but highly realistic about the time and effort required. Avoid generic descriptions. Let names of topics and resources be highly specific to the roles.`;

    const prompt = `Generate a comprehensive career transition roadmap for a ${currentRole} with ${yearsExperience} years of experience who wants to switch to a ${targetRole}. They have ${hoursPerWeek} hours per week available and a learning budget of $${learningBudget}. Ensure all recommended platforms and links are authentic and tailored to their budget constraint.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        temperature: 0.7,
      }
    });

    const roadmapDataText = response.text;
    if (!roadmapDataText) {
      throw new Error("No response received from Gemini.");
    }

    const roadmapData = JSON.parse(roadmapDataText.trim());
    
    // Inject custom metadata for client-side persistence
    const finalizedRoadmap = {
      id: "rm_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now(),
      createdAt: new Date().toISOString(),
      currentRole,
      targetRole,
      yearsExperience,
      hoursPerWeek,
      learningBudget,
      ...roadmapData
    };

    res.json(finalizedRoadmap);
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ 
      error: error?.message || "An error occurred while generating the career roadmap. Please try again." 
    });
  }
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Career Switch Roadmap server running on port ${PORT}`);
  });
}

startServer();
