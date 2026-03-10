
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
import { BudgetForm } from "@/components/budgets/budget-form";
import { CyberCard } from "@/components/ui/cyber-card";
import { 
  LayoutDashboard, 
  BrainCircuit, 
  ListOrdered, 
  Target, 
  LogOut, 
  Settings, 
  Bell, 
  Trash2, 
  RefreshCcw,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = 'dashboard' | 'transactions' | 'budgets' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('moneymind_transactions');
    const savedBudgets = localStorage.getItem('moneymind_budgets');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(MOCK_TRANSACTIONS);
    }

    if (savedBudgets) {
      setBudgetGoals(JSON.parse(savedBudgets));
    } else {
      setBudgetGoals(MOCK_BUDGET_GOALS);
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('moneymind_transactions', JSON.stringify(transactions));
      localStorage.setItem('moneymind_budgets', JSON.stringify(budgetGoals));
    }
  }, [transactions, budgetGoals, isLoaded]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudgetGoal = (goal: BudgetGoal) => {
    setBudgetGoals(prev => {
      const existing = prev.find(g => g.categoryId === goal.categoryId);
      if (existing) {
        return prev.map(g => g.categoryId === goal.categoryId ? goal : g);
      }
      return [...prev, goal];
    });
  };

  const deleteBudgetGoal = (id: string) => {
    setBudgetGoals(prev => prev.filter(g => g.id !== id));
  };

  const resetData = () => {
    setTransactions(MOCK_TRANSACTIONS);
    setBudgetGoals(MOCK_BUDGET_GOALS);
    localStorage.clear();
    alert("System core reset complete. Data restored to factory defaults.");
  };

  const totalBudget = budgetGoals.reduce((sum, g) => sum + g.amount, 0);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
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
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-3 p-3 w-full transition-all text-xs font-headline tracking-widest",
              activeTab === 'dashboard' ? "bg-primary/10 border-l-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <LayoutDashboard className="w-4 h-4" /> DASHBOARD
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={cn(
              "flex items-center gap-3 p-3 w-full transition-all text-xs font-headline tracking-widest",
              activeTab === 'transactions' ? "bg-primary/10 border-l-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <ListOrdered className="w-4 h-4" /> TRANSACTIONS
          </button>
          <button 
            onClick={() => setActiveTab('budgets')}
            className={cn(
              "flex items-center gap-3 p-3 w-full transition-all text-xs font-headline tracking-widest",
              activeTab === 'budgets' ? "bg-primary/10 border-l-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <Target className="w-4 h-4" /> BUDGETS
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-3 p-3 w-full transition-all text-xs font-headline tracking-widest",
              activeTab === 'settings' ? "bg-primary/10 border-l-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <Settings className="w-4 h-4" /> SYSTEM SETTINGS
          </button>
        </nav>

        <div className="p-4 border-t border-primary/20">
          <button className="flex items-center gap-3 p-3 w-full text-secondary text-xs font-headline tracking-widest hover:bg-secondary/10 transition-colors">
            <LogOut className="w-4 h-4" /> DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-primary/10 bg-cyber-dark/40 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-headline tracking-[0.2em] text-muted-foreground uppercase">
              CORE_TERMINAL / <span className="text-foreground">{activeTab}</span>
            </h2>
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

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar relative">
          <div className="fixed top-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-1/4 -left-20 w-96 h-96 bg-secondary/5 blur-[120px] pointer-events-none" />

          {activeTab === 'dashboard' && (
            <>
              <StatsGrid transactions={transactions} budgetTotal={totalBudget} />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                <TransactionForm categories={categories} onAdd={addTransaction} />
                <TransactionList transactions={transactions.slice(0, 10)} categories={categories} onDelete={deleteTransaction} />
                <BudgetList transactions={transactions} categories={categories} budgetGoals={budgetGoals} onDelete={deleteBudgetGoal} />
              </div>
            </>
          )}

          {activeTab === 'transactions' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-1">
                <TransactionForm categories={categories} onAdd={addTransaction} />
              </div>
              <div className="xl:col-span-3">
                <TransactionList 
                  transactions={transactions} 
                  categories={categories} 
                  onDelete={deleteTransaction} 
                  showFull
                />
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <BudgetForm categories={categories} onAdd={addBudgetGoal} />
              </div>
              <div className="xl:col-span-2">
                <BudgetList 
                  transactions={transactions} 
                  categories={categories} 
                  budgetGoals={budgetGoals} 
                  onDelete={deleteBudgetGoal}
                  showFull
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <CyberCard accentColor="purple" title="SYSTEM CONFIGURATION">
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h4 className="text-sm font-headline text-primary tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> SECURITY & DATA
                    </h4>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Reset System Database</p>
                          <p className="text-xs text-muted-foreground">Wipe all local records and restore factory mock data.</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={resetData}>
                          <RefreshCcw className="w-4 h-4 mr-2" /> FACTORY RESET
                        </Button>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-sm font-headline text-primary tracking-widest">NEURAL LINK INFO</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 border border-white/10">
                        <p className="text-[10px] text-muted-foreground uppercase">OS Version</p>
                        <p className="text-sm font-headline">MONEYMIND 2.5.0-STABLE</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10">
                        <p className="text-[10px] text-muted-foreground uppercase">Uptime</p>
                        <p className="text-sm font-headline text-accent">99.98%</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-sm font-headline text-primary tracking-widest">ABOUT DEVELOPER</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      MoneyMind is an experimental financial intelligence core designed to optimize resource allocation through advanced heuristics and predictive spending models. All data is processed locally within the user's neural sandbox.
                    </p>
                  </section>
                </div>
              </CyberCard>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
