package management.member.demo.mapper;

import management.member.demo.dto.ChatContactDTO;
import management.member.demo.entity.Employee;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho Chat
 */
@Component
public class ChatMapper {

    public ChatContactDTO toChatContactDTO(Employee employee) {
        ChatContactDTO dto = new ChatContactDTO();
        dto.setId(String.valueOf(employee.getId()));
        dto.setName(employee.getFullName());
        dto.setAvatar("/api/placeholder/150/150");
        dto.setEmail(employee.getEmail());
        dto.setPosition(employee.getPosition());
        dto.setDepartment(employee.getDepartment());
        dto.setLastMessage(""); // TODO: Get from actual chat messages
        dto.setUnreadCount(0); // TODO: Get from actual unread count
        dto.setLastSeen(""); // TODO: Get from actual last seen
        dto.setStatus("offline"); // TODO: Get from actual status
        return dto;
    }
}

