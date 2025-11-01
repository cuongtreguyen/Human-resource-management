package management.member.demo.Enum;

public enum PayrollStatus {
    PENDING,        // Đang chờ thanh toán (chưa callback từ VNPay)
    PAID,        // Thanh toán thành công (vnp_ResponseCode == 00)
    FAILED,         // Thanh toán thất bại
    CANCELLED,      // Bị hủy
}
