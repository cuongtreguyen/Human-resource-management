-- =====================================================
-- Migration 006: Create Salary Tables
-- =====================================================
-- Description: Create tables for salary and payroll management
-- Dependencies: 004_create_employees.sql
-- =====================================================

-- =====================================================
-- Table: salary_grades
-- Description: Define salary grades/bands
-- =====================================================
CREATE TABLE IF NOT EXISTS salary_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_name VARCHAR(50) UNIQUE NOT NULL,
    min_salary DECIMAL(15, 2) NOT NULL,
    max_salary DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT salary_grades_range_valid CHECK (max_salary >= min_salary),
    CONSTRAINT salary_grades_min_positive CHECK (min_salary >= 0),
    CONSTRAINT salary_grades_name_length CHECK (LENGTH(grade_name) >= 1)
);

-- =====================================================
-- Table: employee_salaries
-- Description: Store employee salary history
-- =====================================================
CREATE TABLE IF NOT EXISTS employee_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    salary_grade_id UUID,
    base_salary DECIMAL(15, 2) NOT NULL,
    allowances JSONB DEFAULT '{}',
    effective_date DATE NOT NULL,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT employee_salaries_amount_positive CHECK (base_salary >= 0),
    CONSTRAINT employee_salaries_date_order CHECK (end_date IS NULL OR end_date >= effective_date),
    
    -- Foreign keys
    CONSTRAINT fk_employee_salaries_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_employee_salaries_grade FOREIGN KEY (salary_grade_id) 
        REFERENCES salary_grades(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =====================================================
-- Table: payrolls
-- Description: Store monthly payroll records
-- =====================================================
CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    base_salary DECIMAL(15, 2) DEFAULT 0,
    allowances DECIMAL(15, 2) DEFAULT 0,
    bonuses DECIMAL(15, 2) DEFAULT 0,
    deductions DECIMAL(15, 2) DEFAULT 0,
    overtime_pay DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    insurance_amount DECIMAL(15, 2) DEFAULT 0,
    total_salary DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft',
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(30),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT payrolls_period_valid CHECK (pay_period_end >= pay_period_start),
    CONSTRAINT payrolls_amounts_positive CHECK (
        base_salary >= 0 AND 
        allowances >= 0 AND 
        bonuses >= 0 AND 
        deductions >= 0 AND
        overtime_pay >= 0 AND
        tax_amount >= 0 AND
        insurance_amount >= 0
    ),
    CONSTRAINT payrolls_status_valid CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'cancelled')),
    CONSTRAINT payrolls_payment_method_valid CHECK (
        payment_method IS NULL OR 
        payment_method IN ('bank_transfer', 'cash', 'check', 'digital_wallet')
    ),
    
    -- Unique constraint: one payroll per employee per period
    CONSTRAINT payrolls_unique_employee_period UNIQUE (employee_id, pay_period_start, pay_period_end),
    
    -- Foreign keys
    CONSTRAINT fk_payrolls_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================
-- Table: salary_components
-- Description: Define salary components (allowances, deductions)
-- =====================================================
CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    is_taxable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT salary_components_type_valid CHECK (type IN ('allowance', 'deduction', 'bonus'))
);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE salary_grades IS 'Defines salary grades/bands for the organization';
COMMENT ON TABLE employee_salaries IS 'Stores employee salary history and current salary';
COMMENT ON TABLE payrolls IS 'Stores monthly payroll records';
COMMENT ON TABLE salary_components IS 'Defines types of salary components (allowances, deductions, bonuses)';

COMMENT ON COLUMN employee_salaries.allowances IS 'JSON object containing allowance details';
COMMENT ON COLUMN employee_salaries.effective_date IS 'Date when this salary becomes effective';
COMMENT ON COLUMN employee_salaries.end_date IS 'Date when this salary ends (null for current salary)';

COMMENT ON COLUMN payrolls.status IS 'Payroll status: draft, pending, approved, paid, cancelled';
COMMENT ON COLUMN payrolls.total_salary IS 'Net salary after all calculations';

COMMENT ON COLUMN salary_components.type IS 'Component type: allowance, deduction, bonus';
COMMENT ON COLUMN salary_components.is_taxable IS 'Whether this component is subject to tax';

-- =====================================================
-- Rollback Script
-- =====================================================
-- DROP TABLE IF EXISTS salary_components;
-- DROP TABLE IF EXISTS payrolls;
-- DROP TABLE IF EXISTS employee_salaries;
-- DROP TABLE IF EXISTS salary_grades;
