
'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Target
} from 'lucide-react';
import { CyberCard } from './ui/cyber-card';
import { Skeleton } from './ui/skeleton';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from 'recharts';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  transactions: any[] | null;
  budgets: any[] | null;
  isLoading: boolean;
}

export function DashboardView({ transactions, budgets, isLoading }: DashboardViewProps) {
  const stats = useMemo(() => {
    if (!transactions) return { balance: 0, income: 0, expense: 0 };
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { balance: income - expense, income, expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    if (!transactions) return [];
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const budgetTotal = useMemo(() => {
    if (!budgets) return 0;
    return budgets.reduce((acc, b) => acc + b.limit, 0);
  }, [budgets]);

  const COLORS = ['#00f5ff', '#ff006e', '#39ff14', '#ffaa00', '#8b5cf6', '#ec4899'];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full bg-card/50" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full bg-card/50" />
          <Skeleton className="h-[400px] w-full bg-card/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline text-primary neon-text-cyan">Neural_Command</h2>
          <p className="text-xs text-muted-foreground font-code uppercase tracking-widest mt-1">Real-time Telemetry Feed</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/20 rounded-sm">
          <Activity className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-[10px] font-headline text-accent uppercase tracking-tighter">Link State: Synchronized</span>
        </div>
      </header>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Credits" value={stats.balance} icon={Wallet} color="cyan" />
        <StatCard label="Inbound Flow" value={stats.income} icon={TrendingUp} color="green" />
        <StatCard label="Outbound Flow" value={stats.expense} icon={TrendingDown} color="pink" />
        <StatCard label="Quota Goal" value={budgetTotal} icon={Target} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CyberCard className="p-6 h-[450px] flex flex-col">
          <h3 className="text-sm font-headline mb-6 border-b border-primary/10 pb-4 flex items-center justify-between uppercase tracking-widest">
            Category_Distribution
            <span className="text-[10px] text-muted-foreground font-code uppercase">Expense profiling</span>
          </h3>
          <div className="flex-1 min-h-0">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center opacity-30 italic font-code text-xs uppercase">No telemetry available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1628', border: '1px solid rgba(0,245,255,0.2)', fontFamily: 'Fira Code', fontSize: '10px' }}
                    itemStyle={{ color: '#00f5ff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CyberCard>

        <CyberCard className="p-6 h-[450px] flex flex-col">
          <h3 className="text-sm font-headline mb-6 border-b border-primary/10 pb-4 uppercase tracking-widest">Recent_Telemetry</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {!transactions || transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-xs font-code">
                No data packets detected.
              </div>
            ) : (
              transactions.slice(0, 10).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 group hover:border-primary/20 transition-all rounded-sm">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-sm border",
                      tx.type === 'income' ? "bg-accent/10 border-accent/30" : "bg-secondary/10 border-secondary/30"
                    )}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-accent" /> : <ArrowDownLeft className="w-4 h-4 text-secondary" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold font-headline uppercase">{tx.desc}</p>
                      <p className="text-[10px] text-muted-foreground font-code uppercase">{tx.category} • {new Date(tx.date).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-headline",
                    tx.type === 'income' ? "text-accent neon-text-green" : "text-secondary neon-text-pink"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </CyberCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors = {
    cyan: "text-primary border-primary/20 bg-primary/5",
    pink: "text-secondary border-secondary/20 bg-secondary/5",
    green: "text-accent border-accent/20 bg-accent/5",
    amber: "text-warning border-warning/20 bg-warning/5"
  };

  return (
    <div className={cn("cyber-card p-6 flex flex-col justify-between h-32 relative group overflow-hidden", colors[color as keyof typeof colors])}>
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24" />
      </div>
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-headline uppercase tracking-widest">{label}</span>
        <Icon className="w-4 h-4 opacity-50" />
      </div>
      <div className="z-10">
        <div className="text-2xl font-headline tracking-tighter">
          ₹{value.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}
