import { Router } from 'express';
import { ExpenseController } from '../controllers/expenseController';
import { createExpenseValidation, updateExpenseValidation } from '../utils/validation';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

// All expense routes require authentication
router.use(authenticate);

router.post(
  '/',
  validate(createExpenseValidation),
  ExpenseController.createExpense
);

router.get('/', ExpenseController.getExpenses);

router.get('/statistics', ExpenseController.getStatistics);

router.get('/:id', ExpenseController.getExpenseById);

router.put(
  '/:id',
  validate(updateExpenseValidation),
  ExpenseController.updateExpense
);

router.delete('/:id', ExpenseController.deleteExpense);

export default router;

