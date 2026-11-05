import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { useApiHealth } from '@/features/diagnostics/useApiHealth';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchVal, setSearchVal] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { isOnline, isLoading } = useApiHealth();

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(null);
  };

  const handleNotificationsClick = () => {
    setToastMessage('Feature coming soon — notifications will be available shortly.');
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSearch) {
        onSearch(searchVal);
      } else {
        navigate(`/tickets?search=${encodeURIComponent(searchVal)}`);
      }
    }
  };

  return (
    <header className="fixed top-0 left-[260px] right-0 h-14 bg-surface-container-lowest border-b border-outline-variant z-40 flex items-center justify-between px-6">
      {/* Global Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search ticket ID (#TK-...) or subject..."
            className="w-full bg-surface-container-low border border-outline-variant rounded pl-8 pr-12 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary transition-colors font-sans"
          />
          <span className="absolute right-2 font-mono text-[10px] text-on-surface-variant bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant select-none">
            ↵
          </span>
        </div>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant pr-4 border-r border-outline-variant">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-primary' : 'bg-error'}`} />
          <span className="text-[11px] font-medium">
            {isLoading ? 'Checking Backend API…' : isOnline ? 'Backend API Online' : 'Backend API Offline'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNotificationsClick}
          className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-error" />
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/tickets/new')}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Ticket
        </Button>
      </div>

      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 w-full max-w-xs">
          <Toast message={toastMessage} variant="info" onClose={dismissToast} />
        </div>
      )}
    </header>
  );
};
