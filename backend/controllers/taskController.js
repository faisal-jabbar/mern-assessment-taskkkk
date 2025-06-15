import Task from '../models/Task.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// ✅ GET all tasks (most recent due first)
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: -1 });
    res.status(200).json({ msg: 'Tasks fetched successfully', data: tasks });
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    next(err);
  }
};

// ✅ CREATE a new task
export const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: 'Validation failed', errors: errors.array() });
  }

  try {
    const newTask = new Task({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      position: count,
      priority: req.body.priority || 'medium',
      category: req.body.category || 'Other', 
    });

    const saved = await newTask.save();
    res.status(201).json({ msg: 'Task created', data: saved });
  } catch (err) {
    console.error('❌ Task creation error:', err.message);
    res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
};
// ✅ REORDER TASKS
export const reorderTasks = async (req, res, next) => {
  const { reorderedTasks } = req.body; // array of task IDs in new order

  if (!Array.isArray(reorderedTasks)) {
    return res.status(400).json({ msg: 'Invalid data format' });
  }

  try {
    const bulkOps = reorderedTasks.map((taskId, index) => ({
      updateOne: {
        filter: { _id: taskId, user: req.user.id },
        update: { position: index },
      },
    }));

    await Task.bulkWrite(bulkOps);
    res.status(200).json({ msg: 'Tasks reordered successfully' });
  } catch (err) {
    console.error('❌ Reorder error:', err);
    res.status(500).json({ msg: 'Failed to reorder tasks' });
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('Submitting formData:', formData); // ✅ Log what you're sending
    const token = localStorage.getItem('token');
    const res = await createTask(formData, token);
    toast.success('✅ Task created successfully');
    setFormData({ title: '', description: '', dueDate: '', priority: 'medium' });
    fetchTasks();
  } catch (err) {
    console.error('❌ Task creation error:', err.response?.data || err.message);
    toast.error(err.response?.data?.msg || 'Error creating task');
  }
};


export const getTasks = async (req, res, next) => {
  try {
const tasks = await Task.find({ user: req.user.id }).sort({ position: 1 });
    res.status(200).json({ msg: 'Tasks fetched successfully', data: tasks });
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    next(err);
  }
};


// ✅ UPDATE task
export const updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: 'Validation failed', errors: errors.array() });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    Object.assign(task, req.body);
    const updated = await task.save();
    res.status(200).json({ msg: 'Task updated successfully', data: updated });
  } catch (err) {
    console.error('❌ Task update failed:', err);
    next(err);
  }
};

// ✅ DELETE task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({ msg: 'Task deleted successfully', data: task });
  } catch (err) {
    console.error('❌ Task deletion failed:', err);
    next(err);
  }
};

// ✅ TOGGLE complete
export const toggleTaskCompletion = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.completed = !task.completed;
    const saved = await task.save();
    res.status(200).json({ msg: 'Task completion toggled', data: saved });
  } catch (err) {
    console.error('❌ Toggle completion failed:', err);
    next(err);
  }
};

// ✅ SEARCH tasks by title
export const searchTasks = async (req, res, next) => {
  try {
    const query = req.query.query || '';
    const tasks = await Task.find({
      user: req.user.id,
      title: { $regex: query, $options: 'i' },
    });

    res.status(200).json({ msg: 'Search completed', data: tasks });
  } catch (err) {
    console.error('❌ Search failed:', err);
    next(err);
  }
};

// ✅ PAGINATED tasks with filters
export const getPaginatedTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, priority, completed } = req.query;
    const filter = { user: req.user.id };

    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === 'true';

    const tasks = await Task.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Task.countDocuments(filter);

    res.status(200).json({
      msg: 'Paginated tasks fetched',
      data: tasks,
      pagination: { total: count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error('❌ Pagination failed:', err);
    next(err);
  }
};

export const getUpcomingTasks = async (req, res, next) => {
  try {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const tasks = await Task.find({
      user: req.user.id,
      dueDate: { $gte: today, $lte: threeDaysLater },
    }).sort({ dueDate: 1 });

    res.status(200).json({ msg: 'Upcoming tasks fetched', data: tasks });
  } catch (err) {
    next(err);
  }
};

