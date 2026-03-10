"use client"

import { useState } from 'react';
import { Category, TransactionType } from "@/lib/types";
import { CyberCard } from "../ui/cyber-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Minus } from "lucide-react";

export function TransactionForm({ 
  categories, 
  onAdd 
}: { 
  categories: Category[], 
  onAdd: (t: any) => void 
}) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<TransactionType>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !description) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      description,
      date,
      categoryId,
      type
    });

    setAmount('');
    setDescription('');
    setCategoryId('');
  };

  return (
    <CyberCard accentColor={type === 'income' ? 'green' : 'purple'} title="LOG DATA STREAM">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant={type === 'expense' ? 'default' : 'outline'} 
            className={`flex-1 font-headline text-xs ${type === 'expense' ? 'bg-secondary text-white' : 'border-secondary/50 text-secondary'}`}
            onClick={() => setType('expense')}
          >
            <Minus className="w-3 h-3 mr-2" /> EXPENSE
          </Button>
          <Button 
            type="button" 
            variant={type === 'income' ? 'default' : 'outline'} 
            className={`flex-1 font-headline text-xs ${type === 'income' ? 'bg-accent text-black' : 'border-accent/50 text-accent'}`}
            onClick={() => setType('income')}
          >
            <Plus className="w-3 h-3 mr-2" /> INCOME
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-muted-foreground">Amount ($)</Label>
          <Input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="0.00"
            className="bg-background/50 border-white/10 text-xl font-headline"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-muted-foreground">Description</Label>
          <Input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Transaction details..."
            className="bg-background/50 border-white/10"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground">Date</Label>
            <Input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="bg-background/50 border-white/10"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className={`w-full font-headline tracking-widest mt-2 ${type === 'income' ? 'bg-accent hover:bg-accent/90' : 'bg-secondary hover:bg-secondary/90'}`}
        >
          EXECUTE LOG
        </Button>
      </form>
    </CyberCard>
  );
}
