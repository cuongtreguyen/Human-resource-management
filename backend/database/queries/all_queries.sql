-- =====================================================
-- HR Management System - Complete Database Queries
-- =====================================================
-- This file contains all common queries for the HR system
-- Categories: CRUD, Reports, Search, Permissions
-- =====================================================

-- =====================================================
-- 1. USER & AUTHENTICATION QUERIES
-- =====================================================

-- 1.1 Get user by username (for login)
SELECT id, username, email, password_hash, full_name, is_active, last_login_at
FROM users
WHERE username = $1 AND deleted_at IS NULL AND is_active = TRUE;

-- 1.2 Get user by email
SELECT id, username, email, full_name, phone_number, avatar_url, is_active
FROM users
WHERE email = $1 AND deleted_at IS NULL;

-- 1.3 Create new user
INSERT INTO users (username, email, password_hash, full_name, phone_number)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, username, email, full_name, created_at;

-- 1.4 Update user profile
UPDATE users
SET full_name = $2, phone_number = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING id, username, email, full_name, phone_number, avatar_url;

-- 1.5 Update last login
UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1;

-- 1.6 Soft delete user
UPDATE users SET deleted_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE id = $1;

-- 1.7 Get all active users with their roles
SELECT u.id, u.username, u.email, u.full_name, u.is_active,
       ARRAY_AGG(r.name) AS roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.username, u.email, u.full_name, u.is_active
ORDER BY u.created_at DESC;

-- =====================================================
-- 2. ROLE & PERMISSION QUERIES
-- =====================================================

-- 2.1 Get all roles
SELECT id, name, description, created_at FROM roles ORDER BY name;

-- 2.2 Get role with its permissions
SELECT r.id, r.name, r.description,
       JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'name', p.name, 'resource', p.resource, 'action', p.action)) AS permissions
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
WHERE r.id = $1
GROUP BY r.id, r.name, r.description;

-- 2.3 Get user's permissions (for authorization)
SELECT DISTINCT p.name, p.resource, p.action
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN role_permissions rp ON ur.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.id = $1 AND u.deleted_at IS NULL AND u.is_active = TRUE;

-- 2.4 Check if user has specific permission
SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = $1 AND p.resource = $2 AND p.action = $3
    AND u.deleted_at IS NULL AND u.is_active = TRUE
) AS has_permission;

-- 2.5 Assign role to user
INSERT INTO user_roles (user_id, role_id, assigned_by)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, role_id) DO NOTHING
RETURNING user_id, role_id, assigned_at;

-- 2.6 Remove role from user
DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2;

-- 2.7 Get all permissions grouped by resource
SELECT resource, ARRAY_AGG(JSON_BUILD_OBJECT('id', id, 'name', name, 'action', action)) AS permissions
FROM permissions
GROUP BY resource
ORDER BY resource;

-- =====================================================
-- 3. DEPARTMENT QUERIES
-- =====================================================

-- 3.1 Get all departments with manager info
SELECT d.id, d.name, d.code, d.description,
       d.parent_department_id,
       pd.name AS parent_department_name,
       e.id AS manager_id,
       CONCAT(e.first_name, ' ', e.last_name) AS manager_name,
       (SELECT COUNT(*) FROM employees WHERE department_id = d.id AND deleted_at IS NULL) AS employee_count
FROM departments d
LEFT JOIN departments pd ON d.parent_department_id = pd.id
LEFT JOIN employees e ON d.manager_id = e.id
WHERE d.deleted_at IS NULL
ORDER BY d.name;

-- 3.2 Get department by ID
SELECT d.*, CONCAT(e.first_name, ' ', e.last_name) AS manager_name
FROM departments d
LEFT JOIN employees e ON d.manager_id = e.id
WHERE d.id = $1 AND d.deleted_at IS NULL;

