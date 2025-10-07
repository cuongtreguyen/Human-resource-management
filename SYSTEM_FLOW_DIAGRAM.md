# 🔄 HR MANAGEMENT SYSTEM - FLOW DIAGRAM

## 📊 SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   DATABASE      │
│   (React)       │◄──►│   (Flask API)   │◄──►│   (SQLite)      │
│   Port: 5173    │    │   Port: 5000    │    │   hr_system.db  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FACE RECOG    │    │   FILE STORAGE  │    │   AUDIT LOGS    │
│   (OpenCV)      │    │   (Uploads)     │    │   (System Logs) │
│   Camera Input  │    │   Images/Docs   │    │   User Actions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔐 AUTHENTICATION FLOW

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant D as Database
    participant J as JWT Service

    U->>F: Enter email/password
    F->>B: POST /api/auth/login
    B->>D: Validate credentials
    D-->>B: User data + role
    B->>J: Generate JWT token
    J-->>B: JWT token
    B-->>F: {token, user, role}
    F->>F: Store token in localStorage
    F->>F: Redirect based on role
    Note over F: Admin/Manager → /dashboard<br/>Employee → /employee
```

---

## 👥 EMPLOYEE MANAGEMENT FLOW

```mermaid
flowchart TD
    A[Admin/Manager Login] --> B[Employee List Page]
    B --> C{Action?}
    
    C -->|View| D[Employee Details]
    C -->|Add| E[Add Employee Form]
    C -->|Edit| F[Edit Employee Form]
    C -->|Delete| G[Confirm Delete]
    C -->|Export| H[Export Options]
    
    E --> I[Submit Form]
    F --> I
    I --> J[POST /api/employees]
    J --> K[Validate Data]
    K --> L[Save to Database]
    L --> M[Return Success]
    M --> N[Update UI]
    
    G --> O[DELETE /api/employees/:id]
    O --> P[Soft Delete/Archive]
    P --> Q[Update Status]
    
    H --> R[Select Format & Filters]
    R --> S[POST /api/employees/export]
    S --> T[Generate File]
    T --> U[Download File]
```

---

## ⏰ ATTENDANCE MANAGEMENT FLOW

```mermaid
flowchart TD
    A[Employee Portal] --> B[Face Recognition Page]
    B --> C[Start Camera]
    C --> D[Capture Photo]
    D --> E[POST /api/attendance/face-recognition]
    
    E --> F[Face Detection]
    F --> G{Face Found?}
    G -->|No| H[Error: No face detected]
    G -->|Yes| I[Face Encoding]
    
    I --> J[Compare with Database]
    J --> K{Match Found?}
    K -->|No| L[Error: Unknown person]
    K -->|Yes| M[Check Confidence]
    
    M --> N{Confidence > 80%?}
    N -->|No| O[Error: Low confidence]
    N -->|Yes| P[Record Attendance]
    
    P --> Q[Check In/Out Logic]
    Q --> R[Update Database]
    R --> S[Return Success]
    S --> T[Show Success Message]
    
    H --> U[Show Error Message]
    L --> U
    O --> U
```

---

## 💰 PAYROLL CALCULATION FLOW

```mermaid
flowchart TD
    A[Payroll Management] --> B[Select Month & Employees]
    B --> C[POST /api/payroll/calculate]
    
    C --> D[Get Attendance Data]
    D --> E[Calculate Base Salary]
    E --> F[Calculate Overtime]
    F --> G[Calculate Bonuses]
    G --> H[Calculate Deductions]
    
    H --> I[Apply Tax Rules]
    I --> J[Generate Payroll Records]
    J --> K[Save to Database]
    K --> L[Return Payroll Data]
    
    L --> M[Display Payroll List]
    M --> N{Action?}
    N -->|Export| O[Generate PDF/Excel]
    N -->|Approve| P[Mark as Approved]
    N -->|Send| Q[Email Payslips]
```

---

## 📅 LEAVE REQUEST FLOW

```mermaid
sequenceDiagram
    participant E as Employee
    participant F as Frontend
    participant B as Backend
    participant M as Manager
    participant D as Database

    E->>F: Submit Leave Request
    F->>B: POST /api/leaves
    B->>D: Save Leave Request
    D-->>B: Leave ID
    B->>B: Send Notification to Manager
    B-->>F: Success Response
    
    Note over M: Manager receives notification
    
    M->>F: View Pending Leaves
    F->>B: GET /api/leaves?status=pending
    B->>D: Query Pending Leaves
    D-->>B: Leave Requests
    B-->>F: Leave List
    
    M->>F: Approve/Reject Leave
    F->>B: PUT /api/leaves/:id/status
    B->>D: Update Leave Status
    B->>B: Send Notification to Employee
    B-->>F: Success Response
    
    Note over E: Employee receives notification
