package management.member.demo.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import management.member.demo.Service.OnLeaveService;
import management.member.demo.dto.OnLeaveListResponse;
import management.member.demo.dto.OnLeaveRequest;
import management.member.demo.dto.OnLeaveResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/onLeave")
@RequiredArgsConstructor
public class OnLeaveController {

    private final OnLeaveService service;

    @PostMapping("/create")
    public ResponseEntity<OnLeaveResponse> createOnLeave(@RequestBody OnLeaveRequest request) {
        return ResponseEntity.ok(service.createOnLeave(request));
    }

    @GetMapping("/getLeaveListByID/{id}")
    public ResponseEntity<List<OnLeaveListResponse>> getLeaveListByID(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLeaveListByID(id));
    }

    @GetMapping("/countLeaveReqByID/{id}")
    public ResponseEntity<Long> countLeaveReqByID(@PathVariable Long id) {
        return ResponseEntity.ok(service.countPendingOnLeaveRequestsById(id));
    }

    @GetMapping("/leaveSummary/{id}")
    public ResponseEntity<Map<String, Long>> getLeaveSummary(@PathVariable Long id) {
        Map<String, Long> summary = service.getLeaveSummary(id);
        return ResponseEntity.ok(summary);
    }
}
