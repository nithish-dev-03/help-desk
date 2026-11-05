import React, { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { authApi } from '@/features/auth/auth-api';
import { useNavigate } from 'react-router-dom';
import { User, Cookie, LogOut, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout, actualRole } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await authApi.deleteUser(user.id);
      await logout();
      navigate('/login');
    } catch {
      setDeleteError('Failed to remove account record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Workstation & Profile Settings</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Identity management, role privileges, and authentication token session state.
        </p>
      </div>

      {deleteError && <Alert variant="error">{deleteError}</Alert>}

      {/* User Identity Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Active Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <span className="text-on-surface-variant text-[11px] block">Full Name</span>
            <span className="font-semibold text-on-surface text-sm mt-0.5 block">
              {user?.name || 'Operator'}
            </span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <span className="text-on-surface-variant text-[11px] block">Corporate Email</span>
            <span className="font-semibold text-on-surface text-sm mt-0.5 block">
              {user?.email || 'N/A'}
            </span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <span className="text-on-surface-variant text-[11px] block">Assigned Role</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs uppercase px-2 py-0.5 bg-secondary-container text-primary font-bold rounded">
                {actualRole || user?.role}
              </span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <span className="text-on-surface-variant text-[11px] block">Database User ID</span>
            <span className="font-mono text-xs font-semibold text-on-surface mt-1 block">
              #{user?.id}
            </span>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
          <Cookie className="w-4 h-4 text-primary" />
          Session Management
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-medium text-on-surface block">Terminate Active Session</span>
            <span className="text-on-surface-variant text-[11px]">
              Clears the HTTP-only access_token cookie from your browser.
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-container-lowest border border-error/30 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-error border-b border-error/20 pb-2">
          Danger Zone
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-medium text-on-surface block">Delete Account Record</span>
            <span className="text-on-surface-variant text-[11px]">
              Issues <code className="font-mono bg-surface-container-low px-1 rounded">DELETE /auth/{user?.id}</code> to remove your user profile.
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account"
        message="Are you sure you want to permanently delete your user profile? You will be logged out immediately."
        confirmText="Confirm Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
