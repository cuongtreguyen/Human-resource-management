package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.User;
import management.member.demo.mapper.UserManagementMapper;
import management.member.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserManagementMapper userManagementMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserListResponseDTO getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserListItemDTO> userDTOs = users.stream()
                .map(userManagementMapper::toUserListItemDTO)
                .collect(Collectors.toList());

        UserListResponseDTO response = new UserListResponseDTO();
        response.setData(userDTOs);
        response.setSuccess(true);

        return response;
    }

    public CreateUserResponseDTO createUser(CreateUserRequestDTO request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        try {
            user.setRole(management.member.demo.enums.Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.setIsLocked(false);

        User saved = userRepository.save(user);

        CreateUserResponseDTO response = new CreateUserResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setSuccess(true);
        response.setMessage("User created successfully");

        return response;
    }
}

