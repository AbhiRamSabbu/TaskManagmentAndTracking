package com.example.taskflow.repository;

import com.example.taskflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR :status = '' OR LOWER(t.status) = LOWER(:status)) AND " +
           "(:priority IS NULL OR :priority = '' OR LOWER(t.priority) = LOWER(:priority)) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.dueDate ASC, t.createdAt DESC")
    List<Task> findWithFilters(@Param("status") String status,
                               @Param("priority") String priority,
                               @Param("search") String search);

    long countByStatus(String status);
}
