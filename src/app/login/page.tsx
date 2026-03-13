
'use client';

import { Github, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (providerName: 'github' | 'google') => {
    setLoading(providerName);
    const provider = providerName === 'github' ? new GithubAuthProvider() : new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "LINK_ESTABLISHED",
        description: `Welcome back to NeuroBudget terminal. Identity verified via ${providerName}.`,
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "CONNECTION_FAILED",
        description: error.message || "Failed to initialize neural link.",
      });
    } finally {
      setLoading(null);
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
            <h2 className="text-lg font-headline text-primary uppercase">System Access</h2>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-code">Select authentication protocol for neural uplink.</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => handleLogin('google')} 
              disabled={!!loading}
              className="w-full bg-white text-black hover:bg-white/90 font-headline tracking-widest flex items-center gap-3 py-6 group"
            >
              {loading === 'google' ? (
                <Zap className="w-5 h-5 animate-spin" />
              ) : (
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {loading === 'google' ? "SYNCING..." : "CONNECT GOOGLE"}
            </Button>

            <Button 
              onClick={() => handleLogin('github')} 
              disabled={!!loading}
              className="w-full bg-primary text-black hover:bg-primary/90 font-headline tracking-widest flex items-center gap-3 py-6 group"
            >
              {loading === 'github' ? (
                <Zap className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {loading === 'github' ? "SYNCING..." : "CONNECT GITHUB"}
            </Button>
          </div>

          <div className="mt-8 text-[10px] text-center text-muted-foreground font-code uppercase tracking-tighter">
            AES-256 Encryption Active • No Local Storage Used • Cloud Synced
          </div>
        </div>
      </div>
    </div>
  );
}
