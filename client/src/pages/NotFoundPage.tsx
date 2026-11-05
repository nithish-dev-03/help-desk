import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-xs flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center">
          <FileQuestion className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-on-surface">404 — Page Not Found</h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          The requested page or ticket entity does not exist or has been relocated within the workspace.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/tickets')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};
