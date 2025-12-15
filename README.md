# Human Resource Management System - Frontend

Hệ thống quản lý nhân sự toàn diện với tính năng **Chấm công bằng nhận diện khuôn mặt** và **Kanban Board (Trello-style)**.

## 🎯 Tổng quan dự án

Đây là phần **Frontend** của hệ thống HRM, được xây dựng bằng React 19 và các công nghệ hiện đại. Hệ thống hỗ trợ 4 vai trò người dùng với các quyền hạn khác nhau.

### Vai trò người dùng

| Vai trò | Mô tả | Trang chính |
|---------|-------|-------------|
| **Admin** | Quản trị viên hệ thống | Dashboard, Quản lý NV, Chấm công |
| **Manager** | Quản lý | Dashboard, Duyệt OT, Kanban |
| **Accountant** | Kế toán | Dashboard, Bảng lương, Báo cáo |
| **Employee** | Nhân viên | Portal cá nhân, Chấm công, Đăng ký OT |

---

## 🛠️ Công nghệ sử dụng

### Core Framework
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **React** | 19.1.1 | Thư viện UI chính, sử dụng Concurrent Features |
| **Vite** | (Rolldown) | Build tool siêu nhanh, HMR tức thì |
| **React Router DOM** | 7.9.2 | Điều hướng SPA (Single Page Application) |

### Styling & UI
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **TailwindCSS** | 3.4.17 | Utility-first CSS framework |
| **Framer Motion** | 12.23.21 | Animation library cho React |
| **Lucide React** | 0.544.0 | Icon library (hơn 1000 icons) |
| **React Icons** | 5.5.0 | Icon library bổ sung |
| **Bootstrap** | 5.3.8 | CSS framework (dùng một số components) |

### State Management & Data Fetching
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **React Context** | (built-in) | Global state management |
| **TanStack Query** | 5.90.2 | Server state management, caching |
| **Axios** | 1.12.2 | HTTP client cho API calls |

### Drag & Drop (Kanban Board)
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **@dnd-kit/core** | 6.3.1 | Drag and drop core library |
| **@dnd-kit/sortable** | 10.0.0 | Sortable list functionality |
| **@dnd-kit/utilities** | 3.2.2 | Utility functions |

### Calendar & Date
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **FullCalendar** | 6.1.19 | Calendar component (daygrid, interaction) |
| **Day.js** | 1.11.18 | Date manipulation library |

### Charts & Visualization
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **Recharts** | 3.2.1 | Charting library cho React |

### Notifications
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **React Toastify** | 11.0.5 | Toast notifications (backup) |

### Utilities
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **class-variance-authority** | 0.7.1 | CSS class variants |
| **tailwind-merge** | 3.3.1 | Merge Tailwind classes |
| **React Helmet** | 6.1.0 | Document head management |

---

## 📁 Cấu trúc thư mục

