package management.member.demo.exception.model;

import management.member.demo.exception.base.BusinessException;

/**
 * Enum quản lý mã lỗi và message tiếng Việt
 * Chỉ chứa mã lỗi và message, hoàn toàn độc lập với HTTP layer
 * HTTP Status được quyết định ở tầng ExceptionHandler
 */
public enum ErrorCode {
    
    // Employee errors
    EMPLOYEE_NOT_FOUND("EMPLOYEE_NOT_FOUND", "Nhân viên không tồn tại"),
    INVALID_EMPLOYEE_ID("INVALID_EMPLOYEE_ID", "ID nhân viên không hợp lệ"),
    INVALID_EMPLOYEE("INVALID_EMPLOYEE", "Thông tin nhân viên không hợp lệ"),
    INVALID_REQUEST("INVALID_REQUEST", "Thông tin yêu cầu không được để trống"),
    
    // Employee field validation errors
    INVALID_FIRST_NAME("INVALID_FIRST_NAME", "Họ không được để trống"),
    INVALID_LAST_NAME("INVALID_LAST_NAME", "Tên không được để trống"),
    INVALID_EMAIL("INVALID_EMAIL", "Email không được để trống"),
    INVALID_EMPLOYEE_CODE("INVALID_EMPLOYEE_CODE", "Mã nhân viên không được để trống"),
    INVALID_DEPARTMENT("INVALID_DEPARTMENT", "Phòng ban không được để trống"),
    INVALID_POSITION("INVALID_POSITION", "Chức vụ không được để trống"),
    INVALID_HIRE_DATE("INVALID_HIRE_DATE", "Ngày vào làm không được để trống"),
    INVALID_STATUS("INVALID_STATUS", "Trạng thái không được để trống"),
    INVALID_STATUS_VALUE("INVALID_STATUS_VALUE", "Trạng thái không hợp lệ. Các giá trị hợp lệ: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED"),
    INVALID_BASE_SALARY("INVALID_BASE_SALARY", "Lương cơ bản không được để trống"),
    INVALID_BASE_SALARY_NEGATIVE("INVALID_BASE_SALARY_NEGATIVE", "Lương cơ bản phải lớn hơn hoặc bằng 0"),
    
    // Employee conflicts
    EMPLOYEE_EMAIL_EXISTS("EMPLOYEE_EMAIL_EXISTS", "Email nhân viên đã tồn tại"),
    EMPLOYEE_CODE_EXISTS("EMPLOYEE_CODE_EXISTS", "Mã nhân viên đã tồn tại"),
    
    // Salary errors
    SALARY_NOT_FOUND("SALARY_NOT_FOUND", "Bản ghi lương không tồn tại"),
    INVALID_SALARY_ID("INVALID_SALARY_ID", "ID bản ghi lương không hợp lệ"),
    INVALID_SALARY("INVALID_SALARY", "Thông tin lương không hợp lệ"),
    
    // Salary field validation errors
    INVALID_SALARY_EMPLOYEE_ID("INVALID_SALARY_EMPLOYEE_ID", "ID nhân viên không được để trống"),
    INVALID_SALARY_BASE_SALARY("INVALID_SALARY_BASE_SALARY", "Lương cơ bản không được để trống"),
    INVALID_SALARY_BASE_SALARY_NEGATIVE("INVALID_SALARY_BASE_SALARY_NEGATIVE", "Lương cơ bản phải lớn hơn hoặc bằng 0"),
    INVALID_SALARY_STATUS("INVALID_SALARY_STATUS", "Trạng thái lương không được để trống"),
    INVALID_SALARY_STATUS_VALUE("INVALID_SALARY_STATUS_VALUE", "Trạng thái lương không hợp lệ. Các giá trị hợp lệ: AWAITING, SUCCESS, FAILED, CANCELLED"),
    INVALID_PAYMENT_DATE("INVALID_PAYMENT_DATE", "Ngày thanh toán không được để trống"),
    
    // Payroll errors
    PAYROLL_NOT_FOUND("PAYROLL_NOT_FOUND", "Bảng lương không tồn tại"),
    INVALID_PAYROLL_ID("INVALID_PAYROLL_ID", "ID bảng lương không hợp lệ"),
    INVALID_PAYROLL("INVALID_PAYROLL", "Thông tin bảng lương không hợp lệ"),
    
    // Payroll field validation errors
    INVALID_PAYROLL_CODE("INVALID_PAYROLL_CODE", "Mã kỳ lương không được để trống"),
    INVALID_PAYROLL_CODE_EXISTS("INVALID_PAYROLL_CODE_EXISTS", "Mã kỳ lương đã tồn tại"),
    INVALID_PAYROLL_PERIOD("INVALID_PAYROLL_PERIOD", "Kỳ lương không được để trống"),
    INVALID_PAYROLL_STATUS("INVALID_PAYROLL_STATUS", "Trạng thái bảng lương không được để trống"),
    INVALID_PAYROLL_STATUS_VALUE("INVALID_PAYROLL_STATUS_VALUE", "Trạng thái bảng lương không hợp lệ. Các giá trị hợp lệ: PENDING, PAID, FAILED, CANCELLED"),
    INVALID_PAYROLL_OPERATION("INVALID_PAYROLL_OPERATION", "Không thể thực hiện thao tác này với trạng thái hiện tại của bảng lương"),
    
    // Security/Authentication errors
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "Xác thực thất bại"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Tên đăng nhập hoặc mật khẩu không đúng"),
    ACCESS_DENIED("ACCESS_DENIED", "Bạn không có quyền truy cập tài nguyên này"),
    
    // Common errors
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Lỗi hệ thống nội bộ"),
    METHOD_NOT_ALLOWED("METHOD_NOT_ALLOWED", "Phương thức không được phép"),
    BAD_REQUEST("BAD_REQUEST", "Yêu cầu không hợp lệ");
    
    private final String code;
    private final String message;
    
    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
    
    /**
     * Tạo BusinessException từ ErrorCode
     * Không map HttpStatus - HttpStatus sẽ được quyết định ở ExceptionHandler
     */
    public BusinessException toException() {
        return new BusinessException(this.code, this.message);
    }

    /**
     * Tạo BusinessException từ ErrorCode với message tùy chỉnh
     */
    public BusinessException toException(String customMessage) {
        return new BusinessException(this.code, customMessage);
    }

    /**
     * Tạo BusinessException từ ErrorCode với format message
     */
    public BusinessException toException(Object... args) {
        String formattedMessage = String.format(this.message, args);
        return new BusinessException(this.code, formattedMessage);
    }
}

