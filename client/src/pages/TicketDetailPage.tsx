import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { commentsApi } from '@/features/comments/comments-api';
import { useAuth } from '@/features/auth/useAuth';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from '@/components/ui/Button';
import { CommentList } from '@/features/comments/CommentList';
import { CommentComposer } from '@/features/comments/CommentComposer';
import { TicketStatusDialog } from '@/components/tickets/TicketStatusDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Alert } from '@/components/ui/Alert';
import { formatTicketId, formatDate, formatTimeAgo } from '@/lib/utils';
import { formatErrorMessage } from '@/lib/errors';
import {
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  User,
  Activity,
} from 'lucide-react';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = parseInt(id || '', 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isAgentOrAdmin = user?.role === 'agent' || user?.role === 'admin';

  // Fetch ticket details
  const {
    data: ticket,
    isLoading: isTicketLoading,
    isError: isTicketError,
    error: ticketError,
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsApi.getTicketById(ticketId),
    enabled: !isNaN(ticketId),
  });

  // Fetch comments
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => commentsApi.getCommentsByTicket(ticketId),
    enabled: !isNaN(ticketId),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return ticketsApi.deleteTicket(ticketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      navigate('/tickets');
    },
  });

  if (isNaN(ticketId)) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Invalid Ticket ID requested.
      </div>
    );
  }

  if (isTicketLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isTicketError || !ticket) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <Alert variant="error" title="Ticket Not Found (404)">
          {formatErrorMessage(ticketError) || 'Ticket could not be retrieved from the database.'}
        </Alert>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/tickets')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to All Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1540px] mx-auto w-full space-y-6">
      {/* Workspace Control & Ticket Title Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-4">
        {/* Breadcrumb, Meta Tags & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tickets')}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              className="p-1 px-2"
            >
              Back
            </Button>
            <span className="font-mono text-xs font-semibold text-primary bg-secondary-container px-2 py-0.5 rounded border border-primary/20">
              {formatTicketId(ticket.id)}
            </span>
            <span className="text-on-surface-variant text-xs">/</span>
            <span className="text-xs text-on-surface-variant font-medium">
              {ticket.category}
            </span>
            <span className="text-on-surface-variant text-xs">•</span>
            <span className="text-xs text-on-surface-variant">
              Created {formatTimeAgo(ticket.created_at)}
            </span>

            {/* Badges */}
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                leftIcon={<Edit className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
            )}

            {isAgentOrAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsStatusModalOpen(true)}
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-primary" />}
              >
                Status: <span className="capitalize ml-1">{ticket.status}</span>
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Ticket Title */}
        <h1 className="text-xl font-bold text-on-surface tracking-tight">
          {ticket.title}
        </h1>

        {/* Future feature roadmap notice from Stitch design */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-surface-container-low/70 rounded-lg border border-outline-variant/60 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span>
              <strong className="text-on-surface">Ticket Assignment:</strong> Currently managed through pool dispatching.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant font-medium">
            POOLED
          </span>
        </div>
      </div>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / MAIN COLUMN (Description, Timeline, Composer) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Original Ticket Description Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="px-5 py-3 bg-surface-container-low/60 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-[10px]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-on-surface">
                  {ticket.creator?.name || `Requester #${ticket.created_by}`}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.2 rounded">
                  Author
                </span>
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {formatDate(ticket.created_at)}
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
                {ticket.description}
              </div>
            </div>
          </section>

          {/* Conversation Timeline Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-on-surface">
                  Conversation Timeline
                </h3>
                <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
                  {comments.length} Events
                </span>
              </div>
            </div>

            <CommentList comments={comments} isLoading={isCommentsLoading} />
          </div>

          {/* Comment Composer */}
          <CommentComposer ticketId={ticket.id} />
        </div>

        {/* RIGHT SIDEBAR COLUMN (Attributes & SLA) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SLA Status Widget */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-surface-container-low/60 border-b border-outline-variant flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">
                Service Level Agreement
              </span>
              <span className="font-mono text-[10px] text-primary font-bold">
                TIER-1 STANDARD
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-surface-container-low rounded-lg text-center">
                <span className="text-[10px] font-mono uppercase text-on-surface-variant tracking-wider block">
                  Status State
                </span>
                <div className="text-base font-bold text-on-surface capitalize my-0.5">
                  {ticket.status}
                </div>
                <span className="font-mono text-[10px] text-primary">
                  {ticket.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              <div className="text-xs text-on-surface-variant flex items-center justify-between font-mono text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Target SLA:
                </span>
                <span className="text-on-surface font-semibold">Active</span>
              </div>
            </div>
          </section>

          {/* Ticket Attributes Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-surface-container-low/60 border-b border-outline-variant flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">
                Ticket Metadata
              </span>
            </div>
            <div className="divide-y divide-surface-container-low text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-on-surface-variant">Requester</span>
                <span className="font-medium text-on-surface">
                  {ticket.creator?.name || `User #${ticket.created_by}`}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-on-surface-variant">Assignee</span>
                <span className="font-medium text-on-surface">
                  {ticket.assigned_to ? `Agent #${ticket.assigned_to}` : 'Unassigned Pool'}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-on-surface-variant">Category</span>
                <span className="font-mono text-[11px] text-on-surface bg-surface-container px-1.5 py-0.2 rounded font-medium">
                  {ticket.category}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-on-surface-variant">Created Timestamp</span>
                <span className="font-mono text-[11px] text-on-surface-variant">
                  {formatDate(ticket.created_at)}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-on-surface-variant">Last Modified</span>
                <span className="font-mono text-[11px] text-on-surface-variant">
                  {formatDate(ticket.updated_at)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Status Modal */}
      <TicketStatusDialog
        ticket={ticket}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Ticket"
        message={`Are you sure you want to permanently delete "${ticket.title}"?`}
        confirmText="Confirm Delete"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
