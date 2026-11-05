import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/errors';
import { User, Mail, Key, ShieldCheck, UserPlus, Info } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await register({ name, email, password });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
              Account Creation
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface">Enroll workstation profile</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Provision a new user account on the Help Desk system.
          </p>
        </div>

        {error && (
          <Alert variant="error" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Legal Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marcus Vance"
            leftElement={<User className="w-4 h-4" />}
          />

          <Input
            label="Corporate Work Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m.vance@workspace.internal"
            leftElement={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Master Password (min 8 symbols)"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            leftElement={<Key className="w-4 h-4" />}
            helperText="Requires at least 8 characters. Hashed via Argon2id."
          />

          <div className="p-3 bg-surface-container-low rounded-lg flex items-start gap-2 border border-outline-variant/60 text-xs text-on-surface-variant">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              By default, newly registered accounts are assigned the <strong>User</strong> role.
              Role promotions to Agent or Admin can only be provisioned by workspace administrators.
            </span>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Register & Dispatch Profile
            </Button>
          </div>

          <div className="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/60">
            Already hold an active workstation key?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Proceed to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
