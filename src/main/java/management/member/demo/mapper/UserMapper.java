package management.member.demo.mapper;

import management.member.demo.dto.UserDTO;
import management.member.demo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);

    List<UserDTO> toDTOList(List<User> users);
    List<User> toEntityList(List<UserDTO> userDTOs);
}