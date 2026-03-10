"use client"

import { Transaction, Category } from "@/lib/types";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Cell,
  Tooltip
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function SpendingChart({ 
  transactions, 
  categories 
}: { 
  transactions: Transaction[], 
  categories: Category[] 
}) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const data = categories.map(cat => {
    const total = expenseTransactions
      .filter(t => t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category: cat.name,
      amount: total,
      color: cat.color
    };
  }).filter(d => d.amount > 0);

  const chartConfig = categories.reduce((acc, cat) => {
    acc[cat.name] = {
      label: cat.name,
      color: cat.color,
    };
    return acc;
  }, {} as any);

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1c1c2c" />
          <XAxis 
            dataKey="category" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
