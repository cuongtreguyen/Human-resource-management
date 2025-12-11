package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name:hrm-attachments}")
    private String bucketName;

    /**
     * Upload file lên S3 - Tối ưu cho file lớn
     * @param file MultipartFile từ request
     * @param folder Thư mục trong bucket (vd: "kanban/attachments")
     * @return URL của file trên S3
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Tạo unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Key = folder/filename
        String key = folder + "/" + uniqueFilename;

        long fileSize = file.getSize();
        log.info("Uploading file to S3: bucket={}, key={}, size={} bytes ({} MB)", 
                bucketName, key, fileSize, fileSize / (1024 * 1024));

        long startTime = System.currentTimeMillis();

        // Upload lên S3 với tối ưu cho file lớn
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(fileSize)
                // Tối ưu metadata
                .metadata(java.util.Map.of(
                        "original-filename", originalFilename != null ? originalFilename : "unknown",
                        "upload-timestamp", String.valueOf(System.currentTimeMillis())
                ))
                .build();

        // Sử dụng RequestBody.fromInputStream với buffer tối ưu
        // Đối với file lớn, nên stream trực tiếp thay vì load toàn bộ vào memory
        try (java.io.InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, fileSize));
        }

        long endTime = System.currentTimeMillis();
        double uploadTimeSeconds = (endTime - startTime) / 1000.0;
        double uploadSpeedMBps = (fileSize / (1024.0 * 1024.0)) / uploadTimeSeconds;

        // Lấy region từ S3Client để đảm bảo đồng bộ
        String region = s3Client.serviceClientConfiguration().region().toString();
        
        // Trả về URL public (nếu bucket public) hoặc key để tạo presigned URL
        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);

        log.info("File uploaded successfully: {} (Time: {}s, Speed: {:.2f} MB/s, Region: {})", 
                fileUrl, uploadTimeSeconds, uploadSpeedMBps, region);
        return fileUrl;
    }

    /**
     * Upload file với tên cụ thể
     */
    public String uploadFile(MultipartFile file, String folder, String filename) throws IOException {
        String key = folder + "/" + filename;

        log.info("Uploading file to S3: bucket={}, key={}", bucketName, key);

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Lấy region từ S3Client để đảm bảo đồng bộ
        String region = s3Client.serviceClientConfiguration().region().toString();
        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);

        log.info("File uploaded successfully: {} (Region: {})", fileUrl, region);
        return fileUrl;
    }

    /**
     * Xóa file từ S3
     * @param fileUrl URL của file hoặc key
     */
    public void deleteFile(String fileUrl) {
        // Extract key từ URL
        String key = extractKeyFromUrl(fileUrl);

        log.info("Deleting file from S3: bucket={}, key={}", bucketName, key);

        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(deleteRequest);

        log.info("File deleted successfully: {}", key);
    }

    /**
     * Tạo presigned URL để download file (có thời hạn)
     * @param fileUrl URL của file hoặc key
     * @param expirationMinutes Thời gian hết hạn (phút)
     * @return Presigned URL
     */
    public String getPresignedUrl(String fileUrl, int expirationMinutes) {
        String key = extractKeyFromUrl(fileUrl);

        log.info("Generating presigned URL for: bucket={}, key={}, expiration={} minutes", bucketName, key, expirationMinutes);

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(expirationMinutes))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
        String presignedUrl = presignedRequest.url().toString();

        log.info("Presigned URL generated successfully: {}", presignedUrl);
        return presignedUrl;
    }

    /**
     * Kiểm tra file có tồn tại không
     */
    public boolean fileExists(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);

            HeadObjectRequest headRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.headObject(headRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }

    /**
     * Lấy key từ S3 URL
     */
    private String extractKeyFromUrl(String fileUrl) {
        if (fileUrl == null) return "";

        // Nếu là full URL: https://bucket.s3.region.amazonaws.com/folder/file.ext
        if (fileUrl.contains("amazonaws.com/")) {
            return fileUrl.substring(fileUrl.indexOf("amazonaws.com/") + 14);
        }

        // Nếu là key trực tiếp
        return fileUrl;
    }

}
