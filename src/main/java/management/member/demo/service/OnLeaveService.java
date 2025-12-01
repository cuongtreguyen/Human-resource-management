package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.OnLeave;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OnLeaveType;
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

    /**
     * Get all leave requests with optional filters
     */
    public LeaveListResponseDTO getAllLeaveRequests(String status, String employeeId, String startDate, String endDate) {
        List<OnLeave> leaves;
        
        if (employeeId != null) {
            Long empId = Long.parseLong(employeeId);
            if (status != null) {
                OnLeaveStatus leaveStatus = OnLeaveStatus.valueOf(status.toUpperCase());
                leaves = onLeaveRepository.findByEmployeeIdAndOnLeaveStatus(empId, leaveStatus);
            } else {
                leaves = onLeaveRepository.findByEmployeeId(empId);
            }
        } else if (status != null) {
            OnLeaveStatus leaveStatus = OnLeaveStatus.valueOf(status.toUpperCase());
            leaves = onLeaveRepository.findByOnLeaveStatus(leaveStatus);
        } else {
            leaves = onLeaveRepository.findAll();
        }
        
        // Filter by date range if provided
        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
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
        
        OnLeave saved = onLeaveRepository.save(onLeave);
        
        CreateLeaveResponseDTO response = new CreateLeaveResponseDTO();
        CreateLeaveResponseDTO.LeaveData data = new CreateLeaveResponseDTO.LeaveData();
        data.setId(saved.getId().toString());
        data.setEmployeeId(saved.getEmployee().getId().toString());
        data.setType(request.getType());
        data.setStartDate(saved.getStartDate());
        data.setEndDate(saved.getEndDate());
        data.setDays((int) saved.getTotalDays());
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
                .mapToLong(OnLeave::getTotalDays)
                .sum();
        
        long annualPending = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .mapToLong(OnLeave::getTotalDays)
                .sum();
        
        // Calculate sick leave
        long sickUsed = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.SICK_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .mapToLong(OnLeave::getTotalDays)
                .sum();
        
        long sickPending = allLeaves.stream()
                .filter(leave -> leave.getOnLeaveType() == OnLeaveType.SICK_LEAVE && 
                        leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .mapToLong(OnLeave::getTotalDays)
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
                    item.setDays((int) leave.getTotalDays());
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
        dto.setDays((int) leave.getTotalDays());
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getOnLeaveStatus().name().toLowerCase());
        dto.setSubmittedDate(leave.getStartDate()); // Use startDate as submittedDate
        if (leave.getEmployee().getDepartment() != null) {
            dto.setDepartment(leave.getEmployee().getDepartment());
        }
        return dto;
    }
}

