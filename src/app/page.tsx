"use client"

import { useState, useEffect } from 'react';
import { Transaction, Category, BudgetGoal } from "@/lib/types";
import { INITIAL_CATEGORIES, MOCK_TRANSACTIONS, MOCK_BUDGET_GOALS } from "@/lib/constants";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { BudgetList } from "@/components/budgets/budget-list";
import { CyberCard } from "@/components/ui/cyber-card";
import { LayoutDashboard, BrainCircuit, ListOrdered, Target, LogOut, Settings, Bell } from "lucide-react";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [budgetGoals] = useState<BudgetGoal[]>(MOCK_BUDGET_GOALS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage or mock
    const saved = localStorage.getItem('moneymind_data');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions(MOCK_TRANSACTIONS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('moneymind_data', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const totalBudget = budgetGoals.reduce((sum, g) => sum + g.amount, 0);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside className="w-64 hidden lg:flex flex-col border-r border-primary/20 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <BrainCircuit className="text-black w-5 h-5" />
            </div>
            <h1 className="font-headline text-xl tracking-tighter neon-text-blue">MONEYMIND</h1>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 tracking-widest uppercase">FINANCIAL INTELLIGENCE v2.5</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 p-3 bg-primary/10 border-l-2 border-primary text-primary text-xs font-headline tracking-widest">
            <LayoutDashboard className="w-4 h-4" /> DASHBOARD
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all text-xs font-headline tracking-widest">
            <ListOrdered className="w-4 h-4" /> TRANSACTIONS
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all text-xs font-headline tracking-widest">
            <Target className="w-4 h-4" /> BUDGETS
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all text-xs font-headline tracking-widest">
            <Settings className="w-4 h-4" /> SYSTEM SETTINGS
          </a>
        </nav>

        <div className="p-4 border-t border-primary/20">
          <button className="flex items-center gap-3 p-3 w-full text-secondary text-xs font-headline tracking-widest hover:bg-secondary/10 transition-colors">
            <LogOut className="w-4 h-4" /> DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-primary/10 bg-cyber-dark/40 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-headline tracking-[0.2em] text-muted-foreground">CORE_TERMINAL / <span className="text-foreground">DASHBOARD</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Neural Link Active</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full text-primary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-sm border border-primary/50 overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" data-ai-hint="cyberpunk avatar" />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar relative">
          {/* Ambient Background Glows */}
          <div className="fixed top-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-1/4 -left-20 w-96 h-96 bg-secondary/5 blur-[120px] pointer-events-none" />

          {/* Stats Overview */}
          <StatsGrid transactions={transactions} budgetTotal={totalBudget} />

          {/* Row 1: Chart & AI */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <CyberCard 
              accentColor="blue" 
              className="xl:col-span-2" 
              title="SPENDING_DYNAMICS_VISUALIZER"
              headerAction={<span className="text-[10px] text-muted-foreground uppercase">Real-time telemetry</span>}
            >
              <SpendingChart transactions={transactions} categories={categories} />
            </CyberCard>
            <AIInsights transactions={transactions} categories={categories} budgetGoals={budgetGoals} />
          </div>

          {/* Row 2: Logging & Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
            <TransactionForm categories={categories} onAdd={addTransaction} />
            <TransactionList transactions={transactions} categories={categories} />
            <BudgetList transactions={transactions} categories={categories} budgetGoals={budgetGoals} />
          </div>
        </div>
      </main>
    </div>
  );
}
