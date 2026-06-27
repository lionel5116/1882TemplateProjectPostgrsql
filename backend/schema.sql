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

-- Test data (10 sample records)
INSERT INTO time_entries
  (employee_name, employee_id, campus_name, date_of_service, service_type, service_desc, start_time, end_time, total_time, total_cost)
VALUES
  ('Maria Santos',     'E1001', 'Bellaire High School',    '2026-06-02', 'Direct',    'Provided individualized reading support for students with IEPs',         '2026-06-02 08:00:00-05', '2026-06-02 10:00:00-05', 2.0,  100.00),
  ('James Williams',   'E1002', 'Lamar High School',       '2026-06-03', 'Indirect',  'Developed differentiated lesson plans and assessment materials',          '2026-06-03 09:30:00-05', '2026-06-03 11:00:00-05', 1.5,   75.00),
  ('Patricia Davis',   'E1003', 'Lee High School',         '2026-06-04', 'On Demand', 'Crisis counseling session for student behavioral incident',               '2026-06-04 13:00:00-05', '2026-06-04 14:00:00-05', 1.0,   50.00),
  ('Robert Johnson',   'E1004', 'Westside High School',    '2026-06-05', 'Direct',    'Small group math intervention for Algebra I students',                    '2026-06-05 08:30:00-05', '2026-06-05 11:00:00-05', 2.5,  125.00),
  ('Linda Martinez',   'E1005', 'Wisdom High School',      '2026-06-09', 'Indirect',  'Collaborated with campus team on IEP progress monitoring procedures',     '2026-06-09 10:00:00-05', '2026-06-09 13:00:00-05', 3.0,  150.00),
  ('Michael Brown',    'E1006', 'Bellaire High School',    '2026-06-10', 'Direct',    'Speech-language therapy sessions with three students',                    '2026-06-10 09:00:00-05', '2026-06-10 10:00:00-05', 1.0,   50.00),
  ('Maria Santos',     'E1001', 'Lee High School',         '2026-06-11', 'On Demand', 'Emergency consultation with parent regarding student accommodation plan',  '2026-06-11 14:30:00-05', '2026-06-11 15:00:00-05', 0.5,   25.00),
  ('James Williams',   'E1002', 'Westside High School',    '2026-06-12', 'Direct',    'Extended writing workshop for students with learning disabilities',        '2026-06-12 08:00:00-05', '2026-06-12 12:00:00-05', 4.0,  200.00),
  ('David Garcia',     'E1007', 'Lamar High School',       '2026-06-16', 'Indirect',  'Training campus staff on assistive technology tools',                     '2026-06-16 11:00:00-05', '2026-06-16 13:00:00-05', 2.0,  100.00),
  ('Patricia Davis',   'E1003', 'Bellaire High School',    '2026-06-17', 'Direct',    'Occupational therapy evaluation and follow-up with two students',          '2026-06-17 09:00:00-05', '2026-06-17 10:30:00-05', 1.5,   75.00);
