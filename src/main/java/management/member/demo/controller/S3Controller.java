package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import management.member.demo.dto.*;
import management.member.demo.mapper.S3Mapper;
import management.member.demo.service.S3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@Tag(name = "S3", description = "S3 file management endpoints")
public class S3Controller {

    private final S3Service s3Service;
    private final S3Mapper s3Mapper;

    @PostMapping("/upload")
    @Operation(summary = "Upload file to S3", description = "Upload một file lên S3 bucket")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Upload successful"),
            @ApiResponse(responseCode = "400", description = "Invalid file"),
            @ApiResponse(responseCode = "500", description = "Upload failed")
    })
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        
        try {
            if (file.isEmpty()) {
                S3ErrorResponseDTO errorResponse = s3Mapper.toErrorResponse("File is empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            log.info("Uploading file to S3: filename={}, size={}, folder={}", 
                    file.getOriginalFilename(), file.getSize(), folder);
            
            String fileUrl = s3Service.uploadFile(file, folder);
            S3UploadResponseDTO response = s3Mapper.toUploadResponse(fileUrl, file, folder);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("S3 upload failed: {}", e.getMessage(), e);
            S3ErrorResponseDTO errorResponse = s3Mapper.toErrorResponse("Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error during S3 upload: {}", e.getMessage(), e);
            S3ErrorResponseDTO errorResponse = s3Mapper.toErrorResponse("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete file from S3", description = "Xóa file từ S3 bucket")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Delete successful"),
            @ApiResponse(responseCode = "400", description = "Invalid file URL"),
            @ApiResponse(responseCode = "500", description = "Delete failed")
    })
    public ResponseEntity<?> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        try {
            log.info("Deleting file from S3: {}", fileUrl);
            
            s3Service.deleteFile(fileUrl);
            S3DeleteResponseDTO response = s3Mapper.toDeleteResponse(fileUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", e.getMessage(), e);
            S3ErrorResponseDTO errorResponse = s3Mapper.toErrorResponse("Delete failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/check")
    @Operation(summary = "Check if file exists", description = "Kiểm tra file có tồn tại trong S3 không")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Check completed")
    })
    public ResponseEntity<?> checkFile(@RequestParam("fileUrl") String fileUrl) {
        try {
            log.info("Checking file existence: {}", fileUrl);
            
            boolean exists = s3Service.fileExists(fileUrl);
            S3CheckResponseDTO response = s3Mapper.toCheckResponse(fileUrl, exists);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error checking file: {}", e.getMessage(), e);
            S3ErrorResponseDTO errorResponse = s3Mapper.toErrorResponse("Error checking file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/presigned-url")
    @Operation(summary = "Generate presigned URL", description = "Tạo presigned URL để download file (có thời hạn)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Presigned URL generated"),
            @ApiResponse(responseCode = "400", description = "Invalid file URL")
    })
    public ResponseEntity<?> getPresignedUrl(
            @RequestParam("fileUrl") String fileUrl,
            @RequestParam(value = "expirationMinutes", defaultValue = "60") int expirationMinutes) {
        try {
            log.info("Generating presigned URL: fileUrl={}, expiration={} minutes", fileUrl, expirationMinutes);
            
            String presignedUrl = s3Service.getPresignedUrl(fileUrl, expirationMinutes);
            S3PresignedUrlResponseDTO response = s3Mapper.toPresignedUrlResponse(fileUrl, presignedUrl, expirationMinutes);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error generating presigned URL: {}", e.getMessage(), e);
            S3ErrorResponseDTO errorResponse = s3Mapper.toErrorResponse("Error generating presigned URL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

