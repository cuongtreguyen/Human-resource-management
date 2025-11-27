package management.member.demo.controller;

import management.member.demo.Service.FlaskApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private FlaskApiService flaskApiService;

    @PostMapping("/parse")
    public ResponseEntity<Map<String, Object>> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Map<String, Object> result = flaskApiService.parseResume(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cache/{cacheId}")
    public ResponseEntity<Map<String, Object>> getCachedResume(@PathVariable String cacheId) {
        try {
            Map<String, Object> result = flaskApiService.getCachedResume(cacheId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

