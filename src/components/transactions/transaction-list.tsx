
"use client"

import { useState } from 'react';
import { Transaction, Category } from "@/lib/types";
import { CyberCard } from "../ui/cyber-card";
import { ArrowDownLeft, ArrowUpRight, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function TransactionList({ 
  transactions, 
  categories,
  onDelete,
  showFull = false
}: { 
  transactions: Transaction[], 
  categories: Category[],
  onDelete?: (id: string) => void,
  showFull?: boolean
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <CyberCard accentColor="blue" title={showFull ? "MASTER DATA LOG" : "RECENT DATA PACKETS"}>
      <div className="space-y-4">
        {showFull && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter data streams..." 
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
        )}

        <div className={cn(
          "space-y-3 overflow-y-auto pr-2 custom-scrollbar",
          showFull ? "max-h-[600px]" : "max-h-[400px]"
        )}>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <Search className="w-8 h-8 mb-2" />
              <p className="text-center text-xs italic">No matching activity detected on this frequency.</p>
            </div>
          ) : (
            filteredTransactions.map(t => {
              const category = categories.find(c => c.id === t.categoryId);
              const isExpense = t.type === 'expense';
              
              return (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-3 border border-white/5 bg-white/5 group hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-sm border",
                      isExpense ? "border-secondary/30 bg-secondary/10" : "border-accent/30 bg-accent/10"
                    )}>
                      {isExpense ? (
                        <ArrowDownLeft className="w-4 h-4 text-secondary" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium tracking-tight group-hover:text-primary transition-colors">{t.description}</p>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: category?.color || '#ccc' }} 
                        />
                        <span className="text-[10px] text-muted-foreground uppercase">{category?.name} • {t.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "font-headline text-sm text-right",
                      isExpense ? "text-secondary neon-text-purple" : "text-accent neon-text-green"
                    )}>
                      {isExpense ? '-' : '+'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        title="Purge record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </CyberCard>
  );
}
