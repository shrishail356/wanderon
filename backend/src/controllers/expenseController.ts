import { Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expenseService';
import { sendSuccess } from '../utils/response';
import { AuthRequest, CreateExpenseRequest, UpdateExpenseRequest } from '../types';

export class ExpenseController {
  /**
   * Create a new expense
   */
  static async createExpense(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.userId;
      const data: CreateExpenseRequest = req.body;

      const expense = await ExpenseService.createExpense(userId, data);

      return sendSuccess(res, { expense }, 'Expense created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all expenses for the current user
   */
  static async getExpenses(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.userId;
      const {
        type,
        category,
        startDate,
        endDate,
        limit = '50',
        page = '1',
      } = req.query;

      const result = await ExpenseService.getUserExpenses(userId, {
        type: type as string,
        category: category as string,
        startDate: startDate as string,
        endDate: endDate as string,
        limit: parseInt(limit as string, 10),
        page: parseInt(page as string, 10),
      });

      return sendSuccess(res, result, 'Expenses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense by ID
   */
  static async getExpenseById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const expense = await ExpenseService.getExpenseById(id, userId);

      return sendSuccess(res, { expense }, 'Expense retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update expense
   */
  static async updateExpense(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const data: UpdateExpenseRequest = req.body;

      const expense = await ExpenseService.updateExpense(id, userId, data);

      return sendSuccess(res, { expense }, 'Expense updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete expense
   */
  static async deleteExpense(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      await ExpenseService.deleteExpense(id, userId);

      return sendSuccess(res, null, 'Expense deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense statistics
   */
  static async getStatistics(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate } = req.query;

      const statistics = await ExpenseService.getExpenseStatistics(
        userId,
        startDate as string,
        endDate as string
      );

      return sendSuccess(res, { statistics }, 'Statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

