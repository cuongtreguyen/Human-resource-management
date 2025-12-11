package management.member.demo.service;

import management.member.demo.mapper.AttendanceMapper;
import management.member.demo.dto.AttendanceDTO;
import management.member.demo.dto.AttendanceRequest;
import management.member.demo.dto.AttendanceFilterResponseDTO;
import management.member.demo.dto.DailyAttendanceResponseDTO;
import management.member.demo.dto.EmployeeAttendanceForAccountantDTO;
import management.member.demo.dto.FaceRecognitionResponseDTO;
import management.member.demo.dto.DayOffAndLateDayDTO;
import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
import management.member.demo.enums.AttendenceStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.AttendanceRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.AttendanceValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceMapper attendanceMapper;

    @Autowired
    private management.member.demo.mapper.AttendanceMapperHelper attendanceMapperHelper;

    @Autowired
    private AttendanceValidator attendanceValidator;

    @Autowired
    private management.member.demo.repository.OnLeaveRepository onLeaveRepository;

    @Value("${face.recognition.confidence.threshold:40.0}")
    private double confidenceThreshold;

    /**
     * Tạo attendance mới từ AttendanceRequest (theo Employee)
     */
    public AttendanceDTO createAttendance(AttendanceRequest request) {
        attendanceValidator.validateAttendanceRequest(request); // Validate request
        // Parse String employeeId to Long
        Long employeeId;
        try {
            employeeId = Long.parseLong(request.getEmployeeId().trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_EMPLOYEE_ID_FORMAT.toException("Định dạng ID nhân viên không hợp lệ: " + request.getEmployeeId());
        }
        
        // Tìm Employee
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));

        // Kiểm tra xem đã có attendance cho ngày này chưa
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(
                employeeId, request.getAttendanceDate());

        if (existing.isPresent()) {
            // Nếu đã có, cập nhật check-in/check-out
            Attendance attendance = existing.get();
            if (request.getCheckIn() != null) {
                attendance.setCheckIn(request.getCheckIn());
            }
            if (request.getCheckOut() != null) {
                attendance.setCheckOut(request.getCheckOut());
            }
            Attendance saved = attendanceRepository.save(attendance);
            return attendanceMapper.toDTO(saved);
        } else {
            // Tạo mới
            Attendance attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setAttendanceDate(request.getAttendanceDate());
            attendance.setCheckIn(request.getCheckIn());
            attendance.setCheckOut(request.getCheckOut());
            attendance.setFullName(employee.getFullName());
            attendance.setUserId(employee.getEmployeeId() != null ? employee.getEmployeeId() : employee.getId().toString());

            Attendance saved = attendanceRepository.save(attendance);
            return attendanceMapper.toDTO(saved);
        }
    }

    /**
     * Tạo attendance từ DTO (tương thích với hệ thống cũ)
     */
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance();

        // Tìm Employee nếu có employeeId
        if (attendanceDTO.getEmployeeId() != null && !attendanceDTO.getEmployeeId().trim().isEmpty()) {
            Long employeeId;
            try {
                employeeId = Long.parseLong(attendanceDTO.getEmployeeId().trim());
            } catch (NumberFormatException e) {
                throw ErrorCode.INVALID_EMPLOYEE_ID_FORMAT.toException("Định dạng ID nhân viên không hợp lệ: " + attendanceDTO.getEmployeeId());
            }
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + attendanceDTO.getEmployeeId()));
            attendance.setEmployee(employee);
            attendance.setFullName(employee.getFullName());
            attendance.setUserId(employee.getEmployeeId() != null ? employee.getEmployeeId() : employee.getId().toString());
        } else if (attendanceDTO.getUserId() != null) {
            // Fallback: dùng userId nếu không có employeeId
            attendance.setUserId(attendanceDTO.getUserId());
        } else {
            throw ErrorCode.INVALID_REQUEST.toException("Cần có employeeId hoặc userId để tạo attendance");
        }

        attendance.setAttendanceDate(attendanceDTO.getAttendanceDate());
        attendance.setCheckIn(attendanceDTO.getCheckIn());
        attendance.setCheckOut(attendanceDTO.getCheckOut());

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return attendanceMapper.toDTO(savedAttendance);
    }

    public List<AttendanceDTO> getAttendanceByUserId(String userId) {
        List<Attendance> attendances = attendanceRepository.findByUserId(userId);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByAttendanceDate(date);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByUserIdAndDate(String userId, LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByUserIdAndAttendanceDate(userId, date);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByDateRange(startDate, endDate);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        return attendanceRepository.findById(id)
                .map(attendance -> {
                    attendance.setCheckIn(attendanceDTO.getCheckIn());
                    attendance.setCheckOut(attendanceDTO.getCheckOut());
                    Attendance updated = attendanceRepository.save(attendance);
                    return attendanceMapper.toDTO(updated);
                })
                .orElse(null);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    /**
     * Lấy attendance theo Employee ID
     */
    public List<AttendanceDTO> getAttendanceByEmployeeId(Long employeeId) {
        List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy attendance theo Employee ID và ngày
     */
    public AttendanceDTO getAttendanceByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        Optional<Attendance> attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
        return attendance.map(attendanceMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy attendance cho nhân viên ID: " + employeeId + " vào ngày: " + date));
    }

    /**
     * Lấy attendance theo Employee ID và khoảng thời gian
     */
    public List<AttendanceDTO> getAttendanceByEmployeeIdAndDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndDateRange(employeeId, startDate, endDate);
        return attendances.stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Check-in cho employee
     * Tự động set status = LATE nếu check-in muộn hơn employee.timeIn
     */
    public AttendanceDTO checkIn(Long employeeId, LocalDate date) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
        LocalTime checkInTime = java.time.LocalTime.now();

        Attendance attendance;
        AttendenceStatus status = calculateCheckInStatus(employee, checkInTime);

        if (existing.isPresent()) {
            attendance = existing.get();
            if (attendance.getCheckIn() != null) {
                throw ErrorCode.ATTENDANCE_ALREADY_CHECKED_IN.toException();
            }
            attendance.setCheckIn(checkInTime);
            attendance.setStatus(status);
        } else {
            attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setAttendanceDate(date);
            attendance.setCheckIn(checkInTime);
            attendance.setStatus(status);
            attendance.setFullName(employee.getFullName());
            attendance.setUserId(employee.getEmployeeId() != null ? employee.getEmployeeId() : employee.getId().toString());
        }

        Attendance saved = attendanceRepository.save(attendance);
        return attendanceMapper.toDTO(saved);
    }

    /**
     * Check-out cho employee
     */
    public AttendanceDTO checkOut(Long employeeId, LocalDate date) {
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, date)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy attendance cho nhân viên ID: " + employeeId + " vào ngày: " + date));

        if (attendance.getCheckOut() != null) {
            throw ErrorCode.ATTENDANCE_ALREADY_CHECKED_OUT.toException();
        }

        attendance.setCheckOut(java.time.LocalTime.now());
        Attendance saved = attendanceRepository.save(attendance);
        return attendanceMapper.toDTO(saved);
    }

    /**
     * Get daily attendance - trả về DailyAttendanceResponseDTO với hoursWorked và overtime
     */
    public List<DailyAttendanceResponseDTO> getDailyAttendance(String date) {
        LocalDate attendanceDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        List<Attendance> attendances = attendanceRepository.findByAttendanceDate(attendanceDate);
        return attendances.stream()
                .map(attendanceMapperHelper::toDailyAttendanceDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get attendance range - trả về DailyAttendanceResponseDTO với hoursWorked và overtime
     */
    public List<DailyAttendanceResponseDTO> getAttendanceRange(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<Attendance> attendances = attendanceRepository.findByDateRange(start, end);
        return attendances.stream()
                .map(attendanceMapperHelper::toDailyAttendanceDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get employee attendance - trả về DailyAttendanceResponseDTO với hoursWorked và overtime
     */
    public List<DailyAttendanceResponseDTO> getEmployeeAttendance(String employeeId, String startDate, String endDate) {
        Long empId = Long.parseLong(employeeId);
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;

        List<Attendance> attendances;
        if (start != null && end != null) {
            attendances = attendanceRepository.findByEmployeeIdAndDateRange(empId, start, end);
        } else {
            attendances = attendanceRepository.findByEmployeeId(empId);
        }

        return attendances.stream()
                .map(attendanceMapperHelper::toDailyAttendanceDTO)
                .collect(Collectors.toList());
    }

    /**
     * Handle face recognition success - tạo hoặc cập nhật attendance
     */
    public FaceRecognitionResponseDTO handleFaceRecognitionSuccess(
            String employeeId, String employeeName, Double confidence, String timestamp) {

        // Validate confidence score (configurable via application.properties)
        // Note: Python should ideally validate confidence before sending, but we validate here as well
        if (confidence == null || confidence < confidenceThreshold) {
            logger.warn("Low confidence score: {} (threshold: {})", confidence, confidenceThreshold);
            return attendanceMapperHelper.toLowConfidenceErrorResponse(confidence);
        }
        
        logger.debug("Confidence validation passed: {} >= {}", confidence, confidenceThreshold);

        try {
            Long empId = Long.parseLong(employeeId);
            LocalDate today = LocalDate.now();

            // Tìm attendance hiện tại
            Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(empId, today);

            Attendance attendance;
            boolean isCheckIn = false;

            if (existing.isPresent()) {
                attendance = existing.get();
                // Nếu đã có check-in, thì đây là check-out
                if (attendance.getCheckIn() != null && attendance.getCheckOut() == null) {
                    attendance.setCheckOut(java.time.LocalTime.now());
                    // Giữ nguyên status LATE nếu đã đi muộn, không đổi thành OUT_WORK
                    if (attendance.getStatus() != AttendenceStatus.LATE) {
                        attendance.setStatus(AttendenceStatus.OUT_WORK); // Set status khi check-out
                    }
                    isCheckIn = false;
                } else if (attendance.getCheckIn() == null) {
                    // Chưa có check-in, tạo check-in với logic kiểm tra muộn
                    LocalTime checkInTime = java.time.LocalTime.now();
                    attendance.setCheckIn(checkInTime);
                    attendance.setStatus(calculateCheckInStatus(attendance.getEmployee(), checkInTime));
                    isCheckIn = true;
                } else {
                    // Đã có cả check-in và check-out, không làm gì
                    return attendanceMapperHelper.toAlreadyRecordedResponse(attendance);
                }
            } else {
                // Tạo mới attendance với check-in
                Employee employee = employeeRepository.findById(empId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

                LocalTime checkInTime = java.time.LocalTime.now();
                attendance = new Attendance();
                attendance.setEmployee(employee);
                attendance.setAttendanceDate(today);
                attendance.setCheckIn(checkInTime);
                attendance.setStatus(calculateCheckInStatus(employee, checkInTime));
                attendance.setFullName(employee.getFullName());
                attendance.setUserId(employee.getEmployeeId() != null ? employee.getEmployeeId() : employee.getId().toString());
                isCheckIn = true;
            }

            Attendance saved = attendanceRepository.save(attendance);
            return attendanceMapperHelper.toSuccessResponse(saved, isCheckIn);
        } catch (NumberFormatException e) {
            return attendanceMapperHelper.toErrorResponse("Invalid employee ID format");
        } catch (ResourceNotFoundException e) {
            return attendanceMapperHelper.toErrorResponse("Employee not found: " + employeeId);
        } catch (Exception e) {
            return attendanceMapperHelper.toErrorResponse("Error recording attendance: " + e.getMessage());
        }
    }

    /**
     * Lấy danh sách nhân viên đã chấm công cho Accountant
     * @param date Ngày cần lấy (nếu null thì lấy hôm nay)
     * @return Danh sách nhân viên đã chấm công với thông tin đầy đủ
     */
    public List<EmployeeAttendanceForAccountantDTO> getEmployeeAttendanceForAccountant(LocalDate date) {
        // Nếu không có date thì lấy hôm nay
        if (date == null) {
            date = LocalDate.now();
        }
        
        // Lấy tất cả attendance records trong ngày
        List<Attendance> attendances = attendanceRepository.findByAttendanceDate(date);
        
        // Map sang DTO
        return attendances.stream()
                .filter(attendance -> attendance.getEmployee() != null) // Chỉ lấy những record có employee
                .map(attendance -> {
                    EmployeeAttendanceForAccountantDTO dto = new EmployeeAttendanceForAccountantDTO();
                    Employee employee = attendance.getEmployee();
                    
                    // Thông tin từ Employee
                    dto.setEmployeeId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
                    dto.setFullName(employee.getFullName());
                    dto.setDepartment(employee.getDepartment());
                    dto.setShift(employee.getShift());
                    
                    // Thông tin từ Attendance
                    dto.setCheckIn(attendance.getCheckIn());
                    dto.setCheckOut(attendance.getCheckOut());
                    dto.setStatus(attendance.getStatus());
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Tính số ngày nghỉ (dayOff) dựa trên checkIn so với timeIn
     * Nếu checkIn chênh lệch với timeIn > 120 phút thì tính là nghỉ
     * 
     * @param employeeId ID của nhân viên
     * @return Số ngày nghỉ (String)
     */
    public String calculateDayOff(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
        
        if (employee.getTimeIn() == null) {
            return "0"; // Nếu không có timeIn thì không tính được
        }
        
        // Lấy tất cả attendance records của employee
        List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
        
        long dayOffCount = attendances.stream()
                .filter(attendance -> {
                    // Nếu không có checkIn thì tính là nghỉ
                    if (attendance.getCheckIn() == null) {
                        return true;
                    }
                    
                    // Tính chênh lệch giữa checkIn và timeIn (tính bằng phút)
                    // Nếu checkIn muộn hơn timeIn thì minutesDifference > 0
                    long minutesDifference = java.time.Duration.between(
                            employee.getTimeIn(),
                            attendance.getCheckIn()
                    ).toMinutes();
                    
                    // Nếu checkIn muộn hơn timeIn > 120 phút (2 giờ) thì tính là nghỉ
                    return minutesDifference > 120;
                })
                .count();
        
        return String.valueOf(dayOffCount);
    }
    
    /**
     * Tính số ngày đi muộn (lateDay) dựa trên checkIn so với timeIn
     * Nếu checkIn muộn hơn timeIn nhưng <= 120 phút thì tính là đi muộn
     * (Nếu > 120 phút thì tính là nghỉ - dayOff)
     * 
     * @param employeeId ID của nhân viên
     * @return Số ngày đi muộn (String)
     */
    public String calculateLateDay(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
        
        if (employee.getTimeIn() == null) {
            return "0"; // Nếu không có timeIn thì không tính được
        }
        
        // Lấy tất cả attendance records của employee
        List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
        
        long lateDayCount = attendances.stream()
                .filter(attendance -> {
                    // Phải có checkIn mới tính là đi muộn
                    if (attendance.getCheckIn() == null) {
                        return false; // Không check-in thì không tính là đi muộn (tính là nghỉ)
                    }
                    
                    // Tính chênh lệch giữa checkIn và timeIn (tính bằng phút)
                    // Nếu checkIn muộn hơn timeIn thì minutesDifference > 0
                    long minutesDifference = java.time.Duration.between(
                            employee.getTimeIn(),
                            attendance.getCheckIn()
                    ).toMinutes();
                    
                    // Đi muộn: checkIn muộn hơn timeIn > 0 phút nhưng <= 120 phút
                    // (Nếu > 120 phút thì tính là nghỉ - dayOff, không phải lateDay)
                    return minutesDifference > 0 && minutesDifference <= 120;
                })
                .count();
        
        return String.valueOf(lateDayCount);
    }
    
    /**
     * Tính tổng số ngày nghỉ (dayOff) bao gồm:
     * 1. Số ngày nghỉ từ bảng attendance (tính từ checkIn so với timeIn)
     *    - Trừ đi những ngày đã có trong onLeave (đã APPROVED) để tránh tính trùng
     * 2. Tổng số ngày nghỉ phép từ bảng on_leave (total_days_onleave) - chỉ tính các đơn đã APPROVED
     * 
     * @param employeeId ID của nhân viên
     * @return Tổng số ngày nghỉ (String)
     */
    public String calculateTotalDayOff(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
        
        if (employee.getTimeIn() == null) {
            // Nếu không có timeIn thì chỉ tính từ onLeave
            List<management.member.demo.entity.OnLeave> approvedLeaves = onLeaveRepository.findByEmployeeIdAndOnLeaveStatus(
                    employeeId, 
                    management.member.demo.enums.OnLeaveStatus.APPROVED
            );
            long totalDaysOnLeave = approvedLeaves.stream()
                    .mapToLong(leave -> {
                        if (leave.getTotalDaysOnleave() != null) {
                            return leave.getTotalDaysOnleave();
                        }
                        if (leave.getStartDate() != null && leave.getEndDate() != null) {
                            return java.time.temporal.ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
                        }
                        return 0L;
                    })
                    .sum();
            return String.valueOf(totalDaysOnLeave);
        }
        
        // 1. Lấy tất cả attendance records của employee
        List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
        
        // 2. Lấy tất cả onLeave đã APPROVED
        List<management.member.demo.entity.OnLeave> approvedLeaves = onLeaveRepository.findByEmployeeIdAndOnLeaveStatus(
                employeeId, 
                management.member.demo.enums.OnLeaveStatus.APPROVED
        );
        
        // 3. Tính dayOff từ attendance, nhưng trừ đi những ngày đã có trong onLeave (đã APPROVED)
        long dayOffFromAttendance = attendances.stream()
                .filter(attendance -> {
                    // Kiểm tra xem attendance này có phải là dayOff không
                    boolean isDayOff = false;
                    
                    // Nếu không có checkIn thì tính là nghỉ
                    if (attendance.getCheckIn() == null) {
                        isDayOff = true;
                    } else {
                        // Tính chênh lệch giữa checkIn và timeIn (tính bằng phút)
                        long minutesDifference = java.time.Duration.between(
                                employee.getTimeIn(),
                                attendance.getCheckIn()
                        ).toMinutes();
                        
                        // Nếu checkIn muộn hơn timeIn > 120 phút (2 giờ) thì tính là nghỉ
                        if (minutesDifference > 120) {
                            isDayOff = true;
                        }
                    }
                    
                    // Nếu không phải dayOff thì không tính
                    if (!isDayOff) {
                        return false;
                    }
                    
                    // Kiểm tra xem attendanceDate có nằm trong khoảng thời gian nghỉ phép đã APPROVED không
                    if (attendance.getAttendanceDate() != null) {
                        for (management.member.demo.entity.OnLeave leave : approvedLeaves) {
                            if (leave.getStartDate() != null && leave.getEndDate() != null) {
                                // Nếu attendanceDate nằm trong khoảng startDate và endDate của onLeave
                                // thì không tính vào dayOff (vì đã được tính trong onLeave)
                                if (!attendance.getAttendanceDate().isBefore(leave.getStartDate()) &&
                                    !attendance.getAttendanceDate().isAfter(leave.getEndDate())) {
                                    return false; // Trừ ngày này ra khỏi dayOff
                                }
                            }
                        }
                    }
                    
                    return true; // Tính vào dayOff
                })
                .count();
        
        // 4. Tính tổng số ngày nghỉ phép từ onLeave (chỉ tính các đơn đã APPROVED)
        long totalDaysOnLeave = approvedLeaves.stream()
                .mapToLong(leave -> {
                    // Sử dụng totalDaysOnleave nếu có, nếu không tính từ startDate và endDate
                    if (leave.getTotalDaysOnleave() != null) {
                        return leave.getTotalDaysOnleave();
                    }
                    if (leave.getStartDate() != null && leave.getEndDate() != null) {
                        return java.time.temporal.ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
                    }
                    return 0L;
                })
                .sum();
        
        // 5. Tổng dayOff = dayOff từ attendance (đã trừ ngày nghỉ phép) + tổng ngày nghỉ phép
        long totalDayOff = dayOffFromAttendance + totalDaysOnLeave;
        
        return String.valueOf(totalDayOff);
    }
    
    /**
     * Tính và trả về dayOff và lateDay từ bảng attendance
     * dayOff bao gồm cả số ngày nghỉ phép (total_days_onleave)
     * Không còn lưu vào bảng employees nữa, chỉ tính toán và trả về
     * 
     * @param employeeId ID của nhân viên
     * @return Map chứa dayOff và lateDay
     */
    public DayOffAndLateDayDTO getDayOffAndLateDay(Long employeeId) {
        String dayOff = calculateTotalDayOff(employeeId); // Sử dụng method mới tính tổng dayOff
        String lateDay = calculateLateDay(employeeId);
        
        DayOffAndLateDayDTO result = new DayOffAndLateDayDTO();
        result.setDayOff(dayOff);
        result.setLateDay(lateDay);
        
        return result;
    }
    
    /**
     * @deprecated Không còn cần thiết vì dayOff và lateDay không lưu vào employees nữa
     * Sử dụng getDayOffAndLateDay() thay thế
     */
    @Deprecated
    public void updateEmployeeDayOffAndLateDay(Long employeeId) {
        // Method này không còn cần thiết vì dayOff và lateDay không lưu vào employees nữa
        // Giữ lại để tương thích với code cũ, nhưng không làm gì cả
    }

    /**
     * API 1: Lấy tất cả attendance theo filter ngày/tháng/năm
     * - Nếu không nhập gì: lấy tất cả
     * - Nếu chỉ nhập năm: filter theo năm
     * - Nếu nhập tháng và năm: filter theo tháng/năm
     * - Nếu nhập đầy đủ ngày/tháng/năm: filter theo ngày cụ thể
     * - Nếu chỉ nhập ngày (không có tháng/năm): lấy ngày hiện tại của tháng/năm hiện tại
     */
    public List<AttendanceFilterResponseDTO> getAllAttendanceByDateFilter(
            Integer day, Integer month, Integer year) {
        // Nếu không có tham số nào, lấy tất cả với Employee được load
        if (day == null && month == null && year == null) {
            List<Attendance> allAttendance = attendanceRepository.findAllWithEmployee();
            return mapToFilterResponseDTO(allAttendance);
        }

        // Xử lý logic filter:
        // - Nếu có ngày nhưng không có tháng/năm: dùng tháng/năm hiện tại
        // - Nếu có tháng nhưng không có năm: dùng năm hiện tại
        LocalDate today = LocalDate.now();
        Integer finalDay = day;
        Integer finalMonth = month != null ? month : (day != null ? today.getMonthValue() : null);
        Integer finalYear = year != null ? year : ((day != null || month != null) ? today.getYear() : null);

        List<Attendance> attendanceList = attendanceRepository.findByDateFilter(
                finalDay, finalMonth, finalYear);
        return mapToFilterResponseDTO(attendanceList);
    }

    /**
     * API 2: Tìm attendance theo fullName (ignore case)
     */
    public List<AttendanceFilterResponseDTO> searchAttendanceByFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            // Nếu không có fullName, trả về tất cả với Employee được load
            List<Attendance> allAttendance = attendanceRepository.findAllWithEmployee();
            return mapToFilterResponseDTO(allAttendance);
        }

        List<Attendance> attendanceList = attendanceRepository.findByFullNameIgnoreCase(fullName.trim());
        return mapToFilterResponseDTO(attendanceList);
    }

    /**
     * Helper method: Map Attendance entity sang AttendanceFilterResponseDTO
     */
    private List<AttendanceFilterResponseDTO> mapToFilterResponseDTO(List<Attendance> attendanceList) {
        return attendanceList.stream().map(attendance -> {
            AttendanceFilterResponseDTO dto = new AttendanceFilterResponseDTO();
            
            // Load lại Employee nếu cần (đảm bảo có đầy đủ thông tin)
            Employee employee = attendance.getEmployee();
            // Nếu employee là proxy/lazy hoặc timeIn null, load lại từ database
            if (employee != null && employee.getTimeIn() == null) {
                Long employeeId = employee.getId();
                if (employeeId != null) {
                    employee = employeeRepository.findById(employeeId).orElse(employee);
                }
            }
            
            // Lấy employeeID từ employee.employeeId hoặc userId
            if (employee != null && employee.getEmployeeId() != null) {
                dto.setEmployeeID(employee.getEmployeeId());
            } else if (attendance.getUserId() != null) {
                dto.setEmployeeID(attendance.getUserId());
            } else {
                dto.setEmployeeID("emp" + (employee != null ? employee.getId() : attendance.getId()));
            }

            // Lấy fullName
            dto.setFullName(attendance.getFullName() != null ? 
                attendance.getFullName() : 
                (employee != null ? employee.getFullName() : null));

            // Lấy department từ Employee
            dto.setDepartment(employee != null ? employee.getDepartment() : null);

            // Lấy shift từ Employee
            dto.setShift(employee != null ? employee.getShift() : null);

            // timeIn và timeOut
            dto.setTimeIn(attendance.getCheckIn());
            dto.setTimeOut(attendance.getCheckOut());

            // status - LUÔN tính lại dựa trên checkIn và employee.timeIn để đảm bảo đúng
            AttendenceStatus status;
            
            // Nếu có checkIn, LUÔN kiểm tra lại xem có đi muộn không (ưu tiên LATE)
            if (attendance.getCheckIn() != null) {
                if (employee != null) {
                    // LUÔN gọi calculateCheckInStatus (có fallback logic nếu timeIn null)
                    AttendenceStatus calculatedStatus = calculateCheckInStatus(employee, attendance.getCheckIn());
                    
                    logger.info("Attendance ID: {}, CheckIn: {}, Employee.timeIn: {}, Shift: {}, CalculatedStatus: {}", 
                        attendance.getId(), attendance.getCheckIn(), employee.getTimeIn(), employee.getShift(), calculatedStatus);
                    
                    // Nếu tính ra là LATE, LUÔN ưu tiên LATE (kể cả khi đã check-out)
                    if (calculatedStatus == AttendenceStatus.LATE) {
                        status = AttendenceStatus.LATE;
                        logger.info("Setting status to LATE for attendance ID: {} (checkIn: {}, expectedTimeIn based on shift: {})", 
                            attendance.getId(), attendance.getCheckIn(), 
                            employee.getTimeIn() != null ? employee.getTimeIn() : "default from shift");
                    } else {
                        // Nếu không muộn, tính dựa trên checkIn/checkOut
                        if (attendance.getCheckOut() != null) {
                            status = AttendenceStatus.OUT_WORK; // Đã check-in và check-out
                        } else {
                            status = AttendenceStatus.IN_WORK; // Đã check-in nhưng chưa check-out
                        }
                    }
                } else {
                    // Không có employee, tính dựa trên checkOut
                    logger.warn("Employee is null for attendance ID: {}", attendance.getId());
                    if (attendance.getCheckOut() != null) {
                        status = AttendenceStatus.OUT_WORK;
                    } else {
                        status = AttendenceStatus.IN_WORK;
                    }
                }
            } else {
                // Không có checkIn
                if (attendance.getCheckOut() != null) {
                    status = AttendenceStatus.OUT_WORK;
                } else {
                    status = attendance.getStatus() != null ? 
                        attendance.getStatus() : AttendenceStatus.NOT_CHECKED_IN;
                }
            }
            
            dto.setStatus(status);

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Helper method: Tính status khi check-in dựa trên thời gian check-in và employee.timeIn
     * - Nếu check-in muộn hơn timeIn > 0 phút nhưng <= 120 phút: LATE
     * - Nếu check-in đúng giờ hoặc sớm: IN_WORK
     * - Nếu muộn > 120 phút: IN_WORK (coi như nghỉ, không tính là muộn)
     * 
     * Fallback: Nếu employee.timeIn là null, dùng giá trị mặc định dựa trên shift:
     * - Morning shift: 08:00
     * - Afternoon shift: 13:00
     * - Night shift: 18:00
     * - Không có shift: 08:00 (mặc định)
     */
    private AttendenceStatus calculateCheckInStatus(Employee employee, LocalTime checkInTime) {
        if (employee == null) {
            logger.warn("Employee is null when calculating check-in status");
            return AttendenceStatus.IN_WORK;
        }
        
        LocalTime expectedTimeIn = employee.getTimeIn();
        
        // Fallback: Nếu timeIn null, dùng giá trị mặc định dựa trên shift
        if (expectedTimeIn == null) {
            String shift = employee.getShift();
            String originalShift = shift; // Giữ lại để log
            if (shift != null) {
                shift = shift.toLowerCase().trim();
                if (shift.contains("morning") || shift.contains("sáng")) {
                    expectedTimeIn = LocalTime.of(8, 0); // 08:00
                } else if (shift.contains("afternoon") || shift.contains("chiều")) {
                    expectedTimeIn = LocalTime.of(13, 0); // 13:00
                } else if (shift.contains("night") || shift.contains("tối") || shift.contains("đêm")) {
                    expectedTimeIn = LocalTime.of(18, 0); // 18:00
                } else {
                    expectedTimeIn = LocalTime.of(8, 0); // Mặc định 08:00
                }
            } else {
                expectedTimeIn = LocalTime.of(8, 0); // Mặc định 08:00 nếu không có shift
            }
            logger.warn("Employee.timeIn is null for employeeId: {}, using default timeIn: {} based on shift: {}", 
                employee.getId(), expectedTimeIn, originalShift);
        }

        if (checkInTime.isAfter(expectedTimeIn)) {
            long minutesLate = java.time.Duration.between(expectedTimeIn, checkInTime).toMinutes();
            logger.debug("Check-in time: {}, Expected timeIn: {}, Minutes late: {}", 
                checkInTime, expectedTimeIn, minutesLate);
            // Nếu muộn > 0 phút thì tính là đi muộn (LATE)
            // Bỏ giới hạn 120 phút - nếu muộn thì luôn là LATE
            if (minutesLate > 0) {
                return AttendenceStatus.LATE;
            }
        }
        
        // Check-in đúng giờ hoặc sớm
        return AttendenceStatus.IN_WORK;
    }

}