```
src/
├── assets/                    # Hình ảnh, icons tĩnh
├── components/                # Components tái sử dụng
│   ├── attendance/           # Components chấm công
│   │   └── AttendanceDetailsModal.jsx
│   ├── common/               # Components dùng chung
│   │   ├── modal/           # Modal components
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/            # Components dashboard
│   │   ├── StatsCard.jsx
│   │   ├── AttendanceRate.jsx
│   │   ├── DepartmentDistribution.jsx
│   │   └── DashboardCharts.jsx
│   ├── employee/             # Components nhân viên
│   ├── evaluation/           # Components đánh giá
│   ├── features/             # Components tính năng đặc biệt
│   │   ├── FaceRecognitionWidget.jsx
│   │   └── DelegationDetailModal.jsx
│   ├── kanban/               # Components Kanban board
│   │   └── AddListWidget.jsx
│   ├── layout/               # Layout components
│   │   ├── Layout.jsx       # Layout cho Admin/Manager/Accountant
│   │   ├── EmployeeLayout.jsx
│   │   └── Sidebar.jsx
│   ├── overtime/             # Components tăng ca
│   │   ├── OTStatusBadge.jsx
│   │   ├── QuotaIndicator.jsx
│   │   └── TaskSelector.jsx
│   ├── payroll/              # Components bảng lương
│   ├── task/                 # Components task management
│   └── ui/                   # UI primitives
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       └── Select.jsx
│
├── config/                   # Cấu hình
│   └── evaluationConfig.js
│
├── constants/                # Hằng số
│   └── leaveTypes.js
│
├── context/                  # React Context providers
│   ├── OTContext.jsx        # Quản lý state OT
│   ├── TaskContext.jsx      # Quản lý state Task
│   └── KanbanContext.jsx    # Quản lý state Kanban
│
├── pages/                    # Các trang chính
│   ├── admin/               # Trang Admin
│   │   ├── EmployeeList.jsx
│   │   └── AdminSupportTickets.jsx
│   ├── attendance/          # Trang chấm công
│   │   ├── AttendanceList.jsx
│   │   └── AttendanceCreate.jsx
│   ├── employee/            # Trang Employee
│   │   ├── Attendance.jsx   # Chấm công cá nhân
│   │   ├── OTRequest.jsx    # Đăng ký OT
│   │   ├── OTReport.jsx     # Báo cáo OT
│   │   ├── EmployeeDetails.jsx
│   │   └── SupportHelp.jsx
│   ├── evaluation/          # Trang đánh giá
│   ├── face-recognition/    # Trang nhận diện khuôn mặt
│   │   ├── FaceRecognition.jsx      # Admin
│   │   ├── FaceRecognitionManager.jsx
│   │   ├── FaceRecognitionAccountant.jsx
│   │   └── FaceRecognitionPortal.jsx
│   ├── kanban/              # Trang Kanban board
│   │   └── KanbanBoard.jsx
│   ├── leave/               # Trang nghỉ phép
│   ├── login/               # Trang đăng nhập
│   │   └── Login.jsx
│   ├── overtime/            # Trang quản lý OT
│   │   ├── OTManagement.jsx # Manager duyệt OT
│   │   └── OTPayroll.jsx
│   ├── payroll/             # Trang bảng lương
│   └── recruitment/         # Trang tuyển dụng
│
├── services/                 # API services
│   ├── config.js            # Cấu hình API endpoints
│   ├── faceRecognitionApi.js # API nhận diện khuôn mặt
│   ├── attendanceApi.js     # API chấm công
│   ├── employeeService.js   # API nhân viên
│   ├── overtimeService.js   # API tăng ca
│   ├── kanbanService.js     # API Kanban
│   ├── leaveService.js      # API nghỉ phép
│   └── fakeApi.js           # Mock data cho development
│
├── styles/                   # CSS styles
│   └── index.css            # Global styles + Tailwind imports
│
├── utils/                    # Utility functions
│   ├── auth.js              # Authentication helpers
│   ├── cn.js                # Class name utility
│   └── systemLogger.js      # Logging utility
│
├── App.jsx                   # Root component + Routes
└── main.jsx                  # Entry point
```

---

## 🚀 Chức năng chính

### 1. 👤 Nhận diện khuôn mặt (Face Recognition)

**Mô tả**: Hệ thống chấm công tự động bằng nhận diện khuôn mặt.

**Luồng hoạt động**:
```
1. Admin đăng ký khuôn mặt nhân viên (chụp 30 ảnh)
2. Hệ thống train model LBPH
3. Nhân viên chấm công bằng camera
4. Hệ thống nhận diện và ghi nhận giờ vào/ra
```

**Files liên quan**:
- `src/pages/face-recognition/FaceRecognition.jsx` - Trang chính
- `src/services/faceRecognitionApi.js` - API calls
- `src/pages/employee/Attendance.jsx` - Chấm công employee

### 2. 📋 Kanban Board (Trello-style)

**Mô tả**: Quản lý công việc theo phương pháp Kanban.

