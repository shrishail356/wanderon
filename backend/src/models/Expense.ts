import mongoose, { Schema, Document } from 'mongoose';
import { ExpenseCategory, ExpenseType } from '../types';

export interface IExpenseDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpenseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Food & Dining',
          'Transportation',
          'Shopping',
          'Bills & Utilities',
          'Entertainment',
          'Healthcare',
          'Education',
          'Travel',
          'Income',
          'Other',
        ],
        message: 'Invalid category',
      },
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        const { __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

// Compound index for efficient queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, type: 1 });

export const Expense = mongoose.model<IExpenseDocument>('Expense', expenseSchema);