-- 3.3 Create department
INSERT INTO departments (name, code, description, parent_department_id, manager_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- 3.4 Update department
UPDATE departments
SET name = $2, code = $3, description = $4, parent_department_id = $5, manager_id = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- 3.5 Get department hierarchy (recursive)
WITH RECURSIVE dept_tree AS (
    SELECT id, name, code, parent_department_id, 0 AS level
    FROM departments
    WHERE parent_department_id IS NULL AND deleted_at IS NULL
    
    UNION ALL
    
    SELECT d.id, d.name, d.code, d.parent_department_id, dt.level + 1
    FROM departments d
    JOIN dept_tree dt ON d.parent_department_id = dt.id
    WHERE d.deleted_at IS NULL
)
SELECT * FROM dept_tree ORDER BY level, name;

-- =====================================================
-- 4. POSITION QUERIES
-- =====================================================

-- 4.1 Get all positions
SELECT id, title, code, description, level, created_at
FROM positions
WHERE deleted_at IS NULL
ORDER BY level DESC, title;

-- 4.2 Create position
INSERT INTO positions (title, code, description, level)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- 4.3 Update position
UPDATE positions
SET title = $2, code = $3, description = $4, level = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- =====================================================
-- 5. EMPLOYEE QUERIES (CRUD)
-- =====================================================

-- 5.1 Get all employees with department and position
SELECT e.id, e.employee_code, e.first_name, e.last_name,
       CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       e.email, e.phone_number, e.gender, e.hire_date,
       e.employment_status, e.contract_type,
       d.name AS department_name, d.code AS department_code,
       p.title AS position_title, p.level AS position_level
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.deleted_at IS NULL
ORDER BY e.created_at DESC;

-- 5.2 Get employee by ID with full details
SELECT e.*,
       d.name AS department_name,
       p.title AS position_title,
       u.username, u.email AS user_email
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
LEFT JOIN users u ON e.user_id = u.id
WHERE e.id = $1 AND e.deleted_at IS NULL;

-- 5.3 Get employee by employee_code
SELECT * FROM employees WHERE employee_code = $1 AND deleted_at IS NULL;

-- 5.4 Create employee
INSERT INTO employees (
    employee_code, first_name, last_name, email, phone_number,
    date_of_birth, gender, national_id, address,
    department_id, position_id, hire_date, contract_type,
    emergency_contact_name, emergency_contact_phone
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
RETURNING *;

-- 5.5 Update employee
UPDATE employees
SET first_name = $2, last_name = $3, email = $4, phone_number = $5,
    date_of_birth = $6, gender = $7, address = $8,
    department_id = $9, position_id = $10, contract_type = $11,
    emergency_contact_name = $12, emergency_contact_phone = $13,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- 5.6 Update employee status
UPDATE employees
SET employment_status = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING id, employee_code, employment_status;

-- 5.7 Soft delete employee
UPDATE employees SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1;

-- 5.8 Get employees by department
SELECT e.id, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       e.email, e.employment_status, p.title AS position
FROM employees e
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.department_id = $1 AND e.deleted_at IS NULL
ORDER BY e.first_name;

-- 5.9 Link employee to user account
UPDATE employees SET user_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;

-- =====================================================
-- 6. ATTENDANCE QUERIES (CRUD)
-- =====================================================

-- 6.1 Get attendance by employee and date range
SELECT a.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, e.employee_code
FROM attendance a
JOIN employees e ON a.employee_id = e.id
WHERE a.employee_id = $1 AND a.date BETWEEN $2 AND $3
ORDER BY a.date DESC;

-- 6.2 Get today's attendance for all employees
SELECT a.id, a.employee_id, a.check_in_time, a.check_out_time, a.status,
       e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
       d.name AS department_name
FROM attendance a
RIGHT JOIN employees e ON a.employee_id = e.id AND a.date = CURRENT_DATE
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.deleted_at IS NULL AND e.employment_status = 'active'
ORDER BY a.check_in_time DESC NULLS LAST;

-- 6.3 Check in
INSERT INTO attendance (employee_id, date, check_in_time, check_in_method, status)
VALUES ($1, CURRENT_DATE, CURRENT_TIMESTAMP, $2, 
    CASE WHEN CURRENT_TIME > '09:00:00' THEN 'late' ELSE 'present' END)
ON CONFLICT (employee_id, date) DO UPDATE 
SET check_in_time = EXCLUDED.check_in_time, check_in_method = EXCLUDED.check_in_method
WHERE attendance.check_in_time IS NULL
RETURNING *;

-- 6.4 Check out
UPDATE attendance
SET check_out_time = CURRENT_TIMESTAMP, check_out_method = $2, updated_at = CURRENT_TIMESTAMP
WHERE employee_id = $1 AND date = CURRENT_DATE AND check_out_time IS NULL
RETURNING *;

-- 6.5 Manual attendance entry
INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, status, check_in_method, check_out_method, notes)
VALUES ($1, $2, $3, $4, $5, 'manual', 'manual', $6)
ON CONFLICT (employee_id, date) DO UPDATE 
SET check_in_time = EXCLUDED.check_in_time, check_out_time = EXCLUDED.check_out_time, 
    status = EXCLUDED.status, notes = EXCLUDED.notes, updated_at = CURRENT_TIMESTAMP
RETURNING *;

-- 6.6 Get employees not checked in today
SELECT e.id, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = CURRENT_DATE
WHERE e.deleted_at IS NULL AND e.employment_status = 'active' AND a.id IS NULL;

-- =====================================================
-- 7. LEAVE REQUEST QUERIES
-- =====================================================

-- 7.1 Get all leave requests with employee info
SELECT lr.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
       e.employee_code, d.name AS department_name,
       u.full_name AS approved_by_name
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN users u ON lr.approved_by = u.id
ORDER BY lr.created_at DESC;

-- 7.2 Get pending leave requests
SELECT lr.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
       e.employee_code, d.name AS department_name
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
LEFT JOIN departments d ON e.department_id = d.id
WHERE lr.status = 'pending'
ORDER BY lr.start_date;

-- 7.3 Get leave requests by employee
SELECT * FROM leave_requests
WHERE employee_id = $1
ORDER BY start_date DESC;

-- 7.4 Create leave request
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, days_count, reason)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- 7.5 Approve leave request
UPDATE leave_requests
SET status = 'approved', approved_by = $2, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- 7.6 Reject leave request
UPDATE leave_requests
SET status = 'rejected', approved_by = $2, approved_at = CURRENT_TIMESTAMP, rejection_reason = $3, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- 7.7 Cancel leave request
UPDATE leave_requests
SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND employee_id = $2 AND status = 'pending'
RETURNING *;

