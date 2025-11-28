package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.SupportTicketMapper;
import management.member.demo.entity.Employee;
import management.member.demo.entity.FAQ;
import management.member.demo.entity.SupportTicket;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.FAQRepository;
import management.member.demo.repository.SupportTicketRepository;
import management.member.demo.validator.SupportTicketValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportTicketService {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private FAQRepository faqRepository;

    @Autowired
    private SupportTicketMapper supportTicketMapper;

    @Autowired
    private SupportTicketValidator supportTicketValidator;

    public TicketListResponseDTO getTickets(String employeeId, String status, String category) {
        Long empId = null;
        if (employeeId != null && !employeeId.trim().isEmpty()) {
            supportTicketValidator.validateEmployeeIdString(employeeId); // Validate trước khi parse
            empId = Long.parseLong(employeeId);
        }
        List<SupportTicket> tickets = ticketRepository.findByFilters(empId, status, category);
        
        TicketListResponseDTO response = new TicketListResponseDTO();
        response.setData(tickets.stream()
                .map(supportTicketMapper::toTicketListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreateTicketResponseDTO createTicket(CreateTicketRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        supportTicketValidator.validateCreateTicketRequest(request);
        
        SupportTicket ticket = new SupportTicket();
        ticket.setSubject(request.getSubject());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : "medium");
        ticket.setStatus("open");
        ticket.setDescription(request.getDescription());
        ticket.setCreatedDate(LocalDate.now());
        ticket.setAssignedTo("support");

        // EmployeeId đã được validate trong validator, safe to parse
        Long empId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));
        ticket.setEmployee(employee);

        SupportTicket savedTicket = ticketRepository.save(ticket);

        CreateTicketResponseDTO response = new CreateTicketResponseDTO();
        response.setId(String.valueOf(savedTicket.getId()));
        response.setSuccess(true);
        response.setMessage("Ticket created successfully");

        return response;
    }

    public RespondToTicketResponseDTO respondToTicket(String id, RespondToTicketRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        supportTicketValidator.validateTicketIdString(id);
        supportTicketValidator.validateRespondToTicketRequest(request);
        
        Long ticketId = Long.parseLong(id);
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        ticket.setResponse(request.getResponse());
        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        } else {
            ticket.setStatus("resolved");
        }

        ticketRepository.save(ticket);

        RespondToTicketResponseDTO response = new RespondToTicketResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Response sent successfully");

        return response;
    }

    public FAQListResponseDTO getFAQs(String category) {
        List<FAQ> faqs;
        if (category != null) {
            faqs = faqRepository.findByCategory(category);
        } else {
            faqs = faqRepository.findAll();
        }
        
        FAQListResponseDTO response = new FAQListResponseDTO();
        response.setData(faqs.stream()
                .map(supportTicketMapper::toFAQDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }
}

