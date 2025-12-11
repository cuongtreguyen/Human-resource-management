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
    INVALID_FULL_NAME("INVALID_FULL_NAME", "Họ và tên không được để trống"),
    INVALID_EMAIL("INVALID_EMAIL", "Email không được để trống"),
    INVALID_EMAIL_FORMAT("INVALID_EMAIL_FORMAT", "Email không đúng định dạng"),
    INVALID_PHONE_FORMAT("INVALID_PHONE_FORMAT", "Số điện thoại không đúng định dạng (phải có 10-11 chữ số)"),
    INVALID_DATE_OF_BIRTH("INVALID_DATE_OF_BIRTH", "Ngày sinh không hợp lệ"),
    INVALID_DATE_RANGE("INVALID_DATE_RANGE", "Khoảng thời gian không hợp lệ"),
    INVALID_DEPARTMENT("INVALID_DEPARTMENT", "Phòng ban không được để trống"),
    INVALID_POSITION("INVALID_POSITION", "Chức vụ không được để trống"),
    INVALID_HIRE_DATE("INVALID_HIRE_DATE", "Ngày vào làm không được để trống"),
    INVALID_STATUS("INVALID_STATUS", "Trạng thái không được để trống"),
    INVALID_STATUS_VALUE("INVALID_STATUS_VALUE", "Trạng thái không hợp lệ. Các giá trị hợp lệ: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED"),
    INVALID_BASE_SALARY("INVALID_BASE_SALARY", "Lương cơ bản không được để trống"),
    INVALID_BASE_SALARY_NEGATIVE("INVALID_BASE_SALARY_NEGATIVE", "Lương cơ bản phải lớn hơn hoặc bằng 0"),
    
    // Employee conflicts
    EMPLOYEE_EMAIL_EXISTS("EMPLOYEE_EMAIL_EXISTS", "Email nhân viên đã tồn tại"),
    
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
    
    // Employee Benefits errors
    EMPLOYEE_BENEFITS_NOT_FOUND("EMPLOYEE_BENEFITS_NOT_FOUND", "Không tìm thấy phúc lợi nhân viên"),
    INVALID_EMPLOYEE_BENEFITS_ID("INVALID_EMPLOYEE_BENEFITS_ID", "ID phúc lợi nhân viên không hợp lệ"),
    
    // OnLeave errors
    INSUFFICIENT_LEAVE_DAYS("INSUFFICIENT_LEAVE_DAYS", "Không đủ ngày nghỉ phép"),
    
    // Notification errors
    NOTIFICATION_NOT_FOUND("NOTIFICATION_NOT_FOUND", "Thông báo không tồn tại"),
    INVALID_NOTIFICATION_ID("INVALID_NOTIFICATION_ID", "ID thông báo không hợp lệ"),

    // Task Delegation errors
    TASK_NOT_PERMITTED("TASK_NOT_PERMITTED", "Bạn không có quyền tạo task"),
    DELEGATION_NOT_FOUND("DELEGATION_NOT_FOUND", "Ủy quyền không tồn tại"),
    INVALID_DELEGATION_ID("INVALID_DELEGATION_ID", "ID ủy quyền không hợp lệ"),
    PERMISSION_DENIED("PERMISSION_DENIED", "Bạn không được giao task này"),
    TASK_NOT_FOUND("TASK_NOT_FOUND", "Task không tồn tại"),

    //Comment
    COMMENT_NOT_FOUND("COMMENT_NOT_FOUND", "Chưa có bình luận nào"),
    
    // Employee Evaluation errors
    EVALUATION_NOT_FOUND("EVALUATION_NOT_FOUND", "Đánh giá không tồn tại"),
    INVALID_EVALUATION_ID("INVALID_EVALUATION_ID", "ID đánh giá không hợp lệ"),
    
    // Policy errors
    POLICY_NOT_FOUND("POLICY_NOT_FOUND", "Chính sách không tồn tại"),
    INVALID_POLICY_ID("INVALID_POLICY_ID", "ID chính sách không hợp lệ"),
    INVALID_POLICY_NAME("INVALID_POLICY_NAME", "Tên chính sách không được để trống"),
    INVALID_POLICY_TYPE("INVALID_POLICY_TYPE", "Loại chính sách không được để trống"),
    
    // Attendance errors
    ATTENDANCE_NOT_FOUND("ATTENDANCE_NOT_FOUND", "Chấm công không tồn tại"),
    INVALID_ATTENDANCE_ID("INVALID_ATTENDANCE_ID", "ID chấm công không hợp lệ"),
    ATTENDANCE_ALREADY_CHECKED_IN("ATTENDANCE_ALREADY_CHECKED_IN", "Nhân viên đã check-in vào ngày này"),
    ATTENDANCE_ALREADY_CHECKED_OUT("ATTENDANCE_ALREADY_CHECKED_OUT", "Nhân viên đã check-out vào ngày này"),
    INVALID_EMPLOYEE_ID_FORMAT("INVALID_EMPLOYEE_ID_FORMAT", "Định dạng ID nhân viên không hợp lệ"),
    
    // Chat errors
    INVALID_CHAT_CONTACT_ID("INVALID_CHAT_CONTACT_ID", "ID liên hệ chat không hợp lệ"),
    
    // Audit Log errors
    INVALID_DATE_FORMAT("INVALID_DATE_FORMAT", "Định dạng ngày không hợp lệ (yêu cầu: yyyy-MM-dd)"),
    
    // Pagination errors
    INVALID_PAGE_NUMBER("INVALID_PAGE_NUMBER", "Số trang không hợp lệ (phải >= 0)"),
    INVALID_PAGE_SIZE("INVALID_PAGE_SIZE", "Kích thước trang không hợp lệ (phải > 0)"),
    
    // Security/Authentication errors
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "Xác thực thất bại"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Tên đăng nhập hoặc mật khẩu không đúng"),
    ACCESS_DENIED("ACCESS_DENIED", "Bạn không có quyền truy cập tài nguyên này"),
    USERNAME_EXISTS("USERNAME_EXISTS", "Tên đăng nhập đã tồn tại"),
    EMAIL_EXISTS("EMAIL_EXISTS", "Email đã tồn tại"),
    INVALID_PASSWORD_FORMAT("INVALID_PASSWORD_FORMAT", "Mật khẩu không đúng định dạng (tối thiểu 8 ký tự)"),
    INVALID_OTP_FORMAT("INVALID_OTP_FORMAT", "OTP không đúng định dạng"),
    OTP_EXPIRED("OTP_EXPIRED", "OTP đã hết hạn"),
    OTP_INVALID("OTP_INVALID", "OTP không đúng"),
    ACCOUNT_LOCKED_OR_INACTIVE("ACCOUNT_LOCKED_OR_INACTIVE", "Tài khoản bị khóa hoặc không hoạt động"),
    TOKEN_GENERATION_ERROR("TOKEN_GENERATION_ERROR", "Lỗi khi tạo token"),
    RATE_LIMIT_EXCEEDED("RATE_LIMIT_EXCEEDED", "Quá nhiều yêu cầu. Vui lòng thử lại sau"),
    
    // User errors
    USER_NOT_FOUND("USER_NOT_FOUND", "Người dùng không tồn tại"),
    INVALID_OLD_PASSWORD("INVALID_OLD_PASSWORD", "Mật khẩu cũ không đúng"),
    
    // File I/O errors
    FILE_UPLOAD_ERROR("FILE_UPLOAD_ERROR", "Lỗi khi upload file"),
    FILE_DOWNLOAD_ERROR("FILE_DOWNLOAD_ERROR", "Lỗi khi download file"),
    FILE_SERIALIZATION_ERROR("FILE_SERIALIZATION_ERROR", "Lỗi khi serialize dữ liệu"),
    
    // Email errors
    EMAIL_SEND_ERROR("EMAIL_SEND_ERROR", "Lỗi khi gửi email"),
    
    // Task errors
    NO_TASKS_FOUND("NO_TASKS_FOUND", "Không tìm thấy task nào"),
    INVALID_TASK_STATUS("INVALID_TASK_STATUS", "Trạng thái task không hợp lệ"),
    INVALID_TASK_PRIORITY("INVALID_TASK_PRIORITY", "Độ ưu tiên task không hợp lệ"),
    
    // OnLeave errors (old methods)
    NO_LEAVE_FOUND("NO_LEAVE_FOUND", "Không tìm thấy đơn nghỉ phép nào"),

    //Overtime errors
    OVERTIME_OUT_OF_TIME("OVERTIME_OUT_OF_TIME", "Chỉ được đăng ký OT trong khoảng 14:00 - 17:00 của ngày hôm nay"),
    OVERTIME_PERMISSION("OVERTIME_PERMISSION", "Bạn không có quyền xem đơn OT của nhân viên khác"),
    OVERTIME_STATUS_PERMISSION("OVERTIME_STATUS_PERMISSION", "Bạn không có quyền thay đổi trạng thái đơn OT này"),
    OVERTIME_NOT_FOUND("OVERTIME_NOT_FOUND", "Đơn OT không tồn tại"),
    OVERTIME_CANNOT_APPROVE("OVERTIME_CANNOT_APPROVE", "Chỉ được duyệt đơn OT đang chờ"),
    OVERTIME_CANNOT_REJECT("OVERTIME_CANNOT_REJECT", "Chỉ được từ chối đơn OT đang chờ"),
    OVERTIME_CANNOT_CANCEL("OVERTIME_CANNOT_CANCEL", "Chỉ được hủy đơn OT đang chờ"),
    OVERTIME_CANNOT_COMPLETE("OVERTIME_CANNOT_COMPLETE", "Chỉ hoàn thành đơn OT đã được duyệt"),
    OVERTIME_ONLY_MANAGER_APPROVE("OVERTIME_ONLY_MANAGER_APPROVE", "Chỉ quản lý mới có quyền duyệt đơn OT"),
    OVERTIME_ONLY_MANAGER_REJECT("OVERTIME_ONLY_MANAGER_REJECT", "Chỉ quản lý mới có quyền từ chối đơn OT"),
    OVERTIME_ONLY_MANAGER_COMPLETE("OVERTIME_ONLY_MANAGER_COMPLETE", "Chỉ quản lý mới có quyền hoàn thành đơn OT"),
    OVERTIME_CANCEL_ILLEGAL("OVERTIME_CANCEL_ILLEGAL", "Bạn không có quyền hủy đơn OT này"),
    OVERTIME_STATUS_INVALID("OVERTIME_STATUS_INVALID", "Trạng thái đơn OT không hợp lệ"),
    
    // Flask API errors
    FLASK_API_ERROR("FLASK_API_ERROR", "Lỗi khi gọi Flask API"),
    FLASK_API_TIMEOUT("FLASK_API_TIMEOUT", "Flask API không phản hồi"),
    FLASK_API_INVALID_RESPONSE("FLASK_API_INVALID_RESPONSE", "Dữ liệu từ Flask API không hợp lệ"),
    
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

