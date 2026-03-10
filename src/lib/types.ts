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
  description: string;
  categoryId: string;
  type: TransactionType;
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
