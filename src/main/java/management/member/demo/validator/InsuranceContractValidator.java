package management.member.demo.validator;

import management.member.demo.dto.AddInsuranceContractForEmployeeRequestDTO;
import management.member.demo.dto.CreateInsuranceContractRequestDTO;
import management.member.demo.dto.UpdateInsuranceContractByEmployeeRequestDTO;
import management.member.demo.dto.UpdateInsuranceContractRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.InsuranceContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class InsuranceContractValidator {

    @Autowired
    private InsuranceContractRepository insuranceContractRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public void validateCreateInsuranceContractRequest(CreateInsuranceContractRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance contract request cannot be null");
        }

        if (request.getInsurenceName() == null || request.getInsurenceName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance name is required");
        }

        if (insuranceContractRepository.existsByInsurenceName(request.getInsurenceName())) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance contract with name '" + request.getInsurenceName() + "' already exists");
        }

        if (request.getEmployerRate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Employer rate is required");
        }

        if (request.getEmployerRate().compareTo(BigDecimal.ZERO) < 0 || request.getEmployerRate().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Employer rate must be between 0 and 100");
        }

        if (request.getEmployeeRate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Employee rate is required");
        }

        if (request.getEmployeeRate().compareTo(BigDecimal.ZERO) < 0 || request.getEmployeeRate().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Employee rate must be between 0 and 100");
        }

        if (request.getEffective() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Effective date is required");
        }

        if (request.getExpiry() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Expiry date is required");
        }

        if (request.getExpiry().isBefore(request.getEffective())) {
            throw ErrorCode.INVALID_REQUEST.toException("Expiry date must be after or equal to effective date");
        }

        if (request.getStatus() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Status is required");
        }
    }

    public void validateUpdateInsuranceContractRequest(String insurenceName, UpdateInsuranceContractRequestDTO request) {
        if (insurenceName == null || insurenceName.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance name is required");
        }

        if (!insuranceContractRepository.existsByInsurenceName(insurenceName)) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance contract not found with name: " + insurenceName);
        }

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Update insurance contract request cannot be null");
        }

        if (request.getEmployerRate() != null) {
            if (request.getEmployerRate().compareTo(BigDecimal.ZERO) < 0 || request.getEmployerRate().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw ErrorCode.INVALID_REQUEST.toException("Employer rate must be between 0 and 100");
            }
        }

        if (request.getEmployeeRate() != null) {
            if (request.getEmployeeRate().compareTo(BigDecimal.ZERO) < 0 || request.getEmployeeRate().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw ErrorCode.INVALID_REQUEST.toException("Employee rate must be between 0 and 100");
            }
        }

        if (request.getEffective() != null && request.getExpiry() != null) {
            if (request.getExpiry().isBefore(request.getEffective())) {
                throw ErrorCode.INVALID_REQUEST.toException("Expiry date must be after or equal to effective date");
            }
        }
    }

    public void validateAddInsuranceContractForEmployeeRequest(String employeeId, AddInsuranceContractForEmployeeRequestDTO request) {
        validateEmployeeId(employeeId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Add insurance contract request cannot be null");
        }

        if (request.getContractId() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Contract ID is required");
        }

        if (!insuranceContractRepository.existsById(request.getContractId())) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance contract not found with ID: " + request.getContractId());
        }

        if (request.getEffective() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Effective date is required");
        }

        if (request.getExpiry() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Expiry date is required");
        }

        if (request.getExpiry().isBefore(request.getEffective())) {
            throw ErrorCode.INVALID_REQUEST.toException("Expiry date must be after or equal to effective date");
        }
    }

    public void validateUpdateInsuranceContractByEmployeeRequest(String employeeId, Long contractId, UpdateInsuranceContractByEmployeeRequestDTO request) {
        validateEmployeeId(employeeId);

        if (contractId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Contract ID is required");
        }

        if (!insuranceContractRepository.existsById(contractId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance contract not found with ID: " + contractId);
        }

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Update insurance contract request cannot be null");
        }

        if (request.getEffective() != null && request.getExpiry() != null) {
            if (request.getExpiry().isBefore(request.getEffective())) {
                throw ErrorCode.INVALID_REQUEST.toException("Expiry date must be after or equal to effective date");
            }
        }
    }

    public void validateInsuranceContractName(String insurenceName) {
        if (insurenceName == null || insurenceName.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance name is required");
        }

        if (!insuranceContractRepository.existsByInsurenceName(insurenceName)) {
            throw ErrorCode.INVALID_REQUEST.toException("Insurance contract not found with name: " + insurenceName);
        }
    }

    private void validateEmployeeId(String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Employee ID is required");
        }

        try {
            Long id = Long.parseLong(employeeId);
            if (!employeeRepository.existsById(id)) {
                throw ErrorCode.EMPLOYEE_NOT_FOUND.toException("Employee not found with ID: " + employeeId);
            }
        } catch (NumberFormatException e) {
            // Try to find by employeeId
            if (!employeeRepository.findByEmployeeId(employeeId).isPresent()) {
                throw ErrorCode.EMPLOYEE_NOT_FOUND.toException("Employee not found with ID: " + employeeId);
            }
        }
    }
}

