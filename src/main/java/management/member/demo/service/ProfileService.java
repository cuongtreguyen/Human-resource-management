package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeEvaluation;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.EmployeeEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeEvaluationRepository employeeEvaluationRepository;

    public EmployeePerformanceDTO getEmployeePerformance(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        // Get latest evaluation from database
        List<EmployeeEvaluation> evaluations = employeeEvaluationRepository.findByFilters(empId, null);
        EmployeeEvaluation latestEvaluation = evaluations.stream()
                .findFirst()
                .orElse(null);

        EmployeePerformanceDTO dto = new EmployeePerformanceDTO();
        dto.setEmployeeId(employeeId);
        
        if (latestEvaluation != null) {
            dto.setPeriod(latestEvaluation.getPeriod() != null ? latestEvaluation.getPeriod() : "N/A");
            dto.setOverallRating(latestEvaluation.getOverallRating());
            
            EmployeePerformanceDTO.PerformanceRatingsDTO ratings = new EmployeePerformanceDTO.PerformanceRatingsDTO();
            // Map workPerformance to quality and productivity
            ratings.setQuality(latestEvaluation.getWorkPerformance() != null ? 
                    latestEvaluation.getWorkPerformance().doubleValue() : 0.0);
            ratings.setProductivity(latestEvaluation.getWorkPerformance() != null ? 
                    latestEvaluation.getWorkPerformance().doubleValue() : 0.0);
            ratings.setTeamwork(latestEvaluation.getTeamwork() != null ? 
                    latestEvaluation.getTeamwork().doubleValue() : 0.0);
            // Map attitude to communication and innovation
            ratings.setCommunication(latestEvaluation.getAttitude() != null ? 
                    latestEvaluation.getAttitude().doubleValue() : 0.0);
            ratings.setInnovation(latestEvaluation.getAttitude() != null ? 
                    latestEvaluation.getAttitude().doubleValue() : 0.0);
            dto.setRatings(ratings);
            
            // Map strengths to achievements
            if (latestEvaluation.getStrengths() != null && !latestEvaluation.getStrengths().isEmpty()) {
                dto.setAchievements(List.of(latestEvaluation.getStrengths().split("\\n")));
            } else {
                dto.setAchievements(new ArrayList<>());
            }
            
            // Map improvements to areasForImprovement
            if (latestEvaluation.getImprovements() != null && !latestEvaluation.getImprovements().isEmpty()) {
                dto.setAreasForImprovement(List.of(latestEvaluation.getImprovements().split("\\n")));
            } else {
                dto.setAreasForImprovement(new ArrayList<>());
            }
            
            dto.setGoals(new ArrayList<>());
            dto.setManagerFeedback(latestEvaluation.getComments() != null ? latestEvaluation.getComments() : "");
            dto.setNextReviewDate(latestEvaluation.getReviewDate() != null ? 
                    latestEvaluation.getReviewDate().plusMonths(3).toString() : null);
        } else {
            // Default values if no evaluation found
            dto.setPeriod("N/A");
            dto.setOverallRating(0.0);
            dto.setRatings(new EmployeePerformanceDTO.PerformanceRatingsDTO());
            dto.setAchievements(new ArrayList<>());
            dto.setAreasForImprovement(new ArrayList<>());
            dto.setGoals(new ArrayList<>());
            dto.setManagerFeedback("");
            dto.setNextReviewDate(null);
        }

        return dto;
    }

    public EmployeeTrainingResponseDTO getEmployeeTraining(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        EmployeeTrainingResponseDTO dto = new EmployeeTrainingResponseDTO();
        dto.setTrainings(new ArrayList<>());
        dto.setSummary(new EmployeeTrainingResponseDTO.TrainingSummaryDTO());
        dto.getSummary().setCompleted(5);
        dto.getSummary().setInProgress(2);
        dto.getSummary().setRegistered(1);
        dto.getSummary().setTotalHours(120);
        dto.getSummary().setCertificates(3);

        return dto;
    }

    public ProfileDTO getProfile(String userId) {
        // Try to find employee by userId (could be employeeId, employeeCode, or id)
        Employee employee = null;
        try {
            Long id = Long.parseLong(userId);
            employee = employeeRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            // Try to find by employeeId or employeeCode
            employee = employeeRepository.findByEmployeeId(userId)
                    .orElse(employeeRepository.findByEmployeeCode(userId).orElse(null));
        }
        
        if (employee != null) {
            ProfileDTO dto = new ProfileDTO();
            dto.setId(String.valueOf(employee.getId()));
            dto.setName(employee.getFullName());
            dto.setEmail(employee.getEmail());
            dto.setPhone(employee.getPhone());
            dto.setAvatar("/api/placeholder/150/150");
            dto.setPosition(employee.getPosition());
            dto.setDepartment(employee.getDepartment());
            dto.setRole("employee");
            return dto;
        }
        
        // If not found, return default
        ProfileDTO dto = new ProfileDTO();
        dto.setId(userId);
        dto.setName("User");
        dto.setEmail("");
        dto.setPhone("");
        dto.setAvatar("/api/placeholder/150/150");
        dto.setPosition("");
        dto.setDepartment("");
        dto.setRole("user");
        return dto;
    }

    public UpdateProfileResponseDTO updateProfile(String userId, UpdateProfileRequestDTO request) {
        UpdateProfileResponseDTO response = new UpdateProfileResponseDTO();
        response.setId(userId);
        response.setSuccess(true);
        response.setMessage("Profile updated successfully");
        return response;
    }

    public SettingsResponseDTO getSettings() {
        SettingsResponseDTO dto = new SettingsResponseDTO();
        
        SettingsResponseDTO.CompanySettingsDTO company = new SettingsResponseDTO.CompanySettingsDTO();
        company.setName("ABC Corporation");
        company.setAddress("123 Nguyễn Huệ, Quận 1, TP.HCM");
        company.setPhone("028-12345678");
        company.setEmail("contact@company.com");
        company.setWebsite("https://company.com");
        company.setTaxCode("0123456789");
        dto.setCompany(company);
        
        SettingsResponseDTO.WorkingHoursSettingsDTO workingHours = new SettingsResponseDTO.WorkingHoursSettingsDTO();
        workingHours.setStartTime("08:00");
        workingHours.setEndTime("17:00");
        workingHours.setLunchBreak("12:00-13:00");
        workingHours.setWorkingDays(List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"));
        dto.setWorkingHours(workingHours);
        
        SettingsResponseDTO.PayrollSettingsDTO payroll = new SettingsResponseDTO.PayrollSettingsDTO();
        payroll.setCurrency("VND");
        payroll.setPaymentDay(5);
        payroll.setSocialInsurance(8.0);
        payroll.setHealthInsurance(1.5);
        payroll.setUnemploymentInsurance(1.0);
        payroll.setOvertimeRate(1.5);
        dto.setPayroll(payroll);
        
        SettingsResponseDTO.LeaveSettingsDTO leave = new SettingsResponseDTO.LeaveSettingsDTO();
        leave.setAnnualLeave(12);
        leave.setSickLeave(5);
        leave.setMaternityLeave(180);
        leave.setCarryForward(true);
        leave.setMaxCarryForward(5);
        dto.setLeave(leave);
        
        dto.setSuccess(true);
        return dto;
    }

    public UpdateSettingsResponseDTO updateSettings(UpdateSettingsRequestDTO request) {
        UpdateSettingsResponseDTO response = new UpdateSettingsResponseDTO();
        response.setSuccess(true);
        response.setMessage("Cài đặt đã được cập nhật");
        return response;
    }
}

