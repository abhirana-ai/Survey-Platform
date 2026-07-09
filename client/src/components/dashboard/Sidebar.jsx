import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  ClipboardList, 
  User, 
  LogOut, 
  ClipboardSignature 
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/surveys', label: 'My Surveys', icon: FileText },
  { to: '/surveys/create', label: 'Create Survey', icon: PlusCircle },
  { to: '/my-responses', label: 'My Responses', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar = ({ mobile = false, onNavigate }) => {
  const { logout, user } = useAuth();

  return (
    <aside className={`${mobile ? 'w-full' : 'hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:flex flex-col justify-between sticky top-0 h-screen overflow-y-auto'}`}>
      <div className="flex-1">
        {/* Brand Logo Header */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/20">
            <ClipboardSignature size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Insight<span className="text-violet-600">Flow</span>
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-violet-50 text-violet-700 shadow-sm border-l-2 border-violet-600 pl-3.5' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 border-l-2 border-transparent'
                  }
                `}
              >
                <Icon size={18} className="shrink-0 stroke-[1.8]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile Summary & Log out */}
      <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
        {!mobile && user && (
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-150 text-slate-700 font-bold text-sm">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user.name}</p>
              <p className="truncate text-[10px] text-slate-500">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
