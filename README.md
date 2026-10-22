# TaskFlow - Spring Boot REST API Backend

Spring Boot REST API backend for the Task Management and Tracking application connected to MySQL database.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Setup (MySQL)](#-database-setup-mysql)
- [Backend Security Features](#-backend-security-features)
- [Prerequisites](#-prerequisites)
- [How to Run](#-how-to-run)
- [REST API Documentation & Examples](#-rest-api-documentation--examples)

---

## 🛠 Tech Stack
- **Framework**: Spring Boot 2.7.18
- **Language**: Java 11
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8.0+
- **Validation**: JSR-380 Bean Validation
- **Build Tool**: Apache Maven

---

## 🏛 Project Structure

```
.
├── database/
│   └── schema.sql                   # MySQL database schema & sample seed data
├── springboot-backend/
│   ├── src/main/java/com/example/taskflow/
│   │   ├── config/
│   │   │   ├── GlobalExceptionHandler.java  # Centralized error handler
│   │   │   └── WebConfig.java               # CORS configuration
│   │   ├── controller/
│   │   │   └── TaskController.java          # REST API endpoints
│   │   ├── model/
│   │   │   └── Task.java                    # JPA Entity with validations
│   │   ├── repository/
│   │   │   └── TaskRepository.java          # JPA repository with parameterized JPQL
│   │   └── TaskflowApplication.java         # Spring Boot entry point
│   ├── src/main/resources/
│   │   └── application.properties           # Database credentials & JPA config
│   └── pom.xml                              # Maven build file
├── .gitignore
└── README.md
```

---

## 🗄 Database Setup (MySQL)

A standalone script is provided in `database/schema.sql`:

```sql
CREATE DATABASE IF NOT EXISTS task_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_management_db;

CREATE TABLE IF NOT EXISTS tasks (
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
```

Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`, which automatically validates and updates the database tables on startup.

---

## 🛡️ Backend Security Features

1. **SQL Injection Prevention**: Parameterized queries using Spring Data JPA (`@Param`).
2. **Input Validation**: JSR-380 Bean Validation (`@Valid`, `@NotBlank`, `@Size(max = 255)`, `@Pattern`, `@NotNull`).
3. **Information Leakage Defense (CWE-209)**: `GlobalExceptionHandler` logs detailed error traces internally on the server console and returns safe, generic error responses to clients.
4. **Mass Assignment / ID Injection Defense**: `POST /api/tasks` sets `task.setId(null)` to prevent attackers from overwriting existing rows.
5. **CORS Safety**: Explicit origin whitelisting (`http://localhost:5173`, `http://127.0.0.1:5173`).

---

## ☕ Prerequisites

- Java JDK 11 or higher installed (`java -version`)
- Apache Maven installed (`mvn -v`)
- MySQL server running on port 3306

---

## 🚀 How to Run

### 1. Configure Database Connection
Edit `springboot-backend/src/main/resources/application.properties` with your MySQL username and password:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 2. Start the Application
Run using Maven:
```bash
cd springboot-backend
mvn spring-boot:run
```

Or build and run the packaged JAR:
```bash
cd springboot-backend
mvn package -DskipTests
java -jar target/taskflow-backend-1.0.0.jar
```

The REST API will be accessible at **`http://localhost:5000`**.

---

## 📡 REST API Documentation & Examples

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Query Parameters | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | - | Health check & database connection verification | `200 OK` |
| `GET` | `/tasks` | `status`, `priority`, `search` | Get filtered tasks | `200 OK` |
| `GET` | `/tasks/stats/summary` | - | Get task counts (total, pending, in_progress, completed) | `200 OK` |
| `GET` | `/tasks/{id}` | - | Get single task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | - | Create new task (validated) | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/{id}` | - | Update existing task | `200 OK` / `400` / `404` |
| `DELETE`| `/tasks/{id}` | - | Delete task by ID | `200 OK` / `404 Not Found` |

### Example: Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Set up CI/CD Pipeline",
  "description": "Configure automated testing workflow",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-11-05"
}
```

**Response (`201 Created`)**:
```json
{
  "id": 1,
  "title": "Set up CI/CD Pipeline",
  "description": "Configure automated testing workflow",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-11-05",
  "created_at": "2026-10-22 14:00:00",
  "updated_at": "2026-10-22 14:00:00"
}
```
