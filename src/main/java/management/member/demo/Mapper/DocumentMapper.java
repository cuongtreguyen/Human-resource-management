package management.member.demo.Mapper;

import management.member.demo.dto.DocumentDTO;
import management.member.demo.entity.Document;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho Document
 */
@Component
public class DocumentMapper {

    public DocumentDTO toDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(String.valueOf(document.getId()));
        dto.setName(document.getName());
        dto.setCategory(document.getCategory());
        dto.setType(document.getType());
        dto.setSize(document.getSize());
        dto.setUploadedBy(document.getUploadedBy());
        dto.setUploadedDate(document.getUploadedDate());
        dto.setDescription(document.getDescription());
        dto.setUrl(document.getUrl());
        dto.setAccessLevel(document.getAccessLevel());
        dto.setDownloads(document.getDownloads());
        dto.setVersion(document.getVersion());
        return dto;
    }
}

