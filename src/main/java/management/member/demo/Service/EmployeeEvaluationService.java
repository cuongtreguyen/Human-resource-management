package management.member.demo.Service;

import management.member.demo.Mapper.EmployeeEvaluationMapper;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeEvaluation;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeEvaluationRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.EmployeeEvaluationValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeEvaluationService {

    @Autowired
    private EmployeeEvaluationRepository evaluationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeEvaluationMapper employeeEvaluationMapper;

    @Autowired
    private EmployeeEvaluationValidator employeeEvaluationValidator;

    public EvaluationListResponseDTO getAllEvaluations(String employeeId, String period) {
        Long empId = employeeId != null ? employeeEvaluationValidator.validateEmployeeIdStringOptional(employeeId) : null;
        List<EmployeeEvaluation> evaluations = evaluationRepository.findByFilters(empId, period);
        
        EvaluationListResponseDTO response = new EvaluationListResponseDTO();
        response.setData(evaluations.stream()
                .map(employeeEvaluationMapper::toEvaluationListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public EvaluationListResponseDTO getEmployeeEvaluations(String employeeId) {
        employeeEvaluationValidator.validateEmployeeIdString(employeeId); // Validate trước khi parse
        Long empId = Long.parseLong(employeeId);
        List<EmployeeEvaluation> evaluations = evaluationRepository.findByFilters(empId, null);
        
        EvaluationListResponseDTO response = new EvaluationListResponseDTO();
        response.setData(evaluations.stream()
                .map(employeeEvaluationMapper::toEvaluationListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreateEvaluationResponseDTO createEvaluation(CreateEvaluationRequestDTO request) {
        employeeEvaluationValidator.validateEmployeeIdString(request.getEmployeeId()); // Validate trước khi parse
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        EmployeeEvaluation evaluation = new EmployeeEvaluation();
        evaluation.setEmployee(employee);
        evaluation.setPeriod(request.getPeriod());
        evaluation.setReviewDate(request.getReviewDate() != null ? request.getReviewDate() : LocalDate.now());
        evaluation.setWorkPerformance(request.getWorkPerformance());
        evaluation.setTeamwork(request.getTeamwork());
        evaluation.setAttitude(request.getAttitude());
        
        // Calculate overall rating
        double overallRating = (request.getWorkPerformance() + request.getTeamwork() + request.getAttitude()) / 3.0;
        evaluation.setOverallRating(Math.round(overallRating * 10.0) / 10.0);
        
        evaluation.setStrengths(request.getStrengths());
        evaluation.setImprovements(request.getImprovements());
        evaluation.setComments(request.getComments());
        evaluation.setReviewer(request.getReviewer());
        evaluation.setReviewerRole(request.getReviewerRole());

        EmployeeEvaluation savedEvaluation = evaluationRepository.save(evaluation);

        CreateEvaluationResponseDTO response = new CreateEvaluationResponseDTO();
        response.setId(String.valueOf(savedEvaluation.getId()));
        response.setSuccess(true);
        response.setMessage("Evaluation created successfully");

        return response;
    }

    public UpdateEvaluationResponseDTO updateEvaluation(String id, CreateEvaluationRequestDTO request) {
        employeeEvaluationValidator.validateEvaluationIdString(id); // Validate trước khi parse
        Long evaluationId = Long.parseLong(id);
        EmployeeEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));

        if (request.getPeriod() != null) {
            evaluation.setPeriod(request.getPeriod());
        }
        if (request.getReviewDate() != null) {
            evaluation.setReviewDate(request.getReviewDate());
        }
        if (request.getWorkPerformance() != null) {
            evaluation.setWorkPerformance(request.getWorkPerformance());
        }
        if (request.getTeamwork() != null) {
            evaluation.setTeamwork(request.getTeamwork());
        }
        if (request.getAttitude() != null) {
            evaluation.setAttitude(request.getAttitude());
        }
        
        // Recalculate overall rating
        double overallRating = (evaluation.getWorkPerformance() + evaluation.getTeamwork() + evaluation.getAttitude()) / 3.0;
        evaluation.setOverallRating(Math.round(overallRating * 10.0) / 10.0);
        
        if (request.getStrengths() != null) {
            evaluation.setStrengths(request.getStrengths());
        }
        if (request.getImprovements() != null) {
            evaluation.setImprovements(request.getImprovements());
        }
        if (request.getComments() != null) {
            evaluation.setComments(request.getComments());
        }
        if (request.getReviewer() != null) {
            evaluation.setReviewer(request.getReviewer());
        }
        if (request.getReviewerRole() != null) {
            evaluation.setReviewerRole(request.getReviewerRole());
        }

        evaluationRepository.save(evaluation);

        UpdateEvaluationResponseDTO response = new UpdateEvaluationResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Evaluation updated successfully");

        return response;
    }

    public DeleteEvaluationResponseDTO deleteEvaluation(String id) {
        Long evaluationId = Long.parseLong(id);
        EmployeeEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));

        evaluationRepository.delete(evaluation);

        DeleteEvaluationResponseDTO response = new DeleteEvaluationResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Evaluation deleted successfully");

        return response;
    }

    public EmployeeWithEvaluationsListResponseDTO getEmployeesWithEvaluations() {
        List<Employee> employees = employeeRepository.findAll();
        
        List<EmployeeWithEvaluationsDTO> employeeDTOs = employees.stream()
                .map(emp -> {
                    List<EmployeeEvaluation> evaluations = evaluationRepository.findByFilters(emp.getId(), null);
                    
                    EmployeeWithEvaluationsDTO dto = new EmployeeWithEvaluationsDTO();
                    dto.setId(String.valueOf(emp.getId()));
                    dto.setName(emp.getFullName());
                    dto.setEmail(emp.getEmail());
                    dto.setDepartment(emp.getDepartment());
                    if (!evaluations.isEmpty()) {
                        EmployeeEvaluation lastEval = evaluations.get(0);
                        EmployeeEvaluationSummaryDTO summary = new EmployeeEvaluationSummaryDTO();
                        summary.setId(String.valueOf(lastEval.getId()));
                        summary.setPeriod(lastEval.getPeriod());
                        summary.setOverallRating(lastEval.getOverallRating());
                        summary.setReviewDate(lastEval.getReviewDate());
                        summary.setReviewer(lastEval.getReviewer());
                        dto.setLastEvaluation(summary);
                    }
                    dto.setEvaluationCount(evaluations.size());
                    
                    return dto;
                })
                .collect(Collectors.toList());
        
        EmployeeWithEvaluationsListResponseDTO response = new EmployeeWithEvaluationsListResponseDTO();
        response.setData(employeeDTOs);
        response.setSuccess(true);
        
        return response;
    }
}