**Cấu trúc**:
```
Board (Dự án)
└── List (Cột: To Do, In Progress, Done)
    └── Card (Thẻ công việc)
        ├── Assignees (Người thực hiện)
        ├── Labels (Nhãn)
        ├── Due Date (Hạn)
        └── Checklist
```

**Files liên quan**:
- `src/pages/kanban/KanbanBoard.jsx` - Trang Kanban
- `src/context/KanbanContext.jsx` - State management
- `src/services/kanbanService.js` - API calls
- `src/components/kanban/` - Components

### 3. ⏰ Quản lý Tăng ca (OT Management)

**Mô tả**: Đăng ký và duyệt yêu cầu tăng ca.

**Luồng**:
```
Employee đăng ký OT → Manager duyệt → Accountant tính lương
```

**Files liên quan**:
- `src/pages/employee/OTRequest.jsx` - Đăng ký OT
- `src/pages/overtime/OTManagement.jsx` - Manager duyệt
- `src/context/OTContext.jsx` - State management
- `src/services/overtimeService.js` - API calls

### 4. 💰 Quản lý Bảng lương (Payroll)

**Mô tả**: Tính toán và quản lý lương nhân viên.

**Files liên quan**:
- `src/pages/payroll/PayrollDetails.jsx`
- `src/components/payroll/PayrollDetailsModal.jsx`

### 5. 📊 Dashboard & Reports

**Mô tả**: Tổng quan và báo cáo hệ thống.

**Files liên quan**:
- `src/pages/Dashboard.jsx`
- `src/components/dashboard/`
- `src/pages/Reports.jsx`

---

## 🔧 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 16.x
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục
cd Human-resource-management

# Cài đặt dependencies
npm install
```

### Chạy Development

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### Build Production

```bash
npm run build
```

Output sẽ nằm trong thư mục `dist/`

---

## ⚙️ Cấu hình

### API Endpoints

File: `src/services/config.js`

```javascript
export const JAVA_API = 'http://localhost:8085/api';  // Java Spring Boot
export const PY_API = 'http://localhost:5000';        // Python Flask
```

### Environment Variables

Tạo file `.env`:

```env
VITE_JAVA_API_URL=http://localhost:8085/api
VITE_PYTHON_API_URL=http://localhost:5000
VITE_APP_NAME=HR Management System
```

---

## 🔗 Kết nối Backend

Hệ thống frontend kết nối với 2 backend:

### 1. Java Spring Boot (Port 8085)
- Quản lý nhân viên, user
- Chấm công (lưu DB)
- Kanban board
- OT management
- Payroll
- Authentication

### 2. Python Flask (Port 5000)
- Face Recognition (OpenCV + LBPH)
- Chấm công realtime (lưu JSON)
- Upload ảnh lên S3

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Python Flask   │────▶│   AWS S3        │
│   (React)       │     │  (Port 5000)    │     │   (Storage)     │
│   Port 5173     │     └────────┬────────┘     └─────────────────┘
│                 │              │
│                 │              ▼
│                 │────▶┌─────────────────┐     ┌─────────────────┐
│                 │     │  Java Spring    │────▶│   MySQL         │
└─────────────────┘     │  (Port 8085)    │     │   (Database)    │
                        └─────────────────┘     └─────────────────┘
```

---

## 📱 Responsive Design

Hệ thống hỗ trợ các breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🎨 Theme & Colors

### Màu theo vai trò

| Vai trò | Primary Color | Gradient |
|---------|---------------|----------|
| Admin | Blue | `from-blue-500 to-blue-600` |
| Manager | Purple | `from-purple-600 to-purple-700` |
| Accountant | Emerald | `from-emerald-600 to-emerald-700` |
| Employee | Orange | `from-orange-500 to-orange-600` |

---

## 📝 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # Kiểm tra code với ESLint
```

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

## 📄 License

MIT License

---

**Xây dựng bởi nhóm phát triển HRM System**
