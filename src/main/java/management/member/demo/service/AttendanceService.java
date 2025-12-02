package management.member.demo.service;

import management.member.demo.mapper.AttendanceMapper;
import management.member.demo.dto.AttendanceDTO;
import management.member.demo.dto.AttendanceRequest;
import management.member.demo.dto.DailyAttendanceResponseDTO;
import management.member.demo.dto.ExportResponseDTO;
import management.member.demo.dto.FaceRecognitionResponseDTO;
import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
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

    @Value("${face.recognition.confidence.threshold:20.0}")
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
            throw new IllegalArgumentException("Invalid employee ID format: " + request.getEmployeeId());
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
                throw new IllegalArgumentException("Invalid employee ID format: " + attendanceDTO.getEmployeeId());
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
            throw new IllegalArgumentException("Cần có employeeId hoặc userId để tạo attendance");
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
     */
    public AttendanceDTO checkIn(Long employeeId, LocalDate date) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);

        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            if (attendance.getCheckIn() != null) {
                throw new IllegalStateException("Employee đã check-in vào ngày này");
            }
            attendance.setCheckIn(java.time.LocalTime.now());
        } else {
            attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setAttendanceDate(date);
            attendance.setCheckIn(java.time.LocalTime.now());
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
            throw new IllegalStateException("Employee đã check-out vào ngày này");
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
                    isCheckIn = false;
                } else if (attendance.getCheckIn() == null) {
                    // Chưa có check-in, tạo check-in
                    attendance.setCheckIn(java.time.LocalTime.now());
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

                attendance = new Attendance();
                attendance.setEmployee(employee);
                attendance.setAttendanceDate(today);
                attendance.setCheckIn(java.time.LocalTime.now());
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
     * Export attendance data
     */
    public ExportResponseDTO exportAttendance(String startDate, String endDate, String format) {
        // TODO: Implement actual export logic
        String filename = "attendance_" + startDate + "_to_" + endDate + "." + (format != null ? format : "excel");

        // TODO: Move export response creation to a mapper if needed
        ExportResponseDTO response = new ExportResponseDTO();
        response.setUrl("/exports/" + filename);
        response.setFilename(filename);
        response.setMessage("Export completed successfully");
        response.setSuccess(true);

        return response;
    }

}