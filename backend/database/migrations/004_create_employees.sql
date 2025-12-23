-- =====================================================
-- Migration 004: Create Employees Table
-- =====================================================
-- Description: Create the main employees table
-- Dependencies: 002_create_users_and_roles.sql, 003_create_departments_and_positions.sql
-- =====================================================

-- =====================================================
-- Table: employees
-- Description: Store employee information
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID UNIQUE,
    department_id UUID,
    position_id UUID,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    national_id VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    hire_date DATE NOT NULL,
    contract_type VARCHAR(50),
    employment_status VARCHAR(20) DEFAULT 'active',
    face_encoding TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT employees_code_format CHECK (employee_code ~* '^[A-Z0-9-]+$'),
    CONSTRAINT employees_gender_valid CHECK (gender IN ('male', 'female', 'other') OR gender IS NULL),
    CONSTRAINT employees_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT employees_status_valid CHECK (employment_status IN ('active', 'on_leave', 'terminated', 'suspended')),
    CONSTRAINT employees_contract_valid CHECK (contract_type IN ('full_time', 'part_time', 'contract', 'intern', 'probation') OR contract_type IS NULL),
    CONSTRAINT employees_hire_date_valid CHECK (hire_date <= CURRENT_DATE),
    CONSTRAINT employees_dob_valid CHECK (date_of_birth < CURRENT_DATE AND date_of_birth > '1900-01-01'),
    
    -- Foreign keys
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_employees_position FOREIGN KEY (position_id) 
        REFERENCES positions(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =====================================================
-- Add manager_id foreign key to departments table
-- This was deferred because employees table didn't exist
-- =====================================================
ALTER TABLE departments 
    ADD CONSTRAINT fk_departments_manager FOREIGN KEY (manager_id) 
    REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE employees IS 'Stores employee personal and professional information';

COMMENT ON COLUMN employees.employee_code IS 'Unique employee identifier code';
COMMENT ON COLUMN employees.user_id IS 'Link to user account for login (optional)';
COMMENT ON COLUMN employees.national_id IS 'National ID card number (CMND/CCCD)';
COMMENT ON COLUMN employees.contract_type IS 'Type of employment contract';
COMMENT ON COLUMN employees.employment_status IS 'Current employment status';
COMMENT ON COLUMN employees.face_encoding IS 'Face recognition data for attendance';
COMMENT ON COLUMN employees.deleted_at IS 'Soft delete timestamp - null means active';

-- =====================================================
-- Rollback Script
-- =====================================================
-- ALTER TABLE departments DROP CONSTRAINT IF EXISTS fk_departments_manager;
-- DROP TABLE IF EXISTS employees;
