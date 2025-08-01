package com.example.taskmanager.repository;

import com.example.taskmanager.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    List<TaskList> findByBoardId(Long boardId);

    @Query("SELECT tl FROM TaskList tl WHERE tl.board.id = :boardId ORDER BY tl.id")
    List<TaskList> findByBoardIdExplicit(@Param("boardId") Long boardId);

    @Query("SELECT COUNT(tl) FROM TaskList tl WHERE tl.board.id = :boardId")
    long countByBoardId(@Param("boardId") Long boardId);
}