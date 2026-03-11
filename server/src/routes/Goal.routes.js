import express from 'express';
import { addGoal, updateGoalProgress, getAllGoals, deleteGoal } from '../controllers/Goal.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All goal routes require authentication
router.use(authMiddleware);

router.get('/all', getAllGoals);
router.patch("/progress/:id", updateGoalProgress);
router.post('/add', addGoal);
router.delete('/:id', deleteGoal);

export default router;