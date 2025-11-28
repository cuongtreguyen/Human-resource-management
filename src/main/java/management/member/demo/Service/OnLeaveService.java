package management.member.demo.Service;

import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Enum.OnLeaveType;
import management.member.demo.Mapper.OnLeaveMapper;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.entity.OnLeave;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OnLeaveRepository;
import management.member.demo.validator.OnLeaveValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OnLeaveService {
    @Autowired
    OnLeaveRepository onLeaveRepository;

    @Autowired
    OnLeaveMapper onLeaveMapper;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    OnLeaveValidator onLeaveValidator;

    public OnLeaveResponse createOnLeave(OnLeaveRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw ErrorCode.INVALID_DATE_RANGE.toException("Ngày kết thúc không thể trước ngày bắt đầu");
        }

        long daysRequested = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        if (employee.getRemainingLeaveDays() < daysRequested) {
            throw ErrorCode.INSUFFICIENT_LEAVE_DAYS.toException(
                String.format("Không đủ ngày nghỉ phép. Còn lại: %d ngày, yêu cầu: %d ngày", 
                    employee.getRemainingLeaveDays(), daysRequested));
        }

        OnLeave onLeave = onLeaveMapper.toOnLeave(request);
        onLeave.setEmployee(employee);
        onLeave.setOnLeaveStatus(OnLeaveStatus.PENDING);

        OnLeave savedLeave = onLeaveRepository.save(onLeave);
        return onLeaveMapper.toOnLeaveResponse(savedLeave);
    }

    public List<OnLeaveListResponse> getLeaveListByID(Long id){
        employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));

        List<OnLeave> onLeaves = onLeaveRepository.findByEmployeeId(id);
        if(onLeaves.isEmpty()){
            throw ErrorCode.NO_LEAVE_FOUND.toException("Không tìm thấy đơn nghỉ phép nào cho nhân viên này");
        }

        return onLeaveMapper.toOnLeaveListResponseList(onLeaves);
    }

    public long countPendingOnLeaveRequestsById(Long employeeId) {
        return onLeaveRepository.findByEmployeeId(employeeId).stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .count();
    }

    public Map<String, Long> getLeaveSummary(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Tính số ngày đã dùng (đã duyệt)
        long usedLeaveDays = onLeaveRepository.findByEmployeeId(employeeId).stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .mapToLong(leave ->
                        java.time.temporal.ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1
                )
                .sum();

        // Trả về dạng key-value
        return Map.of(
                "remainingLeaveDays", Long.valueOf(employee.getRemainingLeaveDays()),
                "usedLeaveDays", Long.valueOf(usedLeaveDays)
        );
    }

    public OnLeaveResponse updateOnLeaveStatus(Long id, OnLeaveStatus status) {
        OnLeave onLeave = onLeaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OnLeave request not found"));

        onLeave.setOnLeaveStatus(status);
        OnLeave updatedOnLeave = onLeaveRepository.save(onLeave);
        return onLeaveMapper.toOnLeaveResponse(updatedOnLeave);
    }

    // New methods for API spec
    public LeaveListResponseDTO getAllLeaveRequests(String status, String employeeId, String startDate, String endDate) {
        List<OnLeave> leaves = onLeaveRepository.findAll();
        
        // Filter by status
        if (status != null && !status.trim().isEmpty()) {
            try {
                OnLeaveStatus statusEnum = OnLeaveStatus.valueOf(status.toUpperCase());
                leaves = leaves.stream()
                        .filter(l -> l.getOnLeaveStatus() == statusEnum)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore filter
            }
        }
        
        // Filter by employeeId
        if (employeeId != null && !employeeId.trim().isEmpty()) {
            try {
                Long empId = Long.parseLong(employeeId);
                leaves = leaves.stream()
                        .filter(l -> l.getEmployee() != null && l.getEmployee().getId().equals(empId))
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                // Invalid employeeId, ignore filter
            }
        }
        
        // Filter by date range
        if (startDate != null && endDate != null) {
            try {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                leaves = leaves.stream()
                        .filter(l -> !l.getStartDate().isAfter(end) && !l.getEndDate().isBefore(start))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                // Invalid date format, ignore filter
            }
        }
        
        LeaveListResponseDTO response = new LeaveListResponseDTO();
        response.setData(leaves.stream()
                .map(this::mapToLeaveListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreateLeaveResponseDTO createLeaveRequest(CreateLeaveRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        onLeaveValidator.validateCreateLeaveRequest(request);
        
        // Validate employee ID string và convert sang Long
        Long employeeId = Long.parseLong(request.getEmployeeId()); // Validator đã đảm bảo format hợp lệ
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));
        
        // Calculate days if not provided
        int days = request.getDays() != null ? request.getDays() : 
                  (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        
        // Check leave balance
        if (employee.getRemainingLeaveDays() < days) {
            throw ErrorCode.INSUFFICIENT_LEAVE_DAYS.toException(
                String.format("Không đủ ngày nghỉ phép. Còn lại: %d ngày, yêu cầu: %d ngày", 
                    employee.getRemainingLeaveDays(), days));
        }
        
        // Create OnLeave entity
        OnLeave onLeave = new OnLeave();
        onLeave.setEmployee(employee);
        // Convert String type to OnLeaveType enum
        OnLeaveType leaveType = mapStringToOnLeaveType(request.getType());
        onLeave.setOnLeaveType(leaveType);
        onLeave.setStartDate(request.getStartDate());
        onLeave.setEndDate(request.getEndDate());
        onLeave.setReason(request.getReason());
        onLeave.setOnLeaveStatus(OnLeaveStatus.PENDING);
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        
        CreateLeaveResponseDTO response = new CreateLeaveResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setEmployeeId(request.getEmployeeId());
        response.setMessage("Leave request created successfully");
        response.setSuccess(true);
        
        return response;
    }

    public UpdateLeaveStatusResponseDTO updateLeaveStatus(String id, UpdateLeaveStatusRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        onLeaveValidator.validateLeaveIdString(id);
        onLeaveValidator.validateUpdateLeaveStatusRequest(request);
        
        Long leaveId = Long.parseLong(id);
        OnLeave onLeave = onLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        
        // Update status - Status đã được validate trong validator, safe to parse
        if (request.getStatus() != null) {
            OnLeaveStatus status = OnLeaveStatus.valueOf(request.getStatus().toUpperCase());
            onLeave.setOnLeaveStatus(status);
            
            // If approved, deduct leave days
            if (status == OnLeaveStatus.APPROVED) {
                int days = (int) ChronoUnit.DAYS.between(onLeave.getStartDate(), onLeave.getEndDate()) + 1;
                Employee employee = onLeave.getEmployee();
                employee.setRemainingLeaveDays(employee.getRemainingLeaveDays() - days);
                employeeRepository.save(employee);
            }
        }
        
        onLeaveRepository.save(onLeave);
        
        UpdateLeaveStatusResponseDTO response = new UpdateLeaveStatusResponseDTO();
        response.setId(id);
        response.setStatus(request.getStatus());
        response.setMessage("Leave status updated successfully");
        response.setSuccess(true);
        
        return response;
    }

    public UpdateLeaveStatusResponseDTO cancelLeaveRequest(String id, String reason) {
        Long leaveId = Long.parseLong(id);
        OnLeave onLeave = onLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        
        onLeave.setOnLeaveStatus(OnLeaveStatus.CANCELLED);
        if (reason != null) {
            onLeave.setReason(reason);
        }
        onLeaveRepository.save(onLeave);
        
        UpdateLeaveStatusResponseDTO response = new UpdateLeaveStatusResponseDTO();
        response.setId(id);
        response.setStatus("cancelled");
        response.setMessage("Leave request cancelled successfully");
        response.setSuccess(true);
        
        return response;
    }

    public LeaveBalanceResponseDTO getLeaveBalance(String employeeId) {
        onLeaveValidator.validateEmployeeIdString(employeeId); // Validate trước khi parse
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(empId);
        int currentYear = LocalDate.now().getYear();
        
        // Calculate annual leave
        long annualUsed = leaves.stream()
                .filter(l -> l.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE && 
                           l.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                           l.getStartDate().getYear() == currentYear)
                .mapToLong(l -> ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1)
                .sum();
        
        long annualPending = leaves.stream()
                .filter(l -> l.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE && 
                           l.getOnLeaveStatus() == OnLeaveStatus.PENDING &&
                           l.getStartDate().getYear() == currentYear)
                .mapToLong(l -> ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1)
                .sum();
        
        // Calculate sick leave
        long sickUsed = leaves.stream()
                .filter(l -> l.getOnLeaveType() == OnLeaveType.SICK_LEAVE && 
                           l.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                           l.getStartDate().getYear() == currentYear)
                .mapToLong(l -> ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1)
                .sum();
        
        long sickPending = leaves.stream()
                .filter(l -> l.getOnLeaveType() == OnLeaveType.SICK_LEAVE && 
                           l.getOnLeaveStatus() == OnLeaveStatus.PENDING &&
                           l.getStartDate().getYear() == currentYear)
                .mapToLong(l -> ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1)
                .sum();
        
        LeaveBalanceResponseDTO response = new LeaveBalanceResponseDTO();
        response.setEmployeeId(employeeId);
        response.setYear(currentYear);
        
        LeaveBalanceResponseDTO.LeaveTypeBalance annual = new LeaveBalanceResponseDTO.LeaveTypeBalance();
        annual.setTotal(12); // Default annual leave
        annual.setUsed((int) annualUsed);
        annual.setPending((int) annualPending);
        annual.setRemaining(12 - (int) annualUsed);
        response.setAnnual(annual);
        
        LeaveBalanceResponseDTO.LeaveTypeBalance sick = new LeaveBalanceResponseDTO.LeaveTypeBalance();
        sick.setTotal(5); // Default sick leave
        sick.setUsed((int) sickUsed);
        sick.setPending((int) sickPending);
        sick.setRemaining(5 - (int) sickUsed);
        response.setSick(sick);
        
        return response;
    }

    public LeaveHistoryResponseDTO getLeaveHistory(String employeeId, Integer year) {
        Long empId = Long.parseLong(employeeId);
        employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(empId);
        int filterYear = year != null ? year : LocalDate.now().getYear();
        
        List<LeaveHistoryResponseDTO.LeaveHistoryItemDTO> history = leaves.stream()
                .filter(l -> l.getStartDate().getYear() == filterYear)
                .map(l -> {
                    LeaveHistoryResponseDTO.LeaveHistoryItemDTO item = new LeaveHistoryResponseDTO.LeaveHistoryItemDTO();
                    item.setId(String.valueOf(l.getId()));
                    item.setType(l.getOnLeaveType() != null ? l.getOnLeaveType().name().toLowerCase() : "annual");
                    item.setStartDate(l.getStartDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    item.setEndDate(l.getEndDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    item.setDays((int) ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1);
                    item.setStatus(l.getOnLeaveStatus() != null ? l.getOnLeaveStatus().name().toLowerCase() : "pending");
                    item.setApprovedBy(null); // TODO: Add approvedBy field to entity
                    item.setApprovedDate(null); // TODO: Add approvedDate field to entity
                    return item;
                })
                .collect(Collectors.toList());
        
        LeaveHistoryResponseDTO response = new LeaveHistoryResponseDTO();
        response.setData(history);
        response.setSuccess(true);
        
        return response;
    }

    private LeaveListItemDTO mapToLeaveListItemDTO(OnLeave leave) {
        LeaveListItemDTO dto = new LeaveListItemDTO();
        dto.setId(String.valueOf(leave.getId()));
        if (leave.getEmployee() != null) {
            dto.setEmployeeId(String.valueOf(leave.getEmployee().getId()));
            dto.setEmployeeName(leave.getEmployee().getFullName());
        }
        dto.setType(leave.getOnLeaveType() != null ? leave.getOnLeaveType().name().toLowerCase() : "annual");
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setDays((int) ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1);
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getOnLeaveStatus() != null ? leave.getOnLeaveStatus().name().toLowerCase() : "pending");
        dto.setSubmittedDate(leave.getStartDate()); // TODO: Add submittedDate field to entity
        dto.setApprovedBy(null); // TODO: Add approvedBy field to entity
        return dto;
    }

    private OnLeaveType mapStringToOnLeaveType(String type) {
        if (type == null) {
            return OnLeaveType.ANNUAL_LEAVE;
        }
        switch (type.toLowerCase()) {
            case "annual":
                return OnLeaveType.ANNUAL_LEAVE;
            case "sick":
                return OnLeaveType.SICK_LEAVE;
            case "unpaid":
                return OnLeaveType.UNPAID_LEAVE;
            case "special":
            case "casual":
                return OnLeaveType.CASUAL_LEAVE;
            case "maternity":
                return OnLeaveType.MATERNITY_LEAVE;
            case "bereavement":
                return OnLeaveType.BEREAVEMENT_LEAVE;
            case "study":
                return OnLeaveType.STUDY_LEAVE;
            case "marriage":
                return OnLeaveType.MARRIAGE_LEAVE;
            default:
                return OnLeaveType.ANNUAL_LEAVE;
        }
    }
}
