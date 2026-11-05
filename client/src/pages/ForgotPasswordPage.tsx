import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/features/auth/auth-api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/errors';
import { Mail, Key, ShieldCheck, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword) {
      setError('Please provide your registered email and new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authApi.resetPassword({ email, password: newPassword });
      setSuccess(true);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
              Access Recovery
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface">Reset Master Secret</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Enter your account email and desired new credentials.
          </p>
        </div>

        {error && (
          <Alert variant="error" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success ? (
          <div className="flex flex-col gap-4">
            <Alert variant="success" title="Password Reset Successfully">
              Your credentials have been updated on the security partition. You can now log in with your new password.
            </Alert>
            <Link to="/login">
              <Button variant="primary" className="w-full" size="md">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Account Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="s.holloway@operator.internal"
              leftElement={<Mail className="w-4 h-4" />}
            />

            <Input
              label="New Master Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••••••"
              leftElement={<Key className="w-4 h-4" />}
              helperText="Min. 8 characters. Directly updates your password hash."
            />

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                size="md"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
              <Link to="/login" className="flex-1">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  size="md"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
