import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { TicketPriority, TicketCreatePayload } from '@/types/tickets';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/errors';
import { useAuth } from '@/features/auth/useAuth';
import {
  Send,
  UploadCloud,
  Bold,
  Italic,
  Code,
  List,
} from 'lucide-react';

export const CreateTicketPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: TicketCreatePayload) => {
      return ticketsApi.createTicket(payload);
    },
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setSuccessMsg(`Ticket "${newTicket.title}" created successfully!`);
      setTimeout(() => {
        navigate(`/tickets/${newTicket.id}`);
      }, 1200);
    },
    onError: (err) => {
      setErrorMsg(formatErrorMessage(err));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Subject line is required (minimum 3 characters).');
      return;
    }
    if (description.trim().length < 3) {
      setErrorMsg('Description must be at least 3 characters.');
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

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('ticket-description-input') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = description.substring(start, end);
    const replacement = `${prefix}${selected}${suffix}`;
    const nextText =
      description.substring(0, start) + replacement + description.substring(end);
    setDescription(nextText);
  };

  const priorityConfigs: Record<
    TicketPriority,
    { label: string; sla: string; color: string }
  > = {
    low: { label: 'Low', sla: '24h Resolution', color: 'bg-secondary' },
    medium: { label: 'Medium', sla: '8h Resolution', color: 'bg-primary' },
    high: { label: 'High', sla: '4h Resolution', color: 'bg-tertiary-container' },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Page Title & Gateway Info */}
      <div className="p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-on-surface-variant">
            <span>GATEWAY</span>
            <span>/</span>
            <span className="text-primary font-semibold">TICKETS_SUBSYSTEM</span>
            <span>/</span>
            <span>ENDPOINT_V1</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface mt-1">
            New Incident / Support Dispatch
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-secondary-container text-primary px-2.5 py-1 rounded font-semibold border border-primary/20">
            POST /tickets/
          </span>
          <span className="font-mono text-xs bg-surface-container-low text-on-surface-variant px-2 py-1 rounded border border-outline-variant">
            SCHEMA_STRICT
          </span>
        </div>
      </div>

      {successMsg && (
        <Alert variant="success" title="Ticket Created">
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="error" onDismiss={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form (8 Columns) */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Subject Line */}
            <div>
              <Input
                label="Subject Line"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., PostgreSQL primary node latency spike above 850ms in us-east-1"
                helperText="Provide a concise, high-signal summary of the issue."
              />
              <div className="flex justify-end mt-1">
                <span className="font-mono text-[11px] text-on-surface-variant">
                  {title.length} / 200 chars
                </span>
              </div>
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-on-surface block mb-1">
                  System Category <span className="text-error">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                >
                  <option value="Infrastructure">Infrastructure & Hosting</option>
                  <option value="Database">Database & Replication</option>
                  <option value="Authentication">Authentication & SSO</option>
                  <option value="Billing">Billing & Licenses</option>
                  <option value="Bug">Defect / Regression Bug</option>
                  <option value="Feature">Feature Request</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-on-surface">
                    Operational Priority <span className="text-error">*</span>
                  </label>
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    {priorityConfigs[priority].sla}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container-low rounded border border-outline-variant">
                  {(['low', 'medium', 'high'] as TicketPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded text-xs capitalize transition-all flex items-center justify-center gap-1.5 ${
                        priority === p
                          ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${priorityConfigs[p].color}`} />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-on-surface">
                  Incident Description <span className="text-error">*</span>
                </label>
                {/* Markdown mini toolbar */}
                <div className="flex items-center gap-1 bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/60 text-on-surface-variant">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1 hover:text-on-surface text-[11px] font-bold"
                    title="Bold"
                  >
                    <Bold className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1 hover:text-on-surface text-[11px] italic"
                    title="Italic"
                  >
                    <Italic className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`')}
                    className="p-1 hover:text-on-surface font-mono text-[11px]"
                    title="Code"
                  >
                    <Code className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n- ')}
                    className="p-1 hover:text-on-surface text-[11px]"
                    title="List"
                  >
                    <List className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <textarea
                id="ticket-description-input"
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail current observations, stack traces, tenant IDs affected, and steps to reproduce..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
              <div className="flex justify-between mt-1 text-[11px] text-on-surface-variant font-mono">
                <span>Markdown supported</span>
                <span>{description.length} chars</span>
              </div>
            </div>

            {/* Mock Dropzone (Stitch spec) */}
            <div>
              <label className="text-xs font-medium text-on-surface block mb-1">
                Diagnostic Attachments (Optional)
              </label>
              <div className="p-5 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low/40 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                <UploadCloud className="w-7 h-7 text-primary mb-1.5" />
                <span className="text-xs font-medium text-on-surface">
                  Drag and drop server logs, core dumps, or screenshots
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  PNG, JPG, LOG, JSON ≤ 25MB
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => navigate('/tickets')}
              >
                Discard
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={mutation.isPending}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Ticket to Queue
              </Button>
            </div>
          </form>
        </div>

        {/* Right Info Sidebar (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* SLA Targets Matrix */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <span className="text-xs font-semibold text-on-surface">
                Target SLA Commitment
              </span>
              <span className="font-mono text-[10px] text-primary font-bold">
                TIER-1 ENTERPRISE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container" />
                  <span>High Priority</span>
                </div>
                <span className="font-mono font-semibold text-tertiary">
                  &lt; 4 hr Ack
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Medium Priority</span>
                </div>
                <span className="font-mono font-semibold text-on-surface">
                  &lt; 8 hr Ack
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Low Priority</span>
                </div>
                <span className="font-mono font-semibold text-on-surface-variant">
                  &lt; 24 hr Ack
                </span>
              </div>
            </div>
          </div>

          {/* Active Operator Context */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-semibold text-on-surface">
              Dispatching Operator Identity
            </span>
            <div className="flex items-center gap-3 p-2.5 rounded bg-surface-container-low">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-on-surface block truncate">
                  {user?.name || user?.email}
                </span>
                <span className="font-mono text-[10px] text-primary uppercase">
                  Role: {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
