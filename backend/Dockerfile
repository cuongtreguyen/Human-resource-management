# 1️⃣ Base image Python 3.10
FROM python:3.10-bullseye

# 2️⃣ Cài gói hệ thống cần thiết
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gfortran \
    libatlas-base-dev \
    liblapack-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
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
    python3-dev \
 && python -m pip install --upgrade pip setuptools wheel \
 && rm -rf /var/lib/apt/lists/*

# 3️⃣ Cài dlib bằng wheel (không build từ source)
RUN pip install --no-cache-dir dlib==19.24.0

# 4️⃣ Copy requirements.txt và cài package khác
COPY requirements.txt .
# Đảm bảo Pillow phiên bản ổn định với Python 3.10
RUN pip install --no-cache-dir -r requirements.txt --use-pep517

# 5️⃣ Copy toàn bộ source code
COPY . /app
WORKDIR /app

# 6️⃣ Lệnh chạy ứng dụng
CMD ["python", "app.py"]
