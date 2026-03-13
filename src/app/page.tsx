
'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { BudgetList } from '@/components/budgets/budget-list';
import { BudgetForm } from '@/components/budgets/budget-form';
import { NeuralTerminal } from '@/components/ai/neural-terminal';
import { CyberModal } from '@/components/ui/cyber-modal';
import { CyberCard } from '@/components/ui/cyber-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useMemoFirebase, useCollection, useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, setDoc, writeBatch, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Download, User, Calendar, Mail, CheckCircle2, RefreshCw } from 'lucide-react';
import { updateProfile } from 'firebase/auth';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Profile Form
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Real-time Data
  const txQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));
  }, [user, db]);

  const budgetQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, 'users', user.uid, 'budgets');
  }, [user, db]);

  const { data: transactions, isLoading: isTxLoading } = useCollection(txQuery);
  const { data: budgets, isLoading: isBudgetLoading } = useCollection(budgetQuery);

  // CRUD Operations
  const handleAddTransaction = async (data: any) => {
    if (!user || !db) return;
    const txRef = doc(collection(db, 'users', user.uid, 'transactions'));
    try {
      await setDoc(txRef, data);
      toast({ title: "LOG_COMMITTED", description: "Transaction stream synchronized." });
      setIsTxModalOpen(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "SYNC_ERROR", description: e.message });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      toast({ title: "RECORD_PURGED", description: "Data packet removed from log." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "PURGE_ERROR", description: e.message });
    }
  };

  const handleSetBudget = async (data: any) => {
    if (!user || !db) return;
    const budgetRef = doc(db, 'users', user.uid, 'budgets', data.categoryId);
    try {
      await setDoc(budgetRef, { limit: data.limit, alertAt: data.alertAt });
      toast({ title: "QUOTA_SYNCED", description: `Budget for ${data.categoryId} updated.` });
      setIsBudgetModalOpen(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "QUOTA_ERROR", description: e.message });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'budgets', id));
      toast({ title: "QUOTA_REMOVED", description: "Sector monitoring disabled." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "SYNC_ERROR", description: e.message });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: newName });
      toast({ title: "NEURAL_IDENTITY_UPDATED", description: "Display handle modified successfully." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "UPDATE_ERROR", description: e.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleFactoryReset = async () => {
    if (!user || !db) return;
    try {
      const batch = writeBatch(db);
      const txs = await getDocs(collection(db, 'users', user.uid, 'transactions'));
      const bdgs = await getDocs(collection(db, 'users', user.uid, 'budgets'));
      
      txs.forEach(d => batch.delete(d.ref));
      bdgs.forEach(d => batch.delete(d.ref));
      
      await batch.commit();
      toast({ title: "SYSTEM_REFORMATTED", description: "All data streams purged. Initializing fresh environment." });
      setIsResetModalOpen(false);
      setActiveTab('dashboard');
    } catch (e: any) {
      toast({ variant: "destructive", title: "RESET_FAILED", description: e.message });
    }
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) return;
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type', 'Recurring'];
    const rows = transactions.map(t => [
      t.date,
      t.desc,
      t.amount,
      t.category,
      t.type,
      t.recurring ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `neurobudget_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "DATA_EXPORT_COMPLETE", description: "Log binary converted to CSV." });
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            
            {activeTab === 'dashboard' && <DashboardView transactions={transactions} budgets={budgets} isLoading={isTxLoading || isBudgetLoading} />}
            
            {activeTab === 'transactions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-headline text-primary neon-text-cyan uppercase">Transactions_Log</h2>
                    <p className="text-xs text-muted-foreground font-code uppercase tracking-widest mt-1">Full Ledger Access</p>
                  </div>
                  <Button 
                    onClick={() => setIsTxModalOpen(true)} 
                    className="bg-primary text-black hover:bg-primary/90 font-headline text-[10px] tracking-widest px-8"
                  >
                    + ADD_LOG_ENTRY
                  </Button>
                </div>
                <div className="flex-1 min-h-0">
                  <TransactionList transactions={transactions || []} onDelete={handleDeleteTransaction} showFull />
                </div>
              </div>
            )}

            {activeTab === 'budgets' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-headline text-primary neon-text-cyan uppercase">Sector_Quotas</h2>
                    <p className="text-xs text-muted-foreground font-code uppercase tracking-widest mt-1">Resource Optimization</p>
                  </div>
                  <Button 
                    onClick={() => setIsBudgetModalOpen(true)} 
                    className="bg-primary text-black hover:bg-primary/90 font-headline text-[10px] tracking-widest px-8"
                  >
                    + INITIALIZE_QUOTA
                  </Button>
                </div>
                <BudgetList transactions={transactions || []} budgets={budgets || []} onDelete={handleDeleteBudget} showFull />
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <NeuralTerminal transactions={transactions || []} budgets={budgets || []} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-3xl font-headline text-primary neon-text-cyan uppercase">Identity_Node</h2>
                
                <CyberCard className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
                      <img 
                        src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`} 
                        className="w-32 h-32 rounded-full border-2 border-primary relative z-10"
                        alt="Avatar"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <h3 className="text-2xl font-headline uppercase">{user?.displayName || 'Unknown_Entity'}</h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-code">
                          <Mail className="w-4 h-4 text-primary" /> {user?.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-code">
                          <Calendar className="w-4 h-4 text-primary" /> Established: {new Date(user?.metadata.creationTime || '').toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 border-t border-white/5 pt-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground font-code">Modify_Identity_Handle</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Enter new handle..."
                          className="bg-white/5 border-white/10 font-code"
                        />
                        <Button 
                          onClick={handleUpdateProfile} 
                          disabled={isUpdatingProfile}
                          className="bg-primary text-black hover:bg-primary/90 font-headline text-[10px]"
                        >
                          {isUpdatingProfile ? "SYNCING..." : "COMMIT_CHANGE"}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm flex items-center gap-4">
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-xs font-headline uppercase text-accent">Status: Fully_Synchronized</p>
                        <p className="text-[10px] font-code text-muted-foreground">Neural link integrity verified across cloud sectors.</p>
                      </div>
                    </div>
                  </div>
                </CyberCard>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-3xl font-headline text-primary neon-text-cyan uppercase">System_Parameters</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CyberCard className="p-6 space-y-4" accentColor="cyan">
                    <div className="flex items-center gap-3 text-primary">
                      <Download className="w-5 h-5" />
                      <h3 className="text-sm font-headline uppercase">Binary_Export</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-code leading-relaxed">
                      Download all transaction data packets in CSV format for offline diagnostics.
                    </p>
                    <Button 
                      onClick={handleExportCSV}
                      className="w-full border-primary/30 text-primary hover:bg-primary/10 variant-outline font-headline text-[10px]"
                    >
                      EXECUTE_EXPORT
                    </Button>
                  </CyberCard>

                  <CyberCard className="p-6 space-y-4" accentColor="pink">
                    <div className="flex items-center gap-3 text-secondary">
                      <RefreshCw className="w-5 h-5" />
                      <h3 className="text-sm font-headline uppercase">Factory_Reset</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-code leading-relaxed">
                      Purge all synchronized data streams. This action is irreversible and requires confirmation.
                    </p>
                    <Button 
                      onClick={() => setIsResetModalOpen(true)}
                      className="w-full border-secondary/30 text-secondary hover:bg-secondary/10 variant-outline font-headline text-[10px]"
                    >
                      INITIALIZE_PURGE
                    </Button>
                  </CyberCard>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <CyberModal 
          isOpen={isTxModalOpen} 
          onClose={() => setIsTxModalOpen(false)} 
          title="New_Transaction_Stream" 
          description="Logging financial activity to Firestore Core."
          accentColor="cyan"
        >
          <TransactionForm onAdd={handleAddTransaction} onCancel={() => setIsTxModalOpen(false)} />
        </CyberModal>

        <CyberModal 
          isOpen={isBudgetModalOpen} 
          onClose={() => setIsBudgetModalOpen(false)} 
          title="Update_Sector_Quota" 
          description="Optimizing resource allocation for specified category."
          accentColor="cyan"
        >
          <BudgetForm onAdd={handleSetBudget} onCancel={() => setIsBudgetModalOpen(false)} />
        </CyberModal>

        <CyberModal 
          isOpen={isResetModalOpen} 
          onClose={() => setIsResetModalOpen(false)} 
          title="Critical_Warning" 
          description="System Reformatting Requested"
          accentColor="pink"
        >
          <div className="space-y-6">
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-sm">
              <p className="text-xs text-secondary font-code leading-relaxed">
                URGENT: Proceeding with this protocol will permanently erase all transaction logs and budget quotas from the Firestore core. No recovery possible.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsResetModalOpen(false)} className="flex-1 font-headline text-[10px]">ABORT</Button>
              <Button onClick={handleFactoryReset} variant="destructive" className="flex-1 font-headline text-[10px]">EXECUTE_WIPE</Button>
            </div>
          </div>
        </CyberModal>

      </div>
    </AuthGuard>
  );
}
