import React from 'react';
import { Menu, ShieldAlert, UserCheck } from 'lucide-react';

export default function TopBar({ onOpenSidebar }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
          <UserCheck className="w-5 h-5 text-slate-700" />
        </div>
      </div>
    </header>
  );
}
