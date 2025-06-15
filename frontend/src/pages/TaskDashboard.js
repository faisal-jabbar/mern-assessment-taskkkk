import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import EditTaskModal from '../components/EditTaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { toast } from 'react-toastify';
import { unparse } from 'papaparse';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  fetchTasks as apiFetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask
} from '../services/api';

import '../styles/animations.css';

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'Other',
  });
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;

const fetchTasks = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const res = await apiFetchTasks(token);
    console.log('📦 API response:', res.data); // Debug line
    setTasks(Array.isArray(res.data?.data) ? res.data.data : []);
  } catch (err) {
    console.error('❌ Fetch tasks error:', err);
    alert('Error fetching tasks');
  }
  setLoading(false);
};


  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('Submitting formData:', formData);
    const token = localStorage.getItem('token');

    const res = await createTask({ ...formData, position: tasks.length }, token); // ✅ Send position
    toast.success('✅ Task created successfully');

    setFormData({ title: '', description: '', dueDate: '', priority: 'medium', category: 'Other' });
    fetchTasks();
  } catch (err) {
    console.error('❌ Task creation error:', err.response?.data || err.message);
    toast.error(err.response?.data?.msg || 'Error creating task');
  }
};




const handleExportCSV = () => {
  const csv = unparse(tasks, {
    columns: ['title', 'description', 'dueDate', 'priority', 'completed'],
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'tasks.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const toggleComplete = async id => {
    try {
      const token = localStorage.getItem('token');
await toggleTask(id, token);
fetchTasks();
    } catch {
      alert('Error toggling task');
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
await deleteTask(deleteId, token);

      toast.success('🗑️ Task deleted');
      setDeleteId(null);
      fetchTasks();
    } catch {
      toast.error('❌ Failed to delete task');
    }
  };

 const saveTaskEdits = async updatedTask => {
  try {
    console.log('✏️ Submitting update for task:', updatedTask);
    const token = localStorage.getItem('token');
const res = await updateTask(updatedTask._id, updatedTask, token);

    console.log('✅ Task Updated:', res.data);
    toast.success('✅ Task updated successfully');
    setShowEditModal(false);
    setEditingTask(null);
    fetchTasks();
  } catch (err) {
    console.error('❌ Task Update Error:', err.response?.data || err.message);
    toast.error(err.response?.data?.msg || 'Failed to update task');
  }
};

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    const reorderedTaskIds = items.map(task => task._id);

    try {
      await axios.patch('/api/tasks/reorder', {
        reorderedTasks: reorderedTaskIds,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error('❌ Failed to reorder:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
      filter.status === 'all' ||
      (filter.status === 'completed' && task.completed) ||
      (filter.status === 'pending' && !task.completed);
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <>
      <NavBar />

      <div className="container py-5">
        <h2 className="mb-4 text-center">📝 Task Dashboard</h2>

        <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <input type="text" name="title" placeholder="Title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input type="text" name="description" placeholder="Description" className="form-control" value={formData.description} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <input type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} required />
            </div>
            <div className="col-md-2">
              <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
           <div className="col-md-2">
  <select
  name="category"
  className="form-select"
  value={formData.category}
  onChange={handleChange}
>
  <option value="Work">Work</option>
  <option value="Personal">Personal</option>
  <option value="Urgent">Urgent</option>
  <option value="Other">Other</option>
</select>

</div>
<div className="d-flex gap-2 mb-3">
  <button className="btn btn-outline-success" onClick={handleExportCSV}>Export CSV</button>
</div>

<div className="col-md-2 d-grid">
  <button type="submit" className="btn btn-success">Add Task</button>
</div>

          </div>
        </form>

        <div className="d-flex gap-3 mb-3">
          <select className="form-select" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <select className="form-select" value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="text" className="form-control" placeholder="Search by title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>

        {loading ? (
          <div className="text-center my-4">Loading tasks...</div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="taskList">
    {(provided) => (
      <ul className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
        {currentTasks.length === 0 ? (
          <li className="list-group-item text-center">No tasks to show</li>
        ) : (
          currentTasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided) => (
                <li
                  className={`list-group-item d-flex justify-content-between align-items-center fade-in ${task.completed ? 'list-group-item-success' : ''}`}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div>
                    <h5 className="mb-1">{task.title}</h5>
                    <small className="text-muted">
                      {task.description} | Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                    <div>
                      <span className={`badge bg-${getPriorityColor(task.priority)} me-2`}>{task.priority}</span>
                      <span className="badge bg-info me-2">{task.category}</span>
                      {task.completed && <span className="badge bg-success">Completed</span>}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => toggleComplete(task._id)}>
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingTask(task); setShowEditModal(true); }}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(task._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              )}
            </Draggable>
          ))
        )}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>

        )}

        <div className="d-flex justify-content-center mt-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} className={`btn btn-sm mx-1 ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          ))}
        </div>
      </div>

      {showEditModal && editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setShowEditModal(false)} onSave={saveTaskEdits} />
      )}

      {deleteId && (
        <DeleteConfirmModal onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
      )}
    </>
    
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'danger';
    case 'medium': return 'warning';
    case 'low': return 'secondary';
    default: return 'light';
  }
}

export default TaskDashboard;
