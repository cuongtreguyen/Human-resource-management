package management.member.demo.Mapper;

import management.member.demo.dto.DelegationListItemDTO;
import management.member.demo.entity.TaskDelegation;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho TaskDelegation
 */
@Component
public class TaskDelegationMapper {

    public DelegationListItemDTO toDelegationListItemDTO(TaskDelegation delegation) {
        DelegationListItemDTO dto = new DelegationListItemDTO();
        dto.setId(String.valueOf(delegation.getId()));
        
        // Map from employee
        if (delegation.getFromEmployee() != null) {
            DelegationListItemDTO.EmployeeInfo fromEmp = new DelegationListItemDTO.EmployeeInfo();
            fromEmp.setId(String.valueOf(delegation.getFromEmployee().getId()));
            fromEmp.setName(delegation.getFromEmployee().getFullName());
            dto.setFromEmployee(fromEmp);
        }
        
        // Map to employee
        if (delegation.getToEmployee() != null) {
            DelegationListItemDTO.EmployeeInfo toEmp = new DelegationListItemDTO.EmployeeInfo();
            toEmp.setId(String.valueOf(delegation.getToEmployee().getId()));
            toEmp.setName(delegation.getToEmployee().getFullName());
            dto.setToEmployee(toEmp);
        }
        
        dto.setStartDate(delegation.getStartDate());
        dto.setEndDate(delegation.getEndDate());
        dto.setReason(delegation.getReason());
        dto.setStatus(delegation.getStatus());
        dto.setCreatedAt(delegation.getCreatedAt());
        // Note: tasks field should be set by Service if needed (requires ObjectMapper)
        return dto;
    }
}

