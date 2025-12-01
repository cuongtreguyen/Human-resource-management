package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.EmployeeEvaluation;
import management.member.demo.entity.Employee;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.EmployeeEvaluationMapper;
import management.member.demo.repository.EmployeeEvaluationRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeEvaluationService {

    @Autowired
    private EmployeeEvaluationRepository evaluationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeEvaluationMapper evaluationMapper;

    public EvaluationListResponseDTO getAllEvaluations(String employeeId, String period) {
        Long empId = employeeId != null ? Long.parseLong(employeeId) : null;
        List<EmployeeEvaluation> evaluations = evaluationRepository.findByFilters(empId, period);

        List<EvaluationListItemDTO> evaluationDTOs = evaluations.stream()
                .map(evaluationMapper::toEvaluationListItemDTO)
                .collect(Collectors.toList());

        EvaluationListResponseDTO response = new EvaluationListResponseDTO();
        response.setData(evaluationDTOs);
        response.setSuccess(true);

        return response;
    }

    public EvaluationListResponseDTO getEmployeeEvaluations(String employeeId) {
        return getAllEvaluations(employeeId, null);
    }

    public CreateEvaluationResponseDTO createEvaluation(CreateEvaluationRequestDTO request) {
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        EmployeeEvaluation evaluation = new EmployeeEvaluation();
        evaluation.setEmployee(employee);
        evaluation.setPeriod(request.getPeriod());
        evaluation.setReviewDate(request.getReviewDate() != null ? request.getReviewDate() : LocalDate.now());
        evaluation.setWorkPerformance(request.getWorkPerformance());
        evaluation.setTeamwork(request.getTeamwork());
        evaluation.setAttitude(request.getAttitude());
        
        // Calculate overall rating
        double overallRating = (request.getWorkPerformance() + request.getTeamwork() + request.getAttitude()) / 3.0;
        evaluation.setOverallRating(overallRating);
        
        evaluation.setStrengths(request.getStrengths());
        evaluation.setImprovements(request.getImprovements());
        evaluation.setComments(request.getComments());
        evaluation.setReviewer(request.getReviewer() != null ? request.getReviewer() : "System");
        evaluation.setReviewerRole("manager");

        EmployeeEvaluation saved = evaluationRepository.save(evaluation);

        CreateEvaluationResponseDTO response = new CreateEvaluationResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setSuccess(true);
        response.setMessage("Đã lưu đánh giá thành công!");

        return response;
    }

    public UpdateEvaluationResponseDTO updateEvaluation(String id, CreateEvaluationRequestDTO request) {
        Long evaluationId = Long.parseLong(id);
        EmployeeEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));

        evaluation.setPeriod(request.getPeriod());
        evaluation.setReviewDate(request.getReviewDate());
        evaluation.setWorkPerformance(request.getWorkPerformance());
        evaluation.setTeamwork(request.getTeamwork());
        evaluation.setAttitude(request.getAttitude());
        
        double overallRating = (request.getWorkPerformance() + request.getTeamwork() + request.getAttitude()) / 3.0;
        evaluation.setOverallRating(overallRating);
        
        evaluation.setStrengths(request.getStrengths());
        evaluation.setImprovements(request.getImprovements());
        evaluation.setComments(request.getComments());

        EmployeeEvaluation updated = evaluationRepository.save(evaluation);

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
                    dto.setDepartment(emp.getDepartment());
                    dto.setEvaluationCount(evaluations.size());
                    // TODO: Map to EmployeeEvaluationSummaryDTO if needed
                    // if (!evaluations.isEmpty()) {
                    //     dto.setLastEvaluation(evaluationMapper.toEvaluationSummaryDTO(evaluations.get(0)));
                    // }
                    return dto;
                })
                .collect(Collectors.toList());

        EmployeeWithEvaluationsListResponseDTO response = new EmployeeWithEvaluationsListResponseDTO();
        response.setData(employeeDTOs);
        response.setSuccess(true);

        return response;
    }
}

