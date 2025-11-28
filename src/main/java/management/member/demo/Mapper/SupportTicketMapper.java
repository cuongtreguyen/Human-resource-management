package management.member.demo.Mapper;

import management.member.demo.dto.FAQDTO;
import management.member.demo.dto.TicketListItemDTO;
import management.member.demo.entity.FAQ;
import management.member.demo.entity.SupportTicket;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho SupportTicket
 */
@Component
public class SupportTicketMapper {

    public TicketListItemDTO toTicketListItemDTO(SupportTicket ticket) {
        TicketListItemDTO dto = new TicketListItemDTO();
        dto.setId(String.valueOf(ticket.getId()));
        dto.setSubject(ticket.getSubject());
        dto.setCategory(ticket.getCategory());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setCreatedDate(ticket.getCreatedDate());
        if (ticket.getEmployee() != null) {
            dto.setEmployeeId(String.valueOf(ticket.getEmployee().getId()));
            dto.setEmployeeName(ticket.getEmployee().getFullName());
        }
        return dto;
    }

    public FAQDTO toFAQDTO(FAQ faq) {
        FAQDTO dto = new FAQDTO();
        dto.setId(String.valueOf(faq.getId()));
        dto.setQuestion(faq.getQuestion());
        dto.setAnswer(faq.getAnswer());
        dto.setCategory(faq.getCategory());
        return dto;
    }
}

