package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Document;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.DocumentMapper;
import management.member.demo.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentMapper documentMapper;

    public DocumentListResponseDTO getDocuments(String category, String search) {
        return getAllDocuments(category, search);
    }
    
    public DocumentListResponseDTO getAllDocuments(String category, String search) {
        List<Document> documents = documentRepository.findByFilters(category, search);

        List<DocumentDTO> documentDTOs = documents.stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList());

        DocumentListResponseDTO response = new DocumentListResponseDTO();
        response.setData(documentDTOs);
        response.setSuccess(true);

        return response;
    }

    public UploadDocumentResponseDTO uploadDocument(UpdateDocumentRequestDTO request) {
        Document document = new Document();
        document.setName(request.getName());
        document.setUploadedDate(LocalDate.now());
        document.setDescription(request.getDescription());
        document.setAccessLevel(request.getAccessLevel());
        document.setDownloads(0);
        document.setVersion("1.0");

        Document saved = documentRepository.save(document);

        UploadDocumentResponseDTO response = new UploadDocumentResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setName(saved.getName());
        response.setSuccess(true);
        response.setMessage("Document uploaded successfully");

        return response;
    }
    
    public UploadDocumentResponseDTO uploadDocument(MultipartFile file, String name, String category, String description, String accessLevel) {
        Document document = new Document();
        document.setName(name);
        document.setCategory(category);
        document.setUploadedDate(LocalDate.now());
        document.setDescription(description != null ? description : "");
        document.setAccessLevel(accessLevel != null ? accessLevel : "all");
        document.setDownloads(0);
        document.setVersion("1.0");
        // TODO: Save file and set URL

        Document saved = documentRepository.save(document);

        UploadDocumentResponseDTO response = new UploadDocumentResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setName(saved.getName());
        response.setSuccess(true);
        response.setMessage("Document uploaded successfully");

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
        if (request.getCategory() != null) {
            document.setCategory(request.getCategory());
        }
        if (request.getAccessLevel() != null) {
            document.setAccessLevel(request.getAccessLevel());
        }

        Document updated = documentRepository.save(document);

        UpdateDocumentResponseDTO response = new UpdateDocumentResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Document updated successfully");

        return response;
    }

    public DeleteDocumentResponseDTO deleteDocument(String id) {
        Long documentId = Long.parseLong(id);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        documentRepository.delete(document);

        DeleteDocumentResponseDTO response = new DeleteDocumentResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Document deleted successfully");

        return response;
    }
    
    public byte[] downloadDocument(String id) {
        Long documentId = Long.parseLong(id);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        
        // TODO: Read file from storage and return bytes
        return new byte[0];
    }
    
    public DocumentListResponseDTO getDocumentsByCategory(String category) {
        return getAllDocuments(category, null);
    }
    
    public EmployeeDocumentListResponseDTO getEmployeeDocuments(String employeeId) {
        // TODO: Implement actual logic to get employee documents
        EmployeeDocumentListResponseDTO response = new EmployeeDocumentListResponseDTO();
        response.setData(new ArrayList<>());
        response.setSuccess(true);
        return response;
    }
}

