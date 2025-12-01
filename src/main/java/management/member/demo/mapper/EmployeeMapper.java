package management.member.demo.mapper;

import management.member.demo.dto.EmployeeDetailDTO;
import management.member.demo.dto.EmployeeListItemDTO;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.ProfileResponse;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import management.member.demo.normalizer.config.ContractTypeMappingConfig;
import management.member.demo.normalizer.config.GenderMappingConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO
 */
@Component
public class EmployeeMapper {

    private final GenderMappingConfig genderMappingConfig;
    private final ContractTypeMappingConfig contractTypeMappingConfig;

    @Autowired
    public EmployeeMapper(GenderMappingConfig genderMappingConfig, ContractTypeMappingConfig contractTypeMappingConfig) {
        this.genderMappingConfig = genderMappingConfig;
        this.contractTypeMappingConfig = contractTypeMappingConfig;
    }

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
        ProfileResponse response = new ProfileResponse();
        response.setData(ProfileResponse.ProfileData.builder()
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
                .build());
        return response;
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
    public EmployeeListItemDTO toListItemDTO(Employee employee) {
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
     * Includes computed field 'name' and Vietnamese → English mapping for gender/contractType
     */
    public EmployeeDetailDTO toDetailDTO(Employee employee) {
        EmployeeDetailDTO dto = new EmployeeDetailDTO();
        // Use employeeId if available, otherwise use employeeCode, otherwise use id as string
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                  (employee.getEmployeeCode() != null ? employee.getEmployeeCode() : String.valueOf(employee.getId())));
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        
        // Computed field: full name (firstName + lastName)
        String fullName = (employee.getFirstName() != null ? employee.getFirstName() : "") + 
                         (employee.getLastName() != null ? " " + employee.getLastName() : "");
        dto.setName(fullName.trim().isEmpty() ? employee.getFullName() : fullName.trim());
        
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
        
        // Map gender: English → Vietnamese for response (reverse mapping)
        String gender = employee.getGender();
        if (gender != null) {
            // Reverse mapping: "male" → "Nam", "female" → "Nữ"
            if ("male".equalsIgnoreCase(gender)) {
                dto.setGender("Nam");
            } else if ("female".equalsIgnoreCase(gender)) {
                dto.setGender("Nữ");
            } else {
                dto.setGender(gender); // Keep as is if not standard
            }
        }
        
        dto.setIdNumber(employee.getIdNumber());
        dto.setTaxCode(employee.getTaxCode());
        dto.setPermanentAddress(employee.getPermanentAddress());
        dto.setTemporaryAddress(employee.getTemporaryAddress());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setContractCode(employee.getContractCode());
        
        // Map contractType: English → Vietnamese for response (reverse mapping)
        String contractType = employee.getContractType();
        if (contractType != null) {
            // Reverse mapping: "Full-time" → "Hợp đồng không xác định thời hạn"
            Map<String, String> reverseMapping = new HashMap<>();
            reverseMapping.put("Full-time", "Hợp đồng không xác định thời hạn");
            reverseMapping.put("Part-time", "Hợp đồng có thời hạn");
            reverseMapping.put("Probation", "Hợp đồng thử việc");
            
            String mapped = reverseMapping.get(contractType);
            dto.setContractType(mapped != null ? mapped : contractType);
        }
        
        // Additional fields (set to null if not in entity - can be populated from other sources)
        dto.setNationality(null); // TODO: Add to entity if needed
        dto.setMaritalStatus(null); // TODO: Add to entity if needed
        dto.setEmployeeType(null); // TODO: Add to entity if needed
        dto.setManager(null); // TODO: Add to entity if needed
        dto.setWorkLocation(null); // TODO: Add to entity if needed
        dto.setEducation(null); // TODO: Add to entity if needed
        dto.setEducationDetails(null); // TODO: Add to entity if needed
        dto.setEmergencyContact(null); // TODO: Add to entity if needed
        dto.setBankAccount(null); // TODO: Add to entity if needed
        dto.setBankName(null); // TODO: Add to entity if needed
        dto.setBankBranch(null); // TODO: Add to entity if needed
        
        return dto;
    }
}
