package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name:hrm-attachments}")
    private String bucketName;

    @Value("${aws.region:ap-southeast-1}")
    private String region;

    /**
     * Upload file lên S3
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

        log.info("Uploading file to S3: bucket={}, key={}", bucketName, key);

        // Upload lên S3
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Trả về URL public (nếu bucket public) hoặc key để tạo presigned URL
        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);

        log.info("File uploaded successfully: {}", fileUrl);
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

        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);

        log.info("File uploaded successfully: {}", fileUrl);
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

        // Sử dụng S3Presigner để tạo presigned URL
        // Note: Cần thêm S3Presigner bean nếu cần presigned URL
        // Tạm thời trả về URL trực tiếp
        return fileUrl;
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

    /**
     * Lấy bucket name
     */
    public String getBucketName() {
        return bucketName;
    }
}
