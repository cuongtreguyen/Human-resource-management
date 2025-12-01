package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.service.ChatService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Chat management endpoints")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/contacts")
    @Operation(summary = "Get chat contacts", description = "Get list of chat contacts (employees)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ChatContactListResponseDTO> getChatContacts() {
        ChatContactListResponseDTO response = chatService.getChatContacts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages/{contactId}")
    @Operation(summary = "Get chat messages", description = "Get chat messages with a contact")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ChatMessageListResponseDTO> getChatMessages(
            @PathVariable String contactId,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "50") Integer size) {
        ChatMessageListResponseDTO response = chatService.getChatMessages(contactId, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/messages")
    @Operation(summary = "Send message", description = "Send a message to a contact")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Message sent successfully")
    })
    public ResponseEntity<SendMessageResponseDTO> sendMessage(
            @Valid @RequestBody SendMessageRequestDTO request,
            @RequestParam(required = false) String senderId) {
        // TODO: Get senderId from security context
        String currentSenderId = senderId != null ? senderId : "1";
        SendMessageResponseDTO response = chatService.sendMessage(request, currentSenderId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

