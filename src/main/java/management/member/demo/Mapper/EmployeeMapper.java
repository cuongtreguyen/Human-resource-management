package management.member.demo.Mapper;

import management.member.demo.dto.EmployeeDetailDTO;
import management.member.demo.dto.EmployeeListItemDTO;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.ProfileResponse;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO
 */
@Component
public class EmployeeMapper {

    /**
     * Map Employee entity sang EmployeeResponse DTO
     */
    public EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .employeeCode(employee.getEmployeeCode())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .hireDate(employee.getHireDate())
                .status(employee.getStatus())
                .baseSalary(employee.getBaseSalary())
                .build();
    }

    /**
     * Map Employee entity sang ProfileResponse DTO
     */
    public ProfileResponse toProfileResponse(Employee employee) {
        return ProfileResponse.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .employeeCode(employee.getEmployeeCode())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .hireDate(employee.getHireDate())
                .status(employee.getStatus())
                .build();
    }

    /**
     * Map ProfileUpdateRequest DTO sang Employee entity (chỉ update các field trong profile)
     * Chỉ update thông tin liên hệ, không update thông tin công việc
     */
    public void updateProfileFromRequest(Employee employee, ProfileUpdateRequest request) {
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        // Các field như department, position, hireDate, status, baseSalary không được update qua profile
    }

    /**
     * Map EmployeeRequest DTO sang Employee entity (chỉ mapping, không validate)
     */
    public void updateEmployeeFromRequest(Employee employee, EmployeeRequest request) {
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setDepartment(request.getDepartment());
        employee.setPosition(request.getPosition());
        employee.setHireDate(request.getHireDate());
        employee.setStatus(request.getStatus());
        employee.setBaseSalary(request.getBaseSalary());
    }

    /**
     * Map Employee entity sang EmployeeListItemDTO for list endpoint
     */
    public EmployeeListItemDTO toListItem(Employee employee) {
        EmployeeListItemDTO dto = new EmployeeListItemDTO();
        // Use employeeId if available, otherwise use employeeCode, otherwise use id as string
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                  (employee.getEmployeeCode() != null ? employee.getEmployeeCode() : String.valueOf(employee.getId())));
        dto.setName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setPosition(employee.getPosition());
        dto.setDepartment(employee.getDepartment());
        dto.setPhone(employee.getPhone());
        // Convert status enum to lowercase string (ACTIVE -> active, ON_LEAVE -> on_leave)
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name().toLowerCase() : null);
        dto.setAvatar("/api/placeholder/150/150"); // Placeholder avatar URL
        dto.setHireDate(employee.getHireDate());
        dto.setSalary(employee.getBaseSalary());
        return dto;
    }

    /**
     * Map Employee entity sang EmployeeDetailDTO for detail endpoint
     */
    public EmployeeDetailDTO toDetail(Employee employee) {
        EmployeeDetailDTO dto = new EmployeeDetailDTO();
        // Use employeeId if available, otherwise use employeeCode, otherwise use id as string
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                  (employee.getEmployeeCode() != null ? employee.getEmployeeCode() : String.valueOf(employee.getId())));
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setPosition(employee.getPosition());
        dto.setDepartment(employee.getDepartment());
        // Convert status enum to lowercase string
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name().toLowerCase() : null);
        dto.setHireDate(employee.getHireDate());
        dto.setSalary(employee.getBaseSalary());
        dto.setPersonalEmail(employee.getPersonalEmail());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setGender(employee.getGender());
        dto.setIdNumber(employee.getIdNumber());
        dto.setTaxCode(employee.getTaxCode());
        dto.setPermanentAddress(employee.getPermanentAddress());
        dto.setTemporaryAddress(employee.getTemporaryAddress());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setContractCode(employee.getContractCode());
        dto.setContractType(employee.getContractType());
        return dto;
    }
}
