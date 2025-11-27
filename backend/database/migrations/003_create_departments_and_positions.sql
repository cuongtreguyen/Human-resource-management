-- =====================================================
-- Migration 003: Create Departments and Positions Tables
-- =====================================================
-- Description: Create tables for organizational structure
-- Dependencies: 002_create_users_and_roles.sql
-- =====================================================

-- =====================================================
-- Table: departments
-- Description: Store department/division information
-- Note: manager_id references employees table (created in migration 004)
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    manager_id UUID, -- Will be linked to employees table after it's created
    parent_department_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT departments_code_format CHECK (code ~* '^[A-Z0-9_-]+$'),
    CONSTRAINT departments_name_length CHECK (LENGTH(name) >= 2),
    
    -- Self-referencing foreign key for parent department
    CONSTRAINT fk_departments_parent FOREIGN KEY (parent_department_id) 
        REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =====================================================
-- Table: positions
-- Description: Store job positions/titles
-- =====================================================
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT positions_code_format CHECK (code ~* '^[A-Z0-9_-]+$'),
    CONSTRAINT positions_title_length CHECK (LENGTH(title) >= 2),
    CONSTRAINT positions_level_range CHECK (level >= 1 AND level <= 20)
);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE departments IS 'Stores organizational departments with hierarchical structure';
COMMENT ON TABLE positions IS 'Stores job positions/titles with level hierarchy';

COMMENT ON COLUMN departments.code IS 'Short unique code for the department (e.g., HR, IT, FIN)';
COMMENT ON COLUMN departments.manager_id IS 'Reference to the department manager (employee)';
COMMENT ON COLUMN departments.parent_department_id IS 'Reference to parent department for hierarchy';
COMMENT ON COLUMN departments.deleted_at IS 'Soft delete timestamp - null means active';

COMMENT ON COLUMN positions.code IS 'Short unique code for the position';
COMMENT ON COLUMN positions.level IS 'Hierarchy level (1=entry level, higher=more senior)';
COMMENT ON COLUMN positions.deleted_at IS 'Soft delete timestamp - null means active';

-- =====================================================
-- Rollback Script
-- =====================================================
-- DROP TABLE IF EXISTS positions;
-- DROP TABLE IF EXISTS departments;
