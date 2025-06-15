// ✅ /routes/taskRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { taskValidationRules } from '../validators/taskValidator.js';
import { reorderTasks } from '../controllers/taskController.js';

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  searchTasks,
  getPaginatedTasks,
  getUpcomingTasks,
} from '../controllers/taskController.js';

const router = express.Router();

// 🟢 STANDARD TASK ROUTES (CRUD)
router.get('/', protect, getTasks);
router.post('/', protect, taskValidationRules, createTask);
router.put('/:id', protect, taskValidationRules, updateTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/toggle', protect, toggleTaskCompletion);

// 🔵 ADVANCED QUERIES
router.get('/search', protect, searchTasks);
router.get('/paginated', protect, getPaginatedTasks);
router.get('/upcoming', protect, getUpcomingTasks);

router.patch('/reorder', protect, reorderTasks); // 🟢 Add this route

export default router;
