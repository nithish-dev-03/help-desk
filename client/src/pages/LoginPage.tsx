import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/errors';
import { Mail, Key, ShieldCheck, ArrowRight, Eye, EyeOff, Cookie, Server } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both corporate email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Header Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-outline-variant bg-surface-container-low/70 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5 text-on-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-on-surface">
                  Help Desk Operations Gate
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant uppercase font-semibold">
                  v1.4.0
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Secured via RFC 6749 & HTTP-Only Encrypted Sessions
              </p>
            </div>
          </div>

          <div className="mt-3 md:mt-0 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded font-mono text-[11px] text-on-surface-variant border border-outline-variant/60">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>AUTH_RELAY_ONLINE</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Auth Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Card */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
            <div>
              <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
                Operator Entry
              </span>
              <h2 className="text-xl font-bold text-on-surface mt-1">
                Sign in to console
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Access support desk, user queues, and audit streams.
              </p>
            </div>

            {error && (
              <Alert variant="error" onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Corporate Work Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent.name@workspace.internal"
                leftElement={<Mail className="w-4 h-4" />}
              />

              <div>
                <Input
                  label="Master Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  leftElement={<Key className="w-4 h-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-on-surface-variant hover:text-on-surface"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Forgot credentials?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Console
                </Button>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg flex items-start gap-2.5 border border-outline-variant/60">
                <Cookie className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-on-surface-variant">
                  <span className="font-semibold text-on-surface block">
                    Session Security
                  </span>
                  Sessions are stored via server-managed JWT cookies. Tokens are not persisted in local storage.
                </div>
              </div>

              <div className="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/60">
                New to the workspace?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Enroll new workstation
                </Link>
              </div>
            </form>
          </div>

          {/* Right Architecture Specs Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant text-xs">
                <span className="font-semibold text-on-surface">
                  Identity Transport Contract
                </span>
                <span className="font-mono text-[10px] text-primary font-bold">
                  STRICT_RFC
                </span>
              </div>

              <div className="space-y-3 text-xs text-on-surface-variant">
                <div className="flex items-start gap-2.5">
                  <Cookie className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-on-surface block">
                      Cookie Session Validation
                    </span>
                    <span>All client API requests include credentials.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Server className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-on-surface block">
                      Role Verification
                    </span>
                    <span>Access levels for User, Agent, and Admin enforced on every route.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 text-xs text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-on-surface block mb-1">
                System Diagnostics
              </span>
              View mock HTTP problem details and test gateway latency in{' '}
              <Link to="/diagnostics" className="text-primary hover:underline font-medium">
                System States
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
