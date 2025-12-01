package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.mapper.ChatMapper;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ChatMapper chatMapper;

    public ChatContactListResponseDTO getChatContacts() {
        List<Employee> employees = employeeRepository.findAll();

        List<ChatContactDTO> contactDTOs = employees.stream()
                .map(chatMapper::toChatContactDTO)
                .collect(Collectors.toList());

        ChatContactListResponseDTO response = new ChatContactListResponseDTO();
        response.setData(contactDTOs);
        response.setSuccess(true);

        return response;
    }

    public ChatMessageListResponseDTO getChatMessages(String contactId, Integer page, Integer size) {
        // Mock implementation - would need ChatMessage entity
        ChatMessageListResponseDTO response = new ChatMessageListResponseDTO();
        response.setData(List.of());
        response.setSuccess(true);
        return response;
    }

    public SendMessageResponseDTO sendMessage(SendMessageRequestDTO request, String senderId) {
        // Mock implementation - would need ChatMessage entity
        SendMessageResponseDTO response = new SendMessageResponseDTO();
        response.setId(System.currentTimeMillis());
        response.setSenderId(senderId);
        response.setReceiverId(request.getReceiverId());
        response.setMessage(request.getMessage());
        response.setTimestamp(LocalDateTime.now().toString());
        response.setType(request.getType());
        response.setSuccess(true);
        return response;
    }
}

