import { Transaction, Category } from "@/lib/types";
import { CyberCard } from "../ui/cyber-card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionList({ 
  transactions, 
  categories 
}: { 
  transactions: Transaction[], 
  categories: Category[] 
}) {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <CyberCard accentColor="blue" title="RECENT DATA PACKETS">
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedTransactions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-xs italic">No activity detected on this frequency.</p>
        ) : (
          sortedTransactions.map(t => {
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
                <div className={cn(
                  "font-headline text-sm",
                  isExpense ? "text-secondary neon-text-purple" : "text-accent neon-text-green"
                )}>
                  {isExpense ? '-' : '+'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </CyberCard>
  );
}
