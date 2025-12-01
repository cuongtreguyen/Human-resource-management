package management.member.demo.mapper;

import management.member.demo.dto.DepartmentDTO;
import management.member.demo.entity.Department;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho Department
 */
@Component
public class DepartmentMapper {

    public DepartmentDTO toDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(String.valueOf(department.getId()));
        dto.setName(department.getName());
        dto.setCode(department.getCode());
        dto.setHead(department.getHead());
        dto.setEmployeeCount(department.getEmployeeCount());
        return dto;
    }
}

