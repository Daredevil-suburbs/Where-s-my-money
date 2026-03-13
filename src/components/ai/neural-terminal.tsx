
'use client';

import { useState } from 'react';
import { runNeuralAnalysis } from '@/ai/flows/financial-analysis';
import { CyberCard } from '../ui/cyber-card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BrainCircuit, Send, Sparkles, AlertCircle, TrendingUp, Landmark, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';

interface NeuralTerminalProps {
  transactions: any[];
  budgets: any[];
}

export function NeuralTerminal({ transactions, budgets }: NeuralTerminalProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performAnalysis = async (type: 'spending' | 'savings' | 'forecast' | 'query', customQuery?: string) => {
    setIsLoading(true);
    try {
      const response = await runNeuralAnalysis({
        transactions,
        budgets,
        type,
        userQuery: customQuery || query
      });
      setResult(response);
    } catch (error) {
      console.error("Neural analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    { id: 'spending', label: 'SPENDING_PROFILE', icon: TrendingUp },
    { id: 'savings', label: 'SAVINGS_PROTOCOLS', icon: Landmark },
    { id: 'forecast', label: 'MARKET_FORECAST', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline text-primary neon-text-cyan uppercase">Neural_Terminal</h2>
          <p className="text-xs text-muted-foreground font-code uppercase tracking-widest mt-1">AI Financial Forensics</p>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary font-code text-[10px] animate-pulse">
          AI_ENGINE_ONLINE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((p) => (
          <Button
            key={p.id}
            variant="outline"
            disabled={isLoading}
            onClick={() => performAnalysis(p.id as any)}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-headline text-[10px] tracking-widest py-8 h-auto flex flex-col gap-3 group"
          >
            <p.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {p.label}
          </Button>
        ))}
      </div>

      <CyberCard className="p-6 flex-1 flex flex-col min-h-0 bg-black/40 border-primary/20">
        <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 pr-2">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="font-code text-xs uppercase tracking-widest animate-pulse">Analyzing neural data clusters...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  <span className="font-headline text-xs tracking-widest text-primary">NEURO_ADVISOR_V4</span>
                </div>
                <Badge 
                  className={
                    result.riskLevel === 'CRITICAL' ? "bg-secondary" : 
                    result.riskLevel === 'HIGH' ? "bg-warning" : "bg-accent"
                  }
                >
                  RISK_LEVEL: {result.riskLevel}
                </Badge>
              </div>

              <div className="font-code text-xs leading-relaxed whitespace-pre-wrap">
                {result.analysis}
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-headline text-primary uppercase">Operational_Steps:</h4>
                <div className="grid gap-2">
                  {result.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-3 p-3 bg-white/5 border border-white/5 rounded-sm text-[10px] font-code">
                      <div className="text-primary font-bold">{i + 1}.</div>
                      <div>{rec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 italic font-code text-xs uppercase space-y-4 text-center">
              <Sparkles className="w-12 h-12 mb-2" />
              <p>Initialize a preset protocol or enter a free-form query <br/> to engage the financial intelligence core.</p>
            </div>
          )}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); performAnalysis('query'); }}
          className="relative"
        >
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ENTER_QUERY_FOR_NEURAL_LINK..."
            className="bg-black/50 border-primary/30 font-code pr-12 h-12 text-xs"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </CyberCard>
    </div>
  );
}
