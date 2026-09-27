# Local Setup: React JSX + Python + Oracle Database

This guide walks you through setting up and running the **AI Career Switch Roadmap Advisor** on your local machine using your favorite IDE (e.g., VS Code, PyCharm, Cursor).

The architecture consists of:
1. **Frontend**: React JSX (TypeScript) built with Vite and Tailwind CSS.
2. **Backend**: Python FastAPI server integrating with Google Gemini AI for structured curriculum generation.
3. **Database**: Oracle Database (via `python-oracledb` Thin mode) for robust cloud/local persistence of generated career plans.

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **Python** (v3.9 or higher)
* **Oracle Database** (Local instance, Docker container, or an Oracle Cloud Autonomous Database)
* **Gemini API Key** (Get yours from [Google AI Studio](https://aistudio.google.com/))

---

## 1. Database Setup (Oracle)

We will create a table named `CAREER_ROADMAPS` with native JSON verification to store generated roadmaps.

1. Connect to your Oracle database using your preferred client (SQL Developer, SQL*Plus, DBeaver, or VS Code Oracle extension).
2. Run the provided script:
   ```bash
   # Execute the statements in /local_setup/db_setup.sql
   ```
   This creates the table `CAREER_ROADMAPS` and sets up indexes on `CURRENT_ROLE` and `TARGET_ROLE` for fast query times.

---

## 2. Backend Setup (Python FastAPI)

The Python server handles the Gemini API communication and saves/retrieves roadmap records directly from Oracle Database.

1. Open your terminal and navigate to the `/local_setup` directory:
   ```bash
   cd local_setup
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   * **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```
   * **Windows (PowerShell)**:
     ```bash
     .\venv\Scripts\Activate.ps1
     ```

4. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `/local_setup` folder (or copy variables from the project root's `.env.example`):
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key"
   
   # Oracle Credentials
   ORACLE_USER="your_oracle_user"
   ORACLE_PASSWORD="your_oracle_password"
   ORACLE_DSN="localhost:1521/ORCL"  # Easy Connect string or connection descriptor
   ```
   *Note: If Oracle Database credentials are not supplied, the Python backend will gracefully fall back to in-memory local storage, so you can test generation instantly.*

6. Start the FastAPI development server:
   ```bash
   python app.py
   ```
   The API will now be running at **`http://localhost:8000`**. You can view interactive API docs at `http://localhost:8000/docs`.

---

## 3. Frontend Setup (React JSX)

Now we will run the React frontend and point it to the active Python server.

1. Navigate back to the root of the project directory (where `package.json` is located):
   ```bash
   cd ..
   ```

2. Create a local `.env` file in the root directory (or update the existing one):
   ```env
   VITE_API_URL="http://localhost:8000"
   ```
   This environment variable instructs the React JSX fetch client to request roadmaps from your local Python server instead of the default Node.js endpoints.

3. Install frontend Node modules:
   ```bash
   npm install
   ```

4. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser to the URL displayed in the terminal (typically **`http://localhost:5173`** or **`http://localhost:3000`** depending on port availability).

---

## Features Built in this Integration

* **Thin Oracle Driver**: The backend uses the official `oracledb` library configured in **Thin Mode**. This is 100% written in Python and does not require complex installation of Oracle Client libraries/SDKs on your local machine.
* **Native JSON in Oracle**: The roadmap is returned by Gemini as a strict JSON structure. It is stored natively in Oracle's database under a `CLOB` column checked by `IS JSON` constraints, making queries quick and keeping data integrity intact.
* **Structured AI Outputs**: Implements Gemini's native structured JSON schemas to prevent generation formatting failures and keep the frontend and backend in perfect sync.
