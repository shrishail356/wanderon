import { Expense, IExpenseDocument } from '../models/Expense';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../types';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { sanitizeInput, sanitizeObject } from '../utils/sanitize';
import mongoose from 'mongoose';

export class ExpenseService {
  /**
   * Create a new expense
   */
  static async createExpense(
    userId: string,
    data: CreateExpenseRequest
  ): Promise<IExpenseDocument> {
    // Sanitize input
    const sanitizedData = sanitizeObject({
      title: sanitizeInput(data.title),
      amount: data.amount,
      category: data.category,
      type: data.type,
      description: data.description ? sanitizeInput(data.description) : undefined,
      date: new Date(data.date),
    });

    const expense = await Expense.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...sanitizedData,
    });

    return expense;
  }

  /**
   * Get all expenses for a user with optional filters
   */
  static async getUserExpenses(
    userId: string,
    filters: {
      type?: string;
      category?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      page?: number;
    } = {}
  ): Promise<{ expenses: IExpenseDocument[]; total: number; page: number; pages: number }> {
    const { type, category, startDate, endDate, limit = 50, page = 1 } = filters;

    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Expense.countDocuments(query),
    ]);

    return {
      expenses: expenses as unknown as IExpenseDocument[],
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get expense by ID
   */
  static async getExpenseById(
    expenseId: string,
    userId: string
  ): Promise<IExpenseDocument> {
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    if (expense.userId.toString() !== userId) {
      throw new AuthorizationError('You do not have permission to access this expense');
    }

    return expense;
  }

  /**
   * Update expense
   */
  static async updateExpense(
    expenseId: string,
    userId: string,
    data: UpdateExpenseRequest
  ): Promise<IExpenseDocument> {
    // Check if expense exists and belongs to user (throws error if not found or unauthorized)
    await this.getExpenseById(expenseId, userId);

    // Sanitize input
    const sanitizedData: any = {};
    if (data.title) sanitizedData.title = sanitizeInput(data.title);
    if (data.amount !== undefined) sanitizedData.amount = data.amount;
    if (data.category) sanitizedData.category = data.category;
    if (data.type) sanitizedData.type = data.type;
    if (data.description !== undefined) {
      sanitizedData.description = data.description ? sanitizeInput(data.description) : undefined;
    }
    if (data.date) sanitizedData.date = new Date(data.date);

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { $set: sanitizedData },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      throw new NotFoundError('Expense not found');
    }

    return updatedExpense;
  }

  /**
   * Delete expense
   */
  static async deleteExpense(expenseId: string, userId: string): Promise<void> {
    // Check if expense exists and belongs to user
    await this.getExpenseById(expenseId, userId);

    const deleted = await Expense.findByIdAndDelete(expenseId);
    if (!deleted) {
      throw new NotFoundError('Expense not found');
    }
  }

  /**
   * Get expense statistics for a user
   */
  static async getExpenseStatistics(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(query).lean();

    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory: Record<string, number> = {};
    const byType: Record<string, number> = { income: 0, expense: 0 };

    expenses.forEach((expense) => {
      if (expense.type === 'income') {
        totalIncome += expense.amount;
        byType.income += expense.amount;
      } else {
        totalExpense += expense.amount;
        byType.expense += expense.amount;
      }

      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory,
      byType,
    };
  }
}