```

---

## 🔍 AUDIT LOG FLOW

```mermaid
flowchart TD
    A[User Action] --> B[API Endpoint]
    B --> C[Business Logic]
    C --> D[Database Operation]
    D --> E[Log Entry Creation]
    
    E --> F[Audit Log Service]
    F --> G[Format Log Data]
    G --> H[Save to audit_logs table]
    
    H --> I[Log Structure]
    I --> J[timestamp: 2024-01-15T10:30:00Z]
    I --> K[user: admin@company.com]
    I --> L[action: create/update/delete]
    I --> M[resource: employee/attendance/payroll]
    I --> N[details: Created employee Nguyễn Văn An]
    I --> O[ipAddress: 192.168.1.100]
    
    P[Admin Views Logs] --> Q[GET /api/logs]
    Q --> R[Filter & Search]
    R --> S[Return Log Data]
    S --> T[Display in Logs Monitor]
```

---

## 📊 DASHBOARD DATA FLOW

```mermaid
flowchart TD
    A[User Login] --> B[Role Check]
    B --> C{User Role?}
    
    C -->|Admin/Manager| D[Admin Dashboard]
    C -->|Employee| E[Employee Portal]
    
    D --> F[GET /api/dashboard/stats]
    F --> G[Query Multiple Tables]
    G --> H[Calculate Statistics]
    H --> I[Return Dashboard Data]
    
    I --> J[Total Employees: 150]
    I --> K[Active Employees: 145]
    I --> L[Today Attendance: 142]
    I --> M[Pending Leaves: 8]
    I --> N[Monthly Payroll: 2.5B VND]
    
    E --> O[GET /api/employee/dashboard]
    O --> P[Employee Specific Data]
    P --> Q[Personal Attendance]
    P --> R[Personal Payroll]
    P --> S[Personal Tasks]
    P --> T[Personal Documents]
```

---

## 🔄 REAL-TIME FACE RECOGNITION FLOW

```mermaid
sequenceDiagram
    participant C as Camera
    participant F as Frontend
    participant B as Backend
    participant AI as Face Recognition AI
    participant D as Database

    C->>F: Video Stream
    F->>F: Capture Frame
    F->>B: POST /api/face-recognition/process
    Note over F,B: Base64 encoded image
    
    B->>AI: Process Image
    AI->>AI: Detect Faces
    AI->>AI: Extract Face Encoding
    
    AI->>D: Compare with Known Faces
    D-->>AI: Match Results
    
    AI-->>B: Recognition Result
    B->>B: Calculate Confidence
    B->>B: Check Business Rules
    
    B-->>F: Recognition Response
    F->>F: Update UI
    F->>F: Show Result
    
    Note over B: If confidence > 80%<br/>Record attendance
```

---

## 📋 API REQUEST/RESPONSE FLOW

```mermaid
flowchart TD
    A[Frontend Request] --> B[API Gateway]
    B --> C[Authentication Check]
    C --> D{JWT Valid?}
    
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F[Role Permission Check]
    
    F --> G{Permission OK?}
    G -->|No| H[403 Forbidden]
    G -->|Yes| I[Route to Controller]
    
    I --> J[Business Logic]
    J --> K[Database Query]
    K --> L[Data Processing]
    L --> M[Response Formatting]
    
    M --> N[200 Success Response]
    M --> O[Error Handling]
    
    N --> P[JSON Response]
    O --> Q[Error Response]
    
    P --> R[Frontend Update]
    Q --> S[Show Error Message]
