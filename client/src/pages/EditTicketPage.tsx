import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { TicketPriority, TicketUpdatePayload } from '@/types/tickets';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/errors';
import { formatTicketId } from '@/lib/utils';
import { Save, ArrowLeft } from 'lucide-react';

export const EditTicketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = parseInt(id || '', 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsApi.getTicketById(ticketId),
    enabled: !isNaN(ticketId),
  });

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setCategory(ticket.category);
      setPriority(ticket.priority);
      setDescription(ticket.description);
    }
  }, [ticket]);

  const mutation = useMutation({
    mutationFn: async (payload: TicketUpdatePayload) => {
      return ticketsApi.updateTicket(ticketId, payload);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      navigate(`/tickets/${updated.id}`);
    },
    onError: (err) => {
      setErrorMsg(formatErrorMessage(err));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !description.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }
    setErrorMsg(null);
    mutation.mutate({
      title: title.trim(),
      category: category.trim(),
      priority,
      description: description.trim(),
    });
  };

  if (isNaN(ticketId)) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Invalid Ticket ID provided.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Alert variant="error" title="Ticket Not Found">
          {formatErrorMessage(error)}
        </Alert>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate('/tickets')}>
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/tickets/${ticketId}`)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Ticket
        </Button>
        <span className="font-mono text-xs text-on-surface-variant">
          Editing {formatTicketId(ticketId)}
        </span>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Edit Ticket Details</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Updates to ticket records are restricted to workspace administrators.
          </p>
        </div>

        {errorMsg && (
          <Alert variant="error" onDismiss={() => setErrorMsg(null)}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div>
              <label className="text-xs font-medium text-on-surface block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Description"
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate(`/tickets/${ticketId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={mutation.isPending}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
