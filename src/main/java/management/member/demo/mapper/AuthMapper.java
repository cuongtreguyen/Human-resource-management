package management.member.demo.mapper;

import management.member.demo.dto.LoginResponse;
import management.member.demo.dto.UserInfoDTO;
import management.member.demo.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AuthMapper {

    public UserInfoDTO toUserInfoDTO(User user, String email) {
        UserInfoDTO userInfo = new UserInfoDTO();
        if (user != null) {
            userInfo.setId(String.valueOf(user.getId()));
            userInfo.setEmail(user.getEmail());
            userInfo.setRole(user.getRole() != null ? user.getRole().name().toLowerCase() : "employee");
            userInfo.setEmployeeId(user.getEmployee() != null && user.getEmployee().getEmployeeId() != null 
                    ? user.getEmployee().getEmployeeId() : null);
        } else {
            userInfo.setId(null);
            userInfo.setEmail(email);
            userInfo.setRole("employee");
            userInfo.setEmployeeId(null);
        }
        return userInfo;
    }

    public void populateLoginResponse(LoginResponse response, User currentUser, String email, 
                                     String accessToken, String refreshToken) {
        // Set token (main field for API spec)
        response.setToken(accessToken);

        // Set user info object
        response.setUser(toUserInfoDTO(currentUser, email));

        // Keep backward compatibility fields
        response.setUsername(currentUser != null ? currentUser.getEmail() : email);
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setAccessTokenExpiresAt(LocalDateTime.now().plusSeconds(3600));
        response.setRole(currentUser != null && currentUser.getRole() != null ? currentUser.getRole().name() : "EMPLOYEE");
    }
}

