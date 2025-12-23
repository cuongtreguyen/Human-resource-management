-- =====================================================
-- Migration 009: Seed Default Data
-- =====================================================
-- Description: Insert default roles, permissions, and sample data
-- Dependencies: All previous migrations
-- =====================================================

-- =====================================================
-- DEFAULT ROLES
-- =====================================================
INSERT INTO roles (id, name, description) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'System administrator with full access to all features'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'hr_manager', 'Human Resources manager with access to employee and HR functions'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'department_manager', 'Department manager with access to team management'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'employee', 'Regular employee with basic access')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- DEFAULT PERMISSIONS
-- =====================================================

-- User Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000001', 'view_users', 'users', 'read', 'View user accounts'),
    ('10000000-0000-0000-0000-000000000002', 'create_users', 'users', 'create', 'Create user accounts'),
    ('10000000-0000-0000-0000-000000000003', 'edit_users', 'users', 'update', 'Edit user accounts'),
    ('10000000-0000-0000-0000-000000000004', 'delete_users', 'users', 'delete', 'Delete user accounts'),
    ('10000000-0000-0000-0000-000000000005', 'manage_users', 'users', 'manage', 'Full access to user management')
ON CONFLICT (name) DO NOTHING;

-- Role Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000011', 'view_roles', 'roles', 'read', 'View roles'),
    ('10000000-0000-0000-0000-000000000012', 'create_roles', 'roles', 'create', 'Create roles'),
    ('10000000-0000-0000-0000-000000000013', 'edit_roles', 'roles', 'update', 'Edit roles'),
    ('10000000-0000-0000-0000-000000000014', 'delete_roles', 'roles', 'delete', 'Delete roles'),
    ('10000000-0000-0000-0000-000000000015', 'manage_roles', 'roles', 'manage', 'Full access to role management')
ON CONFLICT (name) DO NOTHING;

-- Employee Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000021', 'view_employees', 'employees', 'read', 'View employee information'),
    ('10000000-0000-0000-0000-000000000022', 'create_employees', 'employees', 'create', 'Create employee records'),
    ('10000000-0000-0000-0000-000000000023', 'edit_employees', 'employees', 'update', 'Edit employee information'),
    ('10000000-0000-0000-0000-000000000024', 'delete_employees', 'employees', 'delete', 'Delete employee records'),
    ('10000000-0000-0000-0000-000000000025', 'manage_employees', 'employees', 'manage', 'Full access to employee management')
ON CONFLICT (name) DO NOTHING;

-- Department Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000031', 'view_departments', 'departments', 'read', 'View departments'),
    ('10000000-0000-0000-0000-000000000032', 'create_departments', 'departments', 'create', 'Create departments'),
    ('10000000-0000-0000-0000-000000000033', 'edit_departments', 'departments', 'update', 'Edit departments'),
    ('10000000-0000-0000-0000-000000000034', 'delete_departments', 'departments', 'delete', 'Delete departments'),
    ('10000000-0000-0000-0000-000000000035', 'manage_departments', 'departments', 'manage', 'Full access to department management')
ON CONFLICT (name) DO NOTHING;

-- Position Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000041', 'view_positions', 'positions', 'read', 'View positions'),
    ('10000000-0000-0000-0000-000000000042', 'create_positions', 'positions', 'create', 'Create positions'),
    ('10000000-0000-0000-0000-000000000043', 'edit_positions', 'positions', 'update', 'Edit positions'),
    ('10000000-0000-0000-0000-000000000044', 'delete_positions', 'positions', 'delete', 'Delete positions'),
    ('10000000-0000-0000-0000-000000000045', 'manage_positions', 'positions', 'manage', 'Full access to position management')
ON CONFLICT (name) DO NOTHING;

-- Attendance Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000051', 'view_attendance', 'attendance', 'read', 'View attendance records'),
    ('10000000-0000-0000-0000-000000000052', 'create_attendance', 'attendance', 'create', 'Create attendance records'),
    ('10000000-0000-0000-0000-000000000053', 'edit_attendance', 'attendance', 'update', 'Edit attendance records'),
    ('10000000-0000-0000-0000-000000000054', 'delete_attendance', 'attendance', 'delete', 'Delete attendance records'),
    ('10000000-0000-0000-0000-000000000055', 'manage_attendance', 'attendance', 'manage', 'Full access to attendance management')
ON CONFLICT (name) DO NOTHING;

