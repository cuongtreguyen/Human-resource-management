# Hướng dẫn Insert Payroll Data vào Database

## Mục đích
Script SQL này tạo dữ liệu Payroll và Salary mẫu cho tháng 12/2024 để test các API:
- `GET /api/payroll/accountant/monthly`
- `GET /api/payroll-statistics/summary`
- `GET /api/payroll-statistics/dashboard`
- `GET /api/payroll-statistics/filter-options`

## Yêu cầu
- Database PostgreSQL đã được setup
- Bảng `employees` đã có ít nhất 5 employees
- Bảng `payrolls` và `salaries` đã được tạo (tự động bởi Hibernate)

## Cách chạy

### Option 1: Chạy trực tiếp trong PostgreSQL
```sql
\i insert-payroll-data-sql.sql
```

### Option 2: Chạy từ command line
```bash
psql -U postgres -d railway -f insert-payroll-data-sql.sql
```

### Option 3: Chạy từ IDE (IntelliJ IDEA, DBeaver, etc.)
1. Mở file `insert-payroll-data-sql.sql`
2. Kết nối đến database
3. Chạy toàn bộ script

## Dữ liệu được tạo

### Payroll Records
1. **PAYROLL-2024-12** (PAID)
   - Period: 2024-12-01
   - Payment Date: 2024-12-10
   - Status: PAID
   - Total Amount: ~71,000,000 VNĐ
   - 5 Salary records (SUCCESS)

2. **PAYROLL-2024-12-PENDING** (PENDING)
   - Period: 2024-12-01
   - Payment Date: NULL (chưa thanh toán)
   - Status: PENDING
   - Total Amount: ~32,500,000 VNĐ
   - 3 Salary records (AWAITING)

### Salary Records

#### Payroll PAID (5 employees):
- **Employee 1**: Base 15M, Allowance 2M, OT 3M, Bonus 5M → Net: 19,075,000 VNĐ
- **Employee 2**: Base 12M, Allowance 1.5M, OT 2M → Net: 11,677,500 VNĐ
- **Employee 3**: Base 8M, Allowance 1M → Net: 7,245,000 VNĐ
- **Employee 4**: Base 20M, Allowance 3M, Bonus 10M → Net: 23,565,000 VNĐ
- **Employee 5**: Base 10M, Allowance 1.2M, OT 1.5M, Bonus 2M → Net: 11,233,500 VNĐ

#### Payroll PENDING (3 employees):
- **Employee 1**: Base 15M, Allowance 2M, OT 2M → Net: 14,295,000 VNĐ
- **Employee 2**: Base 12M, Allowance 1.5M, OT 1M → Net: 10,972,500 VNĐ
- **Employee 3**: Base 8M, Allowance 1M → Net: 7,245,000 VNĐ

## Công thức tính toán

### Bảo hiểm (tính trên base_salary):
- **BHXH (Social Insurance)**: 17.5% của base_salary
- **BHYT (Health Insurance)**: 8% của base_salary
- **BHTN (Unemployment Insurance)**: 4% của base_salary
- **Total Insurance**: BHXH + BHYT + BHTN

### Thuế thu nhập cá nhân (Personal Income Tax):
- Tính theo bậc thuế suất lũy tiến
- Employee 1: 1,500,000 VNĐ
- Employee 2: 800,000 VNĐ
- Employee 3: 0 VNĐ (dưới ngưỡng chịu thuế)
- Employee 4: 3,000,000 VNĐ
- Employee 5: 600,000 VNĐ

### Net Salary:
```
net_salary = gross_income - total_deductions
total_deductions = total_insurance + personal_income_tax + general_deductions
gross_income = base_salary + allowance + ot_pay + bonus
```

## Lưu ý
- Script sử dụng `ON CONFLICT DO NOTHING` để tránh lỗi nếu dữ liệu đã tồn tại
- Nếu muốn chạy lại, cần xóa dữ liệu cũ trước:
  ```sql
  DELETE FROM salaries WHERE payroll_id IN (
      SELECT id FROM payrolls WHERE code LIKE 'PAYROLL-2024-12%'
  );
  DELETE FROM payrolls WHERE code LIKE 'PAYROLL-2024-12%';
  ```
- Thay đổi tháng trong script nếu muốn tạo dữ liệu cho tháng khác:
  - Thay `2024-12` thành tháng hiện tại (ví dụ: `2025-01`)

## Kiểm tra dữ liệu
Sau khi chạy script, kiểm tra dữ liệu:
```sql
-- Xem tất cả Payroll trong tháng 12/2024
SELECT * FROM payrolls 
WHERE code LIKE 'PAYROLL-2024-12%'
ORDER BY code;

-- Xem tất cả Salary trong tháng 12/2024
SELECT s.*, p.code as payroll_code, p.status as payroll_status
FROM salaries s
JOIN payrolls p ON s.payroll_id = p.id
WHERE p.code LIKE 'PAYROLL-2024-12%'
ORDER BY p.code, s.employee_id;
```

