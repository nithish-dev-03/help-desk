import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '@/types/tickets';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { formatTicketId, formatTimeAgo } from '@/lib/utils';
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';

interface TicketRowProps {
  ticket: Ticket;
  onOpenStatusModal?: (ticket: Ticket) => void;
  onOpenDeleteModal?: (ticket: Ticket) => void;
}

export const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  onOpenStatusModal,
  onOpenDeleteModal,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isAgentOrAdmin = user?.role === 'agent' || user?.role === 'admin';

  return (
    <tr className="hover:bg-secondary-container/25 transition-colors group border-b border-surface-container-low text-xs">
      {/* Ticket ID */}
      <td className="py-3 px-4 font-mono">
        <button
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          className="font-mono text-xs bg-surface-container-low hover:bg-surface-container px-2 py-0.5 rounded text-on-surface font-semibold hover:text-primary transition-colors text-left"
        >
          {formatTicketId(ticket.id)}
        </button>
      </td>

      {/* Subject & Category */}
      <td className="py-3 px-4 min-w-[280px]">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="text-left font-medium text-on-surface hover:text-primary transition-colors text-xs line-clamp-1"
          >
            {ticket.title}
          </button>
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
            <span className="px-1.5 py-0.2 bg-surface-container-low text-on-surface-variant rounded uppercase font-semibold">
              {ticket.category}
            </span>
            <span>•</span>
            <span className="text-on-surface-variant">
              Created {formatTimeAgo(ticket.created_at)}
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <StatusBadge status={ticket.status} />
      </td>

      {/* Priority */}
      <td className="py-3 px-4">
        <PriorityBadge priority={ticket.priority} />
      </td>

      {/* Updated */}
      <td className="py-3 px-4 font-mono text-on-surface-variant text-[11px]">
        {formatTimeAgo(ticket.updated_at)}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {isAgentOrAdmin && onOpenStatusModal && (
            <button
              onClick={() => onOpenStatusModal(ticket)}
              className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors"
              title="Quick Status Patch"
              aria-label="Quick Status Patch"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
            title="Inspect Ticket"
            aria-label="Inspect Ticket"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isAdmin && onOpenDeleteModal && (
            <button
              onClick={() => onOpenDeleteModal(ticket)}
              className="p-1 text-on-surface-variant hover:text-error hover:bg-surface-container rounded transition-colors"
              title="Delete Ticket"
              aria-label="Delete Ticket"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
