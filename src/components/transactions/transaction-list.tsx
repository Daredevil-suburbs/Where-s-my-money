"use client"

import { useState, useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Trash2, Search, Repeat, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { CyberCard } from "../ui/cyber-card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TransactionListProps {
  transactions: any[];
  onDelete: (id: string) => void;
  showFull?: boolean;
}

export function TransactionList({ 
  transactions, 
  onDelete,
  showFull = false
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = monthFilter === 'all' || t.date.startsWith(monthFilter);
        return matchesSearch && matchesMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, monthFilter]);

  // Generate unique months from transactions for the filter
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(t => months.add(t.date.substring(0, 7))); // YYYY-MM
    return Array.from(months).sort().reverse();
  }, [transactions]);

  return (
    <CyberCard accentColor="cyan" className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 className="text-sm font-headline tracking-widest text-primary neon-text-cyan uppercase">
          {showFull ? "Master_Data_Log" : "Recent_Activity"}
        </h3>
        
        {showFull && (
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search descriptions..." 
                className="pl-9 h-8 bg-white/5 border-white/10 text-[10px] font-code"
              />
            </div>
            
            <div className="w-32">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="h-8 bg-white/5 border-white/10 text-[10px] font-code">
                  <Calendar className="w-3 h-3 mr-2 text-primary" />
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30">
                  <SelectItem value="all" className="text-[10px] font-code">All Time</SelectItem>
                  {availableMonths.map(m => (
                    <SelectItem key={m} value={m} className="text-[10px] font-code">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3",
        showFull ? "min-h-[400px]" : "max-h-[400px]"
      )}>
        {filteredTransactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-xs py-20 font-code">
            No data packets found in this frequency.
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div 
              key={t.id} 
              className="flex items-center justify-between p-3 border border-white/5 bg-white/5 group hover:bg-white/10 hover:border-primary/30 transition-all rounded-sm"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-sm border",
                  t.type === 'income' ? "border-accent/30 bg-accent/10" : "border-secondary/30 bg-secondary/10"
                )}>
                  {t.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold font-headline uppercase group-hover:text-primary transition-colors">
                      {t.desc}
                    </p>
                    {t.recurring && (
                      <Badge variant="outline" className="h-4 px-1 border-primary/20 bg-primary/5 text-[8px] text-primary gap-1 animate-pulse">
                        <Repeat className="w-2 h-2" /> RECURRING
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-code uppercase">
                    {t.category} • {new Date(t.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className={cn(
                  "font-headline text-sm text-right",
                  t.type === 'income' ? "text-accent neon-text-green" : "text-secondary neon-text-pink"
                )}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                
                <button 
                  onClick={() => onDelete(t.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  title="Purge record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </CyberCard>
  );
}