-- 7.8 Check for overlapping leave requests
SELECT id, start_date, end_date, leave_type, status
FROM leave_requests
WHERE employee_id = $1 AND status NOT IN ('rejected', 'cancelled')
AND (start_date, end_date) OVERLAPS ($2::DATE, $3::DATE);

-- =====================================================
-- 8. SALARY & PAYROLL QUERIES
-- =====================================================

-- 8.1 Get current salary for employee
SELECT es.*, sg.grade_name, sg.min_salary, sg.max_salary
FROM employee_salaries es
LEFT JOIN salary_grades sg ON es.salary_grade_id = sg.id
WHERE es.employee_id = $1 AND (es.end_date IS NULL OR es.end_date >= CURRENT_DATE)
ORDER BY es.effective_date DESC
LIMIT 1;

-- 8.2 Get salary history for employee
SELECT es.*, sg.grade_name
FROM employee_salaries es
LEFT JOIN salary_grades sg ON es.salary_grade_id = sg.id
WHERE es.employee_id = $1
ORDER BY es.effective_date DESC;

-- 8.3 Create/Update employee salary
INSERT INTO employee_salaries (employee_id, salary_grade_id, base_salary, allowances, effective_date, notes)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- 8.4 End current salary (before adding new one)
UPDATE employee_salaries
SET end_date = $2, updated_at = CURRENT_TIMESTAMP
WHERE employee_id = $1 AND end_date IS NULL;

-- 8.5 Get payrolls by period
SELECT p.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
       e.employee_code, d.name AS department_name
FROM payrolls p
JOIN employees e ON p.employee_id = e.id
LEFT JOIN departments d ON e.department_id = d.id
WHERE p.pay_period_start = $1 AND p.pay_period_end = $2
ORDER BY e.employee_code;

-- 8.6 Get employee payroll history
SELECT * FROM payrolls WHERE employee_id = $1 ORDER BY pay_period_start DESC;

-- 8.7 Create payroll record
INSERT INTO payrolls (
    employee_id, pay_period_start, pay_period_end,
    base_salary, allowances, bonuses, deductions, overtime_pay,
    tax_amount, insurance_amount, total_salary, status, notes
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'draft', $12)
RETURNING *;

-- 8.8 Approve payroll
UPDATE payrolls
SET status = 'approved', updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND status = 'draft'
RETURNING *;

-- 8.9 Mark payroll as paid
UPDATE payrolls
SET status = 'paid', paid_at = CURRENT_TIMESTAMP, payment_method = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND status = 'approved'
RETURNING *;

-- 8.10 Get all salary grades
SELECT * FROM salary_grades ORDER BY min_salary;

-- =====================================================
-- 9. SEARCH QUERIES
-- =====================================================

-- 9.1 Search employees by name, code, or email
SELECT e.id, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       e.email, e.phone_number, e.employment_status,
       d.name AS department_name, p.title AS position_title
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.deleted_at IS NULL
AND (
    e.employee_code ILIKE '%' || $1 || '%'
    OR e.first_name ILIKE '%' || $1 || '%'
    OR e.last_name ILIKE '%' || $1 || '%'
    OR CONCAT(e.first_name, ' ', e.last_name) ILIKE '%' || $1 || '%'
    OR e.email ILIKE '%' || $1 || '%'
)
ORDER BY e.first_name
LIMIT 50;

