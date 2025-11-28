package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.AuditLogMapper;
import management.member.demo.entity.AuditLog;
import management.member.demo.repository.AuditLogRepository;
import management.member.demo.validator.AuditLogValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditLogMapper auditLogMapper;

    @Autowired
    private AuditLogValidator auditLogValidator;

    public List<AuditLogDTO> getAllLogs(String search, String type, String date) {
        LocalDate dateFilter = auditLogValidator.validateDateStringOptional(date); // Validate và parse date
        List<AuditLog> logs = auditLogRepository.findByFilters(search, type, dateFilter);
        return logs.stream()
                .map(auditLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PaginatedLogsResponseDTO getPaginatedLogs(String search, String type, String date, Integer page, Integer size) {
        auditLogValidator.validatePagination(page, size); // Validate pagination
        LocalDate dateFilter = auditLogValidator.validateDateStringOptional(date); // Validate và parse date
        Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 20);
        Page<AuditLog> pageResult = auditLogRepository.findByFiltersPaginated(search, type, dateFilter, pageable);
        
        PaginatedLogsResponseDTO response = new PaginatedLogsResponseDTO();
        response.setLogs(pageResult.getContent().stream()
                .map(auditLogMapper::toDTO)
                .collect(Collectors.toList()));
        response.setTotal(pageResult.getTotalElements());
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(pageResult.getTotalPages());
        
        return response;
    }

    public AuditLogStatsDTO getLogStatistics(String search, String type, String date) {
        LocalDate dateFilter = date != null ? LocalDate.parse(date) : null;
        List<Object[]> actionCounts = auditLogRepository.getActionCounts(search, type, dateFilter);
        
        AuditLogStatsDTO stats = new AuditLogStatsDTO();
        
        for (Object[] row : actionCounts) {
            String action = (String) row[0];
            Long count = (Long) row[1];
            switch (action.toLowerCase()) {
                case "view" -> stats.setView(count.intValue());
                case "navigate" -> stats.setNavigate(count.intValue());
                case "update" -> stats.setUpdate(count.intValue());
                case "create" -> stats.setCreate(count.intValue());
                case "delete" -> stats.setDelete(count.intValue());
                case "error" -> stats.setError(count.intValue());
                case "attendance" -> stats.setAttendance(count.intValue());
            }
        }
        
        stats.setTotal(auditLogRepository.findByFilters(search, type, dateFilter).size());
        
        return stats;
    }

    public List<AuditLogDTO> getLogsByEmployee(String employeeId) {
        List<AuditLog> logs = auditLogRepository.findByEmployeeId(employeeId);
        return logs.stream()
                .map(auditLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CreateAuditLogResponseDTO createLog(CreateAuditLogRequestDTO request) {
        AuditLog log = new AuditLog();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(request.getUser());
        log.setAction(request.getAction());
        log.setResource(request.getResource());
        log.setDetails(request.getDetails());
        log.setIpAddress(request.getIpAddress());
        
        AuditLog savedLog = auditLogRepository.save(log);
        
        CreateAuditLogResponseDTO response = new CreateAuditLogResponseDTO();
        response.setId(String.valueOf(savedLog.getId()));
        response.setSuccess(true);
        response.setMessage("Audit log created successfully");
        
        return response;
    }

    public InitializeLogsResponseDTO initializeSampleLogs() {
        LocalDateTime now = LocalDateTime.now();
        int count = 0;
        
        String[] actions = {"view", "create", "update", "delete", "navigate", "error"};
        String[] resources = {"employee", "attendance", "payroll", "leave", "task", "document"};
        String[] users = {"admin@example.com", "manager@example.com", "employee@example.com"};
        
        for (int i = 0; i < 20; i++) {
            AuditLog log = new AuditLog();
            log.setTimestamp(now.minusHours(i));
            log.setUser(users[i % users.length]);
            log.setAction(actions[i % actions.length]);
            log.setResource(resources[i % resources.length]);
            log.setDetails("Sample log entry " + (i + 1));
            log.setIpAddress("192.168.1." + (100 + i));
            auditLogRepository.save(log);
            count++;
        }
        
        InitializeLogsResponseDTO response = new InitializeLogsResponseDTO();
        response.setCount(count);
        response.setSuccess(true);
        response.setMessage("Sample logs initialized successfully");
        
        return response;
    }

    public CleanupLogsResponseDTO cleanupOldLogs(Integer daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        long countBefore = auditLogRepository.count();
        auditLogRepository.deleteByTimestampBefore(cutoffDate);
        long countAfter = auditLogRepository.count();
        long deletedCount = countBefore - countAfter;
        
        CleanupLogsResponseDTO response = new CleanupLogsResponseDTO();
        response.setDeletedCount((int) deletedCount);
        response.setSuccess(true);
        response.setMessage("Old logs cleaned successfully");
        
        return response;
    }

}

