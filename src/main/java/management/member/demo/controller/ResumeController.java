package management.member.demo.controller;

import management.member.demo.service.FlaskApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private FlaskApiService flaskApiService;

    @PostMapping("/parse")
    public ResponseEntity<Map<String, Object>> parseResume(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = flaskApiService.parseResume(file);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/cache/{cacheId}")
    public ResponseEntity<Map<String, Object>> getCachedResume(@PathVariable String cacheId) {
        Map<String, Object> result = flaskApiService.getCachedResume(cacheId);
        return ResponseEntity.ok(result);
    }
}

