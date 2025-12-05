package management.member.demo.enums;

public enum SupportStatus {
    PENDING,            // Chờ xử lý (Mới tạo)
    ESCALATED_TO_ADMIN, // Đã chuyển lên Admin
    ADMIN_RESOLVED,     // Admin đã xử lý
    WAITING_INFO,       // Cần thông tin từ NV
    COMPLETED,          // Đã hoàn thành
    REJECTED            // Từ chối
}