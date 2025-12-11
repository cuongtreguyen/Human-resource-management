package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.OverTime;
import management.member.demo.entity.Task;
import management.member.demo.entity.User;
import management.member.demo.enums.OverTimeStatus;
import management.member.demo.enums.Role;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.OverTimeMapper;
import management.member.demo.validator.OvertimeValidator;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OverTimeRepository;
import management.member.demo.repository.TaskRepository;
import management.member.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class OvertimeService {
    @Autowired
    OverTimeRepository overtimeRepository;

    @Autowired
    OverTimeMapper overtimeMapper;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    AuthService authService;

    @Autowired
    OvertimeValidator overtimeValidator;

    public OvertimeResponse createOvertime(OvertimeRequest request) {
        // Validate request
        overtimeValidator.validateOvertimeRequest(request);
        overtimeValidator.validateOvertimeRegistrationTime(request.getOtDate());

        //Lấy email từ Token (Security Context)
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Employee employee = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));
        OverTime overtime = overtimeMapper.toEntity(request);

        overtime.setEmployee(employee);
        overtime.setOvertimeStatus(OverTimeStatus.PENDING);
        overtime.setCreatedAt(LocalDateTime.now());

        if (request.getTaskId() != null) {
            Task task = taskRepository.findById(request.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TASK_NOT_FOUND.getMessage()));
            boolean isAssigned = task.getEmployees().stream()
                    .anyMatch(e -> e.getId().equals(employee.getId()));
            if (!isAssigned) {
                throw new ResourceNotFoundException(ErrorCode.PERMISSION_DENIED.getMessage());
            }
            overtime.setTask(task);
        }

        LocalDate otDate = request.getOtDate();
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (otDate.equals(today)) {
            // Giới hạn giờ: trước 14h hoặc sau 17h không được đăng ký
            if (now.isBefore(LocalTime.of(14, 0)) || now.isAfter(LocalTime.of(17, 0))) {
                throw new ResourceNotFoundException(ErrorCode.OVERTIME_OUT_OF_TIME.getMessage());
            }
        }

        OverTime savedOvertime = overtimeRepository.save(overtime);
        return overtimeMapper.toResponse(savedOvertime);
    }

    public Long countOvertimeByStatus(OverTimeStatus status) {
        if (status == null) {
            return overtimeRepository.count();
        }
        return overtimeRepository.countByOvertimeStatus(status);
    }

    public Double countAllOTTime() {
        return overtimeRepository.findAll().stream()
                .mapToDouble(OverTime::getOtHours)
                .sum();
    }

    public List<OvertimeListResponse> getOvertimeByStatus(OverTimeStatus status) {
        User user = authService.getCurrentUser();
        if (!user.getRole().equals(Role.MANAGER) && !user.getRole().equals(Role.ADMIN)) {
            throw new ResourceNotFoundException(ErrorCode.OVERTIME_PERMISSION.getMessage());
        }
        List<OverTime> overtimes;
        if (status != null) {
            overtimes = overtimeRepository.findByOvertimeStatus(status);
        } else {
            overtimes = overtimeRepository.findAll();
        }
        return overtimes.stream()
                .map(overtimeMapper::toListResponse)
                .toList();
    }

    public List<OvertimeListResponse> getOvertimeByTitleOrEmpName(String keyword) {
        User user = authService.getCurrentUser();
        if (!user.getRole().equals(Role.MANAGER) && !user.getRole().equals(Role.ADMIN)) {
            throw new ResourceNotFoundException(ErrorCode.OVERTIME_PERMISSION.getMessage());
        }

        List<OverTime> overtimes = overtimeRepository.searchOvertime(keyword);

        return overtimes.stream()
                .map(overtimeMapper::toListResponse)
                .toList();
    }

    public OvertimeResponse setOvertimeStatus(Long id, OverTimeStatus status, String managerNote) {

        OverTime overtime = overtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.OVERTIME_NOT_FOUND.getMessage()));

        User user = authService.getCurrentUser();
        Employee employee = employeeRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        switch (status) {

            case APPROVED -> {
                if (user.getRole() == Role.MANAGER) {
                    if (overtime.getOvertimeStatus() == OverTimeStatus.PENDING) {

                        overtime.setOvertimeStatus(OverTimeStatus.APPROVED);
                        overtime.setApprovedBy(employee);
                        overtime.setManagerNote(managerNote);

                    } else {
                        throw new ResourceNotFoundException(ErrorCode.OVERTIME_CANNOT_APPROVE.getMessage());
                    }
                } else {
                    throw new ResourceNotFoundException(ErrorCode.OVERTIME_ONLY_MANAGER_APPROVE.getMessage());
                }
            }

            case REJECTED -> {
                if (user.getRole() == Role.MANAGER) {
                    if (overtime.getOvertimeStatus() == OverTimeStatus.PENDING) {

                        overtime.setOvertimeStatus(OverTimeStatus.REJECTED);
                        overtime.setApprovedBy(employee);
                        overtime.setManagerNote(managerNote);

                    } else {
                        throw new ResourceNotFoundException(ErrorCode.OVERTIME_CANNOT_REJECT.getMessage());
                    }
                } else {
                    throw new ResourceNotFoundException(ErrorCode.OVERTIME_ONLY_MANAGER_REJECT.getMessage());
                }
            }
            case COMPLETED -> {
                if (user.getRole() == Role.MANAGER) {
                    if (overtime.getOvertimeStatus() == OverTimeStatus.APPROVED) {

                        overtime.setOvertimeStatus(OverTimeStatus.COMPLETED);
                        overtime.setApprovedBy(employee); // giữ manager đã duyệt
                        overtime.setManagerNote(managerNote);

                    } else {
                        throw new ResourceNotFoundException(ErrorCode.OVERTIME_CANNOT_COMPLETE.getMessage());
                    }
                } else {
                    throw new ResourceNotFoundException(ErrorCode.OVERTIME_ONLY_MANAGER_COMPLETE.getMessage());
                }
            }
            case CANCELLED -> {
                boolean isOwner = overtime.getEmployee().getId().equals(employee.getId());

                if (user.getRole() == Role.EMPLOYEE && isOwner) {
                    if (overtime.getOvertimeStatus() == OverTimeStatus.PENDING) {

                        overtime.setOvertimeStatus(OverTimeStatus.CANCELLED);
                        overtime.setApprovedBy(null);
                        overtime.setManagerNote(null);

                    } else {
                        throw new ResourceNotFoundException(ErrorCode.OVERTIME_CANNOT_CANCEL.getMessage());
                    }
                } else {
                    throw new ResourceNotFoundException(ErrorCode.OVERTIME_CANCEL_ILLEGAL.getMessage());
                }
            }

            default -> {
                throw new ResourceNotFoundException(ErrorCode.OVERTIME_STATUS_INVALID.getMessage());
            }
        }

        OverTime saved = overtimeRepository.save(overtime);
        return overtimeMapper.toResponse(saved);
    }

    public OvertimeDetailResponse getDetailOTByID(Long id){
        OverTime overtime = overtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.OVERTIME_NOT_FOUND.getMessage()));
        return overtimeMapper.toDetailResponse(overtime);
    }

}