package com.example.taskmanager.repository;

import com.example.taskmanager.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findAllByOwnerUsername(String username);
}