-- 9.2 Search users
SELECT id, username, email, full_name, is_active
FROM users
WHERE deleted_at IS NULL
AND (
    username ILIKE '%' || $1 || '%'
    OR email ILIKE '%' || $1 || '%'
    OR full_name ILIKE '%' || $1 || '%'
)
ORDER BY username
LIMIT 50;

-- 9.3 Advanced employee filter
SELECT e.id, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       e.email, e.employment_status, e.hire_date,
       d.name AS department_name, p.title AS position_title
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.deleted_at IS NULL
AND ($1::UUID IS NULL OR e.department_id = $1)
AND ($2::UUID IS NULL OR e.position_id = $2)
AND ($3::VARCHAR IS NULL OR e.employment_status = $3)
AND ($4::DATE IS NULL OR e.hire_date >= $4)
AND ($5::DATE IS NULL OR e.hire_date <= $5)
ORDER BY e.first_name;

-- =====================================================
-- 10. REPORT QUERIES
-- =====================================================

-- 10.1 Employee count by department
SELECT d.id, d.name, d.code,
       COUNT(e.id) AS total_employees,
       COUNT(CASE WHEN e.employment_status = 'active' THEN 1 END) AS active_employees,
       COUNT(CASE WHEN e.employment_status = 'on_leave' THEN 1 END) AS on_leave,
       COUNT(CASE WHEN e.employment_status = 'terminated' THEN 1 END) AS terminated
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id AND e.deleted_at IS NULL
WHERE d.deleted_at IS NULL
GROUP BY d.id, d.name, d.code
ORDER BY d.name;

-- 10.2 Monthly attendance summary by employee
SELECT e.id, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       d.name AS department_name,
       COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
       COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late_days,
       COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
       COUNT(CASE WHEN a.status = 'on_leave' THEN 1 END) AS leave_days,
       COUNT(a.id) AS total_records
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN attendance a ON e.id = a.employee_id 
    AND a.date >= $1 AND a.date <= $2
WHERE e.deleted_at IS NULL AND e.employment_status = 'active'
GROUP BY e.id, e.employee_code, e.first_name, e.last_name, d.name
ORDER BY e.employee_code;

-- 10.3 Daily attendance summary
SELECT 
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent,
    COUNT(CASE WHEN a.status = 'on_leave' THEN 1 END) AS on_leave,
    (SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL AND employment_status = 'active') AS total_employees
FROM attendance a
WHERE a.date = $1;

-- 10.4 Leave statistics by type
SELECT leave_type,
       COUNT(*) AS total_requests,
       COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved,
       COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected,
       COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
       SUM(CASE WHEN status = 'approved' THEN days_count ELSE 0 END) AS total_days_taken
FROM leave_requests
WHERE start_date >= $1 AND start_date <= $2
GROUP BY leave_type
ORDER BY total_requests DESC;

-- 10.5 Payroll summary by department
SELECT d.name AS department_name,
       COUNT(p.id) AS employee_count,
       SUM(p.base_salary) AS total_base_salary,
       SUM(p.allowances) AS total_allowances,
       SUM(p.bonuses) AS total_bonuses,
       SUM(p.deductions) AS total_deductions,
       SUM(p.total_salary) AS grand_total
FROM payrolls p
JOIN employees e ON p.employee_id = e.id
JOIN departments d ON e.department_id = d.id
WHERE p.pay_period_start = $1 AND p.pay_period_end = $2
GROUP BY d.name
ORDER BY grand_total DESC;

-- 10.6 Employee tenure report
SELECT e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       d.name AS department_name, p.title AS position_title,
       e.hire_date,
       EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.hire_date)) AS years,
       EXTRACT(MONTH FROM AGE(CURRENT_DATE, e.hire_date)) AS months
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.deleted_at IS NULL AND e.employment_status = 'active'
ORDER BY e.hire_date;

-- 10.7 New hires report (employees hired in date range)
SELECT e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       e.email, e.hire_date, e.contract_type,
       d.name AS department_name, p.title AS position_title
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.deleted_at IS NULL
AND e.hire_date BETWEEN $1 AND $2
ORDER BY e.hire_date DESC;

