package management.member.demo.Mapper;

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
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
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
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
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
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        // Các field như department, position, hireDate, status, baseSalary không được update qua profile
    }

    /**
     * Map EmployeeRequest DTO sang Employee entity (chỉ mapping, không validate)
     */
    public void updateEmployeeFromRequest(Employee employee, EmployeeRequest request) {
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setDepartment(request.getDepartment());
        employee.setPosition(request.getPosition());
        employee.setHireDate(request.getHireDate());
        employee.setStatus(request.getStatus());
        employee.setBaseSalary(request.getBaseSalary());
    }
}
