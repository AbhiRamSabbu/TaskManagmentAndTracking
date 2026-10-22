# TaskFlow - Full-Stack Task Management Dashboard

A full-stack task management application built with a responsive **React** frontend and a **Spring Boot** REST backend connected to **MySQL**.

---

## 📋 Table of Contents
- [Requirements Checklist](#-requirements-checklist)
- [Project Architecture](#-project-architecture)
- [Database Schema (MySQL)](#-database-schema-mysql)
- [Backend Security Best Practices](#-backend-security-best-practices)
- [Running the Spring Boot Backend](#-running-the-spring-boot-backend)
- [Running the React Frontend](#-running-the-react-frontend)
- [REST API Documentation & Examples](#-rest-api-documentation--examples)
- [Git Version Control](#-git-version-control)

---

## ✅ Requirements Checklist

### 1. Frontend
- Clean, responsive dashboard.
- Task form with fields: **Title**, **Description**, **Priority** (`Low`, `Medium`, `High`), **Status** (`Pending`, `In Progress`, `Completed`), and **Due Date**.
- Task table layout displaying task rows.
- Full edit and delete capabilities (editing populates the form; deletion prompts confirmation).
- Live filtering by **Status** and **Priority**, plus keyword search.
- Summary counter boxes for **Total Tasks**, **Pending Tasks**, **In Progress Tasks**, and **Completed Tasks**.
- Client validation and feedback messages (loading indicator, success alert, and error alert).

### 2. Backend
- RESTful APIs implemented with **Spring Boot 2.7 / Java 11**:
  - `GET /api/tasks` – Retrieve all tasks (supports `status`, `priority`, and `search` query parameters).
  - `GET /api/tasks/:id` – Retrieve a specific task by numeric ID.
  - `POST /api/tasks` – Create a new task with validation.
  - `PUT /api/tasks/:id` – Update task fields or status.
  - `DELETE /api/tasks/:id` – Delete a task.
  - `GET /api/tasks/stats/summary` – Retrieve summary statistics based on actual records.
  - `GET /api/health` – Health check endpoint reporting application and MySQL connection status.
- Strict HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.

### 3. Database
- **MySQL** relational database persistence (`task_management_db`).
- `tasks` table with fields: `id`, `title`, `description`, `priority`, `status`, `due_date`, `created_at`, `updated_at`.
- Automated Hibernate schema management (`ddl-auto=update`) plus standalone schema script in `database/schema.sql`.

---

## 🏛 Project Architecture

```
d:\Test\
├── springboot-backend/              # Spring Boot REST API
│   ├── src/main/java/com/example/taskflow/
│   │   ├── config/                  # WebConfig (CORS), GlobalExceptionHandler
│   │   ├── controller/              # TaskController (/api/tasks, /api/health)
│   │   ├── model/                   # Task JPA Entity
│   │   ├── repository/              # TaskRepository (JPQL filters & counts)
│   │   └── TaskflowApplication.java # Spring Boot entry point
│   ├── src/main/resources/
│   │   └── application.properties   # MySQL credentials & JPA configuration
│   └── pom.xml
│
├── frontend/                        # Minimal React (Vite) Frontend
│   ├── src/
│   │   ├── App.jsx                  # Dashboard, form, filters, and task list
│   │   ├── App.css                  # Simple stylesheet
│   │   ├── index.css                # Base reset
│   │   └── main.jsx                 # React root render
│   ├── vite.config.js               # Proxy /api to backend
│   └── package.json
│
├── database/
│   └── schema.sql                   # MySQL schema, indexes, & seed data
├── package.json                     # Root runner scripts
└── README.md
```

---

## 🗄 Database Schema (MySQL)

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

---

## 🛡️ Backend Security Best Practices

1. **SQL Injection Prevention**: Parameterized queries using Spring Data JPA (`@Param`).
2. **Input Validation**: JSR-380 validation (`@Valid`, `@NotBlank`, `@Size(max = 255)`, `@Pattern`, `@NotNull`).
3. **No Information Leakage (CWE-209)**: `GlobalExceptionHandler` logs exceptions internally and sends safe, generic messages to the client.
4. **ID Tampering Protection**: `POST /api/tasks` sets `task.setId(null)` to prevent overwriting existing rows.
5. **CORS Safety**: Explicitly whitelists only trusted local origins (`http://localhost:5173`, `http://127.0.0.1:5173`).

---

## ☕ Running the Spring Boot Backend

### Prerequisites
- Java JDK 11 or higher installed (`java -version`)
- Maven installed (`mvn -v`)
- MySQL running on port 3306 with credentials matching `springboot-backend/src/main/resources/application.properties`

### Start Command
```bash
cd springboot-backend
mvn spring-boot:run
```
Or run the packaged JAR:
```bash
java -jar springboot-backend/target/taskflow-backend-1.0.0.jar
```
*Backend runs on:* **`http://localhost:5000`**

---

## 💻 Running the React Frontend

### Prerequisites
- Node.js installed

### Start Command
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on:* **`http://localhost:5173`**

---

## 📡 REST API Documentation & Examples

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Query Parameters | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | - | Health check and database status | `200 OK` |
| `GET` | `/tasks` | `status`, `priority`, `search` | Get filtered tasks | `200 OK` |
| `GET` | `/tasks/stats/summary` | - | Get task counts | `200 OK` |
| `GET` | `/tasks/{id}` | - | Get single task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | - | Create new task | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/{id}` | - | Update existing task | `200 OK` / `400` / `404` |
| `DELETE`| `/tasks/{id}` | - | Delete task by ID | `200 OK` / `404 Not Found` |

### Example 1: Create Task
**Request**:
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Build Spring Boot REST API",
  "description": "Implement CRUD endpoints and MySQL integration",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-11-15"
}
```

**Response (`201 Created`)**:
```json
{
  "id": 6,
  "title": "Build Spring Boot REST API",
  "description": "Implement CRUD endpoints and MySQL integration",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-11-15",
  "created_at": "2026-10-22 14:00:00",
  "updated_at": "2026-10-22 14:00:00"
}
```

### Example 2: Update Task
**Request**:
```http
PUT /api/tasks/6
Content-Type: application/json

{
  "status": "Completed"
}
```

**Response (`200 OK`)**:
```json
{
  "id": 6,
  "title": "Build Spring Boot REST API",
  "description": "Implement CRUD endpoints and MySQL integration",
  "priority": "High",
  "status": "Completed",
  "due_date": "2026-11-15",
  "created_at": "2026-10-22 14:00:00",
  "updated_at": "2026-10-22 14:05:00"
}
```

---

## 🐙 Git Version Control

To link and push this codebase to your remote repository:

```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```
