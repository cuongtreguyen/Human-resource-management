package management.member.demo.Mapper;

import management.member.demo.dto.ApplicationListItemDTO;
import management.member.demo.dto.PositionListItemDTO;
import management.member.demo.entity.RecruitmentApplication;
import management.member.demo.entity.RecruitmentPosition;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho Recruitment
 */
@Component
public class RecruitmentMapper {

    public PositionListItemDTO toPositionListItemDTO(RecruitmentPosition position) {
        PositionListItemDTO dto = new PositionListItemDTO();
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
        dto.setApplicationsCount(position.getApplicationsCount());
        return dto;
    }

    public ApplicationListItemDTO toApplicationListItemDTO(RecruitmentApplication application) {
        ApplicationListItemDTO dto = new ApplicationListItemDTO();
        dto.setId(String.valueOf(application.getId()));
        if (application.getPosition() != null) {
            dto.setPositionId(String.valueOf(application.getPosition().getId()));
            dto.setPositionTitle(application.getPosition().getTitle());
        }
        dto.setCandidateName(application.getCandidateName());
        dto.setEmail(application.getEmail());
        dto.setPhone(application.getPhone());
        dto.setStatus(application.getStatus());
        dto.setAppliedDate(application.getAppliedDate());
        return dto;
    }
}

