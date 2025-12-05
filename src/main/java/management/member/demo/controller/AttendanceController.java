package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.service.AttendanceService;
import management.member.demo.service.FlaskApiService;
import management.member.demo.dto.AttendanceDTO;
import management.member.demo.dto.AttendanceFlaskResponseDTO;
import management.member.demo.dto.AttendanceRequest;
import management.member.demo.dto.AttendanceStatsDTO;
import management.member.demo.dto.DailyAttendanceResponseDTO;
import management.member.demo.dto.EmployeeAttendanceForAccountantDTO;
import management.member.demo.dto.FaceRecognitionRequestDTO;
import management.member.demo.dto.FaceRecognitionResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
@Tag(name = "Attendance", description = "Attendance management endpoints")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private FlaskApiService flaskApiService;
    
    @Value("${face.recognition.confidence.threshold:40.0}")
    private double confidenceThreshold;

    private static final Logger logger = LoggerFactory.getLogger(AttendanceController.class);

    // Get daily attendance from local database - Trả về format API spec
    @GetMapping("/daily")
    @Operation(summary = "Get daily attendance", description = "Get attendance records for a specific date (default: today)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<DailyAttendanceResponseDTO>> getDailyAttendance(
            @RequestParam(required = false) String date) {
        try {
            List<DailyAttendanceResponseDTO> attendance = attendanceService.getDailyAttendance(date);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            logger.error("Error getting daily attendance: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get attendance range from local database - Trả về format API spec
    @GetMapping("/range")
    @Operation(summary = "Get attendance range", description = "Get attendance records for a date range")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<DailyAttendanceResponseDTO>> getAttendanceRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            List<DailyAttendanceResponseDTO> attendance = attendanceService.getAttendanceRange(startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            logger.error("Error getting attendance range: {}", e.getMessage(), e);
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
    public ResponseEntity<AttendanceDTO> createAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
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
            @Valid @RequestBody AttendanceDTO attendanceDTO) {
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

    // Lấy attendance của một employee (hỗ trợ Long id hoặc employeeId)
    @GetMapping("/employee/{employeeId}")
    @Operation(
            summary = "Get employee attendance",
            description = "Get attendance records for a specific employee. Supports Long id or employeeId (String). Optional date range filter."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<List<DailyAttendanceResponseDTO>> getAttendanceByEmployeeId(
            @PathVariable String employeeId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<DailyAttendanceResponseDTO> attendance = attendanceService.getEmployeeAttendance(employeeId, startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            logger.error("Error getting employee attendance: {}", e.getMessage(), e);
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
     * Endpoint để Flask gọi vào khi nhận diện thành công
     * Flask sẽ POST đến endpoint này với payload từ face recognition
     */
    @PostMapping("/face-recognition/recognition-success")
    @Operation(
            summary = "Handle face recognition success",
            description = "Nhận notification khi nhận diện khuôn mặt thành công từ Flask API. Validates confidence score and records attendance."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance recorded successfully"),
            @ApiResponse(responseCode = "400", description = "Low confidence score or invalid request")
    })
    public ResponseEntity<FaceRecognitionResponseDTO> handleRecognitionSuccess(
            @Valid @RequestBody FaceRecognitionRequestDTO request) {
        try {
            logger.info("Received face recognition request: employeeId={}, name={}, timestamp={}, confidence={}",
                    request.getEmployeeId(), request.getEmployeeName(), request.getTimestamp(), request.getConfidence());

            // Delegate to service layer
            FaceRecognitionResponseDTO response = attendanceService.handleFaceRecognitionSuccess(
                    request.getEmployeeId(),
                    request.getEmployeeName(),
                    request.getConfidence(),
                    request.getTimestamp()
            );

            if (!response.isSuccess()) {
                // Check if it's a low confidence error
                if (response.getConfidence() != null && response.getConfidence() < confidenceThreshold) {
                    logger.warn("Low confidence score: {} (threshold: {})", response.getConfidence(), confidenceThreshold);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                // Other errors (e.g., employee not found)
                logger.warn("Face recognition failed: {}", response.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            logger.info("Face recognition success: attendanceId={}, status={}",
                    response.getAttendanceId(), response.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error handling recognition success: {}", e.getMessage(), e);
            FaceRecognitionResponseDTO errorResponse = new FaceRecognitionResponseDTO();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    /**
     * Lấy danh sách nhân viên đã chấm công cho Accountant
     * Trả về thông tin: employeeId, fullName, department, shift, checkIn, checkOut, status
     */
    @GetMapping("/accountant/employees")
    @Operation(
            summary = "Get employee attendance list for Accountant",
            description = "Get list of employees who have checked in/out with full details for Accountant. Optional date parameter (default: today)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "400", description = "Invalid date format")
    })
    public ResponseEntity<List<EmployeeAttendanceForAccountantDTO>> getEmployeeAttendanceForAccountant(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<EmployeeAttendanceForAccountantDTO> result = attendanceService.getEmployeeAttendanceForAccountant(date);
        return ResponseEntity.ok(result);
    }
}