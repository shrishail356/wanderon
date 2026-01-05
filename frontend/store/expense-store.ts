import { create } from 'zustand';

export interface Expense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) =>
    set((state) => ({
      expenses: [expense, ...state.expenses],
    })),
  updateExpense: (id, expense) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e._id === id ? expense : e)),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e._id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

