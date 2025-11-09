# Face Recognition Backend API

Backend API cho hệ thống nhận diện khuôn mặt, chạy độc lập với frontend.

## Yêu cầu

- Python 3.8+
- Webcam/camera

## Cài đặt

1. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

## Chạy Backend

### Cách 1: Chạy trực tiếp
```bash
python face_recognition_api.py
```

### Cách 2: Sử dụng Docker
```bash
docker-compose up
```

Backend sẽ chạy tại: `http://localhost:5000`

## API Endpoints

- `GET /api/status` - Kiểm tra trạng thái hệ thống
- `POST /api/take-photos` - Chụp ảnh để đăng ký khuôn mặt
- `POST /api/train` - Huấn luyện model nhận diện
- `POST /api/recognize` - Bắt đầu nhận diện khuôn mặt
- `POST /api/stop` - Dừng quá trình hiện tại
- `GET /api/attendance/daily` - Lấy dữ liệu chấm công theo ngày
- `GET /api/attendance/range` - Lấy dữ liệu chấm công theo khoảng thời gian
- `GET /api/attendance/employee/<emp_id>` - Lấy dữ liệu chấm công của nhân viên
- `GET /api/attendance/stats` - Lấy thống kê chấm công

## Cấu trúc thư mục

- `face_recognition_api.py` - Flask API chính
- `face_recognition.py` - Script nhận diện khuôn mặt
- `take_photo.py` - Script chụp ảnh để training
- `train_model.py` - Script huấn luyện model
- `datasets/` - Thư mục chứa dữ liệu training
- `trainer/` - Thư mục chứa model đã train
- `attendance/` - Thư mục chứa dữ liệu chấm công
- `logs/` - Thư mục chứa log files
- `uploads/` - Thư mục chứa file upload

## Lưu ý

- Frontend kết nối đến backend qua `http://localhost:5000/api`
- Backend sử dụng CORS để cho phép frontend kết nối
- Đảm bảo camera đã được cấp quyền truy cập

