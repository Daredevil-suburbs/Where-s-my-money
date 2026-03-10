import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Groceries', color: '#00FFFF' },
  { id: 'cat_2', name: 'Utilities', color: '#FF00FF' },
  { id: 'cat_3', name: 'Entertainment', color: '#39FF14' },
  { id: 'cat_4', name: 'Salary', color: '#00FF00' },
  { id: 'cat_5', name: 'Transport', color: '#FFFF00' },
  { id: 'cat_6', name: 'Health', color: '#FF0000' },
];

export const MOCK_TRANSACTIONS = [
  { id: 't1', amount: 5000, date: '2025-05-01', description: 'Monthly Salary', categoryId: 'cat_4', type: 'income' as const },
  { id: 't2', amount: 120.50, date: '2025-05-05', description: 'Whole Foods', categoryId: 'cat_1', type: 'expense' as const },
  { id: 't3', amount: 85.00, date: '2025-05-10', description: 'Electric Bill', categoryId: 'cat_2', type: 'expense' as const },
  { id: 't4', amount: 60.00, date: '2025-05-12', description: 'Movie Night', categoryId: 'cat_3', type: 'expense' as const },
  { id: 't5', amount: 45.00, date: '2025-05-15', description: 'Gas Station', categoryId: 'cat_5', type: 'expense' as const },
];

export const MOCK_BUDGET_GOALS = [
  { id: 'bg1', categoryId: 'cat_1', amount: 600, period: 'monthly' as const },
  { id: 'bg2', categoryId: 'cat_2', amount: 200, period: 'monthly' as const },
  { id: 'bg3', categoryId: 'cat_3', amount: 300, period: 'monthly' as const },
];
