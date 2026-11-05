import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-xs flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-on-surface">403 — Access Denied</h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Your current account role does not have permission to access this resource or execute this administrative action.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
