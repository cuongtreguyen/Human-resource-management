package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.Service.DocumentService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Documents", description = "Document management endpoints")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    @Operation(summary = "Get all documents", description = "Get all documents with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<DocumentListResponseDTO> getAllDocuments(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        DocumentListResponseDTO response = documentService.getAllDocuments(category, search);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Upload document", description = "Upload a new document")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Document uploaded successfully")
    })
    public ResponseEntity<UploadDocumentResponseDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam(required = false) String description,
            @RequestParam(required = false, defaultValue = "all") String accessLevel) {
        UploadDocumentResponseDTO response = documentService.uploadDocument(
                file, name, category, description, accessLevel);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download document", description = "Download a document file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "File downloaded successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String id) {
        byte[] fileContent = documentService.downloadDocument(id);
        
        // Get document info for filename
        // TODO: Get document name from service
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "document.pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete document", description = "Delete a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<DeleteDocumentResponseDTO> deleteDocument(@PathVariable String id) {
        DeleteDocumentResponseDTO response = documentService.deleteDocument(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get documents by category", description = "Get documents filtered by category")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<DocumentListResponseDTO> getDocumentsByCategory(@PathVariable String category) {
        DocumentListResponseDTO response = documentService.getDocumentsByCategory(category);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update document", description = "Update document information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document updated successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<UpdateDocumentResponseDTO> updateDocument(
            @PathVariable String id,
            @Valid @RequestBody UpdateDocumentRequestDTO request) {
        UpdateDocumentResponseDTO response = documentService.updateDocument(id, request);
        return ResponseEntity.ok(response);
    }
}

