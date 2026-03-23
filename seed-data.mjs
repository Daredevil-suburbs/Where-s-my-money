// Seed script - adds sample college student data to Firestore
// Usage: node seed-data.mjs <USER_UID>

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { config } from 'dotenv';
config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node seed-data.mjs <USER_UID>');
  console.error('Get your UID from: Firebase Console > Authentication > Users');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const transactions = [
  { amount: 15000, desc: "Monthly Allowance from Home", date: "2026-03-01", category: "Salary", type: "income", recurring: true, createdAt: new Date().toISOString() },
  { amount: 5000, desc: "Room Rent - March", date: "2026-03-01", category: "Rent", type: "expense", recurring: true, createdAt: new Date().toISOString() },
  { amount: 250, desc: "WiFi Share - Hostel", date: "2026-03-02", category: "Utilities", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 1200, desc: "Monthly Mess Bill", date: "2026-03-03", category: "Dining", type: "expense", recurring: true, createdAt: new Date().toISOString() },
  { amount: 350, desc: "Dominos with Friends", date: "2026-03-05", category: "Dining", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 180, desc: "Auto to College", date: "2026-03-06", category: "Transport", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 499, desc: "Spotify Premium", date: "2026-03-07", category: "Entertainment", type: "expense", recurring: true, createdAt: new Date().toISOString() },
  { amount: 800, desc: "Grocery Run - Zepto", date: "2026-03-08", category: "Groceries", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 1500, desc: "DSA Course on Udemy", date: "2026-03-10", category: "Tech", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 200, desc: "Chai and Maggi at Tapri", date: "2026-03-12", category: "Dining", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 450, desc: "Movie - Pushpa 3", date: "2026-03-14", category: "Entertainment", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 150, desc: "Bus Pass Recharge", date: "2026-03-15", category: "Transport", type: "expense", recurring: true, createdAt: new Date().toISOString() },
  { amount: 600, desc: "New Earphones - Amazon", date: "2026-03-16", category: "Shopping", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 350, desc: "Biryani Party", date: "2026-03-18", category: "Dining", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 120, desc: "Printing + Xerox", date: "2026-03-19", category: "Utilities", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 500, desc: "Grocery - Vegetables + Snacks", date: "2026-03-20", category: "Groceries", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 300, desc: "Haircut + Grooming", date: "2026-03-21", category: "Health", type: "expense", recurring: false, createdAt: new Date().toISOString() },
  { amount: 750, desc: "Night Out - Bowling", date: "2026-03-22", category: "Entertainment", type: "expense", recurring: false, createdAt: new Date().toISOString() },
];

const budgets = [
  { id: "Dining", limit: 2500, alertAt: 80 },
  { id: "Entertainment", limit: 1500, alertAt: 75 },
  { id: "Groceries", limit: 1500, alertAt: 80 },
  { id: "Transport", limit: 500, alertAt: 90 },
  { id: "Rent", limit: 5000, alertAt: 95 },
];

async function seed() {
  console.log(`\n🔥 Seeding Firestore for user: ${uid}`);
  console.log(`   Project: ${firebaseConfig.projectId}\n`);

  // Add transactions
  const txCol = collection(db, 'users', uid, 'transactions');
  for (const tx of transactions) {
    const ref = doc(txCol);
    await setDoc(ref, tx);
    const icon = tx.type === 'income' ? '💰' : '💸';
    console.log(`  ${icon} ${tx.desc} — ₹${tx.amount}`);
  }
  console.log(`\n  ✅ ${transactions.length} transactions added\n`);

  // Add budgets
  for (const b of budgets) {
    const ref = doc(db, 'users', uid, 'budgets', b.id);
    await setDoc(ref, { limit: b.limit, alertAt: b.alertAt });
    console.log(`  🎯 ${b.id} — ₹${b.limit} (alert at ${b.alertAt}%)`);
  }
  console.log(`\n  ✅ ${budgets.length} budgets added`);

  console.log('\n🎉 Done! Refresh the app to see your data.\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
