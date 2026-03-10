
"use client"

import { Transaction, Category, BudgetGoal } from "@/lib/types";
import { CyberCard } from "../ui/cyber-card";
import { Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BudgetList({ 
  transactions, 
  categories, 
  budgetGoals,
  onDelete,
  showFull = false
}: { 
  transactions: Transaction[], 
  categories: Category[],
  budgetGoals: BudgetGoal[],
  onDelete?: (id: string) => void,
  showFull?: boolean
}) {
  return (
    <CyberCard accentColor="blue" title={showFull ? "FULL RESOURCE ALLOCATION TABLE" : "RESOURCE ALLOCATION STATUS"}>
      <div className={cn(
        "space-y-6 overflow-y-auto pr-2 custom-scrollbar",
        showFull ? "max-h-[600px]" : "max-h-[400px]"
      )}>
        {budgetGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-50">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-center text-xs italic">No resource quotas established.</p>
          </div>
        ) : (
          budgetGoals.map(goal => {
            const category = categories.find(c => c.id === goal.categoryId);
            const spent = transactions
              .filter(t => t.categoryId === goal.categoryId && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            
            const percentage = Math.min((spent / goal.amount) * 100, 100);
            const isOver = spent > goal.amount;

            return (
              <div key={goal.id} className="group space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(goal.id)}
                        className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <div>
                      <span className="text-xs font-headline text-primary tracking-widest">{category?.name}</span>
                      <p className="text-[10px] text-muted-foreground uppercase">Target: ₹{goal.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-sm font-headline",
                      isOver ? "text-destructive" : "text-foreground"
                    )}>
                      ₹{spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">/ {percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="relative h-2 w-full bg-white/5 border border-white/10">
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-full transition-all duration-500",
                      isOver ? "bg-destructive shadow-[0_0_8px_rgba(255,0,0,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(0,255,255,0.5)]"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                  {isOver && (
                    <div className="absolute -top-4 right-0 text-[8px] text-destructive font-bold uppercase animate-pulse">
                      BUDGET OVERRUN DETECTED
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </CyberCard>
  );
}
