package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Evaluation;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.EvaluationMapper;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class EvaluationService {

    @Autowired EvaluationRepository evaluationRepository;
    @Autowired EmployeeRepository employeeRepository;
    @Autowired EvaluationMapper evaluationMapper;

    // 1. API Tổng hợp: Tìm kiếm nhân viên + Lấy đánh giá gần nhất
    // (Phục vụ cho màn hình List danh sách)
    public List<EmployeeEvaluationSummaryDTO> getEmployeeEvaluationSummaries(String keyword, String department) {
        return employeeRepository.findEmployeeSummariesWithLatestEvaluation(keyword, department);
    }

    // 2. API Tạo đánh giá mới
    public EvaluationResponse createEvaluation(EvaluationRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        // Lấy người đánh giá (User đang login)
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Employee evaluator = employeeRepository.findByEmail(currentEmail).orElse(null);

        // Tính điểm trung bình
        double average = (request.getWorkPerformanceScore() + request.getTeamworkScore() + request.getAttitudeScore()) / 3.0;
        // Làm tròn 1 chữ số thập phân (4.333 -> 4.3)
        average = Math.round(average * 10.0) / 10.0;

        LocalDate evalDate = request.getEvaluationDate() != null
                ? request.getEvaluationDate()
                : LocalDate.now();

        Evaluation evaluation = Evaluation.builder()
                .employee(employee)
                .evaluator(evaluator)
                .evaluationDate(evalDate)
                .workPerformanceScore(request.getWorkPerformanceScore())
                .teamworkScore(request.getTeamworkScore())
                .attitudeScore(request.getAttitudeScore())
                .averageScore(average)
                .strengths(request.getStrengths())
                .goals(request.getGoals())
                .createdAt(LocalDate.now())
                .build();

        Evaluation saved = evaluationRepository.save(evaluation);
        return evaluationMapper.toResponse(saved);
    }

    // 3. API Xem chi tiết đánh giá
    public EvaluationResponse getEvaluationDetail(Long id) {
        Evaluation eval = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EVALUATION_NOT_FOUND.getMessage()));
        return evaluationMapper.toResponse(eval);
    }

}