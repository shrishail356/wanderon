import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  loginCount: number;
}

export interface IExpense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Income'
  | 'Other';

export type ExpenseType = 'income' | 'expense';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  description?: string;
  date: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  type?: ExpenseType;
  description?: string;
  date?: string;
}

