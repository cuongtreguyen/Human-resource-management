package management.member.demo.mapper;

import management.member.demo.dto.EmployeeDetailDTO;
import management.member.demo.dto.EmployeeListItemDTO;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.entity.Employee;
import management.member.demo.normalizer.config.ContractTypeMappingConfig;
import management.member.demo.normalizer.config.GenderMappingConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
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
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .hireDate(employee.getHireDate())
                .status(employee.getStatus())
                .baseSalary(employee.getBaseSalary())
                .build();
    }

    /**
     * Map EmployeeRequest DTO sang Employee entity (chỉ mapping, không validate)
     */
    public void updateEmployeeFromRequest(Employee employee, EmployeeRequest request) {
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
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
        // Use employeeId if available, otherwise use id as string
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
        dto.setName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setPosition(employee.getPosition());
        dto.setDepartment(employee.getDepartment());
        dto.setSeniority(calculateSeniority(employee.getHireDate()));
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name().toLowerCase() : null);
        dto.setHireDate(employee.getHireDate());
        return dto;
    }

    private String calculateSeniority(LocalDate hireDate) {
        if (hireDate == null) return "";
        Period period = Period.between(hireDate, LocalDate.now());
        int years = period.getYears();
        int months = period.getMonths();

        if (years == 0 && months == 0) return "Dưới 1 tháng";

        String result = "";
        if (years > 0) result += years + " năm ";
        if (months > 0) result += months + " tháng";

        return result.trim();
    }

    /**
     * Map Employee entity sang EmployeeDetailDTO for detail endpoint
     * Includes computed field 'name' and Vietnamese → English mapping for gender/contractType
     */
    public EmployeeDetailDTO toDetailDTO(Employee employee) {
        EmployeeDetailDTO dto = new EmployeeDetailDTO();
        // Use employeeId if available, otherwise use id as string
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
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
        
        // Map idCard (Employee.idCard → DTO.idNumber with @JsonProperty("idCard"))
        dto.setIdNumber(employee.getIdCard());
        dto.setTaxCode(employee.getTaxCode());
        dto.setPermanentAddress(employee.getPermanentAddress());
        dto.setTemporaryAddress(employee.getTemporaryAddress());
        dto.setContractCode(employee.getContractCode());
        
        // Map thông tin CMND/CCCD
        dto.setIdCardIssueDate(employee.getIdCardIssueDate());
        dto.setIdCardIssuePlace(employee.getIdCardIssuePlace());
        
        // Map thông tin nghỉ phép và OT
        dto.setRemainingLeaveDays(employee.getRemainingLeaveDays());
        dto.setRemainingOtHours(employee.getRemainingOtHours());
        
        // Map vai trò
        dto.setRole(employee.getRole() != null ? employee.getRole().name().toLowerCase() : null);
        
        // Map thông tin ca làm việc
        dto.setTimeIn(employee.getTimeIn());
        dto.setTimeOut(employee.getTimeOut());
        dto.setShift(employee.getShift());
        
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
        
        // Map các field từ Employee entity
        dto.setMaritalStatus(employee.getMaritalStatus());
        dto.setEmployeeType(employee.getEmployeeType() != null ? employee.getEmployeeType().name().toLowerCase() : null);
        dto.setManager(employee.getManager());

        
        // Map Emergency Contact
        if (employee.getEmergencyContactName() != null || 
            employee.getEmergencyContactPhone() != null || 
            employee.getEmergencyContactRelationship() != null) {
            EmployeeDetailDTO.EmergencyContact emergencyContact = new EmployeeDetailDTO.EmergencyContact();
            emergencyContact.setName(employee.getEmergencyContactName());
            emergencyContact.setPhone(employee.getEmergencyContactPhone());
            emergencyContact.setRelationship(employee.getEmergencyContactRelationship());
            dto.setEmergencyContact(emergencyContact);
        }
        
        // Map address (Employee.address → DTO.address via @JsonProperty)
        // Note: DTO has @JsonProperty("address") on permanentAddress, but we also have address field
        // We'll map Employee.address to a separate field if needed, or use permanentAddress
        
        // Fields not in Employee entity (set to null)
        dto.setNationality(null); // Not in entity
        dto.setEducation(null); // Not in entity
        dto.setEducationDetails(null); // Not in entity
        dto.setBankAccount(null); // Not in entity
        dto.setBankName(null); // Not in entity
        dto.setBankBranch(null); // Not in entity
        
        return dto;
    }
}
