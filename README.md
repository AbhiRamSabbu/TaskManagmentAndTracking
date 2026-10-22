# TaskFlow - Frontend Dashboard

A responsive task management dashboard built with **React** and **Vite**, connecting to the Spring Boot REST API.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [API Proxy Configuration](#-api-proxy-configuration)

---

## ✨ Features

- **Summary Metric Counters**: Live counters for Total, Pending, In Progress, and Completed tasks.
- **Task Creation & Editing Form**:
  - Title (Required, max 255 chars)
  - Description (Optional notes)
  - Priority (Low, Medium, High)
  - Status (Pending, In Progress, Completed)
  - Due Date (Date picker)
- **Task Table**: Clean tabular layout displaying task rows with priority badges and status badges.
- **Filtering & Search**: Live keyword search plus dropdown filters for Status and Priority.
- **Edit & Delete Actions**: Edit button populates the form for immediate update; Delete button confirms before deleting.
- **Visual Feedback**: Built-in loading states, success alerts, and error banners.

---

## 🛠 Tech Stack
- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Clean, responsive CSS (`App.css`)

---

## 🏛 Project Structure

```
.
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # App icon
│   ├── src/
│   │   ├── App.jsx                  # Main dashboard, state, form & table
│   │   ├── App.css                  # Dashboard styles
│   │   ├── index.css                # Base stylesheet
│   │   └── main.jsx                 # React root renderer
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Reverse proxy for /api -> localhost:5000
│   └── package.json                 # Dependencies & scripts
├── .gitignore
└── README.md
```

---

## 💻 Prerequisites
- Node.js (v18 or higher recommended)
- npm (installed with Node.js)
- Running Spring Boot backend on `http://localhost:5000`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The application will start on **`http://localhost:5173`**.

### 3. Build for Production
```bash
npm run build
```
Compiled production files will be output to `frontend/dist`.

---

## 📡 API Proxy Configuration

In `frontend/vite.config.js`, all requests matching `/api/*` are automatically forwarded to the Spring Boot backend:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```
This enables full API communication during local development without CORS issues.
