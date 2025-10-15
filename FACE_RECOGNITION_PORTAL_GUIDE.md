# 🎯 Face Recognition Portal - Hướng dẫn sử dụng

## 📋 Tổng quan
Face Recognition Portal là giao diện web hiện đại để quản lý hệ thống nhận diện khuôn mặt và chấm công sinh trắc học, được tích hợp với Python backend.

## 🚀 Khởi động hệ thống

### Cách 1: Sử dụng Docker (Khuyến nghị)
```bash
# Windows
start-face-recognition.bat

# Linux/Mac
./start-face-recognition.sh
```

### Cách 2: Khởi động thủ công
```bash
# Windows
start-face-recognition-backend.bat

# Linux/Mac
./start-face-recognition-backend.sh
```

## 🌐 Truy cập giao diện

1. **Frontend React**: http://localhost:5173
2. **Python API**: http://localhost:5000
3. **Face Recognition Portal**: http://localhost:5173/face-recognition-portal

## 📱 Sử dụng giao diện

### 1. Đăng nhập
- Truy cập: http://localhost:5173
- Đăng nhập với tài khoản:
  - **Admin**: admin@company.com / admin123
  - **Manager**: manager@company.com / manager123
  - **Employee**: employee@company.com / employee123

### 2. Truy cập Face Recognition Portal
- Sau khi đăng nhập, truy cập: `/face-recognition-portal`
- Hoặc click vào menu "Face Recognition Portal"

## 🎯 Các chức năng chính

### Tab 1: Register User (Đăng ký người dùng)
1. **Nhập thông tin**:
   - User ID: Số từ 1-10000
   - Full Name: Tên đầy đủ

2. **Chụp ảnh**:
   - Click "Start Camera"
   - Nhấn phím 's' để chụp ảnh
   - Chụp nhiều góc độ khác nhau

3. **Dừng camera**:
   - Click "Stop Camera"

### Tab 2: Train Model (Huấn luyện mô hình)
1. **Cảnh báo**: Quá trình có thể mất thời gian
2. **Click "Start Training"** để bắt đầu huấn luyện
3. **Chờ hoàn thành** trước khi sử dụng nhận diện

### Tab 3: Recognize (Nhận diện)
1. **Clock In**: Chấm công vào
2. **Clock Out**: Chấm công ra
3. **Stop Recognition**: Dừng nhận diện

## 🔧 Cấu trúc hệ thống

### Frontend (React)
- `src/pages/FaceRecognitionPortal.jsx` - Giao diện chính
- `src/services/faceRecognitionPortalApi.js` - API service
- `src/Routes.jsx` - Định tuyến

### Backend (Python Flask)
- `src/main/face_recog/face_recognition_api.py` - Flask API
- `src/main/face_recog/take_photo.py` - Chụp ảnh
- `src/main/face_recog/train_model.py` - Huấn luyện
- `src/main/face_recog/face_recognition.py` - Nhận diện

## 📊 API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/status` | GET | Kiểm tra trạng thái hệ thống |
| `/api/take-photos` | POST | Bắt đầu chụp ảnh |
| `/api/train` | POST | Huấn luyện mô hình |
| `/api/recognize` | POST | Bắt đầu nhận diện |
| `/api/stop` | POST | Dừng quá trình |

## 🎨 Giao diện

### Sidebar trái
- **System Status**: Hiển thị trạng thái real-time
- **Instructions**: Hướng dẫn 4 bước sử dụng
- **Face Recognition Card**: Logo và thông tin hệ thống

### Main Content
- **Tab Navigation**: 3 tab chính
- **Dynamic Content**: Nội dung thay đổi theo tab
- **Control Buttons**: Các nút điều khiển

## 🔍 Troubleshooting

### Lỗi kết nối API
```bash
# Kiểm tra Python backend
curl http://localhost:5000/api/status

# Kiểm tra logs
docker-compose logs
```

### Lỗi camera
- Kiểm tra quyền truy cập camera
- Đảm bảo không có ứng dụng khác đang sử dụng camera

### Lỗi training
- Đảm bảo đã chụp đủ ảnh (ít nhất 10-20 ảnh)
- Kiểm tra thư mục `datasets/` có dữ liệu

## 📁 Cấu trúc thư mục

```
src/
├── main/face_recog/
│   ├── face_recognition_api.py
│   ├── take_photo.py
│   ├── train_model.py
│   ├── face_recognition.py
│   ├── datasets/          # Ảnh đã chụp
│   ├── trainer/           # Mô hình đã huấn luyện
│   └── attendance/        # Dữ liệu chấm công
├── pages/
│   └── FaceRecognitionPortal.jsx
└── services/
    └── faceRecognitionPortalApi.js
```

## 🎉 Tính năng nổi bật

✅ **Giao diện hiện đại** - Thiết kế giống hình ảnh bạn cung cấp
✅ **Real-time status** - Cập nhật trạng thái real-time
✅ **Multi-tab interface** - 3 tab chức năng chính
✅ **Python integration** - Tích hợp hoàn chỉnh với Python backend
✅ **Responsive design** - Tương thích mọi thiết bị
✅ **Error handling** - Xử lý lỗi thân thiện
✅ **Loading states** - Hiển thị trạng thái loading

## 🚀 Sẵn sàng sử dụng!

Hệ thống Face Recognition Portal đã được tích hợp hoàn chỉnh và sẵn sàng sử dụng. Bạn có thể:

1. Khởi động hệ thống bằng script
2. Truy cập giao diện web
3. Đăng ký nhân viên mới
4. Huấn luyện mô hình
5. Sử dụng chấm công sinh trắc học

🎯 **Giao diện hoàn toàn giống như hình ảnh bạn đã cung cấp!**
