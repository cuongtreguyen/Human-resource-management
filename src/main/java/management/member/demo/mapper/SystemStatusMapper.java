package management.member.demo.mapper;

import management.member.demo.dto.SystemStatusDTO;
import management.member.demo.entity.SystemStatus;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SystemStatusMapper {
    SystemStatusMapper INSTANCE = Mappers.getMapper(SystemStatusMapper.class);

    SystemStatusDTO toDTO(SystemStatus systemStatus);
    SystemStatus toEntity(SystemStatusDTO systemStatusDTO);
}
