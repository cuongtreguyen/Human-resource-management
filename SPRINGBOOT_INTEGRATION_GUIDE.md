# Hướng dẫn tích hợp Face Recognition vào Spring Boot

## 🎯 **Tổng quan**

Tôi đã tích hợp thành công hệ thống face recognition Python vào dự án Spring Boot của bạn. Bây giờ bạn có thể chạy face recognition trực tiếp từ Spring Boot mà không cần Flask API riêng biệt.

## 🔧 **Những gì đã được tạo:**

### **1. Spring Boot Service & Controller**
- **`FaceRecognitionService.java`** - Service xử lý các chức năng face recognition
- **`FaceRecognitionController.java`** - REST API endpoints

### **2. Python Scripts Integration**
- Copy tất cả Python scripts vào `src/main/python/face_recog/`
- Tích hợp với Spring Boot qua ProcessBuilder

### **3. Frontend Updates**
- Cập nhật tất cả API calls từ port 5000 → 8081
- Sử dụng Spring Boot endpoints thay vì Flask

## 🚀 **Cách sử dụng:**

### **Bước 1: Khởi động Spring Boot**
```bash
cd "e:/SWP391-main/SWP391-main"
./mvnw spring-boot:run
```
Hoặc:
```bash
mvn spring-boot:run
```

### **Bước 2: Khởi động Frontend**
```bash
npm run dev
```

### **Bước 3: Truy cập Face Recognition**
- URL: `http://localhost:5173/face-recognition`
- API sẽ chạy trên: `http://localhost:8081`

## 📋 **API Endpoints mới:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/face-recognition/status` | Kiểm tra trạng thái hệ thống |
| `POST` | `/api/face-recognition/take-photos` | Chụp ảnh cho user mới |
| `POST` | `/api/face-recognition/train` | Training model |
| `POST` | `/api/face-recognition/recognize` | Nhận diện khuôn mặt |
| `POST` | `/api/face-recognition/stop` | Dừng process hiện tại |
| `POST` | `/api/face-recognition/recognition-success` | Callback khi nhận diện thành công |

## 🎨 **Tính năng:**

### **Register User Tab:**
- Nhập User ID và Full Name
- Click "Start Photo Capture"
- Hệ thống tự động chụp 50 ảnh

### **Train Model Tab:**
- Click "Train Model"
- Xử lý tất cả ảnh đã chụp

### **Recognize Tab:**
- Click "Start Face Recognition"
- Tự động detect và record attendance
- Auto-close sau khi nhận diện thành công

## 🔍 **Cấu trúc thư mục:**

```
SWP391-main/
├── src/main/java/com/se1873/js/springboot/project/
│   ├── service/FaceRecognitionService.java
│   └── controller/FaceRecognitionController.java
├── src/main/python/face_recog/
│   ├── take_photo.py
│   ├── train_model.py
│   ├── face_recognition.py
│   ├── datasets/
│   ├── trainer/
│   └── attendance/
└── src/main/resources/
    └── application.yaml (port: 8081)
```

## ⚙️ **Cấu hình:**

### **Spring Boot (application.yaml):**
```yaml
server:
  port: 8081
  address: 0.0.0.0
```

### **Frontend API Calls:**
- Tất cả calls đã được cập nhật từ `localhost:5000` → `localhost:8081`
- Endpoints: `/api/face-recognition/*`

## 🐛 **Troubleshooting:**

### **1. Python không được tìm thấy:**
```bash
# Kiểm tra Python
python --version

# Hoặc sử dụng python3
python3 --version
```

### **2. Port 8081 bị chiếm:**
```bash
# Kiểm tra port
netstat -an | findstr :8081

# Thay đổi port trong application.yaml
server:
  port: 8082
```

### **3. Python scripts không chạy:**
- Kiểm tra đường dẫn trong `FaceRecognitionService.java`
- Đảm bảo Python scripts có trong `src/main/python/face_recog/`

### **4. Camera permissions:**
- Cho phép browser truy cập camera
- Kiểm tra camera có hoạt động không

## 📊 **Lợi ích của tích hợp này:**

1. **Unified System** - Tất cả trong một Spring Boot application
2. **Database Integration** - Có thể tích hợp với PostgreSQL database
3. **Better Security** - Sử dụng Spring Security
4. **Scalability** - Dễ dàng mở rộng và maintain
5. **Professional** - Kiến trúc enterprise-grade

## 🎉 **Kết quả:**

Bây giờ bạn có một hệ thống face recognition hoàn chỉnh tích hợp trong Spring Boot:
- ✅ Không cần Flask API riêng biệt
- ✅ Tất cả chạy trên port 8081
- ✅ Tích hợp với database PostgreSQL
- ✅ Frontend React hoạt động hoàn hảo
- ✅ Professional architecture

---

**Hệ thống đã sẵn sàng để sử dụng! 🚀**
