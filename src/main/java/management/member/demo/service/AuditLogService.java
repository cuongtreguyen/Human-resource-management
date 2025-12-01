package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.AuditLog;
import management.member.demo.mapper.AuditLogMapper;
import management.member.demo.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditLogMapper auditLogMapper;

    public List<AuditLogDTO> getAllLogs(String search, String type, String date) {
        LocalDate dateFilter = date != null ? LocalDate.parse(date) : null;
        List<AuditLog> logs = auditLogRepository.findByFilters(search, type, dateFilter);

        return logs.stream()
                .map(auditLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PaginatedLogsResponseDTO getPaginatedLogs(String search, String type, String date, Integer page, Integer size) {
        LocalDate dateFilter = date != null ? LocalDate.parse(date) : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logPage = auditLogRepository.findByFiltersPaginated(search, type, dateFilter, pageable);

        List<AuditLogDTO> logDTOs = logPage.getContent().stream()
                .map(auditLogMapper::toDTO)
                .collect(Collectors.toList());

        PaginatedLogsResponseDTO response = new PaginatedLogsResponseDTO();
        response.setLogs(logDTOs);
        response.setTotal(logPage.getTotalElements());
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(logPage.getTotalPages());

        return response;
    }

    public AuditLogStatsDTO getLogStatistics(String search, String type, String date) {
        LocalDate dateFilter = date != null ? LocalDate.parse(date) : null;
        List<Object[]> actionCounts = auditLogRepository.getActionCounts(search, type, dateFilter);

        Map<String, Long> statsMap = new HashMap<>();
        long total = 0;

        for (Object[] result : actionCounts) {
            String action = (String) result[0];
            Long count = (Long) result[1];
            statsMap.put(action, count);
            total += count;
        }

        AuditLogStatsDTO stats = new AuditLogStatsDTO();
        stats.setTotal((int) total);
        stats.setView(statsMap.getOrDefault("view", 0L).intValue());
        stats.setNavigate(statsMap.getOrDefault("navigate", 0L).intValue());
        stats.setUpdate(statsMap.getOrDefault("update", 0L).intValue());
        stats.setCreate(statsMap.getOrDefault("create", 0L).intValue());
        stats.setDelete(statsMap.getOrDefault("delete", 0L).intValue());
        stats.setError(statsMap.getOrDefault("error", 0L).intValue());
        stats.setAttendance(statsMap.getOrDefault("attendance", 0L).intValue());

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
        log.setEmployeeId(request.getUser());

        AuditLog saved = auditLogRepository.save(log);

        CreateAuditLogResponseDTO response = new CreateAuditLogResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setSuccess(true);
        response.setMessage("Audit log created successfully");

        return response;
    }

    public InitializeLogsResponseDTO initializeSampleLogs() {
        // Create sample logs
        int count = 100;
        for (int i = 0; i < count; i++) {
            AuditLog log = new AuditLog();
            log.setTimestamp(LocalDateTime.now().minusDays(i % 30));
            log.setUser("user" + (i % 10));
            log.setAction(List.of("view", "navigate", "update", "create", "delete").get(i % 5));
            log.setResource("employee");
            log.setDetails("Sample log entry " + i);
            auditLogRepository.save(log);
        }

        InitializeLogsResponseDTO response = new InitializeLogsResponseDTO();
        response.setSuccess(true);
        response.setMessage("Sample logs initialized");
        response.setCount(count);

        return response;
    }

    public CleanupLogsResponseDTO cleanupOldLogs(Integer daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        List<AuditLog> oldLogs = auditLogRepository.findAll().stream()
                .filter(log -> log.getTimestamp().isBefore(cutoffDate))
                .collect(Collectors.toList());

        int deletedCount = oldLogs.size();
        auditLogRepository.deleteAll(oldLogs);

        CleanupLogsResponseDTO response = new CleanupLogsResponseDTO();
        response.setSuccess(true);
        response.setMessage("Old logs cleaned up");
        response.setDeletedCount(deletedCount);

        return response;
    }
}

