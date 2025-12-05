-- Script SQL để insert Payroll và Salary records cho tháng hiện tại (tháng 12/2024)
-- Chạy script này để tạo dữ liệu mẫu cho các API payroll

-- ============================================
-- 1. Tạo Payroll records cho tháng 12/2024
-- ============================================

-- Payroll 1: PAID (đã thanh toán)
INSERT INTO payrolls (code, period, created_date, payment_date, total_amount, status, note)
VALUES 
    ('PAYROLL-2025-12', '2025-12-01', '2025-12-05', '2024-12-10', 0, 'PAID', 'Payroll tháng 12/2024 - đã thanh toán')
ON CONFLICT (code) DO NOTHING;

-- Payroll 2: PENDING (đang chờ thanh toán)
INSERT INTO payrolls (code, period, created_date, payment_date, total_amount, status, note)
VALUES 
    ('PAYROLL-2025-12-PENDING', '2025-12-01', '2025-12-05', NULL, 0, 'PENDING', 'Payroll tháng 12/2024 - đang chờ thanh toán')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 2. Lấy ID của Payroll và Employees
-- ============================================

DO $$
DECLARE
    payroll_paid_id BIGINT;
    payroll_pending_id BIGINT;
    emp1_id BIGINT;
    emp2_id BIGINT;
    emp3_id BIGINT;
    emp4_id BIGINT;
    emp5_id BIGINT;
    total_net_salary_paid DECIMAL(19,2) := 0;
    total_net_salary_pending DECIMAL(19,2) := 0;
