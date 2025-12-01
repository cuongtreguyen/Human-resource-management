package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.RecruitmentPosition;
import management.member.demo.entity.RecruitmentApplication;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.RecruitmentMapper;
import management.member.demo.repository.RecruitmentPositionRepository;
import management.member.demo.repository.RecruitmentApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecruitmentService {

    @Autowired
    private RecruitmentPositionRepository positionRepository;

    @Autowired
    private RecruitmentApplicationRepository applicationRepository;

    @Autowired
    private RecruitmentMapper recruitmentMapper;

    public PositionListResponseDTO getPositions(String status, String department) {
        List<RecruitmentPosition> positions = positionRepository.findByFilters(status, department);

        List<PositionListItemDTO> positionDTOs = positions.stream()
                .map(recruitmentMapper::toPositionListItemDTO)
                .collect(Collectors.toList());

        PositionListResponseDTO response = new PositionListResponseDTO();
        response.setData(positionDTOs);
        response.setSuccess(true);

        return response;
    }

    public CreatePositionResponseDTO createPosition(CreatePositionRequestDTO request) {
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
        position.setRequirements(request.getRequirements() != null ? String.join(", ", request.getRequirements()) : "");
        position.setApplicationsCount(0);

        RecruitmentPosition saved = positionRepository.save(position);

        CreatePositionResponseDTO response = new CreatePositionResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setSuccess(true);
        response.setMessage("Position created successfully");

        return response;
    }

    public ApplicationListResponseDTO getApplications(String positionId, String status) {
        Long posId = positionId != null ? Long.parseLong(positionId) : null;
        List<RecruitmentApplication> applications = applicationRepository.findByFilters(posId, status);

        List<ApplicationListItemDTO> applicationDTOs = applications.stream()
                .map(recruitmentMapper::toApplicationListItemDTO)
                .collect(Collectors.toList());

        ApplicationListResponseDTO response = new ApplicationListResponseDTO();
        response.setData(applicationDTOs);
        response.setSuccess(true);

        return response;
    }

    public ApplicationDetailDTO getApplicationById(String id) {
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
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        RecruitmentApplication updated = applicationRepository.save(application);

        UpdateApplicationStatusResponseDTO response = new UpdateApplicationStatusResponseDTO();
        response.setId(id);
        response.setStatus(updated.getStatus());
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
        dto.setRequirements(position.getRequirements() != null ? List.of(position.getRequirements().split(", ")) : List.of());
        dto.setApplicationsCount(position.getApplicationsCount());

        return dto;
    }

    public UpdatePositionResponseDTO updatePosition(String id, CreatePositionRequestDTO request) {
        Long positionId = Long.parseLong(id);
        RecruitmentPosition position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));

        position.setTitle(request.getTitle());
        position.setDepartment(request.getDepartment());
        position.setLocation(request.getLocation());
        position.setType(request.getType());
        position.setLevel(request.getLevel());
        position.setSalary(request.getSalary());
        position.setExperience(request.getExperience());
        position.setOpenings(request.getOpenings());
        position.setClosingDate(request.getClosingDate());
        position.setDescription(request.getDescription());
        position.setRequirements(request.getRequirements() != null ? String.join(", ", request.getRequirements()) : "");

        RecruitmentPosition updated = positionRepository.save(position);

        UpdatePositionResponseDTO response = new UpdatePositionResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Position updated successfully");

        return response;
    }

    public DeletePositionResponseDTO deletePosition(String id) {
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
        Long applicationId = Long.parseLong(id);
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        // Convert LocalDate to LocalDateTime (set time to 00:00:00 or use a default time)
        LocalDateTime interviewDateTime = request.getInterviewDate().atStartOfDay();
        application.setInterviewDate(interviewDateTime);
        application.setStatus("interview");

        RecruitmentApplication updated = applicationRepository.save(application);

        ScheduleInterviewResponseDTO response = new ScheduleInterviewResponseDTO();
        response.setId(id);
        response.setInterviewDate(updated.getInterviewDate() != null ? updated.getInterviewDate().toLocalDate() : null);
        response.setSuccess(true);
        response.setMessage("Interview scheduled successfully");

        return response;
    }

    public RateCandidateResponseDTO rateCandidate(String id, RateCandidateRequestDTO request) {
        Long applicationId = Long.parseLong(id);
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setRating(request.getRating());
        if (request.getFeedback() != null) {
            application.setNotes(request.getFeedback());
        }

        RecruitmentApplication updated = applicationRepository.save(application);

        RateCandidateResponseDTO response = new RateCandidateResponseDTO();
        response.setId(id);
        response.setRating(updated.getRating());
        response.setSuccess(true);
        response.setMessage("Candidate rated successfully");

        return response;
    }
}

