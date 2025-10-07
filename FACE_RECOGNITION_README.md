# 🎯 Face Recognition System

Hệ thống chấm công bằng nhận diện khuôn mặt tích hợp với React frontend và Python backend, sử dụng SQLite database.

## 🚀 Tính năng

- ✅ **Đăng ký nhân viên** với ảnh khuôn mặt
- ✅ **Nhận diện khuôn mặt** real-time
- ✅ **Chấm công tự động** (Check In/Out)
- ✅ **Quản lý dữ liệu** với SQLite database
- ✅ **Giao diện web** responsive
- ✅ **Docker containerization**

## 📋 Yêu cầu hệ thống

- Docker Desktop
- Node.js 18+ (cho frontend)
- Python 3.9+ (cho backend)
- Webcam/Camera

## 🛠️ Cài đặt và chạy

### Cách 1: Sử dụng Docker (Khuyến nghị)

1. **Clone repository và vào thư mục:**
```bash
cd "D:\manager employer\human resource management\manager employer"
```

2. **Chạy script khởi động:**
```bash
# Windows
start-face-recognition.bat

# Linux/Mac
chmod +x start-face-recognition.sh
./start-face-recognition.sh
```

3. **Mở trình duyệt:**
- Frontend: http://localhost:5173
- API: http://localhost:5000

### Cách 2: Chạy thủ công

1. **Khởi động Python API:**
```bash
cd backend
pip install -r requirements.txt
python face_recognition_api_new.py
```

2. **Khởi động React frontend:**
```bash
npm install
npm run dev
```

## 📱 Hướng dẫn sử dụng

### 1. Đăng ký nhân viên

1. Mở trang **Face Recognition**
2. Chọn tab **"Register Employee"**
3. Điền thông tin:
   - Employee Code (VD: EMP001)
   - Full Name
   - Department
   - Position
4. Click **"Start Camera"**
5. Nhấn phím **'S'** để chụp ảnh (chụp ít nhất 3 ảnh)
6. Click **"Register Employee"**

### 2. Chấm công

1. Chọn tab **"Attendance"**
2. Click **"Start Camera"**
3. Click **"Check In"** hoặc **"Check Out"**
4. Hệ thống sẽ tự động nhận diện và ghi nhận chấm công

## 🔧 API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/status` | GET | Kiểm tra trạng thái API |
| `/api/register` | POST | Đăng ký nhân viên mới |
| `/api/recognize` | POST | Nhận diện khuôn mặt |
| `/api/employees` | GET | Danh sách nhân viên |
| `/api/attendance/today` | GET | Chấm công hôm nay |

## 📊 Cấu trúc Database

### Bảng `employees`
- `id`: ID tự động
- `employee_code`: Mã nhân viên
- `full_name`: Họ tên
- `department`: Phòng ban
- `position`: Chức vụ
- `face_encoding`: Mã hóa khuôn mặt (BLOB)
- `created_at`: Ngày tạo

### Bảng `attendance`
- `id`: ID tự động
- `employee_id`: ID nhân viên
- `date`: Ngày chấm công
- `check_in`: Giờ vào
- `check_out`: Giờ ra
- `status`: Trạng thái
- `confidence`: Độ tin cậy
- `created_at`: Ngày tạo

## 🐳 Docker Commands

```bash
# Build image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

## 🔍 Troubleshooting

### Lỗi camera không hoạt động
- Kiểm tra quyền truy cập camera trong trình duyệt
- Đảm bảo không có ứng dụng nào khác đang sử dụng camera
- Thử refresh trang web

### Lỗi API không kết nối
- Kiểm tra Docker có đang chạy không
- Kiểm tra port 5000 có bị chiếm không
- Xem logs: `docker-compose logs`

### Lỗi nhận diện kém
- Chụp nhiều ảnh từ các góc độ khác nhau
- Đảm bảo ánh sáng đủ
- Giữ khuôn mặt trong khung hình

## 📁 Cấu trúc thư mục

```
├── backend/
│   ├── face_recognition_api_new.py    # API chính
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                    # Docker config
│   └── data/                         # Database và models
├── src/
│   └── pages/
│       └── FaceRecognition.jsx       # Frontend component
├── docker-compose.yml                # Docker services
├── start-face-recognition.bat        # Windows startup script
└── start-face-recognition.sh         # Linux/Mac startup script
```

## 🎯 Workflow

1. **Đăng ký**: Nhân viên đăng ký với ảnh khuôn mặt
2. **Training**: Hệ thống tự động train model
3. **Recognition**: Nhận diện khuôn mặt real-time
4. **Attendance**: Tự động ghi nhận chấm công
5. **Database**: Lưu trữ dữ liệu vào SQLite

## 🔒 Bảo mật

- Dữ liệu khuôn mặt được mã hóa và lưu trữ local
- Không gửi ảnh lên server bên ngoài
- Database SQLite được bảo vệ trong container

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Docker logs: `docker-compose logs`
2. Browser console (F12)
3. Network tab để xem API calls
4. Camera permissions

---

**🎉 Chúc bạn sử dụng hệ thống thành công!**
