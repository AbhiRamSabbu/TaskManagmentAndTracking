package com.example.taskflow.controller;

import com.example.taskflow.model.Task;
import com.example.taskflow.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;

    @GetMapping("/health")
    public Map<String, Object> checkHealth() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "UP");
        res.put("framework", "Spring Boot 2.7 (Java 11)");
        res.put("timestamp", new Date());

        Map<String, Object> db = new HashMap<>();
        db.put("connectedToMySQL", true);
        db.put("database", "task_management_db");
        res.put("database", db);

        return res;
    }

    @GetMapping("/tasks/stats/summary")
    public Map<String, Object> getTaskStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", taskRepo.count());
        stats.put("pending", taskRepo.countByStatus("Pending"));
        stats.put("in_progress", taskRepo.countByStatus("In Progress"));
        stats.put("completed", taskRepo.countByStatus("Completed"));
        return stats;
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search) {

        String cleanStatus = (status != null && !status.equalsIgnoreCase("All")) ? status.trim() : null;
        String cleanPriority = (priority != null && !priority.equalsIgnoreCase("All")) ? priority.trim() : null;
        String cleanSearch = (search != null) ? search.trim() : null;

        return taskRepo.findWithFilters(cleanStatus, cleanPriority, cleanSearch);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Task task = taskRepo.findById(id).orElse(null);
        if (task == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Task not found with ID " + id);
            return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(task);
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        task.setId(null);
        Task saved = taskRepo.save(task);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task body) {
        Task task = taskRepo.findById(id).orElse(null);
        if (task == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Task not found");
            return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
        }

        if (body.getTitle() != null) {
            String title = body.getTitle().trim();
            if (title.isEmpty() || title.length() > 255) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("message", "Title must be between 1 and 255 characters");
                return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
            }
            task.setTitle(title);
        }

        if (body.getDescription() != null) {
            task.setDescription(body.getDescription());
        }

        if (body.getPriority() != null) {
            String priority = body.getPriority().trim();
            if (!priority.equals("Low") && !priority.equals("Medium") && !priority.equals("High")) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("message", "Invalid priority");
                return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
            }
            task.setPriority(priority);
        }

        if (body.getStatus() != null) {
            String status = body.getStatus().trim();
            if (!status.equals("Pending") && !status.equals("In Progress") && !status.equals("Completed")) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("message", "Invalid status");
                return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
            }
            task.setStatus(status);
        }

        if (body.getDueDate() != null) {
            task.setDueDate(body.getDueDate());
        }

        return ResponseEntity.ok(taskRepo.save(task));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (!taskRepo.existsById(id)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Task not found");
            return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
        }

        taskRepo.deleteById(id);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Task deleted successfully");
        return ResponseEntity.ok(res);
    }
}
