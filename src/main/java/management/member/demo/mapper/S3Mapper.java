package management.member.demo.mapper;

import management.member.demo.dto.*;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Mapper class - Chịu trách nhiệm mapping giữa S3 service results và DTOs
 */
@Component
public class S3Mapper {

    /**
     * Map upload result sang S3UploadResponseDTO
     */
    public S3UploadResponseDTO toUploadResponse(String fileUrl, MultipartFile file, String folder) {
        return S3UploadResponseDTO.builder()
                .status("success")
                .message("File uploaded successfully")
                .fileUrl(fileUrl)
                .originalFilename(file.getOriginalFilename())
                .size(file.getSize())
                .contentType(file.getContentType())
                .folder(folder)
                .build();
    }

    /**
     * Map delete result sang S3DeleteResponseDTO
     */
    public S3DeleteResponseDTO toDeleteResponse(String fileUrl) {
        return S3DeleteResponseDTO.builder()
                .status("success")
                .message("File deleted successfully")
                .fileUrl(fileUrl)
                .build();
    }

    /**
     * Map check result sang S3CheckResponseDTO
     */
    public S3CheckResponseDTO toCheckResponse(String fileUrl, boolean exists) {
        return S3CheckResponseDTO.builder()
                .status("success")
                .fileUrl(fileUrl)
                .exists(exists)
                .message(exists ? "File exists" : "File does not exist")
                .build();
    }

    /**
     * Map presigned URL result sang S3PresignedUrlResponseDTO
     */
    public S3PresignedUrlResponseDTO toPresignedUrlResponse(String originalUrl, String presignedUrl, int expirationMinutes) {
        return S3PresignedUrlResponseDTO.builder()
                .status("success")
                .originalUrl(originalUrl)
                .presignedUrl(presignedUrl)
                .expirationMinutes(expirationMinutes)
                .message("Presigned URL generated successfully")
                .build();
    }

    /**
     * Map error sang S3ErrorResponseDTO
     */
    public S3ErrorResponseDTO toErrorResponse(String message) {
        return S3ErrorResponseDTO.builder()
                .status("error")
                .message(message)
                .build();
    }
}

