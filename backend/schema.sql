-- HISD 1882 Cost Tracking Database Schema
-- Database: 1882costtrackingdb (PostgreSQL)

CREATE TABLE IF NOT EXISTS time_entries (
    id              SERIAL PRIMARY KEY,
    employee_name   VARCHAR(255)    NOT NULL,
    employee_id     VARCHAR(100)    NOT NULL,
    campus_name     VARCHAR(255)    NOT NULL,
    date_of_service DATE            NOT NULL,
    service_type    VARCHAR(20)     NOT NULL CHECK (service_type IN ('Direct', 'Indirect', 'On Demand')),
    service_desc    TEXT            NOT NULL,
    start_time      TIMESTAMPTZ     NOT NULL,
    end_time        TIMESTAMPTZ     NOT NULL,
    total_time      NUMERIC(10, 2)  NOT NULL,
    total_cost      NUMERIC(10, 2)  NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_end_after_start CHECK (end_time > start_time),
    CONSTRAINT chk_min_time        CHECK (total_time >= 0.5)
);

CREATE INDEX IF NOT EXISTS idx_employee_id     ON time_entries (employee_id);
CREATE INDEX IF NOT EXISTS idx_campus_name     ON time_entries (campus_name);
CREATE INDEX IF NOT EXISTS idx_date_of_service ON time_entries (date_of_service);
