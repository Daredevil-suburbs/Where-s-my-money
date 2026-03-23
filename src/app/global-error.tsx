'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#050a18] text-white font-sans">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-lg w-full space-y-6 border border-red-500/30 bg-red-500/5 p-8 rounded-sm shadow-[0_0_30px_rgba(255,0,110,0.15)]">
            <div className="flex items-center gap-3 text-red-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-bold uppercase tracking-widest">SYSTEM_FAULT</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">
              {error.message || 'An unexpected error disrupted the neural link.'}
            </p>
            <button
              onClick={reset}
              className="w-full py-3 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors font-bold uppercase tracking-widest text-xs"
            >
              REINITIALIZE_SYSTEM
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
