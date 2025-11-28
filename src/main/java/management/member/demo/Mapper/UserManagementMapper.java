package management.member.demo.Mapper;

import management.member.demo.dto.UserListItemDTO;
import management.member.demo.entity.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho UserManagement
 */
@Component
public class UserManagementMapper {

    public UserListItemDTO toUserListItemDTO(User user) {
        UserListItemDTO dto = new UserListItemDTO();
        dto.setId(String.valueOf(user.getId()));
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        
        // Determine status
        if (Boolean.TRUE.equals(user.getIsLocked())) {
            dto.setStatus("locked");
        } else if (Boolean.FALSE.equals(user.getIsActive())) {
            dto.setStatus("inactive");
        } else {
            dto.setStatus("active");
        }
        
        dto.setLastLogin(user.getLastLogin());
        dto.setPermissions(new ArrayList<>()); // TODO: Get actual permissions
        
        return dto;
    }
}

