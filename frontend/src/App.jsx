import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = '/api/tasks?';
      if (filterStatus !== 'All') {
        url += 'status=' + encodeURIComponent(filterStatus) + '&';
      }
      if (filterPriority !== 'All') {
        url += 'priority=' + encodeURIComponent(filterPriority) + '&';
      }
      if (search.trim() !== '') {
        url += 'search=' + encodeURIComponent(search.trim()) + '&';
      }

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setTasks(Array.isArray(data) ? data : (data.data || []));
      } else {
        setTasks([]);
      }
    } catch (err) {
      setErrorMessage('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a task title.');
      return;
    }
    if (!dueDate) {
      setErrorMessage('Please pick a due date.');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority: priority,
      status: status,
      due_date: dueDate
    };

    try {
      if (editingId) {
        const res = await fetch('/api/tasks/' + editingId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const result = await res.json();

        if (res.ok) {
          setMessage('Task updated successfully!');
          resetForm();
          fetchTasks();
        } else {
          setErrorMessage(result.message || 'Failed to update task.');
        }
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const result = await res.json();

        if (res.ok) {
          setMessage('Task created successfully!');
          resetForm();
          fetchTasks();
        } else {
          setErrorMessage(result.message || 'Failed to create task.');
        }
      }
    } catch (err) {
      setErrorMessage('Error communicating with the server.');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'Medium');
    setStatus(task.status || 'Pending');
    setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setMessage('');
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('Pending');
    setDueDate('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const res = await fetch('/api/tasks/' + id, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessage('Task deleted successfully!');
        if (editingId === id) {
          resetForm();
        }
        fetchTasks();
      } else {
        setErrorMessage('Failed to delete task.');
      }
    } catch (err) {
      setErrorMessage('Error deleting task.');
    }
  };

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="container">
      <header className="header">
        <h1>Task Manager</h1>
      </header>

      <div className="stats-box">
        <div className="stat-item">
          <strong>Total:</strong> {totalCount}
        </div>
        <div className="stat-item">
          <strong>Pending:</strong> {pendingCount}
        </div>
        <div className="stat-item">
          <strong>In Progress:</strong> {inProgressCount}
        </div>
        <div className="stat-item">
          <strong>Completed:</strong> {completedCount}
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <div className="card">
        <h2>{editingId ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Task List</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-text">No tasks found.</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                  </td>
                  <td>{task.description || '-'}</td>
                  <td>
                    <span className={'badge priority-' + task.priority.toLowerCase()}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={'badge status-' + task.status.toLowerCase().replace(' ', '-')}>
                      {task.status}
                    </span>
                  </td>
                  <td>{task.due_date}</td>
                  <td>
                    <button
                      className="btn-link edit"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-link delete"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
