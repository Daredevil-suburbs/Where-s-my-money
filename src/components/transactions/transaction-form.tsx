
"use client"

import { useState } from 'react';
import { TransactionType } from "@/lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Minus, Repeat } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface TransactionFormProps {
  onAdd: (t: any) => void;
  onCancel: () => void;
}

export function TransactionForm({ onAdd, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [recurring, setRecurring] = useState(false);

  const resolvedCategory = category === '__other__' ? customCategory.trim() : category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !resolvedCategory || !description) return;

    onAdd({
      amount: parseFloat(amount),
      desc: description,
      date,
      category: resolvedCategory,
      type,
      recurring,
      createdAt: new Date().toISOString()
    });
  };

  const CATEGORIES = [
    "Groceries", "Utilities", "Entertainment", "Transport", "Health", 
    "Salary", "Investments", "Rent", "Dining", "Shopping", "Tech"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button 
          type="button" 
          variant={type === 'expense' ? 'default' : 'outline'} 
          className={`flex-1 font-headline text-xs py-6 ${type === 'expense' ? 'bg-secondary text-white' : 'border-secondary/50 text-secondary'}`}
          onClick={() => setType('expense')}
        >
          <Minus className="w-4 h-4 mr-2" /> OUTFLOW
        </Button>
        <Button 
          type="button" 
          variant={type === 'income' ? 'default' : 'outline'} 
          className={`flex-1 font-headline text-xs py-6 ${type === 'income' ? 'bg-accent text-black' : 'border-accent/50 text-accent'}`}
          onClick={() => setType('income')}
        >
          <Plus className="w-4 h-4 mr-2" /> INFLOW
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase text-muted-foreground font-code">Credit_Value (₹)</Label>
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
        <Label className="text-[10px] uppercase text-muted-foreground font-code">Description</Label>
        <Input 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Enter entry details..."
          className="bg-background/50 border-white/10 font-code"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-muted-foreground font-code">Sector</Label>
          <Select value={category} onValueChange={(v) => { setCategory(v); if (v !== '__other__') setCustomCategory(''); }} required>
            <SelectTrigger className="bg-background/50 border-white/10 font-code">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
              <SelectItem value="__other__" className="text-primary border-t border-white/10 mt-1">+ Custom Sector</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-muted-foreground font-code">Timestamp</Label>
          <Input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            className="bg-background/50 border-white/10 font-code"
            required
          />
        </div>
      </div>

      {category === '__other__' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="text-[10px] uppercase text-muted-foreground font-code">Custom_Sector_Name</Label>
          <Input 
            value={customCategory} 
            onChange={e => setCustomCategory(e.target.value)} 
            placeholder="Enter custom sector name..."
            className="bg-background/50 border-primary/30 font-code"
            required
            autoFocus
          />
        </div>
      )}

      <div className="flex items-center space-x-2 py-2">
        <Checkbox 
          id="recurring" 
          checked={recurring} 
          onCheckedChange={(checked) => setRecurring(!!checked)} 
        />
        <Label 
          htmlFor="recurring" 
          className="text-xs font-code text-muted-foreground cursor-pointer flex items-center gap-2"
        >
          <Repeat className="w-3 h-3" />
          Recursive Data Entry
        </Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 font-headline tracking-widest text-[10px] border-white/10"
        >
          ABORT
        </Button>
        <Button 
          type="submit" 
          disabled={category === '__other__' && !customCategory.trim()}
          className={`flex-1 font-headline tracking-widest text-[10px] ${type === 'income' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-secondary text-white hover:bg-secondary/90'}`}
        >
          COMMIT_LOG
        </Button>
      </div>
    </form>
  );
}

