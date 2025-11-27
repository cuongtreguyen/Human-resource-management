FROM python:3.9-slim

WORKDIR /app

# Cài thư viện hệ thống cần cho OpenCV
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

# Cập nhật pip và cài dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gevent

# Cài Gunicorn
RUN pip install --no-cache-dir gunicorn

# Copy toàn bộ source code vào container
COPY . .

# Tạo các thư mục cần thiết
RUN mkdir -p attendance datasets uploads trainer faces logs

# Expose cổng Flask
EXPOSE 5000

# Lệnh chạy ứng dụng Flask bằng Gunicorn (4 worker)
CMD ["gunicorn", "-w", "4", "-k", "gevent", "-b", "0.0.0.0:5000", "--timeout", "300", "app:app"]