-- 10.8 Salary distribution report
SELECT sg.grade_name, sg.min_salary, sg.max_salary,
       COUNT(es.id) AS employee_count,
       AVG(es.base_salary) AS avg_salary,
       MIN(es.base_salary) AS actual_min,
       MAX(es.base_salary) AS actual_max
FROM salary_grades sg
LEFT JOIN employee_salaries es ON sg.id = es.salary_grade_id AND es.end_date IS NULL
GROUP BY sg.id, sg.grade_name, sg.min_salary, sg.max_salary
ORDER BY sg.min_salary;

-- 10.9 Attendance rate by department (for date range)
SELECT d.name AS department_name,
       COUNT(DISTINCT e.id) AS total_employees,
       COUNT(a.id) AS attendance_records,
       COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) AS days_worked,
       ROUND(
           COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::DECIMAL / 
           NULLIF(COUNT(a.id), 0) * 100, 2
       ) AS attendance_rate
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id AND e.deleted_at IS NULL AND e.employment_status = 'active'
LEFT JOIN attendance a ON e.id = a.employee_id AND a.date BETWEEN $1 AND $2
WHERE d.deleted_at IS NULL
GROUP BY d.id, d.name
ORDER BY attendance_rate DESC NULLS LAST;

-- 10.10 Monthly payroll totals
SELECT 
    TO_CHAR(pay_period_start, 'YYYY-MM') AS month,
    COUNT(DISTINCT employee_id) AS employees_paid,
    SUM(base_salary) AS total_base,
    SUM(allowances) AS total_allowances,
    SUM(bonuses) AS total_bonuses,
    SUM(deductions) AS total_deductions,
    SUM(total_salary) AS grand_total
FROM payrolls
WHERE status = 'paid'
GROUP BY TO_CHAR(pay_period_start, 'YYYY-MM')
ORDER BY month DESC
LIMIT 12;

-- =====================================================
-- 11. DASHBOARD QUERIES
-- =====================================================

-- 11.1 Quick stats for dashboard
SELECT 
    (SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL AND employment_status = 'active') AS active_employees,
    (SELECT COUNT(*) FROM departments WHERE deleted_at IS NULL) AS departments,
    (SELECT COUNT(*) FROM leave_requests WHERE status = 'pending') AS pending_leaves,
    (SELECT COUNT(*) FROM attendance WHERE date = CURRENT_DATE) AS today_check_ins;

-- 11.2 Today's birthday list
SELECT id, employee_code, CONCAT(first_name, ' ', last_name) AS full_name, date_of_birth
FROM employees
WHERE deleted_at IS NULL AND employment_status = 'active'
AND EXTRACT(MONTH FROM date_of_birth) = EXTRACT(MONTH FROM CURRENT_DATE)
AND EXTRACT(DAY FROM date_of_birth) = EXTRACT(DAY FROM CURRENT_DATE);

-- 11.3 Upcoming work anniversaries (next 30 days)
SELECT id, employee_code, CONCAT(first_name, ' ', last_name) AS full_name,
       hire_date,
       EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) + 1 AS upcoming_years
FROM employees
WHERE deleted_at IS NULL AND employment_status = 'active'
AND (
    DATE_TRUNC('day', hire_date + 
        INTERVAL '1 year' * (EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) + 1))
    BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
)
ORDER BY hire_date;

-- 11.4 Recent activities (new employees, status changes)
SELECT 'new_employee' AS activity_type, id AS entity_id,
       CONCAT(first_name, ' ', last_name) AS description,
       created_at AS activity_date
FROM employees
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT 'leave_request' AS activity_type, id AS entity_id,
       CONCAT('Leave request: ', leave_type) AS description,
       created_at AS activity_date
FROM leave_requests
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY activity_date DESC
LIMIT 20;

-- =====================================================
-- 12. AUDIT & HISTORY QUERIES
-- =====================================================

-- 12.1 Get audit log for a specific record
SELECT * FROM audit_log
WHERE table_name = $1 AND record_id = $2
ORDER BY changed_at DESC;

-- 12.2 Get recent audit changes
SELECT al.*, u.username AS changed_by_username
FROM audit_log al
LEFT JOIN users u ON al.changed_by = u.id
ORDER BY al.changed_at DESC
LIMIT 100;

-- 12.3 Get changes by user
SELECT al.*, 
       CASE al.table_name 
           WHEN 'employees' THEN (SELECT CONCAT(first_name, ' ', last_name) FROM employees WHERE id = al.record_id)
           ELSE al.record_id::TEXT
       END AS record_name
FROM audit_log al
WHERE al.changed_by = $1
ORDER BY al.changed_at DESC
LIMIT 50;
