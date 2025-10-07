# Backend Integration Guide - Face Recognition

## 🎯 Tổng quan
Hướng dẫn tích hợp Face Recognition với Spring Boot backend của bạn.

## 📁 Cấu trúc Backend cần tạo

### 1. Controller Layer
```java
@RestController
@RequestMapping("/api/face-recognition")
@CrossOrigin(origins = "http://localhost:5173")
public class FaceRecognitionController {
    
    @Autowired
    private FaceRecognitionService faceRecognitionService;
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        // Check OpenCV, camera, model status
        return ResponseEntity.ok(faceRecognitionService.getSystemStatus());
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerEmployee(
            @RequestParam("employeeCode") String employeeCode,
            @RequestParam("fullName") String fullName,
            @RequestParam("department") String department,
            @RequestParam("position") String position,
            @RequestParam("faceImage") MultipartFile faceImage) {
        
        return ResponseEntity.ok(faceRecognitionService.registerEmployee(
            employeeCode, fullName, department, position, faceImage));
    }
    
    @PostMapping("/train")
    public ResponseEntity<Map<String, Object>> trainModel() {
        return ResponseEntity.ok(faceRecognitionService.trainModel());
    }
    
    @PostMapping("/recognize")
    public ResponseEntity<Map<String, Object>> recognizeFace(
            @RequestParam("faceImage") MultipartFile faceImage) {
        
        return ResponseEntity.ok(faceRecognitionService.recognizeFace(faceImage));
    }
    
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getRegisteredEmployees() {
        return ResponseEntity.ok(faceRecognitionService.getRegisteredEmployees());
    }
}
```

### 2. Service Layer
```java
@Service
public class FaceRecognitionService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    public Map<String, Object> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "connected");
        status.put("camera", "active");
        status.put("model", "ready");
        status.put("database", "connected");
        return status;
    }
    
    public Map<String, Object> registerEmployee(String employeeCode, String fullName, 
            String department, String position, MultipartFile faceImage) {
        
        // 1. Save face image to database (employees.picture)
        // 2. Process face features using OpenCV
        // 3. Save employee to database
        
        return Map.of("success", true, "message", "Employee registered successfully");
    }
    
    public Map<String, Object> trainModel() {
        // 1. Load all employee face images
        // 2. Train face recognition model
        // 3. Save model to file system
        
        return Map.of("success", true, "message", "Model trained successfully");
    }
    
    public Map<String, Object> recognizeFace(MultipartFile faceImage) {
        // 1. Process uploaded face image
        // 2. Compare with trained model
        // 3. Return employee info if match found
        
        return Map.of(
            "success", true,
            "employee", employeeInfo,
            "confidence", 0.95
        );
    }
}
```

### 3. OpenCV Integration
```java
@Component
public class OpenCVFaceRecognition {
    
    static {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
    }
    
    public void initializeFaceRecognition() {
        // Initialize OpenCV face detection
        // Load face recognition model
    }
    
    public Mat processFaceImage(MultipartFile image) {
        // Convert MultipartFile to OpenCV Mat
        // Preprocess image for face recognition
        return processedMat;
    }
    
    public double compareFaces(Mat face1, Mat face2) {
        // Compare two face images
        // Return similarity score
        return similarity;
    }
}
```

## 🔧 Cấu hình cần thiết

### 1. application.properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/hr_management
spring.datasource.username=postgres
spring.datasource.password=your_password

# File upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*

# OpenCV
opencv.face.model.path=/path/to/face/model
opencv.face.data.path=/path/to/face/data
```

### 2. Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/face-recognition/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

## 📊 Database Updates

### 1. Thêm indexes cho performance
```sql
-- Index for face recognition queries
CREATE INDEX idx_employees_face_recognition ON employees(employee_code, is_deleted);
CREATE INDEX idx_attendance_face_recognition ON attendance(employee_id, date);
```

### 2. Thêm audit log cho Face Recognition
```sql
-- Log face recognition activities
INSERT INTO audit_logs (user_id, action_type, action_info, action_level)
VALUES (1, 'FACE_RECOGNITION', 'Employee registered for face recognition', 'INFO');
```

## 🚀 Deployment Steps

### 1. Backend Setup
```bash
# Clone và setup Spring Boot project
cd /e:/SWP391-main/SWP391-main
./mvnw clean install
./mvnw spring-boot:run
```

### 2. Frontend Integration
```bash
# Frontend đã được cập nhật để gọi API thật
# Chỉ cần chạy frontend
npm run dev
```

### 3. Test Integration
1. Start PostgreSQL database
2. Run Spring Boot application (port 8080)
3. Run React frontend (port 5173)
4. Test Face Recognition features

## 🔍 API Testing

### Test với Postman/curl
```bash
# Check system status
curl http://localhost:8080/api/face-recognition/status

# Register employee
curl -X POST http://localhost:8080/api/face-recognition/register \
  -F "employeeCode=EMP001" \
  -F "fullName=Nguyen Van A" \
  -F "department=IT" \
  -F "position=Developer" \
  -F "faceImage=@face.jpg"

# Train model
curl -X POST http://localhost:8080/api/face-recognition/train

# Recognize face
curl -X POST http://localhost:8080/api/face-recognition/recognize \
  -F "faceImage=@test_face.jpg"
```

## 📝 Next Steps

1. **Implement OpenCV face detection** trong Spring Boot
2. **Add camera integration** cho real-time face capture
3. **Implement face feature extraction** và matching
4. **Add WebSocket** cho real-time updates
5. **Add face recognition accuracy metrics**
6. **Implement face anti-spoofing** measures

## 🎯 Kết quả mong đợi

- ✅ Face Recognition hoạt động với backend thật
- ✅ Chấm công tự động bằng khuôn mặt
- ✅ Quản lý nhân viên với ảnh khuôn mặt
- ✅ Audit log cho tất cả hoạt động
- ✅ Real-time updates qua WebSocket
