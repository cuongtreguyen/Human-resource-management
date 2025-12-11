package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO chứa thông tin user trong LoginResponse
 */
@Getter
@Setter
public class UserInfoDTO {
    private String id;
    private String email;
    private String role;
    private String fullName;
    private String employeeId;
}