-- Leave Request Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000061', 'view_leave_requests', 'leave_requests', 'read', 'View leave requests'),
    ('10000000-0000-0000-0000-000000000062', 'create_leave_requests', 'leave_requests', 'create', 'Create leave requests'),
    ('10000000-0000-0000-0000-000000000063', 'edit_leave_requests', 'leave_requests', 'update', 'Edit leave requests'),
    ('10000000-0000-0000-0000-000000000064', 'delete_leave_requests', 'leave_requests', 'delete', 'Delete leave requests'),
    ('10000000-0000-0000-0000-000000000065', 'manage_leave_requests', 'leave_requests', 'manage', 'Full access to leave request management'),
    ('10000000-0000-0000-0000-000000000066', 'approve_leave_requests', 'leave_requests', 'update', 'Approve or reject leave requests')
ON CONFLICT (name) DO NOTHING;

-- Salary Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000071', 'view_salaries', 'salaries', 'read', 'View salary information'),
    ('10000000-0000-0000-0000-000000000072', 'create_salaries', 'salaries', 'create', 'Create salary records'),
    ('10000000-0000-0000-0000-000000000073', 'edit_salaries', 'salaries', 'update', 'Edit salary information'),
    ('10000000-0000-0000-0000-000000000074', 'delete_salaries', 'salaries', 'delete', 'Delete salary records'),
    ('10000000-0000-0000-0000-000000000075', 'manage_salaries', 'salaries', 'manage', 'Full access to salary management')
ON CONFLICT (name) DO NOTHING;

-- Payroll Management Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000081', 'view_payrolls', 'payrolls', 'read', 'View payroll records'),
    ('10000000-0000-0000-0000-000000000082', 'create_payrolls', 'payrolls', 'create', 'Create payroll records'),
    ('10000000-0000-0000-0000-000000000083', 'edit_payrolls', 'payrolls', 'update', 'Edit payroll records'),
    ('10000000-0000-0000-0000-000000000084', 'delete_payrolls', 'payrolls', 'delete', 'Delete payroll records'),
    ('10000000-0000-0000-0000-000000000085', 'manage_payrolls', 'payrolls', 'manage', 'Full access to payroll management'),
    ('10000000-0000-0000-0000-000000000086', 'approve_payrolls', 'payrolls', 'update', 'Approve payroll records')
ON CONFLICT (name) DO NOTHING;

-- Reports Permissions
INSERT INTO permissions (id, name, resource, action, description) VALUES
    ('10000000-0000-0000-0000-000000000091', 'view_reports', 'reports', 'read', 'View reports'),
    ('10000000-0000-0000-0000-000000000092', 'export_reports', 'reports', 'create', 'Export reports'),
    ('10000000-0000-0000-0000-000000000093', 'manage_reports', 'reports', 'manage', 'Full access to reports')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ROLE-PERMISSION MAPPINGS
-- =====================================================

-- Admin Role - Full access to everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID, id
FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- HR Manager Role
INSERT INTO role_permissions (role_id, permission_id) VALUES
    -- User management (limited)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000001'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000002'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000003'),
    -- Employee management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000025'),
    -- Department management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000035'),
    -- Position management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000045'),
    -- Attendance management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000055'),
    -- Leave request management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000065'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000066'),
    -- Salary management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000075'),
    -- Payroll management (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000085'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000086'),
    -- Reports (full)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10000000-0000-0000-0000-000000000093')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Department Manager Role
