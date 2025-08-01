package com.example.taskmanager.controller;

import com.example.taskmanager.model.Board;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.BoardRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Board>> listBoards(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(boardRepository.findAllByOwnerUsername(username));
    }

    @PostMapping
    public ResponseEntity<?> createBoard(@RequestBody Board board, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            board.setOwner(user);
            Board savedBoard = boardRepository.save(board);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedBoard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create board");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board incoming) {
        return boardRepository.findById(id)
                .map(existing -> {
                    existing.setName(incoming.getName());
                    return ResponseEntity.ok(boardRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        boardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
