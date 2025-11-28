package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.RecruitmentMapper;
import management.member.demo.entity.RecruitmentApplication;
import management.member.demo.entity.RecruitmentPosition;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.RecruitmentApplicationRepository;
import management.member.demo.repository.RecruitmentPositionRepository;
import management.member.demo.validator.RecruitmentValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruitmentService {

    @Autowired
    private RecruitmentPositionRepository positionRepository;

    @Autowired
    private RecruitmentApplicationRepository applicationRepository;

    @Autowired
    private RecruitmentMapper recruitmentMapper;

    @Autowired
    private RecruitmentValidator recruitmentValidator;

    public PositionListResponseDTO getPositions(String status, String department) {
        List<RecruitmentPosition> positions = positionRepository.findByFilters(status, department);
        
        PositionListResponseDTO response = new PositionListResponseDTO();
        response.setData(positions.stream()
                .map(recruitmentMapper::toPositionListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreatePositionResponseDTO createPosition(CreatePositionRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        recruitmentValidator.validateCreatePositionRequest(request);
        
        RecruitmentPosition position = new RecruitmentPosition();
        position.setTitle(request.getTitle());
        position.setDepartment(request.getDepartment());
        position.setLocation(request.getLocation());
        position.setType(request.getType());
        position.setLevel(request.getLevel());
        position.setSalary(request.getSalary());
        position.setExperience(request.getExperience());
        position.setOpenings(request.getOpenings());
        position.setStatus("active");
        position.setPostedDate(LocalDate.now());
        position.setClosingDate(request.getClosingDate());
        position.setDescription(request.getDescription());
        // Convert requirements list to JSON string
        if (request.getRequirements() != null) {
            try {
                String requirementsJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(request.getRequirements());
                position.setRequirements(requirementsJson);
            } catch (Exception e) {
                position.setRequirements("[]");
            }
        } else {
            position.setRequirements("[]");
        }
        position.setApplicationsCount(0);

        RecruitmentPosition savedPosition = positionRepository.save(position);

        CreatePositionResponseDTO response = new CreatePositionResponseDTO();
        response.setId(String.valueOf(savedPosition.getId()));
        response.setSuccess(true);
        response.setMessage("Position created successfully");

        return response;
    }

    public ApplicationListResponseDTO getApplications(String positionId, String status) {
        Long posId = null;
        if (positionId != null && !positionId.trim().isEmpty()) {
            recruitmentValidator.validatePositionIdString(positionId); // Validate trước khi parse
            posId = Long.parseLong(positionId);
        }
        List<RecruitmentApplication> applications = applicationRepository.findByFilters(posId, status);
        
        ApplicationListResponseDTO response = new ApplicationListResponseDTO();
        response.setData(applications.stream()
                .map(recruitmentMapper::toApplicationListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public ApplicationDetailDTO getApplicationById(String id) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        recruitmentValidator.validateApplicationIdString(id);
        
        Long applicationId = Long.parseLong(id);
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        ApplicationDetailDTO dto = new ApplicationDetailDTO();
        dto.setId(String.valueOf(application.getId()));
        if (application.getPosition() != null) {
            dto.setPositionId(String.valueOf(application.getPosition().getId()));
            dto.setPositionTitle(application.getPosition().getTitle());
        }
        dto.setCandidateName(application.getCandidateName());
        dto.setEmail(application.getEmail());
        dto.setPhone(application.getPhone());
        dto.setExperience(application.getExperience());
        dto.setEducation(application.getEducation());
        dto.setStatus(application.getStatus());
        dto.setAppliedDate(application.getAppliedDate());
        dto.setResumeUrl(application.getResumeUrl());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setRating(application.getRating());
        dto.setInterviewDate(application.getInterviewDate());
        dto.setNotes(application.getNotes());

        return dto;
    }

    public UpdateApplicationStatusResponseDTO updateApplicationStatus(String id, UpdateApplicationStatusRequestDTO request) {
        Long applicationId = Long.parseLong(id);
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setStatus(request.getStatus());
        applicationRepository.save(application);

        UpdateApplicationStatusResponseDTO response = new UpdateApplicationStatusResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Application status updated successfully");

        return response;
    }

    public PositionDetailDTO getPositionById(String id) {
        Long positionId = Long.parseLong(id);
        RecruitmentPosition position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));

        PositionDetailDTO dto = new PositionDetailDTO();
        dto.setId(String.valueOf(position.getId()));
        dto.setTitle(position.getTitle());
        dto.setDepartment(position.getDepartment());
        dto.setLocation(position.getLocation());
        dto.setType(position.getType());
        dto.setLevel(position.getLevel());
        dto.setSalary(position.getSalary());
        dto.setExperience(position.getExperience());
        dto.setOpenings(position.getOpenings());
        dto.setStatus(position.getStatus());
        dto.setPostedDate(position.getPostedDate());
        dto.setClosingDate(position.getClosingDate());
        dto.setDescription(position.getDescription());
        // Parse requirements from JSON string
        if (position.getRequirements() != null && !position.getRequirements().isEmpty()) {
            try {
                List<String> requirements = new com.fasterxml.jackson.databind.ObjectMapper().readValue(
                    position.getRequirements(), 
                    new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {}
                );
                dto.setRequirements(requirements);
            } catch (Exception e) {
                dto.setRequirements(new ArrayList<>());
            }
        } else {
            dto.setRequirements(new ArrayList<>());
        }
        dto.setApplicationsCount(position.getApplicationsCount());

        return dto;
    }

    public UpdatePositionResponseDTO updatePosition(String id, CreatePositionRequestDTO request) {
        recruitmentValidator.validatePositionIdString(id); // Validate trước khi parse
        Long positionId = Long.parseLong(id);
        RecruitmentPosition position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));

        if (request.getTitle() != null) {
            position.setTitle(request.getTitle());
        }
        if (request.getDepartment() != null) {
            position.setDepartment(request.getDepartment());
        }
        if (request.getLocation() != null) {
            position.setLocation(request.getLocation());
        }
        if (request.getType() != null) {
            position.setType(request.getType());
        }
        if (request.getLevel() != null) {
            position.setLevel(request.getLevel());
        }
        if (request.getSalary() != null) {
            position.setSalary(request.getSalary());
        }
        if (request.getExperience() != null) {
            position.setExperience(request.getExperience());
        }
        if (request.getOpenings() != null) {
            position.setOpenings(request.getOpenings());
        }
        // Status and postedDate are not in update request
        if (request.getClosingDate() != null) {
            position.setClosingDate(request.getClosingDate());
        }
        if (request.getDescription() != null) {
            position.setDescription(request.getDescription());
        }
        if (request.getRequirements() != null) {
            try {
                String requirementsJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(request.getRequirements());
                position.setRequirements(requirementsJson);
            } catch (Exception e) {
                // Keep existing requirements if conversion fails
            }
        }

        positionRepository.save(position);

        UpdatePositionResponseDTO response = new UpdatePositionResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Position updated successfully");

        return response;
    }

    public DeletePositionResponseDTO deletePosition(String id) {
        recruitmentValidator.validatePositionIdString(id); // Validate trước khi parse
        Long positionId = Long.parseLong(id);
        RecruitmentPosition position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));

        positionRepository.delete(position);

        DeletePositionResponseDTO response = new DeletePositionResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Position deleted successfully");

        return response;
    }

    public ScheduleInterviewResponseDTO scheduleInterview(String id, ScheduleInterviewRequestDTO request) {
        recruitmentValidator.validateApplicationIdString(id); // Validate trước khi parse
        Long applicationId = Long.parseLong(id);
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        // Combine date and time into LocalDateTime
        LocalDateTime interviewDateTime = request.getInterviewDate().atTime(
            java.time.LocalTime.parse(request.getInterviewTime())
        );
        application.setInterviewDate(interviewDateTime);
        application.setStatus("interview");
        applicationRepository.save(application);

        ScheduleInterviewResponseDTO response = new ScheduleInterviewResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Interview scheduled successfully");
        response.setInterviewDate(request.getInterviewDate());
        response.setInterviewTime(request.getInterviewTime());

        return response;
    }

    public RateCandidateResponseDTO rateCandidate(String id, RateCandidateRequestDTO request) {
        recruitmentValidator.validateApplicationIdString(id); // Validate trước khi parse
        Long applicationId = Long.parseLong(id);
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setRating(request.getRating());
        if (request.getFeedback() != null) {
            application.setNotes(request.getFeedback());
        }
        applicationRepository.save(application);

        RateCandidateResponseDTO response = new RateCandidateResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Candidate rated successfully");
        response.setRating(request.getRating());

        return response;
    }

}

