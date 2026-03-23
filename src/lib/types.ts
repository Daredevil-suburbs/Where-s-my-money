export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  description?: string;
  desc?: string;
  categoryId?: string;
  category?: string;
  type: TransactionType;
  recurring?: boolean;
  createdAt?: string;
}

export interface BudgetGoal {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly';
}

export interface FinancialState {
  transactions: Transaction[];
  categories: Category[];
  budgetGoals: BudgetGoal[];
}
