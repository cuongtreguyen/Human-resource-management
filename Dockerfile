# Multi-stage build để tối ưu kích thước image
# Stage 1: Build application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user non-root để chạy ứng dụng (security best practice)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR từ build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8085


# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]