```

---

## 🗄️ DATABASE RELATIONSHIPS

```mermaid
erDiagram
    USERS ||--o{ EMPLOYEES : "has"
    EMPLOYEES ||--o{ ATTENDANCE : "records"
    EMPLOYEES ||--o{ PAYROLL : "receives"
    EMPLOYEES ||--o{ LEAVES : "requests"
    EMPLOYEES ||--o{ TASKS : "assigned"
    EMPLOYEES ||--o{ FACE_ENCODINGS : "has"
    
    USERS {
        string id PK
        string email
        string password_hash
        string role
        datetime created_at
        datetime updated_at
    }
    
    EMPLOYEES {
        string id PK
        string user_id FK
        string first_name
        string last_name
        string email
        string phone
        string department
        string position
        decimal salary
        date hire_date
        string status
        json personal_info
        json employment_info
    }
    
    ATTENDANCE {
        string id PK
        string employee_id FK
        date date
        time check_in
        time check_out
        string status
        decimal hours_worked
        decimal overtime
        string recognition_type
        decimal confidence
    }
    
    PAYROLL {
        string id PK
        string employee_id FK
        string month
        decimal base_salary
        decimal overtime
        decimal bonuses
        decimal deductions
        decimal net_salary
        string status
    }
    
    LEAVES {
        string id PK
        string employee_id FK
        string type
        date start_date
        date end_date
        integer days
        string reason
        string status
        string approved_by
    }
    
    FACE_ENCODINGS {
        string id PK
        string employee_id FK
        blob face_encoding
        string image_path
        datetime created_at
    }
    
    AUDIT_LOGS {
        string id PK
        string user_id FK
        string action
        string resource
        text details
        string ip_address
        datetime timestamp
    }
```

---

## 🚀 DEPLOYMENT FLOW

```mermaid
flowchart TD
    A[Development] --> B[Code Review]
    B --> C[Testing]
    C --> D[Build Process]
    
    D --> E[Frontend Build]
    D --> F[Backend Build]
    
    E --> G[React Build]
    F --> H[Python Package]
    
    G --> I[Docker Frontend]
    H --> J[Docker Backend]
    
    I --> K[Container Registry]
    J --> K
    
    K --> L[Production Deployment]
    L --> M[Load Balancer]
    M --> N[Frontend Container]
    M --> O[Backend Container]
    M --> P[Database Container]
    
    N --> Q[Port 5173]
    O --> R[Port 5000]
    P --> S[Port 5432]
```

---

## 📱 USER JOURNEY FLOWS

### Admin Journey:
```
Login → Dashboard → Employee Management → Add Employee → Face Registration → Attendance Monitoring → Payroll Generation → Reports
```

### Manager Journey:
```
Login → Dashboard → Employee List → Attendance Management → Leave Approvals → Payroll Review → Reports
```

### Employee Journey:
```
Login → Employee Portal → Face Recognition Check-in → View Attendance → Request Leave → View Payroll → Personal Documents
```

---

## 🔧 ERROR HANDLING FLOW

```mermaid
flowchart TD
    A[API Request] --> B[Try Process]
    B --> C{Success?}
    
    C -->|Yes| D[Return Success Response]
    C -->|No| E[Error Type?]
    
    E -->|Validation Error| F[400 Bad Request]
    E -->|Authentication Error| G[401 Unauthorized]
    E -->|Permission Error| H[403 Forbidden]
    E -->|Not Found| I[404 Not Found]
    E -->|Server Error| J[500 Internal Server Error]
    
    F --> K[Return Error Details]
    G --> K
    H --> K
    I --> K
    J --> K
    
    K --> L[Frontend Error Handling]
    L --> M[Show User-Friendly Message]
    L --> N[Log Error for Debugging]
```

---

## 📊 MONITORING & LOGGING FLOW

```mermaid
flowchart TD
    A[System Activity] --> B[Log Generation]
    B --> C[Log Levels]
    
    C --> D[INFO: Normal Operations]
    C --> E[WARN: Potential Issues]
    C --> F[ERROR: System Errors]
    C --> G[DEBUG: Development Info]
    
    D --> H[Log Storage]
    E --> H
    F --> H
    G --> H
    
    H --> I[Database Logs]
    H --> J[File Logs]
    H --> K[External Monitoring]
    
    I --> L[Audit Trail]
    J --> M[System Monitoring]
    K --> N[Performance Metrics]
    
    L --> O[Admin Dashboard]
    M --> O
    N --> O
```

---

## 🎯 KEY INTEGRATION POINTS

### 1. **Face Recognition Integration**
- Camera input → Image processing → Face encoding → Database comparison → Attendance recording

### 2. **Role-Based Access Control**
- JWT token → Role validation → Permission check → API access

### 3. **Real-time Notifications**
- System events → Notification service → WebSocket → Frontend updates

### 4. **File Upload/Export**
- File selection → Upload to storage → Database reference → Download/Export

### 5. **Audit Trail**
- User actions → Log service → Database storage → Admin monitoring

---

## 📋 BACKEND IMPLEMENTATION PRIORITIES

### Phase 1 (Core Features):
1. **Authentication & Authorization**
2. **Employee CRUD Operations**
3. **Basic Attendance Management**
4. **Database Setup & Models**

### Phase 2 (Advanced Features):
1. **Face Recognition Integration**
2. **Payroll Calculation**
3. **Leave Management**
4. **Audit Logging**

### Phase 3 (Enhancement):
1. **Real-time Notifications**
2. **Advanced Reports**
3. **File Management**
4. **Performance Optimization**

---

## 🔗 API ENDPOINT SUMMARY

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Auth | `/api/auth/login` | POST | User authentication |
| Auth | `/api/auth/logout` | POST | User logout |
| Employees | `/api/employees` | GET | List employees |
| Employees | `/api/employees` | POST | Create employee |
| Employees | `/api/employees/:id` | PUT | Update employee |
| Employees | `/api/employees/:id` | DELETE | Delete employee |
| Attendance | `/api/attendance` | GET | Get attendance records |
| Attendance | `/api/attendance/face-recognition` | POST | Face recognition check-in |
| Payroll | `/api/payroll` | GET | Get payroll records |
| Payroll | `/api/payroll/calculate` | POST | Calculate payroll |
| Leaves | `/api/leaves` | GET | Get leave requests |
| Leaves | `/api/leaves` | POST | Create leave request |
| Dashboard | `/api/dashboard/stats` | GET | Get dashboard statistics |
| Logs | `/api/logs` | GET | Get audit logs |

---

**Backend team có thể sử dụng flow diagram này để hiểu rõ cách hệ thống hoạt động và implement API theo đúng logic!** 🚀
Hệ thống gồm 3 phần chính:

Thành phần	Công nghệ	Vai trò
Frontend	React (Port 5173)	Giao diện người dùng (nhân viên, quản lý, admin)
Backend API	Flask (Port 5000)	Xử lý logic nghiệp vụ, xác thực, tính toán, lưu trữ dữ liệu
Database	SQLite (hr_system.db)	Lưu dữ liệu nhân sự, chấm công, lương, đơn nghỉ, nhật ký hệ thống

Ngoài ra còn có các thành phần phụ:

Face Recognition (OpenCV) → dùng camera nhận diện khuôn mặt khi chấm công.

File Storage → lưu ảnh, tài liệu nhân viên.

Audit Logs → ghi lại hành động người dùng (ai tạo, sửa, xóa dữ liệu).

🔐 2️⃣ Quy trình xác thực đăng nhập (Authentication Flow)

Người dùng nhập email và mật khẩu trên giao diện (Frontend).

Gửi yêu cầu POST /api/auth/login đến Backend.

Backend kiểm tra tài khoản trong Database.

Nếu hợp lệ → Backend tạo JWT token và gửi lại cho Frontend.

Frontend lưu token vào localStorage và điều hướng theo vai trò:

Admin / Manager → /dashboard

Employee → /employee

Token này sẽ được dùng cho mọi API khác để xác định quyền truy cập.

👥 3️⃣ Quy trình quản lý nhân viên (Employee Management Flow)

Quản lý hoặc admin đăng nhập → vào trang danh sách nhân viên.

Có thể:

Xem chi tiết nhân viên.

Thêm mới nhân viên → gửi POST /api/employees.

Chỉnh sửa → cập nhật thông tin.

Xóa (Soft Delete) → đổi trạng thái “đã nghỉ”.

Xuất dữ liệu → PDF / Excel qua /api/employees/export.

Mọi thao tác đều được lưu vào CSDL và cập nhật lại UI.

⏰ 4️⃣ Quy trình chấm công bằng khuôn mặt (Attendance Management Flow)

Nhân viên mở cổng nhân viên → bật camera.

Hệ thống chụp ảnh, gửi đến /api/attendance/face-recognition.

AI xử lý ảnh → trích xuất mã nhận dạng khuôn mặt (face encoding).

So sánh với dữ liệu trong DB:

Nếu không khớp → báo “Không nhận diện được”.

Nếu khớp và độ chính xác > 80% → ghi công vào DB.

Hệ thống xác định là check-in hay check-out tùy thời điểm.

Trả về kết quả và hiển thị thông báo cho người dùng.

💰 5️⃣ Quy trình tính lương (Payroll Flow)

Quản lý chọn tháng và nhân viên cần tính lương.

Gửi yêu cầu POST /api/payroll/calculate.

Backend:

Lấy dữ liệu chấm công → tính lương cơ bản, làm thêm, thưởng, khấu trừ.

Áp dụng quy tắc thuế TNCN → tính lương thực nhận.

Lưu kết quả vào bảng PAYROLL.

Có thể xuất PDF / Excel hoặc gửi phiếu lương qua email.

📅 6️⃣ Quy trình xin nghỉ phép (Leave Request Flow)

Nhân viên gửi đơn nghỉ qua /api/leaves.

Backend lưu đơn và gửi thông báo cho Manager.

Manager xem danh sách đơn “pending” → có thể duyệt hoặc từ chối.

Backend cập nhật trạng thái đơn và thông báo lại cho nhân viên.

🔍 7️⃣ Ghi nhật ký hệ thống (Audit Log Flow)

Mọi hành động (tạo, sửa, xóa, đăng nhập, v.v.) sẽ:

Gửi qua Audit Log Service.

Ghi lại vào bảng AUDIT_LOGS với các thông tin:

timestamp – thời gian

user – người thực hiện

action – hành động

resource – loại tài nguyên (nhân viên, chấm công, lương, …)

details – mô tả chi tiết

ipAddress – địa chỉ IP

Admin có thể xem lại qua /api/logs.

📊 8️⃣ Dashboard (Trang tổng quan)

Khi người dùng đăng nhập, hệ thống kiểm tra role:

Admin/Manager → hiển thị số liệu tổng hợp (nhân viên, lương, nghỉ phép).

Employee → hiển thị dữ liệu cá nhân (chấm công, lương, hồ sơ).

API /api/dashboard/stats tổng hợp nhiều bảng để trả dữ liệu thống kê.

🧠 9️⃣ Nhận diện khuôn mặt theo thời gian thực (Real-time Recognition)

Camera gửi luồng video / ảnh base64 đến Backend.

AI xử lý: phát hiện khuôn mặt → mã hóa → so sánh → trả về độ chính xác.

Nếu vượt ngưỡng (80%) → tự động ghi công vào bảng ATTENDANCE.

🗄️ 🔢 10️⃣ Cấu trúc cơ sở dữ liệu

Bao gồm các bảng:

USERS – người dùng (đăng nhập)

EMPLOYEES – thông tin nhân viên

ATTENDANCE – dữ liệu chấm công

PAYROLL – lương

LEAVES – đơn nghỉ phép

FACE_ENCODINGS – dữ liệu khuôn mặt

AUDIT_LOGS – nhật ký hệ thống

→ Các bảng được liên kết theo employee_id, user_id (quan hệ 1-nhiều).

🚀 11️⃣ Quy trình triển khai (Deployment Flow)

Code được phát triển → review → test → build.

Frontend build React → Docker container (port 5173).

Backend build Flask → Docker container (port 5000).

Database (Postgres hoặc SQLite) container (port 5432).

Triển khai lên môi trường Production qua Load Balancer.

👣 12️⃣ Hành trình người dùng (User Journey)
Vai trò	Quy trình chính
Admin	Đăng nhập → Quản lý nhân viên → Đăng ký khuôn mặt → Theo dõi chấm công → Tạo lương → Báo cáo
Manager	Đăng nhập → Duyệt nghỉ phép → Theo dõi nhân viên → Xem lương phòng ban
Employee	Đăng nhập → Chấm công bằng khuôn mặt → Xem công → Gửi đơn nghỉ → Xem lương cá nhân
⚙️ 13️⃣ Xử lý lỗi (Error Handling Flow)

400 → Dữ liệu sai (Validation Error)

401 → Chưa đăng nhập

403 → Không có quyền

404 → Không tìm thấy dữ liệu

500 → Lỗi hệ thống

Frontend sẽ hiển thị thông báo thân thiện và Backend lưu log chi tiết để debug.

📊 14️⃣ Giám sát & Logging (Monitoring)

Hệ thống chia log theo cấp độ:

INFO: hoạt động bình thường

WARN: cảnh báo

ERROR: lỗi hệ thống

DEBUG: thông tin phục vụ phát triển

Các log được lưu vào:

Database (AUDIT_LOGS)

File logs (log.txt)

Hoặc công cụ giám sát bên ngoài (Prometheus, Grafana).

🎯 15️⃣ Các điểm tích hợp chính (Integration Points)

Face Recognition – Kết nối AI & camera để xác định danh tính.

RBAC – Xác thực bằng JWT và kiểm tra quyền truy cập.

Real-time Notifications – Dùng WebSocket để cập nhật trạng thái ngay lập tức.

File Management – Upload và xuất file tài liệu, báo cáo.

Audit Logging – Theo dõi mọi hành động của người dùng.

🧩 16️⃣ Ưu tiên triển khai Backend (Backend Implementation)
Giai đoạn	Tính năng chính
Phase 1	Đăng nhập, quản lý nhân viên, chấm công cơ bản, cấu trúc DB
Phase 2	Tích hợp nhận diện khuôn mặt, tính lương, nghỉ phép, audit log
Phase 3	Thông báo real-time, báo cáo nâng cao, quản lý file, tối ưu hiệu năngimage.png