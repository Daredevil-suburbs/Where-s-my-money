import { Transaction } from "@/lib/types";
import { CyberCard } from "../ui/cyber-card";
import { TrendingDown, TrendingUp, Wallet, Target } from "lucide-react";

export function StatsGrid({ transactions, budgetTotal }: { transactions: Transaction[], budgetTotal: number }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CyberCard accentColor="blue" className="p-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/20 border border-primary/50">
            <Wallet className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">Total Balance</p>
            <p className="text-2xl font-headline neon-text-blue">${balance.toLocaleString()}</p>
          </div>
        </div>
      </CyberCard>

      <CyberCard accentColor="green" className="p-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-accent/20 border border-accent/50">
            <TrendingUp className="text-accent w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">Total Income</p>
            <p className="text-2xl font-headline neon-text-green">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
      </CyberCard>

      <CyberCard accentColor="purple" className="p-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-secondary/20 border border-secondary/50">
            <TrendingDown className="text-secondary w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">Total Expenses</p>
            <p className="text-2xl font-headline neon-text-purple">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </CyberCard>

      <CyberCard accentColor="blue" className="p-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/20 border border-primary/50">
            <Target className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">Budget Goal</p>
            <p className="text-2xl font-headline text-primary">${budgetTotal.toLocaleString()}</p>
          </div>
        </div>
      </CyberCard>
    </div>
  );
}
