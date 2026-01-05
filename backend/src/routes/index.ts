import { Router } from 'express';
import authRoutes from './authRoutes';
import expenseRoutes from './expenseRoutes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);

export default router;

