
"use client"

import { ArrowRight, AlertTriangle, Target, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CyberCard } from "../ui/cyber-card";
import { Badge } from "../ui/badge";

interface BudgetListProps {
  transactions: any[];
  budgets: any[];
  onDelete: (id: string) => void;
  showFull?: boolean;
}

export function BudgetList({ 
  transactions, 
  budgets,
  onDelete,
  showFull = false
}: BudgetListProps) {
  return (
    <CyberCard accentColor="cyan" className="p-6 h-full">
      <h3 className="text-sm font-headline tracking-widest text-primary neon-text-cyan uppercase mb-6 flex items-center justify-between">
        Resource_Quotas
        <span className="text-[10px] text-muted-foreground font-code uppercase tracking-tighter">Budget Utilization</span>
      </h3>

      <div className={cn(
        "space-y-8 pr-2 custom-scrollbar overflow-y-auto",
        showFull ? "max-h-[700px]" : "max-h-[400px]"
      )}>
        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 font-code text-xs space-y-4">
            <Target className="w-8 h-8" />
            <p>No quotas initialized in this sector.</p>
          </div>
        ) : (
          budgets.map(budget => {
            const spent = transactions
              .filter(t => t.category === budget.id && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            
            const percentage = Math.round((spent / budget.limit) * 100);
            const isNearLimit = percentage >= (budget.alertAt || 80);
            const isOverLimit = spent > budget.limit;

            return (
              <div key={budget.id} className="group space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/5 border border-primary/20 rounded-sm">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-headline text-primary tracking-widest uppercase">{budget.id}</span>
                        {isOverLimit ? (
                          <Badge variant="destructive" className="h-4 px-1 text-[8px] animate-pulse">CRITICAL_OVERRUN</Badge>
                        ) : isNearLimit ? (
                          <Badge className="h-4 px-1 text-[8px] bg-warning text-black animate-pulse">WARNING: THRESHOLD</Badge>
                        ) : null}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-code uppercase mt-0.5">
                        Limit: ₹{budget.limit.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-headline tracking-tighter",
                        isOverLimit ? "text-secondary neon-text-pink" : isNearLimit ? "text-warning neon-text-amber" : "text-foreground"
                      )}>
                        ₹{spent.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-code uppercase">
                        Utilization: {percentage}%
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onDelete(budget.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative h-2 w-full bg-white/5 border border-white/10 overflow-hidden">
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-full transition-all duration-1000 ease-out",
                      isOverLimit 
                        ? "bg-secondary shadow-[0_0_15px_#ff006e]" 
                        : isNearLimit 
                          ? "bg-warning shadow-[0_0_15px_#ffaa00]" 
                          : "bg-primary shadow-[0_0_15px_#00f5ff]"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </CyberCard>
  );
}
