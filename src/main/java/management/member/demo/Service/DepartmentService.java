package management.member.demo.Service;

import management.member.demo.Mapper.DepartmentMapper;
import management.member.demo.dto.DepartmentDTO;
import management.member.demo.dto.DepartmentListResponseDTO;
import management.member.demo.entity.Department;
import management.member.demo.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DepartmentMapper departmentMapper;

    public DepartmentListResponseDTO getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        
        List<DepartmentDTO> departmentDTOs = departments.stream()
                .map(departmentMapper::toDTO)
                .collect(Collectors.toList());
        
        DepartmentListResponseDTO response = new DepartmentListResponseDTO();
        response.setData(departmentDTOs);
        response.setSuccess(true);
        
        return response;
    }
}

