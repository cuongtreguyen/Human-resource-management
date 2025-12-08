package management.member.demo.controller;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.EmployeeLeaveSummaryDTO;
import management.member.demo.dto.LeaveListItemDTO;
import management.member.demo.service.AuthService;
import management.member.demo.service.OnLeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employee/leave")
public class EmployeeLeaveController {
    private final OnLeaveService onLeaveService;
    private final AuthService authService;

    @GetMapping("/summary")
    public ResponseEntity<EmployeeLeaveSummaryDTO> getSummary() {
        Long employeeId = Long.parseLong(authService.getCurrentUser().getEmployee().getId().toString());
        return ResponseEntity.ok(onLeaveService.getEmployeeLeaveSummary(employeeId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<LeaveListItemDTO>> getHistory() {
        Long employeeId = Long.parseLong(authService.getCurrentUser().getEmployee().getId().toString());
        return ResponseEntity.ok(onLeaveService.getEmployeeRecentHistory(employeeId));
    }
}
