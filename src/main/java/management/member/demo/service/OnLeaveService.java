package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.OnLeave;
import management.member.demo.entity.User;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OnLeaveType;
import management.member.demo.enums.Role;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.OnLeaveMapper;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OnLeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class OnLeaveService {

    @Autowired
    private OnLeaveRepository onLeaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OnLeaveMapper onLeaveMapper;

    @Autowired
    private AuthService authService;

    
    /**
     * Tính tổng số ngày nghỉ phép và lưu vào field totalDaysOnleave
     * 
     * @param onLeave Đối tượng OnLeave cần tính toán
     * @return Tổng số ngày nghỉ phép
     */
    public long calculateAndSetTotalDaysOnleave(OnLeave onLeave) {
        if (onLeave.getStartDate() == null || onLeave.getEndDate() == null) {
            onLeave.setTotalDaysOnleave(0L);
            return 0;
        }
        
        long totalDays = ChronoUnit.DAYS.between(onLeave.getStartDate(), onLeave.getEndDate()) + 1;
        onLeave.setTotalDaysOnleave(totalDays);
        return totalDays;
    }
    
    /**
     * Lấy tổng số ngày nghỉ phép
     * Nếu đã có totalDaysOnleave, trả về giá trị đó, nếu không tính toán lại
     * 
     * @param onLeave Đối tượng OnLeave
     * @return Tổng số ngày nghỉ phép
     */
    public long getTotalDays(OnLeave onLeave) {
        // Nếu đã có totalDaysOnleave, trả về giá trị đó
        if (onLeave.getTotalDaysOnleave() != null) {
            return onLeave.getTotalDaysOnleave();
        }
        
        // Nếu chưa có, tính toán lại
        if (onLeave.getStartDate() != null && onLeave.getEndDate() != null) {
            return ChronoUnit.DAYS.between(onLeave.getStartDate(), onLeave.getEndDate()) + 1;
        }
        
        return 0;
    }

    /**
     * Get all leave requests with optional filters
     */
    public LeaveListResponseDTO getAllLeaveRequests(OnLeaveStatus status, String employeeId, String startDate, String endDate) {
        List<OnLeave> leaves;
        
        if (employeeId != null) {
            Long empId = Long.parseLong(employeeId);
            if (status != null) {
                leaves = onLeaveRepository.findByEmployeeIdAndOnLeaveStatus(empId, status);
            } else {
                leaves = onLeaveRepository.findByEmployeeId(empId);
            }
        } else if (status != null) {
            leaves = onLeaveRepository.findByOnLeaveStatus(status);
        } else {
            leaves = onLeaveRepository.findAll();
        }
        
        // Filter by date range if provided
        if (startDate != null || endDate != null) {
            LocalDate start;
            LocalDate end;
            if(startDate != null && endDate != null){
                start = LocalDate.parse(startDate);
                end = LocalDate.parse(endDate);
            } else if(startDate != null){
                start = LocalDate.parse(startDate);
                end = start;
            } else{
                end = LocalDate.parse(endDate);
                start = end;
            }
            leaves = leaves.stream()
                    .filter(leave -> !leave.getEndDate().isBefore(start) && !leave.getStartDate().isAfter(end))
                    .collect(Collectors.toList());
        }
        
        List<LeaveListItemDTO> items = leaves.stream()
                .map(this::toLeaveListItemDTO)
                .collect(Collectors.toList());
        
        LeaveListResponseDTO response = new LeaveListResponseDTO();
        response.setData(items);
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Create a new leave request
     */
    public CreateLeaveResponseDTO createLeaveRequest(CreateLeaveRequestDTO request) {
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));
        
        OnLeave onLeave = new OnLeave();
        onLeave.setEmployee(employee);
        // Map frontend type to enum
        String typeUpper = request.getType().toUpperCase();
        OnLeaveType leaveType;
        switch (typeUpper) {
            case "ANNUAL":
                leaveType = OnLeaveType.ANNUAL_LEAVE;
                break;
            case "SICK":
                leaveType = OnLeaveType.SICK_LEAVE;
                break;
            case "UNPAID":
                leaveType = OnLeaveType.UNPAID_LEAVE;
                break;
            case "SPECIAL":
                leaveType = OnLeaveType.CASUAL_LEAVE;
                break;
            default:
                try {
                    leaveType = OnLeaveType.valueOf(typeUpper + "_LEAVE");
                } catch (IllegalArgumentException e) {
                    leaveType = OnLeaveType.CASUAL_LEAVE; // Default
                }
        }
        onLeave.setOnLeaveType(leaveType);
        onLeave.setStartDate(request.getStartDate());
        onLeave.setEndDate(request.getEndDate());
        onLeave.setReason(request.getReason());
        onLeave.setOnLeaveStatus(OnLeaveStatus.PENDING);
        
        // Tính toán và lưu totalDaysOnleave
        calculateAndSetTotalDaysOnleave(onLeave);
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        
        CreateLeaveResponseDTO response = new CreateLeaveResponseDTO();
        CreateLeaveResponseDTO.LeaveData data = new CreateLeaveResponseDTO.LeaveData();
        data.setId(saved.getId().toString());
        data.setEmployeeId(saved.getEmployee().getId().toString());
        data.setType(request.getType());
        data.setStartDate(saved.getStartDate());
        data.setEndDate(saved.getEndDate());
        data.setDays((int) getTotalDays(saved));
        data.setStatus(saved.getOnLeaveStatus().name().toLowerCase());
        data.setSubmittedDate(LocalDate.now());
        
        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Leave request submitted successfully");
        
        return response;
    }

    /**
     * Update leave request status
     */
    public UpdateLeaveStatusResponseDTO updateLeaveStatus(String id, UpdateLeaveStatusRequestDTO request) {
        Long leaveId = Long.parseLong(id);
        OnLeave onLeave = onLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + id));
        
        OnLeaveStatus newStatus = OnLeaveStatus.valueOf(request.getStatus().toUpperCase());
        onLeave.setOnLeaveStatus(newStatus);
        
        // Tính toán lại totalDaysOnleave nếu cần
        calculateAndSetTotalDaysOnleave(onLeave);
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        
        UpdateLeaveStatusResponseDTO response = new UpdateLeaveStatusResponseDTO();
        UpdateLeaveStatusResponseDTO.LeaveStatusData data = new UpdateLeaveStatusResponseDTO.LeaveStatusData();
        data.setId(saved.getId().toString());
        data.setStatus(saved.getOnLeaveStatus().name().toLowerCase());
        if (request.getApprovedBy() != null) {
            data.setApprovedBy(request.getApprovedBy());
        }
        
        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Status updated successfully");
        
        return response;
    }

    /**
     * Cancel leave request
     */
    public UpdateLeaveStatusResponseDTO cancelLeaveRequest(String id, String reason) {
        Long leaveId = Long.parseLong(id);
        OnLeave onLeave = onLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + id));
        
        onLeave.setOnLeaveStatus(OnLeaveStatus.CANCELLED);
        if (reason != null) {
            onLeave.setReason(reason);
        }
        
        // Tính toán lại totalDaysOnleave nếu cần
        calculateAndSetTotalDaysOnleave(onLeave);
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        
        UpdateLeaveStatusResponseDTO response = new UpdateLeaveStatusResponseDTO();
        UpdateLeaveStatusResponseDTO.LeaveStatusData data = new UpdateLeaveStatusResponseDTO.LeaveStatusData();
        data.setId(saved.getId().toString());
        data.setStatus(saved.getOnLeaveStatus().name().toLowerCase());
        
        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Leave request cancelled successfully");
        
        return response;
    }

    /**
     * Get leave balance for an employee
     */
    public LeaveBalanceResponseDTO getLeaveBalance(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
        
        int currentYear = LocalDate.now().getYear();
        List<OnLeave> allLeaves = onLeaveRepository.findByEmployeeId(empId);
        
        // Calculate annual leave
        long annualUsed = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .mapToLong(leave -> getTotalDays(leave))
                .sum();
        
        long annualPending = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                    .mapToLong(leave -> getTotalDays(leave))
                .sum();
        
        // Calculate sick leave
        long sickUsed = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.SICK_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .mapToLong(leave -> getTotalDays(leave))
                .sum();
        
        long sickPending = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.SICK_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .mapToLong(leave -> getTotalDays(leave))
                .sum();
        
        LeaveBalanceResponseDTO response = new LeaveBalanceResponseDTO();
        LeaveBalanceResponseDTO.BalanceData data = new LeaveBalanceResponseDTO.BalanceData();
        data.setEmployeeId(employeeId);
        data.setYear(currentYear);
        
        // Annual leave balance (default 12 days per year)
        LeaveBalanceResponseDTO.LeaveTypeBalance annual = new LeaveBalanceResponseDTO.LeaveTypeBalance();
        annual.setTotal(12);
        annual.setUsed((int) annualUsed);
        annual.setPending((int) annualPending);
        annual.setRemaining(12 - (int) annualUsed - (int) annualPending);
        annual.setCarriedForward(0); // TODO: Calculate from previous year
        data.setAnnual(annual);
        
        // Sick leave balance (default 5 days per year)
        LeaveBalanceResponseDTO.LeaveTypeBalance sick = new LeaveBalanceResponseDTO.LeaveTypeBalance();
        sick.setTotal(5);
        sick.setUsed((int) sickUsed);
        sick.setPending((int) sickPending);
        sick.setRemaining(5 - (int) sickUsed - (int) sickPending);
        data.setSick(sick);
        
        response.setData(data);
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Get leave history for an employee
     */
    public LeaveHistoryResponseDTO getLeaveHistory(String employeeId, Integer year) {
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
        
        int targetYear = year != null ? year : LocalDate.now().getYear();
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(empId);
        
        // Filter by year if specified
        if (year != null) {
            leaves = leaves.stream()
                    .filter(leave -> leave.getStartDate().getYear() == targetYear || 
                            leave.getEndDate().getYear() == targetYear)
                    .collect(Collectors.toList());
        }
        
        List<LeaveHistoryResponseDTO.LeaveHistoryItemDTO> items = leaves.stream()
                .map(leave -> {
                    LeaveHistoryResponseDTO.LeaveHistoryItemDTO item = new LeaveHistoryResponseDTO.LeaveHistoryItemDTO();
                    item.setId(leave.getId().toString());
                    item.setType(leave.getOnLeaveType().name().toLowerCase());
                    item.setStartDate(leave.getStartDate().toString());
                    item.setEndDate(leave.getEndDate().toString());
                    item.setDays((int) getTotalDays(leave));
                    item.setStatus(leave.getOnLeaveStatus().name().toLowerCase());
                    return item;
                })
                .collect(Collectors.toList());
        
        LeaveHistoryResponseDTO response = new LeaveHistoryResponseDTO();
        response.setData(items);
        response.setSuccess(true);
        
        return response;
    }

    // Legacy methods for backward compatibility
    
    public OnLeaveResponse createOnLeave(OnLeaveRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));
        
        OnLeave onLeave = onLeaveMapper.toOnLeave(request);
        onLeave.setEmployee(employee);
        
        // Tính toán và lưu totalDaysOnleave
        calculateAndSetTotalDaysOnleave(onLeave);
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        return onLeaveMapper.toOnLeaveResponse(saved);
    }

    public List<OnLeaveListResponse> getLeaveListByID(Long id) {
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(id);
        return onLeaveMapper.toOnLeaveListResponseList(leaves);
    }

    public Long countPendingOnLeaveRequestsById(Long id) {
        List<OnLeave> pendingLeaves = onLeaveRepository.findByEmployeeIdAndOnLeaveStatus(id, OnLeaveStatus.PENDING);
        return (long) pendingLeaves.size();
    }

    public Map<String, Long> getLeaveSummary(Long id) {
        List<OnLeave> allLeaves = onLeaveRepository.findByEmployeeId(id);
        
        Map<String, Long> summary = new HashMap<>();
        summary.put("total", (long) allLeaves.size());
        summary.put("pending", allLeaves.stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .count());
        summary.put("approved", allLeaves.stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .count());
        summary.put("rejected", allLeaves.stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.REJECTED)
                .count());
        
        return summary;
    }

    public OnLeaveResponse updateOnLeaveStatus(Long leaveId, OnLeaveStatus status) {
        OnLeave onLeave = onLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));
        
        onLeave.setOnLeaveStatus(status);
        
        // Tính toán lại totalDaysOnleave nếu cần
        calculateAndSetTotalDaysOnleave(onLeave);
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        return onLeaveMapper.toOnLeaveResponse(saved);
    }

    // Helper method
    private LeaveListItemDTO toLeaveListItemDTO(OnLeave leave) {
        LeaveListItemDTO dto = new LeaveListItemDTO();
        dto.setId(leave.getId().toString());
        dto.setEmployeeId(leave.getEmployee().getId().toString());
        dto.setEmployeeName(leave.getEmployee().getFullName());
        dto.setType(leave.getOnLeaveType().name().toLowerCase());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setDays((int) getTotalDays(leave));
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getOnLeaveStatus().name().toLowerCase());
        dto.setSubmittedDate(leave.getStartDate()); // Use startDate as submittedDate
        if (leave.getEmployee().getDepartment() != null) {
            dto.setDepartment(leave.getEmployee().getDepartment());
        }
        return dto;
    }

    public long countLeaveReqByStatus(OnLeaveStatus status){
        if(status == null){
            return onLeaveRepository.count();
        }
        return onLeaveRepository.countByOnLeaveStatus(status);
    }

    public OnLeaveResponse getLeaveReqByID(String id) {
        OnLeave onleave = onLeaveRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.NO_LEAVE_FOUND.getMessage()));
        return onLeaveMapper.toOnLeaveResponse(onleave);
    }

    public void setLeaveStatusByID(String id, OnLeaveStatus status) {
        OnLeave onleave = onLeaveRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.NO_LEAVE_FOUND.getMessage()));
        switch (status) {
            case APPROVED -> {
                User currentUser = authService.getCurrentUser();
                if(currentUser.getRole() == Role.MANAGER) {
                    if (onleave.getOnLeaveStatus() == OnLeaveStatus.PENDING) {
                        onleave.setOnLeaveStatus(OnLeaveStatus.APPROVED);
                        onLeaveRepository.save(onleave);
                    } else {
                        throw new ResourceNotFoundException("Status not valid");
                    }
                }
            }
            case REJECTED -> {
                User currentUser = authService.getCurrentUser();
                if(currentUser.getRole() == Role.MANAGER) {
                    if (onleave.getOnLeaveStatus() == OnLeaveStatus.PENDING) {
                        onleave.setOnLeaveStatus(OnLeaveStatus.REJECTED);
                        onLeaveRepository.save(onleave);
                    } else {
                        throw new ResourceNotFoundException("Status not valid");
                    }
                }
            }
            case COMPLETED -> {
                User currentUser = authService.getCurrentUser();
                if(currentUser.getRole() == Role.MANAGER) {
                    if (onleave.getOnLeaveStatus() == OnLeaveStatus.APPROVED) {
                        onleave.setOnLeaveStatus(OnLeaveStatus.COMPLETED);
                        onLeaveRepository.save(onleave);
                    } else {
                        throw new ResourceNotFoundException("Status not valid");
                    }
                }
            }
            case CANCELLED -> {
                User currentUser = authService.getCurrentUser();
                if(currentUser.getRole() == Role.EMPLOYEE) {
                    if (onleave.getOnLeaveStatus() == OnLeaveStatus.PENDING) {
                        onleave.setOnLeaveStatus(OnLeaveStatus.CANCELLED);
                        onLeaveRepository.save(onleave);
                    } else {
                        throw new ResourceNotFoundException("Status not valid");
                    }
                }
            }
            default -> {
                System.out.println(status);
                throw new ResourceNotFoundException("Status not valid");
            }
        }
    }
    
    /**
     * Lấy danh sách đơn xin nghỉ phép cho Accountant theo ID nhân viên
     * 
     * @param employeeId ID của nhân viên (required)
     * @return Danh sách đơn xin nghỉ phép với đầy đủ thông tin
     */
    public List<LeaveApplicationForAccountantDTO> getLeaveApplicationsForAccountant(Long employeeId) {
        // Kiểm tra employee có tồn tại không
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
        
        // Lấy đơn xin nghỉ phép theo employeeId
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(employeeId);
        
        // Map sang DTO
        return leaves.stream()
                .map(leave -> {
                    LeaveApplicationForAccountantDTO dto = new LeaveApplicationForAccountantDTO();
                    
                    dto.setEmployeeId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
                    dto.setFullName(employee.getFullName());
                    dto.setDepartment(employee.getDepartment());
                    
                    dto.setOnLeaveType(leave.getOnLeaveType());
                    dto.setStartDate(leave.getStartDate());
                    dto.setEndDate(leave.getEndDate());
                    dto.setOnLeaveStatus(leave.getOnLeaveStatus());
                    dto.setTotalDaysOnleave(leave.getTotalDaysOnleave());
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy chi tiết đơn xin nghỉ phép cho Accountant theo ID
     * 
     * @param leaveId ID của đơn xin nghỉ phép
     * @return Chi tiết đơn xin nghỉ phép với đầy đủ thông tin
     */
    public LeaveApplicationDetailForAccountantDTO getLeaveApplicationDetailForAccountant(Long leaveId) {
        // Lấy đơn xin nghỉ phép theo ID
        OnLeave leave = onLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave application not found with ID: " + leaveId));
        
        // Kiểm tra employee có tồn tại không
        if (leave.getEmployee() == null) {
            throw new ResourceNotFoundException("Employee not found for leave application ID: " + leaveId);
        }
        
        // Tạo DTO
        LeaveApplicationDetailForAccountantDTO dto = new LeaveApplicationDetailForAccountantDTO();
        
        Employee employee = leave.getEmployee();
        dto.setEmployeeId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
        dto.setFullName(employee.getFullName());
        dto.setDepartment(employee.getDepartment());
        
        dto.setOnLeaveType(leave.getOnLeaveType());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setOnLeaveStatus(leave.getOnLeaveStatus());
        dto.setSubmittedDate(leave.getSubmittedDate());
        dto.setTotalDaysOnleave(leave.getTotalDaysOnleave());
        
        return dto;
    }
}

