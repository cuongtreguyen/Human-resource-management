FROM python:3.9-slim

WORKDIR /app

# Cài đặt thư viện hệ thống cần cho OpenCV & các dependency
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgtk-3-0 \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    python3-dev \
    python3-numpy \
    && rm -rf /var/lib/apt/lists/*

# Copy file requirements
COPY requirements.txt .

# Cài Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code vào container
COPY . .

# Tạo các thư mục cần thiết
RUN mkdir -p attendance datasets uploads trainer faces logs

# Expose cổng Flask
EXPOSE 5000

# Lệnh chạy ứng dụng Flask
CMD ["python", "app.py"]
