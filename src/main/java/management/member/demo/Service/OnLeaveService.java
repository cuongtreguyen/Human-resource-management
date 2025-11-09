package management.member.demo.Service;

import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Mapper.OnLeaveMapper;
import management.member.demo.dto.OnLeaveListResponse;
import management.member.demo.dto.OnLeaveRequest;
import management.member.demo.dto.OnLeaveResponse;
import management.member.demo.entity.Employee;
import management.member.demo.entity.OnLeave;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OnLeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class OnLeaveService {
    @Autowired
    OnLeaveRepository onLeaveRepository;

    @Autowired
    OnLeaveMapper onLeaveMapper;

    @Autowired
    EmployeeRepository employeeRepository;

    public OnLeaveResponse createOnLeave(OnLeaveRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        long daysRequested = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        if (employee.getRemainingLeaveDays() < daysRequested) {
            throw new RuntimeException("Not enough leave days. Remaining: " + employee.getRemainingLeaveDays());
        }

        OnLeave onLeave = onLeaveMapper.toOnLeave(request);
        onLeave.setEmployee(employee);
        onLeave.setOnLeaveStatus(OnLeaveStatus.PENDING);

        OnLeave savedLeave = onLeaveRepository.save(onLeave);
        return onLeaveMapper.toOnLeaveResponse(savedLeave);
    }

    public List<OnLeaveListResponse> getLeaveListByID(Long id){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<OnLeave> onLeaves = onLeaveRepository.findByEmployeeId(id);
        if(onLeaves.isEmpty()){
            throw new RuntimeException("No leave found for this employee");
        }

        List<OnLeave> onLeaveList = onLeaveRepository.findByEmployeeId(id);
        return onLeaves.stream()
                .map(onLeave -> OnLeaveListResponse.builder()
                        .id(onLeave.getId())
                        .startDate(onLeave.getStartDate())
                        .endDate(onLeave.getEndDate())
                        .onLeaveType(onLeave.getOnLeaveType())
                        .onLeaveStatus(onLeave.getOnLeaveStatus())
                        .build()
                )
                .toList();
    }

    public long countPendingOnLeaveRequestsById(Long employeeId) {
        return onLeaveRepository.findByEmployeeId(employeeId).stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.PENDING)
                .count();
    }

    public Map<String, Long> getLeaveSummary(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Tính số ngày đã dùng (đã duyệt)
        long usedLeaveDays = onLeaveRepository.findByEmployeeId(employeeId).stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED)
                .mapToLong(leave ->
                        java.time.temporal.ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1
                )
                .sum();

        // Trả về dạng key-value
        return Map.of(
                "remainingLeaveDays", Long.valueOf(employee.getRemainingLeaveDays()),
                "usedLeaveDays", Long.valueOf(usedLeaveDays)
        );
    }
}
