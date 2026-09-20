import React from 'react';
import { User, AlertTriangle, Info, Plus, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function PatientDashboard() {
  // Hard-coded sample data for shell preview
  const patient = {
    id: 'CR-001',
    name: 'Anu Thomas',
    age: 68,
    care_type: 'Palliative Care',
    recorded_visits: 12,
    observers: 3,
  };

  const alert = {
    active: true,
    message: 'Pain is rising — Please inform the nurse.',
  };

  const sampleVisits = [
    { id: 12, date: 'Sep 19, 2026 • 10:30 AM', observer: 'Visitor B', note: 'Severe lower back pain, uncomfortable moving...', raw: 10, corrected: 8 },
    { id: 11, date: 'Sep 18, 2026 • 02:15 PM', observer: 'Visitor A', note: 'Appears uncomfortable when moving...', raw: 8, corrected: 8 },
    { id: 10, date: 'Sep 17, 2026 • 11:20 AM', observer: 'Visitor C', note: 'Some discomfort, but manageable...', raw: 6, corrected: 7 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Patient Info Header & Alert Banner Container */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Patient Details */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-semibold border border-slate-200">
                  Patient ID: {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>Age: {patient.age}</span>
                <span>•</span>
                <span>{patient.care_type}</span>
                <span>•</span>
                <span>Demo Patient</span>
                <span>•</span>
                <span>{patient.recorded_visits} recorded visits</span>
                <span>•</span>
                <span>{patient.observers} observers</span>
              </p>
            </div>
          </div>

          {/* Alert Banner Shell */}
          {alert.active && (
            <div className="w-full lg:w-auto px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm font-semibold shadow-2xs">
              <div className="p-1 rounded-md bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-rose-900">{alert.message}</p>
                <p className="text-xs font-normal text-rose-700">Trend alert triggered based on adjusted evaluation</p>
              </div>
            </div>
          )}
        </div>

        {/* Charts Grid Shells (Placeholders - Charts deferred to next step) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw Pain Trend Shell */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Raw Pain Trend</h2>
                <Info className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Unadjusted scores</span>
            </div>
            
            {/* Chart Placeholder Box */}
            <div className="h-64 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2 p-4 text-center">
              <p className="text-sm font-semibold text-slate-600">Raw Pain Trend Chart Placeholder</p>
              <p className="text-xs text-slate-400">Recharts integration ready for raw score plotting</p>
            </div>
          </div>

          {/* Corrected Pain Trend Shell */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Corrected Pain Trend</h2>
                <Info className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-blue-600">Bias Adjusted</span>
            </div>

            {/* Chart Placeholder Box */}
            <div className="h-64 rounded-xl bg-blue-50/40 border border-dashed border-blue-200 flex flex-col items-center justify-center text-blue-600/70 space-y-2 p-4 text-center">
              <p className="text-sm font-semibold text-blue-900">Corrected Pain Trend Chart Placeholder</p>
              <p className="text-xs text-blue-600/80">Recharts integration ready for normalized score plotting</p>
            </div>
          </div>
        </div>

        {/* Observer Adjustments Section */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Observer Adjustments</h2>
              <Info className="w-4 h-4 text-slate-400" />
            </div>

            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
              onClick={() => alert('Score New Note modal will be implemented in the next step.')}
            >
              <Plus className="w-4 h-4" />
              <span>Score New Note</span>
            </button>
          </div>

          {/* Adjustment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Visitor A</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-[11px] text-slate-400">(no adjustment)</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                A
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Visitor B</p>
                <p className="text-2xl font-bold text-emerald-600">-2</p>
                <p className="text-[11px] text-emerald-600 font-medium">(scores higher)</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                B
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Visitor C</p>
                <p className="text-2xl font-bold text-amber-600">+1</p>
                <p className="text-[11px] text-amber-600 font-medium">(scores lower)</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                C
              </div>
            </div>
          </div>
        </div>

        {/* Visit History Section */}
        <div id="visit-history" className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Visit History</h2>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table Shell */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Note (summary)</th>
                  <th className="py-3 px-4 text-center">Raw</th>
                  <th className="py-3 px-4 text-center">Corrected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {sampleVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-400">{visit.id}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium text-xs">{visit.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{visit.observer}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs max-w-xs truncate">{visit.note}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">{visit.raw}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{visit.corrected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
