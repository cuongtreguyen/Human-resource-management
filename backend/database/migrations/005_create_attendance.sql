-- =====================================================
-- Migration 005: Create Attendance Tables
-- =====================================================
-- Description: Create tables for attendance tracking and leave management
-- Dependencies: 004_create_employees.sql
-- =====================================================

-- =====================================================
-- Table: attendance
-- Description: Store daily attendance records
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present',
    check_in_method VARCHAR(30),
    check_out_method VARCHAR(30),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT attendance_status_valid CHECK (status IN ('present', 'late', 'absent', 'on_leave', 'holiday', 'half_day')),
    CONSTRAINT attendance_method_valid CHECK (
        (check_in_method IS NULL OR check_in_method IN ('face_recognition', 'manual', 'card', 'mobile', 'biometric')) AND
        (check_out_method IS NULL OR check_out_method IN ('face_recognition', 'manual', 'card', 'mobile', 'biometric'))
    ),
    CONSTRAINT attendance_time_order CHECK (check_out_time IS NULL OR check_in_time IS NULL OR check_out_time >= check_in_time),
    CONSTRAINT attendance_date_valid CHECK (date <= CURRENT_DATE),
    
    -- Unique constraint: one attendance record per employee per day
    CONSTRAINT attendance_unique_employee_date UNIQUE (employee_id, date),
    
    -- Foreign keys
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================
-- Table: leave_requests
-- Description: Store leave/absence requests
-- =====================================================
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    leave_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count DECIMAL(5, 2),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT leave_type_valid CHECK (leave_type IN ('annual', 'sick', 'unpaid', 'maternity', 'paternity', 'bereavement', 'personal', 'other')),
    CONSTRAINT leave_status_valid CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    CONSTRAINT leave_date_order CHECK (end_date >= start_date),
    CONSTRAINT leave_days_positive CHECK (days_count IS NULL OR days_count > 0),
    
    -- Foreign keys
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_leave_approved_by FOREIGN KEY (approved_by) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =====================================================
-- Table: holidays
-- Description: Store company holidays
-- =====================================================
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint: one holiday per date
    CONSTRAINT holidays_unique_date UNIQUE (date)
);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE attendance IS 'Stores daily attendance records for employees';
COMMENT ON TABLE leave_requests IS 'Stores employee leave/absence requests';
COMMENT ON TABLE holidays IS 'Stores company-wide holidays';

COMMENT ON COLUMN attendance.status IS 'Attendance status: present, late, absent, on_leave, holiday, half_day';
COMMENT ON COLUMN attendance.check_in_method IS 'Method used for check-in: face_recognition, manual, card, mobile, biometric';
COMMENT ON COLUMN attendance.check_out_method IS 'Method used for check-out';

COMMENT ON COLUMN leave_requests.leave_type IS 'Type of leave: annual, sick, unpaid, maternity, paternity, bereavement, personal, other';
COMMENT ON COLUMN leave_requests.status IS 'Request status: pending, approved, rejected, cancelled';
COMMENT ON COLUMN leave_requests.days_count IS 'Number of leave days (can be fractional for half days)';

COMMENT ON COLUMN holidays.is_recurring IS 'If true, this holiday repeats every year';

-- =====================================================
-- Rollback Script
-- =====================================================
-- DROP TABLE IF EXISTS holidays;
-- DROP TABLE IF EXISTS leave_requests;
-- DROP TABLE IF EXISTS attendance;
