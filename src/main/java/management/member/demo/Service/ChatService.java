package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.ChatMapper;
import management.member.demo.entity.Employee;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.ChatValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ChatMapper chatMapper;

    @Autowired
    private ChatValidator chatValidator;

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    public ChatContactListResponseDTO getChatContacts() {
        List<Employee> employees = employeeRepository.findAll();
        
        List<ChatContactDTO> contacts = employees.stream()
                .map(chatMapper::toChatContactDTO)
                .collect(Collectors.toList());
        
        ChatContactListResponseDTO response = new ChatContactListResponseDTO();
        response.setData(contacts);
        response.setSuccess(true);
        
        return response;
    }

    public ChatMessageListResponseDTO getChatMessages(String contactId, Integer page, Integer size) {
        if (contactId != null && !contactId.trim().isEmpty()) {
            chatValidator.validateContactIdString(contactId); // Validate contactId
        }
        chatValidator.validatePagination(page, size); // Validate pagination
        
        // TODO: Implement actual message retrieval from database
        // For now, return empty list
        
        ChatMessageListResponseDTO response = new ChatMessageListResponseDTO();
        response.setData(new ArrayList<>());
        response.setSuccess(true);
        response.setTotal(0L);
        response.setPage(page != null ? page : 0);
        response.setSize(size != null ? size : 50);
        response.setTotalPages(0);
        
        return response;
    }

    public SendMessageResponseDTO sendMessage(SendMessageRequestDTO request, String senderId) {
        // TODO: Implement actual message saving to database
        // For now, return mock response
        
        SendMessageResponseDTO response = new SendMessageResponseDTO();
        response.setId(System.currentTimeMillis());
        response.setSenderId(senderId);
        response.setReceiverId(request.getReceiverId());
        response.setMessage(request.getMessage());
        response.setTimestamp(LocalDateTime.now().format(ISO_FORMATTER));
        response.setType(request.getType() != null ? request.getType() : "text");
        response.setSuccess(true);
        
        return response;
    }
}

