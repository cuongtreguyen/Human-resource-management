package management.member.demo.Mapper;

import management.member.demo.dto.OnLeaveRequest;
import management.member.demo.dto.OnLeaveResponse;
import management.member.demo.entity.OnLeave;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OnLeaveMapper {
    @Mapping(target = "employee", ignore = true) // vì set trong service
    OnLeave toOnLeave(OnLeaveRequest request);

    @Mapping(source = "employee.remainingLeaveDays", target = "remainingLeaveDays")
    OnLeaveResponse toOnLeaveResponse(OnLeave onLeave);
}
