package management.member.demo.Service;

import management.member.demo.Enum.Role;
import management.member.demo.Mapper.UserManagementMapper;
import management.member.demo.dto.*;
import management.member.demo.entity.User;
import management.member.demo.exception.base.BusinessException;
import management.member.demo.repository.UserRepository;
import management.member.demo.validator.UserManagementValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserManagementMapper userManagementMapper;

    @Autowired
    private UserManagementValidator userManagementValidator;

    public UserListResponseDTO getAllUsers() {
        List<User> users = userRepository.findAll();
        
        UserListResponseDTO response = new UserListResponseDTO();
        response.setData(users.stream()
                .map(userManagementMapper::toUserListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreateUserResponseDTO createUser(CreateUserRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        userManagementValidator.validateCreateUserRequest(request);
        
        // Check if username already exists (business logic - kiểm tra trong DB)
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists");
        }

        // Check if email already exists (business logic - kiểm tra trong DB)
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // FirstName and LastName are not in CreateUserRequestDTO
        // They can be extracted from username or set to empty
        user.setFirstName("");
        user.setLastName("");
        // Role đã được validate trong validator, safe to parse
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setFailedLoginAttempts(0);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        CreateUserResponseDTO response = new CreateUserResponseDTO();
        response.setId(String.valueOf(savedUser.getId()));
        response.setSuccess(true);
        response.setMessage("User created successfully");

        return response;
    }

}

