package management.member.demo.Mapper;

import management.member.demo.dto.OnLeaveRequest;
import management.member.demo.dto.OnLeaveResponse;
import management.member.demo.dto.OnLeaveListResponse;
import management.member.demo.entity.OnLeave;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OnLeaveMapper {
    @Mapping(target = "employee", ignore = true) // vì set trong service
    OnLeave toOnLeave(OnLeaveRequest request);

    @Mapping(source = "employee.remainingLeaveDays", target = "remainingLeaveDays")
    OnLeaveResponse toOnLeaveResponse(OnLeave onLeave);

    OnLeaveListResponse toOnLeaveListResponse(OnLeave onLeave);

    List<OnLeaveListResponse> toOnLeaveListResponseList(List<OnLeave> onLeaves);
}
