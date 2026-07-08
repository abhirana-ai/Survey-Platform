import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Button from '../components/common/Button.jsx';
import { Menu, X, ClipboardSignature } from 'lucide-react';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Left Header Brand on Mobile */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
                  <ClipboardSignature size={16} className="stroke-[2.5]" />
                </div>
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  Insight<span className="text-violet-600">Flow</span>
                </span>
              </div>
              
              {/* Workspace Indicator on Desktop */}
              <div className="hidden lg:block">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-250/30 px-3 py-1 text-xs font-semibold text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Workspace
                </span>
              </div>

              {/* Mobile Menu Button */}
              <Button 
                variant="secondary" 
                className="lg:hidden p-2.5 h-10 w-10 flex items-center justify-center rounded-xl" 
                onClick={() => setMobileOpen((value) => !value)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>

            {/* Mobile Sidebar Panel */}
            {mobileOpen && (
              <div className="mt-4 border-t border-slate-100 pt-4 lg:hidden">
                <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
              </div>
            )}
          </header>

          {/* Main Workspace Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
