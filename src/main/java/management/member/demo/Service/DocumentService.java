package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.DocumentMapper;
import management.member.demo.entity.Document;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.DocumentRepository;
import management.member.demo.validator.DocumentValidator;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentMapper documentMapper;

    @Autowired
    private DocumentValidator documentValidator;

    private static final String UPLOAD_DIR = "uploads/documents/";

    public DocumentListResponseDTO getAllDocuments(String category, String search) {
        List<Document> documents = documentRepository.findByFilters(category, search);
        
        DocumentListResponseDTO response = new DocumentListResponseDTO();
        response.setData(documents.stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public UploadDocumentResponseDTO uploadDocument(MultipartFile file, String name, String category, 
                                                     String description, String accessLevel) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        documentValidator.validateFile(file);
        documentValidator.validateDocumentName(name);
        if (category != null) {
            documentValidator.validateDocumentCategory(category);
        }
        
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : "";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Determine file type
            String fileType = extension.replace(".", "").toLowerCase();
            if (fileType.isEmpty()) {
                fileType = "unknown";
            }

            // Calculate file size
            long sizeInBytes = file.getSize();
            String size = formatFileSize(sizeInBytes);

            // Create document entity
            Document document = new Document();
            document.setName(name);
            document.setCategory(category);
            document.setType(fileType);
            document.setSize(size);
            document.setUploadedBy("system"); // TODO: Get from security context
            document.setUploadedDate(LocalDate.now());
            document.setDescription(description);
            document.setUrl(filePath.toString());
            document.setAccessLevel(accessLevel != null ? accessLevel : "all");
            document.setDownloads(0);
            document.setVersion("1.0");

            Document savedDocument = documentRepository.save(document);

            UploadDocumentResponseDTO response = new UploadDocumentResponseDTO();
            response.setId(String.valueOf(savedDocument.getId()));
            response.setSuccess(true);
            response.setMessage("Document uploaded successfully");

            return response;
        } catch (IOException e) {
            throw ErrorCode.FILE_UPLOAD_ERROR.toException("Không thể upload document: " + e.getMessage());
        }
    }

    public byte[] downloadDocument(String id) {
        Long documentId = Long.parseLong(id);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        try {
            Path filePath = Paths.get(document.getUrl());
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw ErrorCode.FILE_DOWNLOAD_ERROR.toException("Không thể download document: " + e.getMessage());
        }
    }

    public DeleteDocumentResponseDTO deleteDocument(String id) {
        Long documentId = Long.parseLong(id);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        try {
            // Delete file from filesystem
            Path filePath = Paths.get(document.getUrl());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            // Log error but continue with database deletion
        }

        documentRepository.delete(document);

        DeleteDocumentResponseDTO response = new DeleteDocumentResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Document deleted successfully");

        return response;
    }

    public DocumentListResponseDTO getDocumentsByCategory(String category) {
        List<Document> documents = documentRepository.findByCategory(category);
        
        DocumentListResponseDTO response = new DocumentListResponseDTO();
        response.setData(documents.stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public UpdateDocumentResponseDTO updateDocument(String id, UpdateDocumentRequestDTO request) {
        Long documentId = Long.parseLong(id);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        if (request.getName() != null) {
            document.setName(request.getName());
        }
        if (request.getDescription() != null) {
            document.setDescription(request.getDescription());
        }
        if (request.getAccessLevel() != null) {
            document.setAccessLevel(request.getAccessLevel());
        }

        documentRepository.save(document);

        UpdateDocumentResponseDTO response = new UpdateDocumentResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Document updated successfully");

        return response;
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        } else if (bytes < 1024 * 1024) {
            return String.format("%.2f KB", bytes / 1024.0);
        } else {
            return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
        }
    }
}

