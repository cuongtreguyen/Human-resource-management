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
import management.member.demo.validator.OnLeaveValidator;
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

    @Autowired
    private OnLeaveValidator onLeaveValidator;

    
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
        // Nếu đã có totalDaysOnleave, trả về giá trị đóF
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
    /**
     * TẠO ĐƠN NGHỈ PHÉP (Hàm hợp nhất - Dùng cho cả Mobile và Web)
     */
    public CreateLeaveResponseDTO createLeaveRequestForManager(CreateLeaveRequestDTO request) {
        // Validate request
        onLeaveValidator.validateCreateLeaveRequest(request);
        
        // 1. Tìm nhân viên
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));

        OnLeave onLeave = new OnLeave();
        onLeave.setEmployee(employee);

        // 2. Xử lý Loại nghỉ phép (Logic mapping thông minh)
        String typeInput = request.getType() != null ? request.getType().trim().toUpperCase() : "CASUAL";
        OnLeaveType leaveType;

        switch (typeInput) {
            case "ANNUAL": case "ANNUAL_LEAVE": case "NGHỈ PHÉP NĂM": case "PHÉP NĂM":
                leaveType = OnLeaveType.ANNUAL_LEAVE;
                break;
            case "SICK": case "SICK_LEAVE": case "NGHỈ ỐM":
                leaveType = OnLeaveType.SICK_LEAVE;
                break;
            case "MATERNITY": case "MATERNITY_LEAVE": case "THAI SẢN": case "NGHỈ THAI SẢN":
                leaveType = OnLeaveType.MATERNITY_LEAVE;
                break;
            case "BEREAVEMENT": case "BEREAVEMENT_LEAVE": case "NGHỈ TANG": case "TANG CHẾ":
                leaveType = OnLeaveType.BEREAVEMENT_LEAVE;
                break;
            case "MARRIAGE": case "MARRIAGE_LEAVE": case "WEDDING": case "NGHỈ CƯỚI":
                leaveType = OnLeaveType.MARRIAGE_LEAVE;
                break;
            case "STUDY": case "STUDY_LEAVE": case "TRAINING": case "HỌC TẬP":
                leaveType = OnLeaveType.STUDY_LEAVE;
                break;
            case "CASUAL": case "CASUAL_LEAVE": case "SPECIAL": case "VIỆC RIÊNG":
            default:
                try {
                    leaveType = OnLeaveType.valueOf(typeInput);
                } catch (IllegalArgumentException e) {
                    try {
                        leaveType = OnLeaveType.valueOf(typeInput + "_LEAVE");
                    } catch (IllegalArgumentException ex) {
                        leaveType = OnLeaveType.CASUAL_LEAVE;
                    }
                }
        }
        onLeave.setOnLeaveType(leaveType);

        // 3. Gán dữ liệu từ Request
        onLeave.setStartDate(request.getStartDate());
        onLeave.setEndDate(request.getEndDate());
        onLeave.setReason(request.getReason());

        // 4. Gán dữ liệu hệ thống (Mặc định)
        onLeave.setOnLeaveStatus(OnLeaveStatus.PENDING); // Chờ duyệt
        onLeave.setSubmittedDate(LocalDate.now());       // Ngày nộp là hôm nay

        // 5. Tính toán tổng số ngày
        calculateAndSetTotalDaysOnleave(onLeave);

        // 6. Lưu xuống DB
        OnLeave saved = onLeaveRepository.save(onLeave);

        // 7. Tạo Response (Sử dụng hàm Mapper để tái sử dụng code)
        CreateLeaveResponseDTO response = new CreateLeaveResponseDTO();

        // --- GỌI HÀM MAPPER Ở ĐÂY ---
        response.setData(toLeaveListItemDTO(saved));
        // -----------------------------

        response.setSuccess(true);
        response.setMessage("Tạo đơn nghỉ phép thành công!");

        return response;
    }

    //tạo đơn nghỉ phép cho nhân viên
    public CreateLeaveResponseDTO createLeaveRequest(CreateLeaveRequestDTO request) {
        // 1. Lấy thông tin user hiện tại
        User currentUser = authService.getCurrentUser();
        Employee employee = currentUser.getEmployee();
        if (employee == null) {
            throw new ResourceNotFoundException("Employee not found for current user");
        }

        OnLeave onLeave = new OnLeave();
        onLeave.setEmployee(employee);

        // 2. Xử lý Loại nghỉ phép (Logic mapping thông minh)
        String typeInput = request.getType() != null ? request.getType().trim().toUpperCase() : "CASUAL";
        OnLeaveType leaveType;

        switch (typeInput) {
            case "ANNUAL":
            case "ANNUAL_LEAVE":
            case "NGHỈ PHÉP NĂM":
            case "PHÉP NĂM":
                leaveType = OnLeaveType.ANNUAL_LEAVE;
                break;
            case "SICK":
            case "SICK_LEAVE":
            case "NGHỈ ỐM":
                leaveType = OnLeaveType.SICK_LEAVE;
                break;
            // ... (Các trường hợp khác tương tự như trên)
            case "CASUAL":
            case "CASUAL_LEAVE":
            case "SPECIAL":
            case "VIỆC RIÊNG":
            default:
                try {
                    leaveType = OnLeaveType.valueOf(typeInput);
                } catch (IllegalArgumentException e) {
                    try {
                        leaveType = OnLeaveType.valueOf(typeInput + "_LEAVE");
                    } catch (IllegalArgumentException ex) {
                        leaveType = OnLeaveType.CASUAL_LEAVE;
                    }
                }
        }
        onLeave.setOnLeaveType(leaveType);

        // 3. Gán dữ liệu từ Request
        onLeave.setStartDate(request.getStartDate());
        onLeave.setEndDate(request.getEndDate());
        onLeave.setReason(request.getReason());

        // 4. Gán dữ liệu hệ thống (Mặc định)
        onLeave.setOnLeaveStatus(OnLeaveStatus.PENDING); // Chờ duyệt
        onLeave.setSubmittedDate(LocalDate.now());       // Ngày nộp là hôm nay

        // 5. Tính toán tổng số ngày
        calculateAndSetTotalDaysOnleave(onLeave);

        // 6. Lưu xuống
        OnLeave saved = onLeaveRepository.save(onLeave);
        // 7. Tạo Response (Sử dụng hàm Mapper để tái sử dụng code)
        CreateLeaveResponseDTO response = new CreateLeaveResponseDTO();
        // --- GỌI HÀM MAPPER Ở ĐÂY ---
        response.setData(toLeaveListItemDTO(saved));
        // -----------------------------
        response.setSuccess(true);
        response.setMessage("Tạo đơn nghỉ phép thành công!");
        return response;
    }



