package management.member.demo.controller;

import lombok.RequiredArgsConstructor;
import management.member.demo.Enum.TaskStatus;
import management.member.demo.Service.TaskService;
import management.member.demo.dto.TaskRequest;
import management.member.demo.dto.TaskResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @PostMapping("/createTasks")
    public ResponseEntity<TaskResponse> createTasks(@RequestBody TaskRequest request){
        return ResponseEntity.ok(service.createTask(request));
    }

    @PostMapping("/updateTaskStatusByID/{id}")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id, @RequestParam("status")TaskStatus status){
        return ResponseEntity.ok(service.updateTaskStatus(id, status));
    }

    @GetMapping("/findTaskByStatus")
    public ResponseEntity<List<TaskResponse>> findTaskByStatus(@RequestParam("status")TaskStatus status){
        return ResponseEntity.ok(service.findTaskByStatus(status));
    }

    @GetMapping("/countTaskByStatus")
    public ResponseEntity<Long> countTaskByStatus(@RequestParam("status")TaskStatus status){
        return ResponseEntity.ok(service.countTaskByStatus(status));
    }

    @GetMapping("viewTaskDetailsByID/{id}")
    public ResponseEntity<TaskResponse> viewTaskDetailsByID(@PathVariable Long id){
        return ResponseEntity.ok(service.viewTaskDetails(id));
    }
}
