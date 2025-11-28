package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.Service.SupportTicketService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@Tag(name = "Support Tickets", description = "Support ticket management endpoints")
public class SupportTicketController {

    @Autowired
    private SupportTicketService supportTicketService;

    @GetMapping("/tickets")
    @Operation(summary = "Get support tickets", description = "Get support tickets with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<TicketListResponseDTO> getTickets(
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        TicketListResponseDTO response = supportTicketService.getTickets(employeeId, status, category);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tickets")
    @Operation(summary = "Create support ticket", description = "Create a new support ticket")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ticket created successfully")
    })
    public ResponseEntity<CreateTicketResponseDTO> createTicket(
            @Valid @RequestBody CreateTicketRequestDTO request) {
        CreateTicketResponseDTO response = supportTicketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/tickets/{id}/respond")
    @Operation(summary = "Respond to ticket", description = "Respond to a support ticket")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Response sent successfully"),
            @ApiResponse(responseCode = "404", description = "Ticket not found")
    })
    public ResponseEntity<RespondToTicketResponseDTO> respondToTicket(
            @PathVariable String id,
            @Valid @RequestBody RespondToTicketRequestDTO request) {
        RespondToTicketResponseDTO response = supportTicketService.respondToTicket(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/faqs")
    @Operation(summary = "Get FAQs", description = "Get frequently asked questions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<FAQListResponseDTO> getFAQs(
            @RequestParam(required = false) String category) {
        FAQListResponseDTO response = supportTicketService.getFAQs(category);
        return ResponseEntity.ok(response);
    }
}

