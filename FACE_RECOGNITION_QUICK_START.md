# 🚀 Hướng dẫn nhanh - Face Recognition System

## 📋 **Các bước để chạy hệ thống chấm công bằng Face ID:**

### **Bước 1: Khởi động Python Backend**
```bash
# Mở Command Prompt hoặc PowerShell
cd "D:\Management Employee\Human-resource-management\src\main\face_recog"
python face_recognition_api.py
```

**Hoặc chạy file batch:**
```bash
# Từ thư mục gốc dự án
start-face-recognition-backend.bat
```

### **Bước 2: Khởi động React Frontend**
```bash
# Mở terminal khác
cd "D:\Management Employee\Human-resource-management"
npm run dev
```

### **Bước 3: Truy cập hệ thống**
1. **Mở trình duyệt**: http://localhost:5177
2. **Đăng nhập**:
   - Email: `admin@company.com`
   - Password: `admin123`
3. **Vào Face Recognition**: Click "Face Recognition Portal" trong sidebar

### **Bước 4: Sử dụng chấm công**

#### **4.1 Đăng ký nhân viên mới:**
1. Vào tab **"Đăng ký nhân viên"**
2. Nhập thông tin:
   - Mã nhân viên: `001`
   - Họ và tên: `Nguyễn Văn A`
   - Phòng ban: `IT`
   - Chức vụ: `Developer`
3. Click **"Khởi động camera"**
4. Nhấn phím **'s'** để chụp ảnh (chụp 10-20 ảnh từ các góc khác nhau)
5. Click **"Đăng ký nhân viên"**

#### **4.2 Huấn luyện mô hình:**
1. Vào tab **"Huấn luyện mô hình"**
2. Click **"Huấn luyện mô hình"**
3. Chờ quá trình hoàn thành

#### **4.3 Chấm công:**
1. Vào tab **"Chấm công"**
2. Click **"Khởi động camera"**
3. Đưa khuôn mặt vào camera
4. Click **"Chấm công"**
5. Hệ thống sẽ tự động nhận diện và ghi nhận thời gian

### **Bước 5: Xem báo cáo**
- Vào tab **"Báo cáo hôm nay"** để xem danh sách chấm công

## 🔧 **Troubleshooting**

### **Lỗi không kết nối được Python API:**
```bash
# Kiểm tra Python đã cài đặt
python --version

# Cài đặt dependencies
pip install flask opencv-python pillow numpy requests werkzeug

# Khởi động lại API
python face_recognition_api.py
```

### **Lỗi camera không hoạt động:**
- Kiểm tra quyền truy cập camera trong trình duyệt
- Đảm bảo không có ứng dụng khác đang sử dụng camera
- Thử refresh trang (F5)

### **Lỗi nhận diện không chính xác:**
- Chụp nhiều ảnh hơn (20-30 ảnh)
- Chụp từ các góc độ khác nhau
- Đảm bảo ánh sáng đủ
- Huấn luyện lại mô hình

## 📱 **URLs quan trọng:**
- **Frontend**: http://localhost:5177
- **Python API**: http://localhost:5000
- **Face Recognition**: http://localhost:5177/face-recognition-portal

## 🎯 **Tài khoản test:**
- **Admin**: admin@company.com / admin123
- **Manager**: manager@company.com / manager123
- **Employee**: employee@company.com / employee123

## ✅ **Kiểm tra hệ thống hoạt động:**
1. Python API chạy trên port 5000
2. React app chạy trên port 5177
3. Có thể đăng nhập và vào Face Recognition Portal
4. Camera hoạt động bình thường
5. Có thể chụp ảnh và đăng ký nhân viên

**🎉 Hệ thống sẵn sàng cho chấm công bằng Face ID!**
