package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequestDTO {
    private String name;
    private String phone;
    private String avatar; // base64 or URL
}

