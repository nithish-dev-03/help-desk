import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Ticket, TicketStatus } from '@/types/tickets';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/errors';
import { formatTicketId } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TicketStatusDialogProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketStatusDialog: React.FC<TicketStatusDialogProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    ticket?.status || 'open'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
      setErrorMsg(null);
    }
  }, [ticket]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!ticket) return;
      return ticketsApi.updateTicketStatus(ticket.id, selectedStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket?.id] });
      onClose();
    },
    onError: (err) => {
      setErrorMsg(formatErrorMessage(err));
    },
  });

  if (!ticket) return null;

  const statuses: Array<{ value: TicketStatus; label: string; desc: string }> = [
    { value: 'open', label: 'Open', desc: 'Ticket is waiting for agent review' },
    { value: 'in_progress', label: 'In Progress', desc: 'Agent is actively working on the ticket' },
    { value: 'pending', label: 'Pending', desc: 'Waiting on user reply or third-party vendor' },
    { value: 'resolved', label: 'Resolved', desc: 'Resolution implemented and verified' },
    { value: 'closed', label: 'Closed', desc: 'Ticket finalized and archived' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status: ${formatTicketId(ticket.id)}`}
      description={`Change operational status for "${ticket.title}"`}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">
        {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

        <div className="flex flex-col gap-2">
          {statuses.map((s) => {
            const isSelected = selectedStatus === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setSelectedStatus(s.value)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-secondary-container/50 text-on-surface'
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-2">
                    <span>{s.label}</span>
                    <span className="font-mono text-[10px] text-on-surface-variant font-normal">
                      PATCH /status
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                    {s.desc}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            disabled={selectedStatus === ticket.status}
          >
            Apply Status
          </Button>
        </div>
      </div>
    </Modal>
  );
};
