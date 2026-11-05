import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { CheckCircle2, XCircle, RefreshCw, Copy, Check } from 'lucide-react';

export const SystemDiagnostics: React.FC = () => {
  const [pingState, setPingState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const runPingTest = async () => {
    setPingState('testing');
    const start = performance.now();
    try {
      await ticketsApi.checkHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setPingState('success');
    } catch {
      setPingState('error');
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const errorSpecs = [
    {
      status: '401 UNAUTHORIZED',
      route: 'GET /tickets/',
      title: 'Session Authentication Required',
      description: 'Triggered when the access_token cookie is missing, expired, or invalid.',
      color: 'border-error/40 bg-error-container/30',
      payload: JSON.stringify(
        {
          status: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required. Please sign in to resume your workstation.',
          },
        },
        null,
        2
      ),
    },
    {
      status: '403 FORBIDDEN',
      route: 'DELETE /tickets/{id}/',
      title: 'Role-Based Access Control Rejection',
      description: 'Triggered when a user or agent role attempts an admin-only operation.',
      color: 'border-tertiary/40 bg-tertiary-fixed/30',
      payload: JSON.stringify(
        {
          status: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have permission to perform this action',
          },
        },
        null,
        2
      ),
    },
    {
      status: '404 NOT FOUND',
      route: 'GET /tickets/9999',
      title: 'Resource Null Reference',
      description: 'Entity identifier is not present in the PostgreSQL database partition.',
      color: 'border-outline bg-surface-container-low',
      payload: JSON.stringify(
        {
          status: false,
          error: {
            code: 'TICKET_NOT_FOUND',
            message: 'Ticket not found',
          },
        },
        null,
        2
      ),
    },
    {
      status: '409 CONFLICT',
      route: 'POST /auth/register',
      title: 'Duplicate Entity Collision',
      description: 'Raised when email or entity violates a database unique constraint.',
      color: 'border-tertiary/40 bg-surface-container-low',
      payload: JSON.stringify(
        {
          status: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'Email is already registered',
          },
        },
        null,
        2
      ),
    },
    {
      status: '422 UNPROCESSABLE ENTITY',
      route: 'POST /tickets/',
      title: 'Schema Validation Failure',
      description: 'Request payload failed Pydantic validation (length or type error).',
      color: 'border-error/40 bg-error-container/20',
      payload: JSON.stringify(
        {
          status: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            fields: [
              { loc: ['body', 'title'], msg: 'String should have at least 3 characters', type: 'string_too_short' },
              { loc: ['body', 'category'], msg: 'Field required', type: 'missing' },
            ],
          },
        },
        null,
        2
      ),
    },
    {
      status: '500 INTERNAL SERVER ERROR',
      route: 'ANY /api/*',
      title: 'Unexpected Exception Intercept',
      description: 'Unhandled database or server exception caught by centralized handler.',
      color: 'border-error bg-error-container/40',
      payload: JSON.stringify(
        {
          status: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
          },
        },
        null,
        2
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Live Health Ping Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-on-surface">
              Live Gateway Connectivity Diagnostic
            </h2>
            <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded text-primary font-medium">
              RFC 7807 Standard
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Pings the active FastAPI backend endpoint at <code className="font-mono bg-surface-container-low px-1 rounded">/tickets/health-check</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pingState === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>CONNECTED ({latency}ms)</span>
            </div>
          )}
          {pingState === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-error font-mono">
              <XCircle className="w-4 h-4 text-error" />
              <span>SERVER UNREACHABLE</span>
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={runPingTest}
            isLoading={pingState === 'testing'}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Run Ping Test
          </Button>
        </div>
      </div>

      {/* Error Taxonomy Section */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-on-surface">
            Backend Error Architecture & Taxonomy
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Normalized JSON error envelope implemented across all endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {errorSpecs.map((spec, i) => (
            <div
              key={spec.status}
              className={`rounded-xl border p-4 shadow-xs flex flex-col justify-between ${spec.color}`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40 text-xs">
                  <span className="font-mono font-bold text-on-surface text-[11px]">
                    {spec.status}
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    {spec.route}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-on-surface mt-2.5">
                  {spec.title}
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  {spec.description}
                </p>
                <div className="mt-3 bg-inverse-surface text-inverse-on-surface p-3 rounded font-mono text-[11px] overflow-x-auto leading-relaxed shadow-xs">
                  <pre>{spec.payload}</pre>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-outline-variant/30 flex justify-end">
                <button
                  onClick={() => handleCopy(spec.payload, i)}
                  className="font-mono text-[11px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="w-3 h-3 text-primary" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Payload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
