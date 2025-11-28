package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.entity.User;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeePerformanceDTO getEmployeePerformance(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        EmployeePerformanceDTO dto = new EmployeePerformanceDTO();
        dto.setEmployeeId(employeeId);
        dto.setPeriod("Current");
        
        // TODO: Calculate actual performance metrics from tasks, evaluations, etc.
        dto.setOverallRating(0.0);
        dto.setRatings(new EmployeePerformanceDTO.PerformanceRatingsDTO());
        dto.setAchievements(new ArrayList<>());
        dto.setAreasForImprovement(new ArrayList<>());
        dto.setGoals(new ArrayList<>());
        dto.setManagerFeedback("");
        dto.setNextReviewDate("");
        
        return dto;
    }

    public EmployeeTrainingResponseDTO getEmployeeTraining(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        EmployeeTrainingResponseDTO response = new EmployeeTrainingResponseDTO();
        
        // TODO: Get actual training data from training records
        response.setTrainings(new ArrayList<>());
        response.setSummary(new EmployeeTrainingResponseDTO.TrainingSummaryDTO());
        response.setSuccess(true);
        
        return response;
    }

    public ProfileDTO getProfile(String userId) {
        Long id = Long.parseLong(userId);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ProfileDTO dto = new ProfileDTO();
        dto.setId(userId);
        dto.setName(user.getFirstName() + " " + user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        
        // If user has employeeId, get employee details
        if (user.getEmployeeId() != null) {
            try {
                Long empId = Long.parseLong(user.getEmployeeId());
                employeeRepository.findById(empId).ifPresent(emp -> {
                    dto.setPhone(emp.getPhone());
                    dto.setPosition(emp.getPosition());
                    dto.setDepartment(emp.getDepartment());
                });
            } catch (NumberFormatException e) {
                // EmployeeId is not a number, skip
            }
        }
        
        return dto;
    }

    public UpdateProfileResponseDTO updateProfile(String userId, UpdateProfileRequestDTO request) {
        Long id = Long.parseLong(userId);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getName() != null) {
            String[] nameParts = request.getName().split(" ", 2);
            user.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                user.setLastName(nameParts[1]);
            }
        }
        // Email cannot be updated via this endpoint
        if (request.getPhone() != null && user.getEmployeeId() != null) {
            try {
                Long empId = Long.parseLong(user.getEmployeeId());
                employeeRepository.findById(empId).ifPresent(emp -> {
                    emp.setPhone(request.getPhone());
                    employeeRepository.save(emp);
                });
            } catch (NumberFormatException e) {
                // EmployeeId is not a number, skip
            }
        }

        userRepository.save(user);

        UpdateProfileResponseDTO response = new UpdateProfileResponseDTO();
        response.setId(userId);
        response.setSuccess(true);
        response.setMessage("Profile updated successfully");

        return response;
    }

    public SettingsResponseDTO getSettings() {
        SettingsResponseDTO response = new SettingsResponseDTO();
        // TODO: Get actual settings from database or configuration
        response.setCompany(new SettingsResponseDTO.CompanySettingsDTO());
        response.setWorkingHours(new SettingsResponseDTO.WorkingHoursSettingsDTO());
        response.setPayroll(new SettingsResponseDTO.PayrollSettingsDTO());
        response.setLeave(new SettingsResponseDTO.LeaveSettingsDTO());
        response.setSuccess(true);
        
        return response;
    }

    public UpdateSettingsResponseDTO updateSettings(UpdateSettingsRequestDTO request) {
        // TODO: Save settings to database or configuration
        UpdateSettingsResponseDTO response = new UpdateSettingsResponseDTO();
        response.setSuccess(true);
        response.setMessage("Settings updated successfully");
        
        return response;
    }
}

