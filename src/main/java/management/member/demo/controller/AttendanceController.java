package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.Service.AttendanceService;
import management.member.demo.Service.FlaskApiService;
import management.member.demo.dto.AttendanceDTO;
import management.member.demo.dto.AttendanceFlaskResponseDTO;
import management.member.demo.dto.AttendanceRequest;
import management.member.demo.dto.AttendanceStatsDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import management.member.demo.dto.RecognitionSuccessResponseDTO;
import management.member.demo.entity.Attendance;
import management.member.demo.repository.AttendanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
@Tag(name = "Attendance", description = "Attendance management endpoints")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private FlaskApiService flaskApiService;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    private static final Logger logger = LoggerFactory.getLogger(AttendanceController.class);

    // Get daily attendance from Flask API - Trả về format Flask
    @GetMapping("/daily")
    public ResponseEntity<List<AttendanceFlaskResponseDTO>> getDailyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date) {
        try {
            List<AttendanceFlaskResponseDTO> attendance = flaskApiService.getDailyAttendanceFlaskFormat(date);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get attendance range from Flask API - Trả về format Flask
    @GetMapping("/range")
    public ResponseEntity<List<AttendanceFlaskResponseDTO>> getAttendanceRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String endDate) {
        try {
            List<AttendanceFlaskResponseDTO> attendance = flaskApiService.getAttendanceRangeFlaskFormat(startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get attendance by employee from Flask API (by employee ID string) - Trả về format Flask
    @GetMapping("/employee/flask/{empId}")
    public ResponseEntity<List<AttendanceFlaskResponseDTO>> getAttendanceByEmployeeFromFlask(
            @PathVariable String empId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String endDate) {
        try {
            List<AttendanceFlaskResponseDTO> attendance = flaskApiService.getAttendanceByEmployeeFlaskFormat(empId, startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get attendance stats from Flask API
    @GetMapping("/stats")
    public ResponseEntity<AttendanceStatsDTO> getAttendanceStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date) {
        try {
            AttendanceStatsDTO stats = flaskApiService.getAttendanceStats(date);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Local database operations
    @PostMapping("/local")
    public ResponseEntity<AttendanceDTO> createAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        try {
            AttendanceDTO created = attendanceService.createAttendance(attendanceDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/local/user/{userId}")
    public ResponseEntity<List<AttendanceDTO>> getLocalAttendanceByUserId(@PathVariable String userId) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getAttendanceByUserId(userId);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/local/date")
    public ResponseEntity<List<AttendanceDTO>> getLocalAttendanceByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getAttendanceByDate(date);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/local/{id}")
    public ResponseEntity<AttendanceDTO> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceDTO attendanceDTO) {
        try {
            AttendanceDTO updated = attendanceService.updateAttendance(id, attendanceDTO);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/local/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== Employee-based Attendance Operations ==========

    // Tạo attendance mới cho employee
    @PostMapping("/employee")
    @Operation(
            summary = "Create attendance for employee",
            description = "Tạo hoặc cập nhật attendance cho nhân viên"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Attendance created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<AttendanceDTO> createEmployeeAttendance(
            @Valid @RequestBody AttendanceRequest request) {
        try {
            AttendanceDTO created = attendanceService.createAttendance(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy tất cả attendance của một employee
    @GetMapping("/employee/{employeeId}")
    @Operation(
            summary = "Get all attendance by employee ID",
            description = "Lấy tất cả attendance của một nhân viên"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByEmployeeId(
            @PathVariable Long employeeId) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getAttendanceByEmployeeId(employeeId);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy attendance của employee theo ngày
    @GetMapping("/employee/{employeeId}/date")
    @Operation(
            summary = "Get attendance by employee ID and date",
            description = "Lấy attendance của nhân viên theo ngày cụ thể"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<AttendanceDTO> getAttendanceByEmployeeIdAndDate(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            AttendanceDTO attendance = attendanceService.getAttendanceByEmployeeIdAndDate(employeeId, date);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy attendance của employee theo khoảng thời gian
    @GetMapping("/employee/{employeeId}/range")
    @Operation(
            summary = "Get attendance by employee ID and date range",
            description = "Lấy attendance của nhân viên theo khoảng thời gian"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByEmployeeIdAndDateRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getAttendanceByEmployeeIdAndDateRange(
                    employeeId, startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Check-in cho employee
    @PostMapping("/employee/{employeeId}/check-in")
    @Operation(
            summary = "Check-in for employee",
            description = "Check-in cho nhân viên vào ngày hiện tại"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Check-in successful"),
            @ApiResponse(responseCode = "400", description = "Already checked in"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<AttendanceDTO> checkIn(
            @PathVariable Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            LocalDate checkDate = date != null ? date : LocalDate.now();
            AttendanceDTO attendance = attendanceService.checkIn(employeeId, checkDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Check-out cho employee
    @PostMapping("/employee/{employeeId}/check-out")
    @Operation(
            summary = "Check-out for employee",
            description = "Check-out cho nhân viên vào ngày hiện tại"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Check-out successful"),
            @ApiResponse(responseCode = "400", description = "Already checked out or not checked in"),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<AttendanceDTO> checkOut(
            @PathVariable Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            LocalDate checkDate = date != null ? date : LocalDate.now();
            AttendanceDTO attendance = attendanceService.checkOut(employeeId, checkDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint để Flask gọi vào khi nhận diện thành công (alias của /api/face-recognition/recognition-success)
     * Flask sẽ POST đến endpoint này với payload từ face recognition
     */
    @PostMapping("/face-recognition/recognition-success")
    @Operation(
            summary = "Handle face recognition success",
            description = "Nhận notification khi nhận diện khuôn mặt thành công từ Flask API"
    )
    public ResponseEntity<RecognitionSuccessResponseDTO> handleRecognitionSuccess(@RequestBody Map<String, Object> payload) {
        try {
            // Lấy thông tin từ payload Flask
            String employeeIdStr = (String) payload.get("id");
            String employeeName = (String) payload.get("name");
            String timestamp = (String) payload.get("timestamp");
            String confidence = (String) payload.get("confidence");
            
            logger.info("Received face recognition success: id={}, name={}, timestamp={}, confidence={}", 
                    employeeIdStr, employeeName, timestamp, confidence);
            
            // Tạo response với thông tin cơ bản
            RecognitionSuccessResponseDTO response = new RecognitionSuccessResponseDTO(
                true, 
                "Face recognition successful",
                employeeIdStr,
                employeeName
            );
            response.setTimestamp(timestamp);
            
            // Tự động lưu attendance vào database
            try {
                // Parse employee ID (có thể là String hoặc Long)
                Long employeeId = null;
                try {
                    employeeId = Long.parseLong(employeeIdStr);
                } catch (NumberFormatException e) {
                    // Nếu không parse được, tìm employee theo employeeId (String)
                    logger.warn("Cannot parse employee ID as Long: {}, will try to find by employeeId string", employeeIdStr);
                }
                
                // Parse timestamp để lấy date và time
                LocalDate attendanceDate = LocalDate.now();
                LocalTime checkInTime = LocalTime.now();
                
                if (timestamp != null && !timestamp.isEmpty()) {
                    try {
                        // Parse timestamp format: "2025-11-28 00:07:08"
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                        LocalDateTime dateTime = LocalDateTime.parse(timestamp, formatter);
                        attendanceDate = dateTime.toLocalDate();
                        checkInTime = dateTime.toLocalTime();
                    } catch (Exception e) {
                        logger.warn("Cannot parse timestamp: {}, using current time", timestamp);
                    }
                }
                
                if (employeeId != null) {
                    // Tìm employee và lưu attendance với timestamp từ Flask
                    Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, attendanceDate);
                    
                    if (existing.isEmpty()) {
                        // Chưa check-in, tạo mới với timestamp từ Flask
                        logger.info("Creating new attendance for employee {} on {} with checkIn={}", 
                                employeeId, attendanceDate, checkInTime);
                        
                        // Tạo attendance request với timestamp từ Flask
                        AttendanceRequest request = new AttendanceRequest();
                        request.setEmployeeId(employeeId);
                        request.setAttendanceDate(attendanceDate);
                        request.setCheckIn(checkInTime); // Dùng timestamp từ Flask
                        
                        AttendanceDTO attendance = attendanceService.createAttendance(request);
                        response.setAttendanceId(attendance.getId());
                        response.setCheckInTime(attendance.getCheckIn() != null ? attendance.getCheckIn().toString() : null);
                        response.setMessage("Face recognized and checked in successfully");
                        logger.info("Attendance saved to database: id={}, employeeId={}, date={}, checkIn={}", 
                                attendance.getId(), employeeId, attendanceDate, attendance.getCheckIn());
                    } else {
                        // Đã check-in rồi, có thể update check-out nếu chưa có
                        Attendance att = existing.get();
                        response.setAttendanceId(att.getId());
                        response.setCheckInTime(att.getCheckIn() != null ? att.getCheckIn().toString() : null);
                        
                        if (att.getCheckOut() == null) {
                            // Chưa check-out, có thể set check-out với timestamp hiện tại
                            att.setCheckOut(checkInTime); // Dùng timestamp từ Flask làm check-out
                            attendanceRepository.save(att);
                            response.setMessage("Face recognized and checked out successfully");
                            logger.info("Updated check-out for attendance id={} with time={}", att.getId(), checkInTime);
                        } else {
                            response.setMessage("Face recognized (already checked in and out)");
                            logger.info("Attendance already completed: id={}", att.getId());
                        }
                    }
                } else {
                    // Không tìm thấy employee ID hợp lệ
                    logger.warn("Cannot save attendance: invalid employee ID {}", employeeIdStr);
                    response.setMessage("Face recognized but could not save attendance (invalid employee ID)");
                }
            } catch (Exception e) {
                logger.error("Error saving attendance to database: {}", e.getMessage(), e);
                // Vẫn trả về success nhưng không có attendance info
                response.setMessage("Face recognized but failed to save attendance: " + e.getMessage());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error handling recognition success: {}", e.getMessage(), e);
            RecognitionSuccessResponseDTO errorResponse = new RecognitionSuccessResponseDTO(false, e.getMessage(), null, null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
