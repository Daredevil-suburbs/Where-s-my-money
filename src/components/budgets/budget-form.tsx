
"use client"

import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Target } from "lucide-react";

interface BudgetFormProps {
  onAdd: (b: any) => void;
  onCancel: () => void;
}

export function BudgetForm({ onAdd, onCancel }: BudgetFormProps) {
  const [limit, setLimit] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [alertAt, setAlertAt] = useState([80]);

  const resolvedCategory = category === '__other__' ? customCategory.trim() : category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || !resolvedCategory) return;

    onAdd({
      limit: parseFloat(limit),
      alertAt: alertAt[0],
      categoryId: resolvedCategory,
    });
  };

  const CATEGORIES = [
    "Groceries", "Utilities", "Entertainment", "Transport", "Health", 
    "Dining", "Shopping", "Tech"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] uppercase text-muted-foreground font-code">Sector_Allocation</Label>
        <Select value={category} onValueChange={(v) => { setCategory(v); if (v !== '__other__') setCustomCategory(''); }} required>
          <SelectTrigger className="bg-background/50 border-white/10 font-code">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
            <SelectItem value="__other__" className="text-primary border-t border-white/10 mt-1">+ Custom Sector</SelectItem>
          </SelectContent>
        </Select>
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

      <div className="space-y-2">
        <Label className="text-[10px] uppercase text-muted-foreground font-code">Credit_Limit (₹)</Label>
        <Input 
          type="number" 
          value={limit} 
          onChange={e => setLimit(e.target.value)} 
          placeholder="5000"
          className="bg-background/50 border-white/10 text-xl font-headline"
          required
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <Label className="text-[10px] uppercase text-muted-foreground font-code">Alert_Threshold</Label>
          <span className="text-xs font-headline text-warning neon-text-amber">{alertAt}%</span>
        </div>
        <Slider 
          value={alertAt} 
          onValueChange={setAlertAt} 
          max={100} 
          step={5} 
          className="py-4"
        />
        <p className="text-[8px] text-muted-foreground font-code italic">
          System will trigger warnings when resource utilization exceeds this percentage.
        </p>
      </div>

      <div className="flex gap-3 pt-6">
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
          className="flex-1 font-headline tracking-widest text-[10px] bg-primary text-black hover:bg-primary/90"
        >
          SYNC_QUOTA
        </Button>
      </div>
    </form>
  );
}

