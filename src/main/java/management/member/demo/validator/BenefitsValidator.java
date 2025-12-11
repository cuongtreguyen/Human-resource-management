package management.member.demo.validator;

import management.member.demo.dto.AddBenefitForEmployeeRequestDTO;
import management.member.demo.dto.CreateBenefitRequestDTO;
import management.member.demo.dto.UpdateBenefitRequestDTO;
import management.member.demo.dto.UpdateEmployeeBenefitRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.BenefitsRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class BenefitsValidator {

    @Autowired
    private BenefitsRepository benefitsRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public void validateCreateBenefitRequest(CreateBenefitRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit request cannot be null");
        }

        if (request.getBenefitId() == null || request.getBenefitId().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit ID is required");
        }

        if (benefitsRepository.existsByBenefitId(request.getBenefitId())) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit with ID '" + request.getBenefitId() + "' already exists");
        }

        if (request.getBenefitName() == null || request.getBenefitName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit name is required");
        }

        if (request.getAllowanceAmount() != null && request.getAllowanceAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Allowance amount must be >= 0");
        }
    }

    public void validateUpdateBenefitRequest(String benefitId, UpdateBenefitRequestDTO request) {
        if (benefitId == null || benefitId.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit ID is required");
        }

        if (!benefitsRepository.existsByBenefitId(benefitId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit not found with ID: " + benefitId);
        }

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Update benefit request cannot be null");
        }

        if (request.getAllowanceAmount() != null && request.getAllowanceAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Allowance amount must be >= 0");
        }
    }

    public void validateAddBenefitForEmployeeRequest(String employeeId, AddBenefitForEmployeeRequestDTO request) {
        validateEmployeeId(employeeId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Add benefit request cannot be null");
        }

        if (request.getBenefitId() == null || request.getBenefitId().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit ID is required");
        }

        if (!benefitsRepository.existsByBenefitId(request.getBenefitId())) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit not found with ID: " + request.getBenefitId());
        }
    }

    public void validateUpdateEmployeeBenefitRequest(String employeeId, String benefitId, UpdateEmployeeBenefitRequestDTO request) {
        validateEmployeeId(employeeId);

        if (benefitId == null || benefitId.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit ID is required");
        }

        if (!benefitsRepository.existsByBenefitId(benefitId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit not found with ID: " + benefitId);
        }

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Update employee benefit request cannot be null");
        }
    }

    public void validateBenefitId(String benefitId) {
        if (benefitId == null || benefitId.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit ID is required");
        }

        if (!benefitsRepository.existsByBenefitId(benefitId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Benefit not found with ID: " + benefitId);
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

