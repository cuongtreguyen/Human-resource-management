package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.SupportTicket;
import management.member.demo.entity.FAQ;
import management.member.demo.entity.Employee;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.SupportTicketMapper;
import management.member.demo.repository.SupportTicketRepository;
import management.member.demo.repository.FAQRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupportTicketService {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private FAQRepository faqRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SupportTicketMapper ticketMapper;

    public TicketListResponseDTO getTickets(String employeeId, String status, String category) {
        Long empId = employeeId != null ? Long.parseLong(employeeId) : null;
        List<SupportTicket> tickets = ticketRepository.findByFilters(empId, status, category);

        List<TicketListItemDTO> ticketDTOs = tickets.stream()
                .map(ticketMapper::toTicketListItemDTO)
                .collect(Collectors.toList());

        TicketListResponseDTO response = new TicketListResponseDTO();
        response.setData(ticketDTOs);
        response.setSuccess(true);

        return response;
    }

    public CreateTicketResponseDTO createTicket(CreateTicketRequestDTO request) {
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        SupportTicket ticket = new SupportTicket();
        ticket.setSubject(request.getSubject());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus("open");
        ticket.setDescription(request.getDescription());
        ticket.setCreatedDate(LocalDate.now());
        ticket.setEmployee(employee);
        ticket.setAssignedTo("IT Support"); // Default assignment

        SupportTicket saved = ticketRepository.save(ticket);

        CreateTicketResponseDTO response = new CreateTicketResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setSuccess(true);
        response.setMessage("Yêu cầu hỗ trợ đã được tạo");

        return response;
    }

    public RespondToTicketResponseDTO respondToTicket(String id, RespondToTicketRequestDTO request) {
        Long ticketId = Long.parseLong(id);
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        ticket.setResponse(request.getResponse());
        ticket.setStatus("resolved");

        SupportTicket updated = ticketRepository.save(ticket);

        RespondToTicketResponseDTO response = new RespondToTicketResponseDTO();
        response.setId(id);
        response.setStatus(updated.getStatus());
        response.setSuccess(true);
        response.setMessage("Response sent successfully");

        return response;
    }

    public FAQListResponseDTO getFAQs(String category) {
        List<FAQ> faqs;
        if (category != null && !category.isEmpty()) {
            faqs = faqRepository.findByCategory(category);
        } else {
            faqs = faqRepository.findAll();
        }

        List<FAQDTO> faqDTOs = faqs.stream()
                .map(ticketMapper::toFAQDTO)
                .collect(Collectors.toList());

        FAQListResponseDTO response = new FAQListResponseDTO();
        response.setData(faqDTOs);
        response.setSuccess(true);

        return response;
    }
}

