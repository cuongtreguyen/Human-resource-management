package management.member.demo.mapper;

import management.member.demo.dto.SupportRequestResponse;
import management.member.demo.dto.SupportStatsDTO;
import management.member.demo.entity.SupportRequest;
import org.springframework.stereotype.Component;

@Component
public class SupportRequestMapper {

    public SupportRequestResponse toResponse(SupportRequest req) {
        return SupportRequestResponse.builder()
                .id(req.getId())
                .title(req.getTitle())
                .content(req.getContent())
                .category(req.getCategory().name())
                .status(req.getStatus().name())
                .requesterId(req.getRequester().getId())
                .requesterName(req.getRequester().getFullName())
                .requesterDepartment(req.getRequester().getDepartment())
                .managerResponse(req.getManagerResponse())
                .adminResponse(req.getAdminResponse())
                .createdAt(req.getCreatedAt())
                .updatedAt(req.getUpdatedAt())
                .build();
    }

    public SupportStatsDTO toStatsDTO(long total, long escalated, long waiting, long completed) {
        return SupportStatsDTO.builder()
                .totalRequests(total)
                .escalatedToAdmin(escalated)
                .waitingInfo(waiting)
                .completed(completed)
                .build();
    }
}

