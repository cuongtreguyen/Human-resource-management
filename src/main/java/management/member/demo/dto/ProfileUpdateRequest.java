package management.member.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Profile Update Request DTO - Dùng cho update profile
 * Chỉ chứa các field user được phép update (thông tin liên hệ)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    
    /** Họ và tên */
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 200, message = "Họ và tên không được vượt quá 200 ký tự")
    private String fullName;
    
    /** Email công việc */
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    @Size(max = 120, message = "Email không được vượt quá 120 ký tự")
    private String email;
    
    /** Số điện thoại */
    @Size(max = 30, message = "Số điện thoại không được vượt quá 30 ký tự")
    private String phone;
    
    /** Địa chỉ */
    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String address;
}