INSERT INTO role_permissions (role_id, permission_id) VALUES
    -- View employees
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000021'),
    -- View departments
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000031'),
    -- View positions
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000041'),
    -- Attendance (view and create)
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000051'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000052'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000053'),
    -- Leave requests (view and approve)
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000061'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000066'),
    -- View reports
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000091')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Employee Role
INSERT INTO role_permissions (role_id, permission_id) VALUES
    -- View own employee info (limited scope handled in application)
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '10000000-0000-0000-0000-000000000021'),
    -- View departments
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '10000000-0000-0000-0000-000000000031'),
    -- View positions
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '10000000-0000-0000-0000-000000000041'),
    -- View own attendance
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '10000000-0000-0000-0000-000000000051'),
    -- Create and view own leave requests
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '10000000-0000-0000-0000-000000000061'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '10000000-0000-0000-0000-000000000062')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =====================================================
-- DEFAULT ADMIN USER
-- Password: Admin@123 (bcrypt hash)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, full_name, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin', 'admin@hrms.local', 
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VxmnOoZTNa0N.G', 
     'System Administrator', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES
    ('00000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- =====================================================
-- SAMPLE DEPARTMENTS
-- =====================================================
INSERT INTO departments (id, name, code, description) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Human Resources', 'HR', 'Human Resources Department - handles recruitment, employee relations, and HR policies'),
    ('20000000-0000-0000-0000-000000000002', 'Information Technology', 'IT', 'Information Technology Department - manages IT infrastructure and software development'),
    ('20000000-0000-0000-0000-000000000003', 'Finance', 'FIN', 'Finance Department - handles financial planning, accounting, and budgeting'),
    ('20000000-0000-0000-0000-000000000004', 'Sales', 'SALES', 'Sales Department - manages sales operations and customer relationships'),
    ('20000000-0000-0000-0000-000000000005', 'Marketing', 'MKT', 'Marketing Department - handles marketing strategies and brand management'),
    ('20000000-0000-0000-0000-000000000006', 'Operations', 'OPS', 'Operations Department - manages day-to-day business operations'),
    ('20000000-0000-0000-0000-000000000007', 'Research & Development', 'RD', 'R&D Department - focuses on innovation and product development'),
    ('20000000-0000-0000-0000-000000000008', 'Customer Service', 'CS', 'Customer Service Department - handles customer support and satisfaction')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SAMPLE POSITIONS
-- =====================================================
INSERT INTO positions (id, title, code, description, level) VALUES
    ('30000000-0000-0000-0000-000000000001', 'Chief Executive Officer', 'CEO', 'Top executive responsible for overall company direction', 20),
    ('30000000-0000-0000-0000-000000000002', 'Chief Technology Officer', 'CTO', 'Executive responsible for technology strategy', 19),
    ('30000000-0000-0000-0000-000000000003', 'Chief Financial Officer', 'CFO', 'Executive responsible for financial strategy', 19),
    ('30000000-0000-0000-0000-000000000004', 'Chief Operating Officer', 'COO', 'Executive responsible for operations', 19),
    ('30000000-0000-0000-0000-000000000005', 'Department Director', 'DIR', 'Director of a department', 15),
    ('30000000-0000-0000-0000-000000000006', 'Senior Manager', 'SR_MGR', 'Senior management position', 12),
    ('30000000-0000-0000-0000-000000000007', 'Manager', 'MGR', 'Management position', 10),
    ('30000000-0000-0000-0000-000000000008', 'Team Lead', 'TL', 'Team leadership position', 8),
    ('30000000-0000-0000-0000-000000000009', 'Senior Specialist', 'SR_SPEC', 'Senior level specialist', 6),
    ('30000000-0000-0000-0000-000000000010', 'Specialist', 'SPEC', 'Mid-level specialist', 4),
    ('30000000-0000-0000-0000-000000000011', 'Junior Specialist', 'JR_SPEC', 'Entry level specialist', 2),
    ('30000000-0000-0000-0000-000000000012', 'Intern', 'INTERN', 'Internship position', 1)
ON CONFLICT (title) DO NOTHING;

-- =====================================================
-- SAMPLE SALARY GRADES
-- =====================================================
INSERT INTO salary_grades (id, grade_name, min_salary, max_salary, description) VALUES
    ('40000000-0000-0000-0000-000000000001', 'Grade A - Executive', 50000000, 150000000, 'Executive level salary grade (C-level)'),
    ('40000000-0000-0000-0000-000000000002', 'Grade B - Director', 30000000, 60000000, 'Director level salary grade'),
    ('40000000-0000-0000-0000-000000000003', 'Grade C - Senior Manager', 20000000, 40000000, 'Senior Manager salary grade'),
    ('40000000-0000-0000-0000-000000000004', 'Grade D - Manager', 15000000, 25000000, 'Manager salary grade'),
    ('40000000-0000-0000-0000-000000000005', 'Grade E - Team Lead', 12000000, 18000000, 'Team Lead salary grade'),
    ('40000000-0000-0000-0000-000000000006', 'Grade F - Senior', 10000000, 15000000, 'Senior level salary grade'),
    ('40000000-0000-0000-0000-000000000007', 'Grade G - Mid-Level', 8000000, 12000000, 'Mid-level salary grade'),
    ('40000000-0000-0000-0000-000000000008', 'Grade H - Junior', 6000000, 9000000, 'Junior level salary grade'),
    ('40000000-0000-0000-0000-000000000009', 'Grade I - Entry', 4000000, 7000000, 'Entry level salary grade'),
    ('40000000-0000-0000-0000-000000000010', 'Grade J - Intern', 2000000, 4000000, 'Intern salary grade')
ON CONFLICT (grade_name) DO NOTHING;

-- =====================================================
-- SAMPLE SALARY COMPONENTS
-- =====================================================
INSERT INTO salary_components (id, name, type, description, is_taxable) VALUES
    ('50000000-0000-0000-0000-000000000001', 'Housing Allowance', 'allowance', 'Monthly housing allowance', FALSE),
    ('50000000-0000-0000-0000-000000000002', 'Transportation Allowance', 'allowance', 'Monthly transportation allowance', FALSE),
    ('50000000-0000-0000-0000-000000000003', 'Meal Allowance', 'allowance', 'Daily meal allowance', FALSE),
    ('50000000-0000-0000-0000-000000000004', 'Phone Allowance', 'allowance', 'Monthly phone allowance', FALSE),
    ('50000000-0000-0000-0000-000000000005', 'Performance Bonus', 'bonus', 'Quarterly/annual performance bonus', TRUE),
    ('50000000-0000-0000-0000-000000000006', 'Project Bonus', 'bonus', 'Bonus for project completion', TRUE),
    ('50000000-0000-0000-0000-000000000007', '13th Month Bonus', 'bonus', 'Annual 13th month salary bonus', TRUE),
    ('50000000-0000-0000-0000-000000000008', 'Social Insurance', 'deduction', 'Social insurance contribution', FALSE),
    ('50000000-0000-0000-0000-000000000009', 'Health Insurance', 'deduction', 'Health insurance contribution', FALSE),
    ('50000000-0000-0000-0000-000000000010', 'Unemployment Insurance', 'deduction', 'Unemployment insurance contribution', FALSE)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SAMPLE HOLIDAYS (Vietnam)
-- =====================================================
INSERT INTO holidays (id, name, date, description, is_recurring) VALUES
    ('60000000-0000-0000-0000-000000000001', 'New Year''s Day', '2024-01-01', 'International New Year', TRUE),
    ('60000000-0000-0000-0000-000000000002', 'Lunar New Year (Tết) - Day 1', '2024-02-10', 'Vietnamese Lunar New Year - First Day', FALSE),
    ('60000000-0000-0000-0000-000000000003', 'Lunar New Year (Tết) - Day 2', '2024-02-11', 'Vietnamese Lunar New Year - Second Day', FALSE),
    ('60000000-0000-0000-0000-000000000004', 'Lunar New Year (Tết) - Day 3', '2024-02-12', 'Vietnamese Lunar New Year - Third Day', FALSE),
    ('60000000-0000-0000-0000-000000000005', 'Hung Kings Commemoration Day', '2024-04-18', 'Anniversary of the Hung Kings', FALSE),
    ('60000000-0000-0000-0000-000000000006', 'Reunification Day', '2024-04-30', 'Liberation of South Vietnam', TRUE),
    ('60000000-0000-0000-0000-000000000007', 'International Workers'' Day', '2024-05-01', 'International Labor Day', TRUE),
    ('60000000-0000-0000-0000-000000000008', 'Independence Day', '2024-09-02', 'Vietnam National Day', TRUE)
ON CONFLICT (date) DO NOTHING;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE roles IS 'Default roles seeded: admin, hr_manager, department_manager, employee';
COMMENT ON TABLE permissions IS 'Permissions cover: users, roles, employees, departments, positions, attendance, leave_requests, salaries, payrolls, reports';

-- =====================================================
-- Rollback Script
-- =====================================================
-- DELETE FROM holidays WHERE id LIKE '60000000%';
-- DELETE FROM salary_components WHERE id LIKE '50000000%';
-- DELETE FROM salary_grades WHERE id LIKE '40000000%';
-- DELETE FROM positions WHERE id LIKE '30000000%';
-- DELETE FROM departments WHERE id LIKE '20000000%';
-- DELETE FROM user_roles WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';
-- DELETE FROM role_permissions;
-- DELETE FROM permissions WHERE id LIKE '10000000%';
-- DELETE FROM roles WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');
