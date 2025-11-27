-- =====================================================
-- Migration 007: Create Indexes
-- =====================================================
-- Description: Create indexes for query performance optimization
-- Dependencies: All previous migrations
-- =====================================================

-- =====================================================
-- Users Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =====================================================
-- Roles Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- =====================================================
-- Permissions Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action);

-- =====================================================
-- User Roles Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- =====================================================
-- Role Permissions Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- =====================================================
-- Departments Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
CREATE INDEX IF NOT EXISTS idx_departments_parent ON departments(parent_department_id);
CREATE INDEX IF NOT EXISTS idx_departments_manager ON departments(manager_id);
CREATE INDEX IF NOT EXISTS idx_departments_deleted_at ON departments(deleted_at) WHERE deleted_at IS NULL;

-- =====================================================
-- Positions Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_positions_code ON positions(code);
CREATE INDEX IF NOT EXISTS idx_positions_title ON positions(title);
CREATE INDEX IF NOT EXISTS idx_positions_level ON positions(level);
CREATE INDEX IF NOT EXISTS idx_positions_deleted_at ON positions(deleted_at) WHERE deleted_at IS NULL;

-- =====================================================
-- Employees Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_national_id ON employees(national_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_hire_date ON employees(hire_date);
CREATE INDEX IF NOT EXISTS idx_employees_deleted_at ON employees(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(employment_status) WHERE employment_status = 'active';
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(first_name, last_name);

-- =====================================================
-- Attendance Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in ON attendance(check_in_time);
CREATE INDEX IF NOT EXISTS idx_attendance_date_range ON attendance(date, employee_id);

-- =====================================================
-- Leave Requests Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_type ON leave_requests(leave_type);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_pending ON leave_requests(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_leave_requests_approved_by ON leave_requests(approved_by);

-- =====================================================
-- Holidays Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_holidays_year ON holidays(EXTRACT(YEAR FROM date));

-- =====================================================
-- Salary Grades Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_salary_grades_name ON salary_grades(grade_name);
CREATE INDEX IF NOT EXISTS idx_salary_grades_range ON salary_grades(min_salary, max_salary);

-- =====================================================
-- Employee Salaries Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_employee_salaries_employee ON employee_salaries(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_grade ON employee_salaries(salary_grade_id);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_effective ON employee_salaries(effective_date);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_current ON employee_salaries(employee_id, effective_date) 
    WHERE end_date IS NULL;

-- =====================================================
-- Payrolls Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_payrolls_employee ON payrolls(employee_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_period ON payrolls(pay_period_start, pay_period_end);
CREATE INDEX IF NOT EXISTS idx_payrolls_status ON payrolls(status);
CREATE INDEX IF NOT EXISTS idx_payrolls_paid_at ON payrolls(paid_at);
CREATE INDEX IF NOT EXISTS idx_payrolls_pending ON payrolls(status) WHERE status IN ('draft', 'pending');

-- =====================================================
-- Salary Components Table Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_salary_components_type ON salary_components(type);
CREATE INDEX IF NOT EXISTS idx_salary_components_active ON salary_components(is_active) WHERE is_active = TRUE;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON INDEX idx_users_is_active IS 'Partial index for active users only';
COMMENT ON INDEX idx_users_deleted_at IS 'Partial index for non-deleted users';
COMMENT ON INDEX idx_employees_active IS 'Partial index for active employees only';
COMMENT ON INDEX idx_leave_requests_pending IS 'Partial index for pending leave requests';
COMMENT ON INDEX idx_employee_salaries_current IS 'Partial index for current (active) salaries';
COMMENT ON INDEX idx_payrolls_pending IS 'Partial index for draft and pending payrolls';

-- =====================================================
-- Rollback Script
-- =====================================================
-- DROP INDEX IF EXISTS idx_salary_components_active;
-- DROP INDEX IF EXISTS idx_salary_components_type;
-- DROP INDEX IF EXISTS idx_payrolls_pending;
-- DROP INDEX IF EXISTS idx_payrolls_paid_at;
-- DROP INDEX IF EXISTS idx_payrolls_status;
-- DROP INDEX IF EXISTS idx_payrolls_period;
-- DROP INDEX IF EXISTS idx_payrolls_employee;
-- DROP INDEX IF EXISTS idx_employee_salaries_current;
-- DROP INDEX IF EXISTS idx_employee_salaries_effective;
-- DROP INDEX IF EXISTS idx_employee_salaries_grade;
-- DROP INDEX IF EXISTS idx_employee_salaries_employee;
-- DROP INDEX IF EXISTS idx_salary_grades_range;
-- DROP INDEX IF EXISTS idx_salary_grades_name;
-- DROP INDEX IF EXISTS idx_holidays_year;
-- DROP INDEX IF EXISTS idx_holidays_date;
-- DROP INDEX IF EXISTS idx_leave_requests_approved_by;
-- DROP INDEX IF EXISTS idx_leave_requests_pending;
-- DROP INDEX IF EXISTS idx_leave_requests_dates;
-- DROP INDEX IF EXISTS idx_leave_requests_type;
-- DROP INDEX IF EXISTS idx_leave_requests_status;
-- DROP INDEX IF EXISTS idx_leave_requests_employee;
-- DROP INDEX IF EXISTS idx_attendance_date_range;
-- DROP INDEX IF EXISTS idx_attendance_check_in;
-- DROP INDEX IF EXISTS idx_attendance_status;
-- DROP INDEX IF EXISTS idx_attendance_employee_date;
-- DROP INDEX IF EXISTS idx_attendance_date;
-- DROP INDEX IF EXISTS idx_attendance_employee;
-- DROP INDEX IF EXISTS idx_employees_name;
-- DROP INDEX IF EXISTS idx_employees_active;
-- DROP INDEX IF EXISTS idx_employees_deleted_at;
-- DROP INDEX IF EXISTS idx_employees_hire_date;
-- DROP INDEX IF EXISTS idx_employees_status;
-- DROP INDEX IF EXISTS idx_employees_position;
-- DROP INDEX IF EXISTS idx_employees_department;
-- DROP INDEX IF EXISTS idx_employees_user_id;
-- DROP INDEX IF EXISTS idx_employees_national_id;
-- DROP INDEX IF EXISTS idx_employees_email;
-- DROP INDEX IF EXISTS idx_employees_code;
-- DROP INDEX IF EXISTS idx_positions_deleted_at;
-- DROP INDEX IF EXISTS idx_positions_level;
-- DROP INDEX IF EXISTS idx_positions_title;
-- DROP INDEX IF EXISTS idx_positions_code;
-- DROP INDEX IF EXISTS idx_departments_deleted_at;
-- DROP INDEX IF EXISTS idx_departments_manager;
-- DROP INDEX IF EXISTS idx_departments_parent;
-- DROP INDEX IF EXISTS idx_departments_name;
-- DROP INDEX IF EXISTS idx_departments_code;
-- DROP INDEX IF EXISTS idx_role_permissions_permission_id;
-- DROP INDEX IF EXISTS idx_role_permissions_role_id;
-- DROP INDEX IF EXISTS idx_user_roles_role_id;
-- DROP INDEX IF EXISTS idx_user_roles_user_id;
-- DROP INDEX IF EXISTS idx_permissions_resource_action;
-- DROP INDEX IF EXISTS idx_permissions_action;
-- DROP INDEX IF EXISTS idx_permissions_resource;
-- DROP INDEX IF EXISTS idx_roles_name;
-- DROP INDEX IF EXISTS idx_users_created_at;
-- DROP INDEX IF EXISTS idx_users_deleted_at;
-- DROP INDEX IF EXISTS idx_users_is_active;
-- DROP INDEX IF EXISTS idx_users_username;
-- DROP INDEX IF EXISTS idx_users_email;
