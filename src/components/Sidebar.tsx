
'use client';

import { 
  LayoutDashboard, 
  ListOrdered, 
  Target, 
  BrainCircuit, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const auth = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'transactions', label: 'TRANSACTIONS', icon: ListOrdered },
    { id: 'budgets', label: 'BUDGETS', icon: Target },
    { id: 'ai', label: 'NEURAL_ANALYSIS', icon: BrainCircuit },
    { id: 'profile', label: 'USER_PROFILE', icon: User },
    { id: 'settings', label: 'SYSTEM_CONFIG', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] p-2 bg-card border border-primary/30 text-primary rounded-sm shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-card border-r border-primary/20 flex flex-col transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8 border-b border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-primary neon-text-cyan" />
            <h1 className="text-xl font-headline tracking-tighter text-primary neon-text-cyan">NeuroBudget</h1>
          </div>
          <p className="text-[10px] text-muted-foreground font-code tracking-[0.2em] uppercase">Core Operating System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-sm font-headline text-[10px] tracking-[0.2em] transition-all group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
              )}
              <item.icon className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-primary" : "text-muted-foreground"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-primary/10">
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full justify-start gap-4 text-secondary hover:text-secondary hover:bg-secondary/10 font-headline text-[10px] tracking-[0.2em]"
          >
            <LogOut className="w-4 h-4" /> DISCONNECT_LINK
          </Button>
        </div>
      </aside>
    </>
  );
}