BEGIN
    -- Lấy ID của Payroll
    SELECT id INTO payroll_paid_id FROM payrolls WHERE code = 'PAYROLL-2024-12';
    SELECT id INTO payroll_pending_id FROM payrolls WHERE code = 'PAYROLL-2024-12-PENDING';
    
    -- Lấy ID của employees (lấy 5 employees đầu tiên)
    SELECT id INTO emp1_id FROM employees ORDER BY id LIMIT 1 OFFSET 0;
    SELECT id INTO emp2_id FROM employees ORDER BY id LIMIT 1 OFFSET 1;
    SELECT id INTO emp3_id FROM employees ORDER BY id LIMIT 1 OFFSET 2;
    SELECT id INTO emp4_id FROM employees ORDER BY id LIMIT 1 OFFSET 3;
    SELECT id INTO emp5_id FROM employees ORDER BY id LIMIT 1 OFFSET 4;
    
    -- ============================================
    -- 3. Tạo Salary records cho Payroll PAID
    -- ============================================
    
    IF payroll_paid_id IS NOT NULL AND emp1_id IS NOT NULL THEN
        -- Employee 1: Lương cao, có OT, có bonus
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp1_id, payroll_paid_id, 
            15000000,  -- base_salary
            2000000,   -- allowance
            3000000,   -- ot_pay
            5000000,   -- bonus
            25000000,  -- gross_income
            2625000,   -- social_insurance (17.5% của base_salary)
            1200000,   -- health_insurance (8% của base_salary)
            600000,    -- unemployment_insurance (4% của base_salary)
            4425000,   -- total_insurance
            0,         -- general_deductions
            1500000,   -- personal_income_tax
            5925000,   -- total_deductions
            19075000,  -- net_salary
            'SUCCESS'  -- status
        ) ON CONFLICT DO NOTHING;
        total_net_salary_paid := total_net_salary_paid + 19075000;
    END IF;
    
    IF payroll_paid_id IS NOT NULL AND emp2_id IS NOT NULL THEN
        -- Employee 2: Lương trung bình, có OT
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp2_id, payroll_paid_id,
            12000000,  -- base_salary
            1500000,   -- allowance
            2000000,   -- ot_pay
            0,         -- bonus
            15500000,  -- gross_income
            1627500,   -- social_insurance
            930000,    -- health_insurance
            465000,    -- unemployment_insurance
            3022500,   -- total_insurance
            0,         -- general_deductions
            800000,    -- personal_income_tax
            3822500,   -- total_deductions
            11677500,  -- net_salary
            'SUCCESS'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_paid := total_net_salary_paid + 11677500;
    END IF;
    
    IF payroll_paid_id IS NOT NULL AND emp3_id IS NOT NULL THEN
        -- Employee 3: Lương thấp, không OT, không bonus
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp3_id, payroll_paid_id,
            8000000,   -- base_salary
            1000000,   -- allowance
            0,         -- ot_pay
            0,         -- bonus
            9000000,   -- gross_income
            945000,    -- social_insurance
            540000,    -- health_insurance
            270000,    -- unemployment_insurance
            1755000,   -- total_insurance
            0,         -- general_deductions
            0,         -- personal_income_tax
            1755000,   -- total_deductions
            7245000,   -- net_salary
            'SUCCESS'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_paid := total_net_salary_paid + 7245000;
    END IF;
    
    IF payroll_paid_id IS NOT NULL AND emp4_id IS NOT NULL THEN
        -- Employee 4: Lương cao, có bonus lớn
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp4_id, payroll_paid_id,
            20000000,  -- base_salary
            3000000,   -- allowance
            0,         -- ot_pay
            10000000,  -- bonus
            33000000,  -- gross_income
            3465000,   -- social_insurance
            1980000,   -- health_insurance
            990000,    -- unemployment_insurance
            6435000,   -- total_insurance
            0,         -- general_deductions
            3000000,   -- personal_income_tax
            9435000,   -- total_deductions
            23565000,  -- net_salary
            'SUCCESS'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_paid := total_net_salary_paid + 23565000;
    END IF;
    
    IF payroll_paid_id IS NOT NULL AND emp5_id IS NOT NULL THEN
        -- Employee 5: Lương trung bình, có OT và bonus
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp5_id, payroll_paid_id,
            10000000,  -- base_salary
            1200000,   -- allowance
            1500000,   -- ot_pay
            2000000,   -- bonus
            14700000,  -- gross_income
            1543500,   -- social_insurance
            882000,    -- health_insurance
            441000,    -- unemployment_insurance
            2866500,   -- total_insurance
            0,         -- general_deductions
            600000,    -- personal_income_tax
            3466500,   -- total_deductions
            11233500,  -- net_salary
            'SUCCESS'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_paid := total_net_salary_paid + 11233500;
    END IF;
    
    -- ============================================
    -- 4. Tạo Salary records cho Payroll PENDING
    -- ============================================
    
    IF payroll_pending_id IS NOT NULL AND emp1_id IS NOT NULL THEN
        -- Employee 1: PENDING
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp1_id, payroll_pending_id,
            15000000,  -- base_salary
            2000000,   -- allowance
            2000000,   -- ot_pay
            0,         -- bonus
            19000000,  -- gross_income
            1995000,   -- social_insurance
            1140000,   -- health_insurance
            570000,    -- unemployment_insurance
            3705000,   -- total_insurance
            0,         -- general_deductions
            1000000,   -- personal_income_tax
            4705000,   -- total_deductions
            14295000,  -- net_salary
            'AWAITING'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_pending := total_net_salary_pending + 14295000;
    END IF;
    
    IF payroll_pending_id IS NOT NULL AND emp2_id IS NOT NULL THEN
        -- Employee 2: PENDING
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp2_id, payroll_pending_id,
            12000000,  -- base_salary
            1500000,   -- allowance
            1000000,   -- ot_pay
            0,         -- bonus
            14500000,  -- gross_income
            1522500,   -- social_insurance
            870000,    -- health_insurance
            435000,    -- unemployment_insurance
            2827500,   -- total_insurance
            0,         -- general_deductions
            700000,    -- personal_income_tax
            3527500,   -- total_deductions
            10972500,  -- net_salary
            'AWAITING'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_pending := total_net_salary_pending + 10972500;
    END IF;
    
    IF payroll_pending_id IS NOT NULL AND emp3_id IS NOT NULL THEN
        -- Employee 3: PENDING
        INSERT INTO salaries (
            employee_id, payroll_id, base_salary, allowance, ot_pay, bonus,
            gross_income, social_insurance, health_insurance, unemployment_insurance,
            total_insurance, general_deductions, personal_income_tax, total_deductions,
            net_salary, status
        ) VALUES (
            emp3_id, payroll_pending_id,
            8000000,   -- base_salary
            1000000,   -- allowance
            0,         -- ot_pay
            0,         -- bonus
            9000000,   -- gross_income
            945000,    -- social_insurance
            540000,    -- health_insurance
            270000,    -- unemployment_insurance
            1755000,   -- total_insurance
            0,         -- general_deductions
            0,         -- personal_income_tax
            1755000,   -- total_deductions
            7245000,   -- net_salary
            'AWAITING'
        ) ON CONFLICT DO NOTHING;
        total_net_salary_pending := total_net_salary_pending + 7245000;
    END IF;
    
    -- ============================================
    -- 5. Cập nhật total_amount của Payroll
    -- ============================================
    
    UPDATE payrolls 
    SET total_amount = total_net_salary_paid
    WHERE id = payroll_paid_id;
    
    UPDATE payrolls 
    SET total_amount = total_net_salary_pending
    WHERE id = payroll_pending_id;
    
END $$;

-- ============================================
-- 6. Kiểm tra dữ liệu đã insert
-- ============================================

SELECT 
    p.code,
    p.period,
    p.payment_date,
    p.status,
    p.total_amount,
    COUNT(s.id) as salary_count,
    COALESCE(SUM(s.net_salary), 0) as total_net_salary
FROM payrolls p
LEFT JOIN salaries s ON s.payroll_id = p.id
WHERE p.period >= DATE_TRUNC('month', CURRENT_DATE)
   OR p.code LIKE 'PAYROLL-2024-12%'
GROUP BY p.id, p.code, p.period, p.payment_date, p.status, p.total_amount
ORDER BY p.period DESC, p.code;

-- Xem chi tiết Salary records
SELECT 
    s.id,
    s.employee_id,
    e.full_name,
    e.department,
    s.base_salary,
    s.allowance,
    s.ot_pay,
    s.bonus,
    s.gross_income,
    s.total_insurance,
    s.personal_income_tax,
    s.total_deductions,
    s.net_salary,
    s.status,
    p.code as payroll_code,
    p.status as payroll_status
FROM salaries s
JOIN employees e ON s.employee_id = e.id
JOIN payrolls p ON s.payroll_id = p.id
WHERE p.period >= DATE_TRUNC('month', CURRENT_DATE)
   OR p.code LIKE 'PAYROLL-2024-12%'
ORDER BY p.period DESC, s.employee_id;

