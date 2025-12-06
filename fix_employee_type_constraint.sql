-- Script để fix constraint employee_type_check trong PostgreSQL

-- 1. Xem constraint hiện tại
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'employees_employee_type_check';

-- 2. Drop constraint cũ (nếu có)
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_employee_type_check;

-- 3. Tạo constraint mới với các giá trị đúng
ALTER TABLE employees 
ADD CONSTRAINT employees_employee_type_check 
CHECK (employee_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'));

-- 4. Kiểm tra lại
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'employees_employee_type_check';
