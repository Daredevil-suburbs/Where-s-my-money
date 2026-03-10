
"use client"

import { useState } from 'react';
import { Category, BudgetGoal } from "@/lib/types";
import { CyberCard } from "../ui/cyber-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Target } from "lucide-react";

export function BudgetForm({ 
  categories, 
  onAdd 
}: { 
  categories: Category[], 
  onAdd: (goal: BudgetGoal) => void 
}) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      categoryId,
      amount: parseFloat(amount),
      period: 'monthly'
    });

    setAmount('');
    setCategoryId('');
  };

  return (
    <CyberCard accentColor="blue" title="ESTABLISH QUOTA">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-[10px] text-muted-foreground leading-relaxed italic border-l border-primary/30 pl-3 mb-4">
          Establish monthly resource limits for specific data categories. Existing quotas for the same category will be updated.
        </p>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-muted-foreground">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-muted-foreground">Monthly Limit (₹)</Label>
          <Input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="0.00"
            className="bg-background/50 border-white/10 text-xl font-headline"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full font-headline tracking-widest mt-2 bg-primary text-black hover:bg-primary/90"
        >
          <Target className="w-4 h-4 mr-2" /> INITIALIZE BUDGET
        </Button>
      </form>
    </CyberCard>
  );
}