//    ///  ///////////////////////////////
//    public LeaveHistoryResponseDTO getLeaveHistory(String employeeId) {
//
//        Long empId = Long.parseLong(employeeId);
//
//        // 1. Lấy employee hoặc ném lỗi
//        Employee employee = employeeRepository.findById(empId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId
//                        )
//                );
//
//        // 2. Lấy danh sách nghỉ phép
//        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(empId);
//
//        // 3. Map sang DTO (sạch, rõ ràng)
//        List<LeaveHistoryResponseDTO.LeaveHistoryItemDTO> items = leaves.stream()
//                .map(this::toLeaveListItemDTO)
//                .collect(Collectors.toList());
//
//        // 4. Tạo response
//        LeaveHistoryResponseDTO response = new LeaveHistoryResponseDTO();
//        response.setData(items);
//        response.setSuccess(true);
//
//        return response;
//    }




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


    //-------------------------------------------------
   public OnLeaveResponse getLeaveRequestById(Long id) {
        OnLeave onLeave = onLeaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.NO_LEAVE_FOUND.getMessage()));
        return onLeaveMapper.toOnLeaveResponse(onLeave);
    }
    // Legacy methods for backward compatibility

    public List<OnLeaveListResponse> getLeaveListByID(Long id) {
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(id);
        return onLeaveMapper.toOnLeaveListResponseList(leaves);
    }

    public Long countPendingOnLeaveRequestsById(Long id) {
        List<OnLeave> pendingLeaves = onLeaveRepository.findByEmployeeIdAndOnLeaveStatus(id, OnLeaveStatus.PENDING);
        return (long) pendingLeaves.size();
    }

    public Long countAllPendingOnLeaveRequests() {
        List<OnLeave> pendingLeaves = onLeaveRepository.findByOnLeaveStatus(OnLeaveStatus.PENDING);
        return (long) pendingLeaves.size();
    }

    public LeaveSummaryDTO getLeaveSummary(Long id) {
        List<OnLeave> allLeaves = onLeaveRepository.findByEmployeeId(id);
        
        LeaveSummaryDTO summary = new LeaveSummaryDTO();
        summary.setTotal((long) allLeaves.size());
        summary.setPending(allLeaves.stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .count());
        summary.setApproved(allLeaves.stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .count());
        summary.setRejected(allLeaves.stream()
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
        Employee emp = leave.getEmployee();
        if (emp != null) {
            String code = emp.getEmployeeId() != null ? emp.getEmployeeId() : String.valueOf(emp.getId());
            dto.setEmployeeId(code);
            dto.setEmployeeName(emp.getFullName());
            dto.setDepartment(emp.getDepartment());
        }
        dto.setType(leave.getOnLeaveType().name().toLowerCase());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setDays((int) getTotalDays(leave));
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getOnLeaveStatus().name().toLowerCase());
        return dto;
    }

    public Map<String, Long> countLeaveReq() {
        // 1. Khởi tạo Map với giá trị mặc định là 0 cho tất cả trạng thái
        Map<String, Long> stats = new HashMap<>();

        // Giả sử Enum của bạn là: PENDING, APPROVED, REJECTED
        // Khởi tạo trước để nếu DB không có dòng nào thì FE vẫn nhận được số 0 thay vì null
        stats.put("PENDING", 0L);
        stats.put("APPROVED", 0L);
        stats.put("REJECTED", 0L);
        // ... thêm các status khác nếu có (VD: CANCELLED)

        // 2. Gọi DB lấy dữ liệu Group By
        List<Object[]> results = onLeaveRepository.countRequestGroupedByStatus();

        long totalCount = 0;

        // 3. Đổ dữ liệu từ DB vào Map
        for (Object[] result : results) {
            // result[0] là Enum (Status), result[1] là Long (Count)
            if (result[0] != null) {
                String statusName = ((OnLeaveStatus) result[0]).name();
                Long count = (Long) result[1];

                stats.put(statusName, count);
                totalCount += count;
            }
        }

        // 4. Thêm tổng số đơn (để hiển thị ô đầu tiên bên trái dashboard)
        stats.put("TOTAL", totalCount);

        return stats;
    }

    public OnLeaveResponse getLeaveReqByID(String id) {
        OnLeave onleave = onLeaveRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.NO_LEAVE_FOUND.getMessage()));
        return onLeaveMapper.toOnLeaveResponse(onleave);
    }

    public List<OnLeaveListResponse> getAllLeaveByEmployeeId(Long employeeId) {

        List<OnLeave> leaves = onLeaveRepository.findByEmployee_Id(employeeId);

        return onLeaveMapper.toOnLeaveListResponseList(leaves);
    }




    public void setLeaveStatusByID(String id, OnLeaveStatus status) {
        OnLeave onleave = onLeaveRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.NO_LEAVE_FOUND.getMessage()));

        switch (status) {
            case APPROVED -> {
                User currentUser = authService.getCurrentUser();
                if(currentUser.getRole() == Role.MANAGER) {
                    if (onleave.getOnLeaveStatus() == OnLeaveStatus.PENDING) {

                        // --- [BẮT ĐẦU LOGIC TRỪ PHÉP] ---
                        // Chỉ trừ nếu là Nghỉ phép năm
                        if (onleave.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE) {
                            Employee employee = onleave.getEmployee();

                            // Lấy số ngày nghỉ của đơn này
                            long daysRequested = getTotalDays(onleave);

                            // Lấy số dư hiện tại (nếu null coi như 0)
                            int currentBalance = employee.getRemainingLeaveDays() != null ? employee.getRemainingLeaveDays() : 0;

                            // (Tuỳ chọn) Kiểm tra xem còn đủ phép không
                            if (currentBalance < daysRequested) {
                                throw new ResourceNotFoundException("Nhân viên không đủ ngày phép năm. (Còn lại: " + currentBalance + ", Yêu cầu: " + daysRequested + ")");
                            }

                            // Trừ phép và cập nhật Employee
                            employee.setRemainingLeaveDays(currentBalance - (int) daysRequested);
                            employeeRepository.save(employee);
                        }
                        // --- [KẾT THÚC LOGIC TRỪ PHÉP] ---

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
                    // Logic Hủy đơn: Chỉ cho hủy khi đang Pending
                    if (onleave.getOnLeaveStatus() == OnLeaveStatus.PENDING) {
                        onleave.setOnLeaveStatus(OnLeaveStatus.CANCELLED);
                        onLeaveRepository.save(onleave);
                    }
                    // Nếu bạn muốn cho phép hủy đơn ĐÃ DUYỆT thì phải cộng lại ngày phép ở đây
                    else {
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
    public EmployeeLeaveSummaryDTO getEmployeeLeaveSummary(Long employeeId) {

        List<OnLeave> allLeaves = onLeaveRepository.findByEmployeeId(employeeId);

        long used = allLeaves.stream()
                .filter(l -> l.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE)
                .filter(l -> l.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .mapToLong(this::getTotalDays)
                .sum();

        long pending = allLeaves.stream()
                .filter(l -> l.getOnLeaveType() == OnLeaveType.ANNUAL_LEAVE)
                .filter(l -> l.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .mapToLong(this::getTotalDays)
                .sum();

        // lấy phép còn lại từ Employee
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        long remaining = emp.getRemainingLeaveDays() != null ? emp.getRemainingLeaveDays() : 12;

        return EmployeeLeaveSummaryDTO.builder()
                .remaining(remaining)
                .used(used)
                .pending(pending)
                .build();
    }

    public List<LeaveListItemDTO> getEmployeeRecentHistory(Long employeeId) {
        List<OnLeave> leaves = onLeaveRepository.findByEmployeeId(employeeId);

        return leaves.stream()
                .sorted((a, b) -> b.getStartDate().compareTo(a.getStartDate())) // sort recent first
                .map(this::toLeaveListItemDTO)
                .collect(Collectors.toList());
    }


}

