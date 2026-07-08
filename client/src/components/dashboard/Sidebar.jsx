import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/surveys', label: 'Surveys' },
  { to: '/surveys/create', label: 'Create Survey' },
  { to: '/my-responses', label: 'My Responses' },
];

const Sidebar = ({ mobile = false, onNavigate }) => {
  const { logout } = useAuth();

  return (
    <aside className={`${mobile ? 'w-full' : 'hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 p-6 lg:block'}`}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Survey Platform</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Workspace</h2>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => {
          logout();
          onNavigate?.();
        }}
        className="mt-8 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
