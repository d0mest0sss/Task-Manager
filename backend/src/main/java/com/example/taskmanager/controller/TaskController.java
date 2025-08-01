package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskList;
import com.example.taskmanager.repository.TaskListRepository;
import com.example.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    @GetMapping("/list/{taskListId}")
    public ResponseEntity<List<Task>> getTasksByList(@PathVariable Long taskListId) {
        List<Task> tasks = taskRepository.findAll()
                .stream()
                .filter(task -> task.getTaskList().getId().equals(taskListId))
                .toList();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, @RequestParam Long taskListId) {
        TaskList taskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new RuntimeException("TaskList not found"));
        task.setTaskList(taskList);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updated) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        return ResponseEntity.ok(taskRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
