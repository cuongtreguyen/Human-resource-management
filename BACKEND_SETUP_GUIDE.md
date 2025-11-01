# Hướng dẫn chạy Backend Spring Boot

## 🚀 Cách chạy Backend (Spring Boot)

### 1. **Chuẩn bị môi trường:**
```bash
# Cài đặt Java 21 (theo pom.xml)
# Cài đặt Maven
# Cài đặt PostgreSQL
```

### 2. **Chạy Backend:**
```bash
# Mở terminal trong thư mục backend
cd /e:/SWP391-main/SWP391-main

# Chạy với Maven Wrapper
./mvnw spring-boot:run

# Hoặc chạy với Maven
mvn spring-boot:run
```

### 3. **Cấu hình Database:**
```properties
# Trong application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hr_management
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 4. **Chạy Database:**
```sql
-- Chạy file new.sql trong PostgreSQL
-- Tạo database hr_management
-- Import dữ liệu mẫu
```


## 🔗 Kết nối Frontend với Backend

### **Frontend (React):**
- Chạy trên `http://localhost:5173`
- Gọi API đến `http://localhost:8080`

### **Backend (Spring Boot):**
- Chạy trên `http://localhost:8080`
- Cung cấp API cho Face Recognition

## 📋 Checklist hoàn chỉnh:

### ✅ **Đã hoàn thành:**
1. **Frontend React** - Hoạt động với mock data
2. **Database Schema** - Đã thiết kế sẵn
3. **API Integration** - Đã chuẩn bị
4. **Face Recognition UI** - Đã có camera integration

### 🔄 **Cần làm tiếp:**
1. **Chạy Backend Spring Boot** - Port 8080
2. **Kết nối Database PostgreSQL**
3. **Implement Face Recognition APIs** trong Spring Boot
4. **Test integration** giữa Frontend và Backend

## 🎯 Kết luận:

**Bạn KHÔNG cần Python** cho dự án này! 
- Backend sử dụng **Spring Boot + Java**
- Face Recognition sử dụng **OpenCV Java**
- Chỉ cần chạy Spring Boot server là đủ

**Cách đơn giản nhất:**
1. Chạy PostgreSQL
2. Import database từ `new.sql`
3. Chạy `./mvnw spring-boot:run` trong thư mục backend
4. Frontend sẽ tự động kết nối với backend
