import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Button from '../components/common/Button.jsx';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-600">Authenticated workspace</p>
                <h1 className="text-xl font-semibold text-slate-900">Survey management</h1>
              </div>
              <Button variant="secondary" className="lg:hidden" onClick={() => setMobileOpen((value) => !value)}>
                Menu
              </Button>
            </div>
            {mobileOpen ? (
              <div className="mt-4 lg:hidden">
                <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
              </div>
            ) : null}
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
