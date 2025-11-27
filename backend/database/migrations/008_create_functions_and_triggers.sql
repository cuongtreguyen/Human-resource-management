-- =====================================================
-- Migration 008: Create Functions and Triggers
-- =====================================================
-- Description: Create utility functions, triggers, and stored procedures
-- Dependencies: All previous migrations
-- =====================================================

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: update_updated_at_column
-- Description: Automatically update updated_at timestamp
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: generate_employee_code
-- Description: Generate unique employee code
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION generate_employee_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
    current_year TEXT;
    sequence_num INTEGER;
BEGIN
    current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(
        CASE 
            WHEN employee_code ~ ('^EMP' || current_year || '[0-9]+$')
            THEN CAST(SUBSTRING(employee_code FROM 8) AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO sequence_num
    FROM employees
    WHERE employee_code LIKE 'EMP' || current_year || '%';
    
    new_code := 'EMP' || current_year || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VALIDATION FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: prevent_duplicate_users
-- Description: Check for duplicate email or username before insert/update
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_duplicate_users()
RETURNS TRIGGER AS $$
DECLARE
    existing_id UUID;
BEGIN
    -- Check for duplicate email
    SELECT id INTO existing_id
    FROM users
    WHERE email = NEW.email 
      AND id != COALESCE(NEW.id, uuid_generate_v4())
      AND deleted_at IS NULL;
    
    IF FOUND THEN
        RAISE EXCEPTION 'A user with email % already exists', NEW.email
            USING ERRCODE = 'unique_violation';
    END IF;
    
    -- Check for duplicate username
    SELECT id INTO existing_id
    FROM users
    WHERE username = NEW.username 
      AND id != COALESCE(NEW.id, uuid_generate_v4())
      AND deleted_at IS NULL;
    
    IF FOUND THEN
        RAISE EXCEPTION 'A user with username % already exists', NEW.username
            USING ERRCODE = 'unique_violation';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: prevent_duplicate_employees
-- Description: Check for duplicate employee_code, national_id, or email
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_duplicate_employees()
RETURNS TRIGGER AS $$
DECLARE
    existing_id UUID;
BEGIN
    -- Check for duplicate employee_code
    SELECT id INTO existing_id
    FROM employees
    WHERE employee_code = NEW.employee_code 
      AND id != COALESCE(NEW.id, uuid_generate_v4())
      AND deleted_at IS NULL;
    
    IF FOUND THEN
        RAISE EXCEPTION 'An employee with code % already exists', NEW.employee_code
            USING ERRCODE = 'unique_violation';
    END IF;
    
    -- Check for duplicate national_id (if provided)
    IF NEW.national_id IS NOT NULL THEN
        SELECT id INTO existing_id
        FROM employees
        WHERE national_id = NEW.national_id 
          AND id != COALESCE(NEW.id, uuid_generate_v4())
          AND deleted_at IS NULL;
        
        IF FOUND THEN
            RAISE EXCEPTION 'An employee with national ID % already exists', NEW.national_id
                USING ERRCODE = 'unique_violation';
        END IF;
    END IF;
    
    -- Check for duplicate email
    SELECT id INTO existing_id
    FROM employees
    WHERE email = NEW.email 
      AND id != COALESCE(NEW.id, uuid_generate_v4())
      AND deleted_at IS NULL;
    
    IF FOUND THEN
        RAISE EXCEPTION 'An employee with email % already exists', NEW.email
            USING ERRCODE = 'unique_violation';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: validate_attendance
-- Description: Validate attendance records (prevent duplicate check-ins)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION validate_attendance()
RETURNS TRIGGER AS $$
DECLARE
    existing_id UUID;
BEGIN
    -- Check for existing attendance on the same day
    SELECT id INTO existing_id
    FROM attendance
    WHERE employee_id = NEW.employee_id 
      AND date = NEW.date
      AND id != COALESCE(NEW.id, uuid_generate_v4());
    
    IF FOUND THEN
        RAISE EXCEPTION 'Attendance record already exists for employee on %', NEW.date
            USING ERRCODE = 'unique_violation';
    END IF;
    
    -- Validate check-in and check-out times
    IF NEW.check_out_time IS NOT NULL AND NEW.check_in_time IS NOT NULL THEN
        IF NEW.check_out_time < NEW.check_in_time THEN
            RAISE EXCEPTION 'Check-out time cannot be before check-in time'
                USING ERRCODE = 'check_violation';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: validate_leave_request
-- Description: Validate leave requests (check for overlaps)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION validate_leave_request()
RETURNS TRIGGER AS $$
DECLARE
    overlap_id UUID;
    overlap_dates TEXT;
BEGIN
    -- Check for overlapping leave requests
    SELECT lr.id, 
           TO_CHAR(lr.start_date, 'YYYY-MM-DD') || ' to ' || TO_CHAR(lr.end_date, 'YYYY-MM-DD')
    INTO overlap_id, overlap_dates
    FROM leave_requests lr
    WHERE lr.employee_id = NEW.employee_id 
      AND lr.id != COALESCE(NEW.id, uuid_generate_v4())
      AND lr.status NOT IN ('rejected', 'cancelled')
      AND (
          (NEW.start_date BETWEEN lr.start_date AND lr.end_date) OR
          (NEW.end_date BETWEEN lr.start_date AND lr.end_date) OR
          (lr.start_date BETWEEN NEW.start_date AND NEW.end_date)
      )
    LIMIT 1;
    
    IF FOUND THEN
        RAISE EXCEPTION 'Leave request overlaps with existing request (%)', overlap_dates
            USING ERRCODE = 'exclusion_violation';
    END IF;
    
    -- Validate dates
    IF NEW.end_date < NEW.start_date THEN
        RAISE EXCEPTION 'End date cannot be before start date'
            USING ERRCODE = 'check_violation';
    END IF;
    
    -- Calculate days count if not provided
    IF NEW.days_count IS NULL THEN
        NEW.days_count := (NEW.end_date - NEW.start_date) + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: validate_payroll_period
-- Description: Validate payroll periods (no overlaps)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION validate_payroll_period()
RETURNS TRIGGER AS $$
DECLARE
    overlap_id UUID;
BEGIN
    -- Check for overlapping payroll periods for the same employee
    SELECT id INTO overlap_id
    FROM payrolls
    WHERE employee_id = NEW.employee_id 
      AND id != COALESCE(NEW.id, uuid_generate_v4())
      AND (
          (NEW.pay_period_start BETWEEN pay_period_start AND pay_period_end) OR
          (NEW.pay_period_end BETWEEN pay_period_start AND pay_period_end) OR
          (pay_period_start BETWEEN NEW.pay_period_start AND NEW.pay_period_end)
      )
    LIMIT 1;
    
    IF FOUND THEN
        RAISE EXCEPTION 'Payroll period overlaps with existing payroll record'
            USING ERRCODE = 'exclusion_violation';
    END IF;
    
    -- Validate dates
    IF NEW.pay_period_end < NEW.pay_period_start THEN
        RAISE EXCEPTION 'Pay period end date cannot be before start date'
            USING ERRCODE = 'check_violation';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUDIT FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Table: audit_log
-- Description: Store audit trail for important changes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    
    CONSTRAINT audit_action_valid CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON audit_log(changed_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON audit_log(changed_by);

COMMENT ON TABLE audit_log IS 'Stores audit trail for data changes';

-- -----------------------------------------------------
-- Function: log_audit_changes
-- Description: Log changes to audit_log table
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATA CLEANUP FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: cleanup_duplicate_attendance
-- Description: Remove duplicate attendance records (keep the first one)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_duplicate_attendance()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH duplicates AS (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY employee_id, date 
                   ORDER BY created_at
               ) AS rn
        FROM attendance
    )
    DELETE FROM attendance
    WHERE id IN (
        SELECT id FROM duplicates WHERE rn > 1
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: cleanup_orphaned_user_roles
-- Description: Remove user_roles where user or role no longer exists
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_orphaned_user_roles()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_roles
    WHERE user_id NOT IN (SELECT id FROM users WHERE deleted_at IS NULL)
       OR role_id NOT IN (SELECT id FROM roles);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: get_user_permissions
-- Description: Get all permissions for a user (through their roles)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
    permission_name VARCHAR(100),
    resource VARCHAR(50),
    action VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT p.name, p.resource, p.action
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: check_user_permission
-- Description: Check if user has a specific permission
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_resource VARCHAR(50),
    p_action VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = p_user_id
          AND (p.resource = p_resource OR p.resource = '*')
          AND (p.action = p_action OR p.action = 'manage')
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: get_employee_current_salary
-- Description: Get the current salary for an employee
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_employee_current_salary(p_employee_id UUID)
RETURNS TABLE (
    base_salary DECIMAL(15, 2),
    allowances JSONB,
    grade_name VARCHAR(50),
    effective_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT es.base_salary, es.allowances, sg.grade_name, es.effective_date
    FROM employee_salaries es
    LEFT JOIN salary_grades sg ON es.salary_grade_id = sg.id
    WHERE es.employee_id = p_employee_id
      AND es.effective_date <= CURRENT_DATE
      AND (es.end_date IS NULL OR es.end_date >= CURRENT_DATE)
    ORDER BY es.effective_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: get_department_employees_count
-- Description: Get the count of active employees in a department
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_department_employees_count(p_department_id UUID)
RETURNS INTEGER AS $$
DECLARE
    emp_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO emp_count
    FROM employees
    WHERE department_id = p_department_id
      AND employment_status = 'active'
      AND deleted_at IS NULL;
    
    RETURN emp_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_positions_updated_at
    BEFORE UPDATE ON positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_salary_grades_updated_at
    BEFORE UPDATE ON salary_grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_employee_salaries_updated_at
    BEFORE UPDATE ON employee_salaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_payrolls_updated_at
    BEFORE UPDATE ON payrolls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_salary_components_updated_at
    BEFORE UPDATE ON salary_components
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Validation triggers
CREATE TRIGGER trigger_prevent_duplicate_users
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_users();

CREATE TRIGGER trigger_prevent_duplicate_employees
    BEFORE INSERT OR UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_employees();

CREATE TRIGGER trigger_validate_attendance
    BEFORE INSERT OR UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION validate_attendance();

CREATE TRIGGER trigger_validate_leave_request
    BEFORE INSERT OR UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION validate_leave_request();

CREATE TRIGGER trigger_validate_payroll_period
    BEFORE INSERT OR UPDATE ON payrolls
    FOR EACH ROW
    EXECUTE FUNCTION validate_payroll_period();

-- Audit triggers (for important tables)
CREATE TRIGGER trigger_audit_employees
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER trigger_audit_payrolls
    AFTER INSERT OR UPDATE OR DELETE ON payrolls
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER trigger_audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_changes();

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates updated_at timestamp on row update';
COMMENT ON FUNCTION generate_employee_code() IS 'Generates unique employee code in format EMP{YEAR}{SEQUENCE}';
COMMENT ON FUNCTION prevent_duplicate_users() IS 'Prevents duplicate email or username for users';
COMMENT ON FUNCTION prevent_duplicate_employees() IS 'Prevents duplicate employee_code, national_id, or email for employees';
COMMENT ON FUNCTION validate_attendance() IS 'Validates attendance records and prevents duplicates';
COMMENT ON FUNCTION validate_leave_request() IS 'Validates leave requests and checks for overlaps';
COMMENT ON FUNCTION validate_payroll_period() IS 'Validates payroll periods and prevents overlaps';
COMMENT ON FUNCTION log_audit_changes() IS 'Logs data changes to audit_log table';
COMMENT ON FUNCTION cleanup_duplicate_attendance() IS 'Removes duplicate attendance records, keeping the first one';
COMMENT ON FUNCTION cleanup_orphaned_user_roles() IS 'Removes orphaned user_roles records';
COMMENT ON FUNCTION get_user_permissions(UUID) IS 'Returns all permissions for a user through their roles';
COMMENT ON FUNCTION check_user_permission(UUID, VARCHAR, VARCHAR) IS 'Checks if user has a specific permission';
COMMENT ON FUNCTION get_employee_current_salary(UUID) IS 'Returns the current salary for an employee';
COMMENT ON FUNCTION get_department_employees_count(UUID) IS 'Returns count of active employees in a department';

-- =====================================================
-- Rollback Script
-- =====================================================
-- DROP TRIGGER IF EXISTS trigger_audit_user_roles ON user_roles;
-- DROP TRIGGER IF EXISTS trigger_audit_payrolls ON payrolls;
-- DROP TRIGGER IF EXISTS trigger_audit_employees ON employees;
-- DROP TRIGGER IF EXISTS trigger_validate_payroll_period ON payrolls;
-- DROP TRIGGER IF EXISTS trigger_validate_leave_request ON leave_requests;
-- DROP TRIGGER IF EXISTS trigger_validate_attendance ON attendance;
-- DROP TRIGGER IF EXISTS trigger_prevent_duplicate_employees ON employees;
-- DROP TRIGGER IF EXISTS trigger_prevent_duplicate_users ON users;
-- DROP TRIGGER IF EXISTS trigger_salary_components_updated_at ON salary_components;
-- DROP TRIGGER IF EXISTS trigger_payrolls_updated_at ON payrolls;
-- DROP TRIGGER IF EXISTS trigger_employee_salaries_updated_at ON employee_salaries;
-- DROP TRIGGER IF EXISTS trigger_salary_grades_updated_at ON salary_grades;
-- DROP TRIGGER IF EXISTS trigger_leave_requests_updated_at ON leave_requests;
-- DROP TRIGGER IF EXISTS trigger_attendance_updated_at ON attendance;
-- DROP TRIGGER IF EXISTS trigger_employees_updated_at ON employees;
-- DROP TRIGGER IF EXISTS trigger_positions_updated_at ON positions;
-- DROP TRIGGER IF EXISTS trigger_departments_updated_at ON departments;
-- DROP TRIGGER IF EXISTS trigger_roles_updated_at ON roles;
-- DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
-- DROP FUNCTION IF EXISTS get_department_employees_count(UUID);
-- DROP FUNCTION IF EXISTS get_employee_current_salary(UUID);
-- DROP FUNCTION IF EXISTS check_user_permission(UUID, VARCHAR, VARCHAR);
-- DROP FUNCTION IF EXISTS get_user_permissions(UUID);
-- DROP FUNCTION IF EXISTS cleanup_orphaned_user_roles();
-- DROP FUNCTION IF EXISTS cleanup_duplicate_attendance();
-- DROP FUNCTION IF EXISTS log_audit_changes();
-- DROP TABLE IF EXISTS audit_log;
-- DROP FUNCTION IF EXISTS validate_payroll_period();
-- DROP FUNCTION IF EXISTS validate_leave_request();
-- DROP FUNCTION IF EXISTS validate_attendance();
-- DROP FUNCTION IF EXISTS prevent_duplicate_employees();
-- DROP FUNCTION IF EXISTS prevent_duplicate_users();
-- DROP FUNCTION IF EXISTS generate_employee_code();
-- DROP FUNCTION IF EXISTS update_updated_at_column();
