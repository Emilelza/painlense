import React from 'react';
import { Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500 flex items-center justify-center gap-2">
      <Info className="w-4 h-4 text-slate-400" />
      <span className="font-semibold tracking-wide uppercase text-slate-400">
        SYNTHETIC DATA — NOT FOR CLINICAL USE
      </span>
    </footer>
  );
}
