package management.member.demo.Service;

import management.member.demo.Mapper.AttendanceMapper;
import management.member.demo.dto.AttendanceDTO;
import management.member.demo.dto.AttendanceRequest;
import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.AttendanceRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceMapper attendanceMapper;

    /**
     * Tạo attendance mới từ AttendanceRequest (theo Employee)
     */
    public AttendanceDTO createAttendance(AttendanceRequest request) {
        // Tìm Employee
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));

        // Kiểm tra xem đã có attendance cho ngày này chưa
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(
                request.getEmployeeId(), request.getAttendanceDate());
        
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
            return mapToDTO(saved);
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
            return mapToDTO(saved);
        }
    }

    /**
     * Tạo attendance từ DTO (tương thích với hệ thống cũ)
     */
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance();
        
        // Tìm Employee nếu có employeeId
        if (attendanceDTO.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(attendanceDTO.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + attendanceDTO.getEmployeeId()));
            attendance.setEmployee(employee);
            attendance.setFullName(employee.getFullName());
            attendance.setUserId(employee.getEmployeeId() != null ? employee.getEmployeeId() : employee.getId().toString());
        } else if (attendanceDTO.getUserId() != null) {
            // Fallback: dùng userId nếu không có employeeId
            attendance.setUserId(attendanceDTO.getUserId());
            attendance.setFullName(attendanceDTO.getUserName());
        } else {
            throw new IllegalArgumentException("Cần có employeeId hoặc userId để tạo attendance");
        }
        
        attendance.setAttendanceDate(attendanceDTO.getAttendanceDate());
        attendance.setCheckIn(attendanceDTO.getCheckIn());
        attendance.setCheckOut(attendanceDTO.getCheckOut());
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return mapToDTO(savedAttendance);
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
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy attendance theo Employee ID và ngày
     */
    public AttendanceDTO getAttendanceByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        Optional<Attendance> attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
        return attendance.map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy attendance cho nhân viên ID: " + employeeId + " vào ngày: " + date));
    }

    /**
     * Lấy attendance theo Employee ID và khoảng thời gian
     */
    public List<AttendanceDTO> getAttendanceByEmployeeIdAndDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndDateRange(employeeId, startDate, endDate);
        return attendances.stream()
                .map(this::mapToDTO)
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
        return mapToDTO(saved);
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
        return mapToDTO(saved);
    }

    /**
     * Map Attendance entity sang DTO với thông tin Employee
     */
    private AttendanceDTO mapToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        if (attendance.getEmployee() != null) {
            dto.setEmployeeId(attendance.getEmployee().getId());
            dto.setEmployeeName(attendance.getEmployee().getFullName());
        }
        dto.setUserId(attendance.getUserId());
        dto.setUserName(attendance.getFullName());
        dto.setAttendanceDate(attendance.getAttendanceDate());
        dto.setCheckIn(attendance.getCheckIn());
        dto.setCheckOut(attendance.getCheckOut());
        dto.setCreatedAt(attendance.getCreatedAt());
        dto.setUpdatedAt(attendance.getUpdatedAt());
        return dto;
    }
}