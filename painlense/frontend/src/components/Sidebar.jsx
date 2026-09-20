import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, User, ClipboardList, Settings, X, Activity } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0B1727] text-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                PainLens
              </span>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <NavLink
              to="/patient"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <User className="w-5 h-5" />
              <span>Patient</span>
            </NavLink>

            <a
              href="#visit-history"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
            >
              <ClipboardList className="w-5 h-5" />
              <span>Visit History</span>
            </a>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 cursor-not-allowed transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/60 text-xs text-slate-400 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300">System Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
