package com.example.taskmanager.controller;

import com.example.taskmanager.model.Board;
import com.example.taskmanager.model.TaskList;
import com.example.taskmanager.repository.BoardRepository;
import com.example.taskmanager.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasklists")
@RequiredArgsConstructor
@Slf4j
public class TaskListController {

    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;

    @PostMapping
    public ResponseEntity<TaskList> createTaskList(@RequestBody TaskList taskList, @RequestParam Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id " + boardId));
        taskList.setBoard(board);
        TaskList saved = taskListRepository.save(taskList);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<TaskList>> getTaskListsByBoard(@PathVariable Long boardId) {
        Optional<Board> boardOpt = boardRepository.findById(boardId);
        if (boardOpt.isEmpty()) {
            log.error("Board with id {} not found!", boardId);
            return ResponseEntity.notFound().build();
        }

        List<TaskList> taskLists = taskListRepository.findByBoardId(boardId);;
        return ResponseEntity.ok(taskLists);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskList> updateTaskList(@PathVariable Long id, @RequestBody TaskList updatedList) {
        TaskList taskList = taskListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TaskList not found"));
        taskList.setName(updatedList.getName());
        TaskList saved = taskListRepository.save(taskList);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskList(@PathVariable Long id) {
        taskListRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}