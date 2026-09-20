import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, ArrowRight, TrendingUp, Users, CheckCircle2, Info } from 'lucide-react';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Landing Page Navigation */}
      <header className="h-20 border-b border-slate-200/80 bg-white px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            PainLens
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span>DEMO MODE</span>
            <span className="hidden sm:inline text-blue-400 font-normal">|</span>
            <span className="hidden sm:inline text-blue-600 font-normal">Synthetic patient data</span>
          </div>

          <Link
            to="/patient"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Landing Page Hero */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Typography & CTAs */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            Understand pain trends across{' '}
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8 decoration-4">
              different observers.
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            PainLens reads visit notes, turns them into pain scores, corrects for observer differences, and shows whether the patient is really getting worse.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/patient"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              <span>View Patient</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">NLP Note Scoring</p>
                <p className="text-xs text-slate-500">Structured severity indexing</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Observer Bias</p>
                <p className="text-xs text-slate-500">Corrects score variances</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">True Trend Alert</p>
                <p className="text-xs text-slate-500">Early clinical warning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Preview Graphic */}
        <div className="flex-1 w-full max-w-lg">
          <div className="relative rounded-3xl bg-white p-6 lg:p-8 shadow-2xl shadow-blue-900/10 border border-slate-200/80 space-y-6">
            {/* Observer Avatar Stack */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-700 font-bold text-xs">A</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 font-bold text-xs">B</div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-amber-700 font-bold text-xs">C</div>
                </div>
                <span className="text-xs font-medium text-slate-500">3 Observers Tracking</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Live Data</span>
            </div>

            {/* Illustrative Trend Preview Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/50 to-indigo-50/30 border border-blue-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Pain Score Correction</span>
                <span className="text-emerald-600 font-bold">Trend Normalized</span>
              </div>
              
              {/* SVG Sparkline Mockup */}
              <div className="h-28 w-full flex items-end justify-between px-2 pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                  <path
                    d="M 10,60 Q 60,50 100,45 T 180,30 T 260,15 T 290,10"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="60" r="5" fill="#2563eb" />
                  <circle cx="100" cy="45" r="5" fill="#2563eb" />
                  <circle cx="180" cy="30" r="5" fill="#2563eb" />
                  <circle cx="260" cy="15" r="5" fill="#2563eb" />
                  <circle cx="290" cy="10" r="6" fill="#1d4ed8" className="animate-ping opacity-75" />
                  <circle cx="290" cy="10" r="5" fill="#2563eb" />
                </svg>
              </div>
            </div>

            {/* Summary card item */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                CR
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Patient: Anu Thomas (CR-001)</p>
                <p className="text-[11px] text-slate-500">12 recorded visits across 3 observer perspectives</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
