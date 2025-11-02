# Hướng Dẫn Tách Backend và Frontend

Dự án đã được tách thành 2 phần độc lập: **Frontend (React)** và **Backend (Python Flask)**.

## 📁 Cấu Trúc Mới

```
Human-resource-management/
├── backend/                    # Python Backend (CHẠY ĐỘC LẬP)
│   ├── face_recognition_api.py
│   ├── face_recognition.py
│   ├── take_photo.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── README.md
│   ├── datasets/
│   ├── trainer/
│   ├── attendance/
│   └── logs/
│
├── src/                        # React Frontend (CHẠY ĐỘC LẬP)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── package.json               # Frontend dependencies
├── docker-compose.yml         # Docker setup cho backend
├── start-face-recognition-backend.bat  # Windows script
└── start-face-recognition-backend.sh  # Linux/Mac script
```

## 🚀 Cách Chạy

### Frontend (React)

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

### Backend (Python Flask)

**Cách 1: Dùng script (Khuyến nghị)**

Windows:
```bash
start-face-recognition-backend.bat
```

Linux/Mac:
```bash
chmod +x start-face-recognition-backend.sh
./start-face-recognition-backend.sh
```

**Cách 2: Chạy thủ công**

```bash
cd backend
pip install -r requirements.txt
python face_recognition_api.py
```

**Cách 3: Dùng Docker**

```bash
docker-compose up
```

Backend chạy tại: `http://localhost:5000`

## 🔌 Kết Nối

- Frontend tự động kết nối đến backend qua `http://localhost:5000/api`
- Backend sử dụng CORS để cho phép frontend kết nối
- Cả 2 có thể chạy trên các terminal/process riêng biệt

## ✅ Lưu Ý

1. **Backend và Frontend chạy độc lập**: Bạn có thể khởi động/ dừng từng phần riêng biệt
2. **Code không thay đổi**: Tất cả code Python đã được di chuyển nguyên vẹn, không sửa đổi
3. **Dữ liệu được giữ nguyên**: Các thư mục `datasets/`, `trainer/`, `attendance/` đã được di chuyển cùng backend
4. **Ports cố định**: 
   - Frontend: 5173 (Vite default)
   - Backend: 5000 (Flask default)

## 🛠️ Troubleshooting

### Backend không khởi động
- Kiểm tra Python đã được cài đặt: `python --version`
- Cài đặt dependencies: `pip install -r backend/requirements.txt`
- Kiểm tra port 5000 đã được sử dụng chưa

### Frontend không kết nối được backend
- Đảm bảo backend đang chạy tại `http://localhost:5000`
- Kiểm tra CORS đã được bật trong backend (đã có sẵn)
- Xem console của browser để kiểm tra lỗi kết nối

### Lỗi import trong Python
- Đảm bảo đang chạy từ thư mục `backend/`
- Các đường dẫn trong code sử dụng relative paths, sẽ tự động đúng khi chạy từ thư mục backend

