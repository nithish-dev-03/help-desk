import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { cn } from '@/lib/utils';
import { useApiHealth } from '@/features/diagnostics/useApiHealth';
import {
  LayoutDashboard,
  Inbox,
  ListFilter,
  PlusCircle,
  Settings,
  LogOut,
  ShieldCheck,
  Bug,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOnline, isLoading } = useApiHealth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['user', 'agent', 'admin'],
    },
    {
      label: 'My Tickets',
      path: '/tickets?filter=my',
      icon: <Inbox className="w-4 h-4" />,
      roles: ['user', 'agent', 'admin'],
    },
    {
      label: 'All Tickets',
      path: '/tickets',
      icon: <ListFilter className="w-4 h-4" />,
      roles: ['user', 'agent', 'admin'],
    },
    {
      label: 'New Ticket',
      path: '/tickets/new',
      icon: <PlusCircle className="w-4 h-4" />,
      roles: ['user', 'agent', 'admin'],
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings className="w-4 h-4" />,
      roles: ['user', 'agent', 'admin'],
    },
    {
      label: 'System States',
      path: '/diagnostics',
      icon: <Bug className="w-4 h-4 text-tertiary" />,
      roles: ['user', 'agent', 'admin'],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-outline-variant">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5 text-on-primary" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-on-surface tracking-tight">
                  Help Desk
                </span>
                <span className="font-mono text-[10px] bg-surface-container-low text-on-surface-variant px-1 py-0.5 rounded border border-outline-variant/60">
                  v1.4.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Health Banner */}
        <div className="px-4 py-2 border-b border-outline-variant bg-surface-container-low/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-primary animate-pulse' : 'bg-error'}`} />
            <span className="text-on-surface-variant text-[11px] font-medium">
              {isLoading ? 'API: Checking' : isOnline ? 'API: Operational' : 'API: Offline'}
            </span>
          </div>
          <span className={`font-mono text-[10px] font-medium ${isOnline ? 'text-primary' : 'text-error'}`}>
            {isLoading ? '—' : isOnline ? '200 OK' : 'UNAVAILABLE'}
          </span>
        </div>

        {user && (
          <div className="px-4 pt-3 pb-1 text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
            Assigned Role: <span className="text-primary">{user.role}</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 p-3 mt-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-colors',
                  isActive
                    ? 'bg-secondary-container text-primary font-semibold border-l-2 border-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Account / Footer */}
      <div className="border-t border-outline-variant p-3 bg-surface-container-lowest">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-outline-variant/60">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-on-surface font-medium truncate">
                {user?.name || user?.email || 'Operator'}
              </span>
              <span className="font-mono text-[10px] text-primary uppercase font-medium">
                {user?.role || 'Guest'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container-low rounded transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
