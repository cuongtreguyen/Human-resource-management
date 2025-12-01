package management.member.demo.mapper;

import management.member.demo.dto.AttendanceDTO;
import management.member.demo.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    AttendanceMapper INSTANCE = Mappers.getMapper(AttendanceMapper.class);

    AttendanceDTO toDTO(Attendance attendance);
    Attendance toEntity(AttendanceDTO attendanceDTO);

    List<AttendanceDTO> toDTOList(List<Attendance> attendances);
    List<Attendance> toEntityList(List<AttendanceDTO> attendanceDTOs);
}
