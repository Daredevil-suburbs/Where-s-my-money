"use client"

import { useMemo } from 'react';
import { Target, Trash2, AlertCircle, AlertTriangle } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {budgets.length === 0 ? (
        <CyberCard accentColor="cyan" className="p-12 col-span-full flex flex-col items-center justify-center opacity-30 font-code text-xs space-y-4">
          <Target className="w-12 h-12" />
          <p>No quotas initialized in this sector.</p>
        </CyberCard>
      ) : (
        budgets.map(budget => {
          const spent = transactions
            .filter(t => t.category === budget.id && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const percentage = Math.round((spent / budget.limit) * 100);
          const alertThreshold = budget.alertAt || 80;
          const isNearLimit = percentage >= alertThreshold;
          const isOverLimit = spent > budget.limit;

          return (
            <CyberCard key={budget.id} accentColor={isOverLimit ? 'pink' : isNearLimit ? 'amber' : 'cyan'} className="p-6 group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 border rounded-sm",
                      isOverLimit ? "bg-secondary/10 border-secondary/30" : isNearLimit ? "bg-warning/10 border-warning/30" : "bg-primary/10 border-primary/30"
                    )}>
                      <Target className={cn("w-5 h-5", isOverLimit ? "text-secondary" : isNearLimit ? "text-warning" : "text-primary")} />
                    </div>
                    <div>
                      <h4 className="text-sm font-headline tracking-widest text-primary uppercase">{budget.id}</h4>
                      <p className="text-[10px] text-muted-foreground font-code uppercase">Quota: ₹{budget.limit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(budget.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-code uppercase">Utilization</span>
                      <span className={cn(
                        "text-xl font-headline",
                        isOverLimit ? "text-secondary neon-text-pink" : isNearLimit ? "text-warning neon-text-amber" : "text-foreground"
                      )}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground font-code uppercase">Spent / Remaining</span>
                      <p className="text-xs font-code">
                        ₹{spent.toLocaleString('en-IN')} / ₹{Math.max(0, budget.limit - spent).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="relative h-3 w-full bg-white/5 border border-white/10 overflow-hidden">
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
                    {/* Threshold marker */}
                    <div 
                      className="absolute top-0 h-full w-[1px] bg-warning/50 z-20"
                      style={{ left: `${alertThreshold}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {isOverLimit ? (
                    <Badge variant="destructive" className="h-5 px-2 text-[8px] animate-pulse flex gap-1 items-center">
                      <AlertCircle className="w-3 h-3" /> CRITICAL_OVERRUN
                    </Badge>
                  ) : isNearLimit ? (
                    <Badge className="h-5 px-2 text-[8px] bg-warning text-black animate-pulse flex gap-1 items-center">
                      <AlertTriangle className="w-3 h-3" /> WARNING: THRESHOLD
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="h-5 px-2 text-[8px] border-accent/30 text-accent uppercase font-code">
                      Sector_Stable
                    </Badge>
                  )}
                  <Badge variant="outline" className="h-5 px-2 text-[8px] border-white/10 text-muted-foreground font-code">
                    ALERT_AT: {alertThreshold}%
                  </Badge>
                </div>
              </div>
            </CyberCard>
          );
        })
      )}
    </div>
  );
}
