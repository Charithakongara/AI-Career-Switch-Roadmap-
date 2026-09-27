-- SQL Script to set up Oracle Database tables for local career roadmaps
-- Connect to your Oracle database instance and execute this script

-- Drop table if it already exists
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CAREER_ROADMAPS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

-- Create Table to store generated career roadmaps
CREATE TABLE CAREER_ROADMAPS (
    ID VARCHAR2(50) PRIMARY KEY,
    TITLE VARCHAR2(255) NOT NULL,
    CURRENT_ROLE VARCHAR2(255) NOT NULL,
    TARGET_ROLE VARCHAR2(255) NOT NULL,
    YEARS_EXPERIENCE NUMBER NOT NULL,
    HOURS_PER_WEEK NUMBER NOT NULL,
    LEARNING_BUDGET NUMBER NOT NULL,
    CREATED_AT VARCHAR2(100) NOT NULL,
    ROADMAP_JSON CLOB NOT NULL,
    CONSTRAINT check_json CHECK (ROADMAP_JSON IS JSON)
);

-- Index for faster search by target role
CREATE INDEX IDX_RM_TARGET_ROLE ON CAREER_ROADMAPS(TARGET_ROLE);

-- Index for faster search by current role
CREATE INDEX IDX_RM_CURRENT_ROLE ON CAREER_ROADMAPS(CURRENT_ROLE);

COMMIT;
