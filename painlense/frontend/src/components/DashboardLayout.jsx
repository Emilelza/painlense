import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dark Navy Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container offset for lg screen sidebar width */}
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
