-- =====================================================
-- Seed: Sample Employees
-- =====================================================
-- Description: Insert sample employees for testing
-- Note: Run this AFTER running all migrations
-- =====================================================

-- Create sample users for employees first
INSERT INTO users (id, username, email, password_hash, full_name, is_active) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'nguyen.van.a', 'nguyenvana@company.com', 
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VxmnOoZTNa0N.G', 
     'Nguyễn Văn A', TRUE),
    ('e0000000-0000-0000-0000-000000000002', 'tran.thi.b', 'tranthib@company.com', 
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VxmnOoZTNa0N.G', 
     'Trần Thị B', TRUE),
    ('e0000000-0000-0000-0000-000000000003', 'le.van.c', 'levanc@company.com', 
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VxmnOoZTNa0N.G', 
     'Lê Văn C', TRUE),
    ('e0000000-0000-0000-0000-000000000004', 'pham.thi.d', 'phamthid@company.com', 
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VxmnOoZTNa0N.G', 
     'Phạm Thị D', TRUE),
    ('e0000000-0000-0000-0000-000000000005', 'hoang.van.e', 'hoangvane@company.com', 
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VxmnOoZTNa0N.G', 
     'Hoàng Văn E', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Assign employee role to sample users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::UUID
FROM users u
WHERE u.id LIKE 'e0000000%'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Create sample employees
INSERT INTO employees (id, employee_code, user_id, department_id, position_id, first_name, last_name, date_of_birth, gender, national_id, email, phone_number, address, hire_date, contract_type, employment_status) VALUES
    -- HR Department
    ('70000000-0000-0000-0000-000000000001', 'EMP20240001', 
     'e0000000-0000-0000-0000-000000000001',
     '20000000-0000-0000-0000-000000000001', -- HR Department
     '30000000-0000-0000-0000-000000000007', -- Manager
     'Văn A', 'Nguyễn', '1985-03-15', 'male', '012345678901',
     'nguyenvana@company.com', '0901234567', 
     '123 Nguyễn Huệ, Q1, TP.HCM',
     '2020-01-15', 'full_time', 'active'),
    
    -- IT Department
    ('70000000-0000-0000-0000-000000000002', 'EMP20240002',
     'e0000000-0000-0000-0000-000000000002',
     '20000000-0000-0000-0000-000000000002', -- IT Department
     '30000000-0000-0000-0000-000000000009', -- Senior Specialist
     'Thị B', 'Trần', '1990-07-22', 'female', '012345678902',
     'tranthib@company.com', '0901234568',
     '456 Lê Lợi, Q3, TP.HCM',
     '2021-06-01', 'full_time', 'active'),
    
    ('70000000-0000-0000-0000-000000000003', 'EMP20240003',
     'e0000000-0000-0000-0000-000000000003',
     '20000000-0000-0000-0000-000000000002', -- IT Department
     '30000000-0000-0000-0000-000000000010', -- Specialist
     'Văn C', 'Lê', '1992-11-08', 'male', '012345678903',
     'levanc@company.com', '0901234569',
     '789 Trần Hưng Đạo, Q5, TP.HCM',
     '2022-03-15', 'full_time', 'active'),
    
    -- Finance Department
    ('70000000-0000-0000-0000-000000000004', 'EMP20240004',
     'e0000000-0000-0000-0000-000000000004',
     '20000000-0000-0000-0000-000000000003', -- Finance Department
     '30000000-0000-0000-0000-000000000009', -- Senior Specialist
     'Thị D', 'Phạm', '1988-05-30', 'female', '012345678904',
     'phamthid@company.com', '0901234570',
     '101 Điện Biên Phủ, Q10, TP.HCM',
     '2019-09-01', 'full_time', 'active'),
    
    -- Sales Department
    ('70000000-0000-0000-0000-000000000005', 'EMP20240005',
     'e0000000-0000-0000-0000-000000000005',
     '20000000-0000-0000-0000-000000000004', -- Sales Department
     '30000000-0000-0000-0000-000000000011', -- Junior Specialist
     'Văn E', 'Hoàng', '1995-12-10', 'male', '012345678905',
     'hoangvane@company.com', '0901234571',
     '202 Cách Mạng Tháng 8, Q3, TP.HCM',
     '2023-01-10', 'probation', 'active')
ON CONFLICT (employee_code) DO NOTHING;

-- Set department managers (update departments with manager_id)
UPDATE departments 
SET manager_id = '70000000-0000-0000-0000-000000000001'
WHERE id = '20000000-0000-0000-0000-000000000001';

-- Create sample salaries for employees
INSERT INTO employee_salaries (id, employee_id, salary_grade_id, base_salary, allowances, effective_date, notes) VALUES
    ('80000000-0000-0000-0000-000000000001',
     '70000000-0000-0000-0000-000000000001',
     '40000000-0000-0000-0000-000000000004', -- Grade D - Manager
     18000000,
     '{"housing": 2000000, "transportation": 500000, "meal": 700000}'::jsonb,
     '2020-01-15',
     'Initial salary'),
    
    ('80000000-0000-0000-0000-000000000002',
     '70000000-0000-0000-0000-000000000002',
     '40000000-0000-0000-0000-000000000006', -- Grade F - Senior
     12000000,
     '{"housing": 1500000, "transportation": 400000, "meal": 700000}'::jsonb,
     '2021-06-01',
     'Initial salary'),
    
    ('80000000-0000-0000-0000-000000000003',
     '70000000-0000-0000-0000-000000000003',
     '40000000-0000-0000-0000-000000000007', -- Grade G - Mid-Level
     10000000,
     '{"housing": 1000000, "transportation": 400000, "meal": 700000}'::jsonb,
     '2022-03-15',
     'Initial salary'),
    
    ('80000000-0000-0000-0000-000000000004',
     '70000000-0000-0000-0000-000000000004',
     '40000000-0000-0000-0000-000000000006', -- Grade F - Senior
     13000000,
     '{"housing": 1500000, "transportation": 400000, "meal": 700000}'::jsonb,
     '2019-09-01',
     'Initial salary'),
    
    ('80000000-0000-0000-0000-000000000005',
     '70000000-0000-0000-0000-000000000005',
     '40000000-0000-0000-0000-000000000008', -- Grade H - Junior
     7000000,
     '{"transportation": 300000, "meal": 700000}'::jsonb,
     '2023-01-10',
     'Probation salary')
ON CONFLICT DO NOTHING;

-- Create some sample attendance records (last 5 days)
INSERT INTO attendance (id, employee_id, check_in_time, check_out_time, date, status, check_in_method, check_out_method) VALUES
    -- Employee 1 attendance
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000001', 
     CURRENT_DATE - INTERVAL '4 days' + TIME '08:00:00', 
     CURRENT_DATE - INTERVAL '4 days' + TIME '17:30:00',
     CURRENT_DATE - INTERVAL '4 days', 'present', 'face_recognition', 'face_recognition'),
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000001', 
     CURRENT_DATE - INTERVAL '3 days' + TIME '08:15:00', 
     CURRENT_DATE - INTERVAL '3 days' + TIME '17:45:00',
     CURRENT_DATE - INTERVAL '3 days', 'late', 'face_recognition', 'face_recognition'),
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000001', 
     CURRENT_DATE - INTERVAL '2 days' + TIME '07:55:00', 
     CURRENT_DATE - INTERVAL '2 days' + TIME '18:00:00',
     CURRENT_DATE - INTERVAL '2 days', 'present', 'face_recognition', 'face_recognition'),
    
    -- Employee 2 attendance
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000002', 
     CURRENT_DATE - INTERVAL '4 days' + TIME '08:05:00', 
     CURRENT_DATE - INTERVAL '4 days' + TIME '17:30:00',
     CURRENT_DATE - INTERVAL '4 days', 'present', 'card', 'card'),
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000002', 
     CURRENT_DATE - INTERVAL '3 days' + TIME '08:00:00', 
     CURRENT_DATE - INTERVAL '3 days' + TIME '17:30:00',
     CURRENT_DATE - INTERVAL '3 days', 'present', 'card', 'card'),
    
    -- Employee 3 attendance
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000003', 
     CURRENT_DATE - INTERVAL '4 days' + TIME '09:00:00', 
     CURRENT_DATE - INTERVAL '4 days' + TIME '18:00:00',
     CURRENT_DATE - INTERVAL '4 days', 'late', 'manual', 'manual'),
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000003', 
     CURRENT_DATE - INTERVAL '3 days' + TIME '08:00:00', 
     CURRENT_DATE - INTERVAL '3 days' + TIME '17:30:00',
     CURRENT_DATE - INTERVAL '3 days', 'present', 'face_recognition', 'face_recognition')
ON CONFLICT (employee_id, date) DO NOTHING;

-- Create sample leave requests
INSERT INTO leave_requests (id, employee_id, leave_type, start_date, end_date, days_count, reason, status, approved_by, approved_at) VALUES
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000002', 
     'annual', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', 3,
     'Family vacation', 'approved', 
     '00000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
    
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000003', 
     'sick', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', 1,
     'Medical appointment', 'approved', 
     '00000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    
    (uuid_generate_v4(), '70000000-0000-0000-0000-000000000005', 
     'personal', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '14 days', 1,
     'Personal matters', 'pending', NULL, NULL);

-- =====================================================
-- Rollback Script
-- =====================================================
-- DELETE FROM leave_requests WHERE employee_id LIKE '70000000%';
-- DELETE FROM attendance WHERE employee_id LIKE '70000000%';
-- DELETE FROM employee_salaries WHERE id LIKE '80000000%';
-- UPDATE departments SET manager_id = NULL WHERE id = '20000000-0000-0000-0000-000000000001';
-- DELETE FROM employees WHERE id LIKE '70000000%';
-- DELETE FROM user_roles WHERE user_id LIKE 'e0000000%';
-- DELETE FROM users WHERE id LIKE 'e0000000%';
