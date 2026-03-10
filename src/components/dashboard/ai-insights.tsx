"use client"

import { useState, useEffect } from 'react';
import { Transaction, Category, BudgetGoal } from "@/lib/types";
import { generateFinancialInsight, FinancialInsightOutput } from "@/ai/flows/financial-insight-generator";
import { CyberCard } from "../ui/cyber-card";
import { Sparkles, BrainCircuit, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export function AIInsights({ 
  transactions, 
  categories, 
  budgetGoals 
}: { 
  transactions: Transaction[], 
  categories: Category[],
  budgetGoals: BudgetGoal[]
}) {
  const [insight, setInsight] = useState<FinancialInsightOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    setLoading(true);
    try {
      const formattedTransactions = transactions.map(t => ({
        date: t.date,
        description: t.description,
        amount: t.amount,
        category: categories.find(c => c.id === t.categoryId)?.name || 'Unknown',
        type: t.type
      }));

      const spendingGoals = budgetGoals.map(bg => ({
        category: categories.find(c => c.id === bg.categoryId)?.name || 'Unknown',
        budgetAmount: bg.amount,
        spentAmount: transactions
          .filter(t => t.categoryId === bg.categoryId && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      }));

      const result = await generateFinancialInsight({
        transactions: formattedTransactions,
        spendingGoals,
        currentDate: new Date().toISOString().split('T')[0]
      });
      setInsight(result);
    } catch (error) {
      console.error("AI Insight failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CyberCard accentColor="blue" title="MONEYMIND AI CORE" headerAction={
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={getInsights} 
        disabled={loading}
        className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10 border border-primary/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
        ANALYZE DATA
      </Button>
    }>
      {!insight && !loading ? (
        <div className="flex flex-col items-center justify-center py-8 opacity-50 space-y-4">
          <Sparkles className="w-12 h-12 text-primary/50" />
          <p className="text-sm italic text-center max-w-[200px]">
            Initialize the AI core to analyze your spending patterns.
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-xs font-headline animate-pulse tracking-widest text-primary">PROCESSING DATA STREAMS...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-primary/5 border-l-2 border-primary">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Expert Advice</span>
            </div>
            <p className="text-xs leading-relaxed">{insight?.advice}</p>
          </div>

          {insight?.warnings && insight.warnings.length > 0 && (
            <div className="p-3 bg-secondary/5 border-l-2 border-secondary">
              <div className="flex items-center gap-2 mb-2 text-secondary">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Predictive Warnings</span>
              </div>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {insight.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          <div className="p-3 bg-accent/5 border-l-2 border-accent">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <BrainCircuit className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">System Insights</span>
            </div>
            <ul className="text-xs space-y-1 list-disc list-inside">
              {insight?.insights.map((ins, i) => <li key={i}>{ins}</li>)}
            </ul>
          </div>
        </div>
      )}
    </CyberCard>
  );
}
