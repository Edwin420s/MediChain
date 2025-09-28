-- Initialize MediChain database with proper configurations

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up database parameters
ALTER DATABASE medichain SET timezone TO 'UTC';
ALTER DATABASE medichain SET default_transaction_isolation TO 'read committed';

-- Create tablespace for better performance (optional)
-- CREATE TABLESPACE medichain_ts LOCATION '/var/lib/postgresql/data';

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS medichain;
SET search_path TO medichain, public;

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE record_type AS ENUM ('LAB_RESULT', 'PRESCRIPTION', 'IMAGING', 'DIAGNOSIS', 'TREATMENT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_action AS ENUM ('RECORD_CREATE', 'RECORD_VIEW', 'CONSENT_GRANT', 'CONSENT_REVOKE', 'USER_LOGIN', 'ACCESS_DENIED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_level AS ENUM ('DEPARTMENT', 'HOSPITAL', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON medichain.users (email);
CREATE INDEX IF NOT EXISTS idx_users_did ON medichain.users (did);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON medichain.patients (user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON medichain.doctors (user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medichain.medical_records (patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medichain.medical_records (created_at);
CREATE INDEX IF NOT EXISTS idx_consents_patient_id ON medichain.consents (patient_id);
CREATE INDEX IF NOT EXISTS idx_consents_doctor_id ON medichain.consents (doctor_id);
CREATE INDEX IF NOT EXISTS idx_consents_expiry_date ON medichain.consents (expiry_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON medichain.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON medichain.audit_logs (created_at);

-- Create function for soft delete (if needed)
CREATE OR REPLACE FUNCTION soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function for audit logging
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO medichain.audit_logs (actor_id, action, target_id, details)
    VALUES (NEW.id, 'RECORD_CREATE', NEW.id, json_build_object('table', TG_TABLE_NAME));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create views for reporting
CREATE OR REPLACE VIEW medichain.department_stats AS
SELECT 
    d.id,
    d.name,
    d.description,
    COUNT(doc.id) as doctor_count,
    COUNT(CASE WHEN doc.is_verified THEN 1 END) as verified_doctors,
    d.created_at
FROM medichain.departments d
LEFT JOIN medichain.doctors doc ON d.id = doc.department_id
GROUP BY d.id, d.name, d.description, d.created_at;

CREATE OR REPLACE VIEW medichain.patient_consent_stats AS
SELECT 
    p.id as patient_id,
    u.name as patient_name,
    COUNT(c.id) as total_consents,
    COUNT(CASE WHEN c.is_active AND c.expiry_date > NOW() THEN 1 END) as active_consents,
    MAX(c.created_at) as last_consent_date
FROM medichain.patients p
JOIN medichain.users u ON p.user_id = u.id
LEFT JOIN medichain.consents c ON p.id = c.patient_id
GROUP BY p.id, u.name;

-- Set up database permissions
GRANT CONNECT ON DATABASE medichain TO medichain_user;
GRANT USAGE ON SCHEMA medichain TO medichain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA medichain TO medichain_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA medichain TO medichain_user;

-- Create backup user with read-only access
CREATE USER backup_user WITH PASSWORD 'backup_password';
GRANT CONNECT ON DATABASE medichain TO backup_user;
GRANT USAGE ON SCHEMA medichain TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA medichain TO backup_user;