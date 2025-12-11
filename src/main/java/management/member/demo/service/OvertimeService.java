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
import java.time.ZoneId;
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
        // 1. Validate request cơ bản
        overtimeValidator.validateCreateOvertimeRequest(request);

        // ⚠️ QUAN TRỌNG: Đã xóa dòng validateOvertimeRegistrationTime gây lỗi 400/404 ảo

        // 2. Lấy thông tin nhân viên
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Employee employee = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        // 3. Map Entity (Mapper đã set department từ request)
        OverTime overtime = overtimeMapper.toEntity(request);

        // 4. Set các field bổ sung
        overtime.setEmployee(employee);
        overtime.setOvertimeStatus(OverTimeStatus.PENDING);
        overtime.setCreatedAt(LocalDateTime.now());


        // 4. Validate Task
        if (request.getTaskId() != null) {
            Task task = taskRepository.findById(request.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TASK_NOT_FOUND.getMessage()));
            
            // Validate: Employee phải được assign vào task này
            boolean isAssigned = task.getEmployees().stream()
                    .anyMatch(e -> e.getId().equals(employee.getId()));
            if (!isAssigned) {
                throw ErrorCode.PERMISSION_DENIED.toException("Bạn không được giao task này");
            }
            
            // Validate: Employee phải là member của board của task này
            if (task.getBoard() != null && task.getBoard().getMembers() != null) {
                boolean isBoardMember = task.getBoard().getMembers().stream()
                        .anyMatch(m -> m.getId().equals(employee.getId()));
                if (!isBoardMember) {
                    throw ErrorCode.PERMISSION_DENIED.toException("Bạn không phải là thành viên của board này");
                }
            }
            
            overtime.setTask(task);
        }

        // 5. Check Timezone Việt Nam (Fix lỗi khung giờ)
        LocalDate otDate = request.getOtDate();
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        LocalDate today = LocalDate.now(vietnamZone);
        LocalTime now = LocalTime.now(vietnamZone);

        if (otDate.equals(today)) {
            // Chỉ cho phép đăng ký trước 14h hoặc sau 17h (tùy logic công ty bạn)
            // Theo logic cũ bạn muốn chặn 14h-17h hay cho phép 14h-17h?
            // Logic dưới đây là: CHỈ CHO PHÉP TRONG KHOẢNG 14h - 17h
            if (now.isBefore(LocalTime.of(14, 0)) || now.isAfter(LocalTime.of(17, 0))) {
                throw new ResourceNotFoundException(ErrorCode.OVERTIME_OUT_OF_TIME.getMessage());
            }
        }

        // 6. Lưu và trả về
        OverTime savedOvertime = overtimeRepository.save(overtime);
        return overtimeMapper.toCreateResponse(savedOvertime);
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

        // 1. Tìm Overtime request
        OverTime overtime = overtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.OVERTIME_NOT_FOUND.getMessage()));

        // 2. Lấy thông tin người đang thực hiện (Manager hoặc Employee)
        User user = authService.getCurrentUser();

        // --- SỬA LẠI ĐOẠN NÀY ---
        // Tìm nhân viên theo Email (vì ID của User và Employee có thể khác nhau)
        Employee employee = employeeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));
        // -------------------------

        // 3. Xử lý logic chuyển trạng thái
        switch (status) {

            case APPROVED -> {
                if (user.getRole() == Role.MANAGER) {
                    if (overtime.getOvertimeStatus() == OverTimeStatus.PENDING) {
                        overtime.setOvertimeStatus(OverTimeStatus.APPROVED);
                        overtime.setApprovedBy(employee); // Lưu người duyệt
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
                        overtime.setApprovedBy(employee); // Lưu người từ chối
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
                        // Giữ nguyên approvedBy của người đã duyệt trước đó
                        overtime.setManagerNote(managerNote);
                    } else {
                        throw new ResourceNotFoundException(ErrorCode.OVERTIME_CANNOT_COMPLETE.getMessage());
                    }
                } else {
                    throw new ResourceNotFoundException(ErrorCode.OVERTIME_ONLY_MANAGER_COMPLETE.getMessage());
                }
            }

            case CANCELLED -> {
                // Check xem có phải chính chủ hủy không
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

        // 4. Lưu và trả về response (Dùng hàm toStatusResponse để hiện người duyệt)
        OverTime saved = overtimeRepository.save(overtime);
        return overtimeMapper.toStatusResponse(saved);
    }

    public OvertimeDetailResponse getDetailOTByID(Long id){
        OverTime overtime = overtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.OVERTIME_NOT_FOUND.getMessage()));
        return overtimeMapper.toDetailResponse(overtime);
    }

}