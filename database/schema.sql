CREATE DATABASE IF NOT EXISTS task_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_management_db;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tasks (title, description, priority, status, due_date) VALUES
('Set up CI/CD Pipeline', 'Configure GitHub Actions workflow for automated testing and deployment.', 'High', 'In Progress', '2026-11-05'),
('Design Landing Page Mockups', 'Create responsive mobile and desktop wireframes in Figma.', 'Medium', 'Completed', '2026-10-25'),
('Implement User Authentication', 'Set up JWT authentication, refresh tokens, and password hashing.', 'High', 'Pending', '2026-11-12'),
('Draft API Documentation', 'Document all REST endpoints, request/response payloads using Swagger/OpenAPI.', 'Low', 'Pending', '2026-11-20'),
('Database Performance Optimization', 'Add compound indexes on tasks table and profile slow queries.', 'Medium', 'In Progress', '2026-11-08');
