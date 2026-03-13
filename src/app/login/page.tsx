
'use client';

import { Github, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setLoading(true);
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Link Established",
        description: "Welcome back to NeuroBudget terminal.",
      });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to initialize neural link.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-sm border border-primary/50 bg-primary/10 mb-6 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
            <Zap className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-headline mb-2 neon-text-cyan">NeuroBudget</h1>
          <p className="text-muted-foreground font-code text-xs tracking-[0.3em] uppercase">Financial Intelligence v4.0</p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-primary/30 p-8 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="mb-8 border-l-2 border-primary pl-4">
            <h2 className="text-lg font-headline text-primary">System Access</h2>
            <p className="text-xs text-muted-foreground mt-1">Authorized GitHub profile required for data persistence.</p>
          </div>

          <Button 
            onClick={handleGitHubLogin} 
            disabled={loading}
            className="w-full bg-primary text-black hover:bg-primary/90 font-headline tracking-widest flex items-center gap-3 py-6 group"
          >
            {loading ? (
              <Zap className="w-5 h-5 animate-spin" />
            ) : (
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            {loading ? "INITIALIZING..." : "CONNECT GITHUB"}
          </Button>

          <div className="mt-8 text-[10px] text-center text-muted-foreground font-code uppercase tracking-tighter">
            Secure Encryption Active • No Local Storage Used • Cloud Synced
          </div>
        </div>
      </div>
    </div>
  );
}
