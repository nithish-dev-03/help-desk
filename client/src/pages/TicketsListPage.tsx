import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { Ticket, TicketPriority } from '@/types/tickets';
import { TicketRow } from '@/components/tickets/TicketRow';
import { TicketFilters, FilterState } from '@/components/tickets/TicketFilters';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { TicketStatusDialog } from '@/components/tickets/TicketStatusDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { AppApiError, formatErrorMessage } from '@/lib/errors';

export const TicketsListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const urlSearch = searchParams.get('search') || '';
  const urlFilter = searchParams.get('filter') || 'all';

  const [simulatedState, setSimulatedState] = useState<'normal' | 'skeleton' | 'empty' | 'error'>('normal');

  const [filters, setFilters] = useState<FilterState>({
    search: urlSearch,
    status: (urlFilter === 'pending' ? 'pending' : 'all'),
    priority: 'all',
    category: 'all',
    sortBy: 'newest',
  });

  const [statusTicket, setStatusTicket] = useState<Ticket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<Ticket | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: rawTickets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketsApi.getAllTickets,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return ticketsApi.deleteTicket(id);
    },
    onSuccess: () => {
      setDeleteTicket(null);
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (err) => {
      setDeleteError(
        err instanceof AppApiError && err.status === 409
          ? 'This ticket cannot be deleted because it has related conversation records. Resolve or archive the ticket instead.'
          : formatErrorMessage(err)
      );
    },
  });

  // Extract unique categories from real tickets
  const categories = useMemo(() => {
    const set = new Set<string>();
    rawTickets.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [rawTickets]);

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    if (simulatedState === 'empty') return [];

    let result = [...rawTickets];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          String(t.id).includes(q) ||
          `#tk-${String(t.id).padStart(4, '0')}`.includes(q)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (filters.sortBy === 'updated_desc') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (filters.sortBy === 'priority_desc') {
        const pWeights: Record<TicketPriority, number> = { high: 3, medium: 2, low: 1 };
        return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [rawTickets, filters, simulatedState]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
      {/* Workspace Header & State Simulator */}
      <section className="p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
          <div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-xs mb-1">
              <span>WORKSPACE</span>
              <span>/</span>
              <span className="text-primary font-semibold">QUEUE_DISPATCHER</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-on-surface">Ticket Console</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary-container text-primary font-semibold">
                LIVE FEED: {rawTickets.length} ITEMS
              </span>
            </div>
          </div>

          {/* State Switcher Toolbar (Stitch design preview tool) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-surface-container-low rounded-lg border border-outline-variant">
            <span className="text-[10px] font-mono text-on-surface-variant px-2 uppercase font-semibold">
              Simulate:
            </span>
            <button
              type="button"
              onClick={() => setSimulatedState('normal')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                simulatedState === 'normal'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Active Records
            </button>
            <button
              type="button"
              onClick={() => setSimulatedState('skeleton')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                simulatedState === 'skeleton'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Skeleton Loading
            </button>
            <button
              type="button"
              onClick={() => setSimulatedState('empty')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                simulatedState === 'empty'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Empty State
            </button>
            <button
              type="button"
              onClick={() => setSimulatedState('error')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                simulatedState === 'error'
                  ? 'bg-surface-container-lowest text-error font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-error'
              }`}
            >
              API Error
            </button>
          </div>
        </div>

        {/* Telemetry Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              High Priority
            </p>
            <p className="text-xl font-bold text-tertiary mt-0.5">
              {rawTickets.filter((t) => t.priority === 'high').length} Tickets
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              In Progress
            </p>
            <p className="text-xl font-bold text-on-surface mt-0.5">
              {rawTickets.filter((t) => t.status === 'in_progress').length} Tickets
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Pending Response
            </p>
            <p className="text-xl font-bold text-on-surface mt-0.5">
              {rawTickets.filter((t) => t.status === 'pending').length} Tickets
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Resolved Clearance
            </p>
            <p className="text-xl font-bold text-[#2F7652] mt-0.5">
              {rawTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length} Tickets
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Query Deck */}
      <TicketFilters
        filters={filters}
        onChange={setFilters}
        categories={categories}
      />

      {/* Error State Banner */}
      {(isError || simulatedState === 'error') && (
        <Alert variant="error" title="API Exception Encountered">
          {simulatedState === 'error'
            ? 'HTTP 500: Database connection pool was exhausted during query dispatch.'
            : formatErrorMessage(error)}
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSimulatedState('normal');
                refetch();
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry Dispatch
            </Button>
          </div>
        </Alert>
      )}

      {deleteError && (
        <Alert variant="error" title="Ticket Deletion Failed" onDismiss={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      {/* Tickets Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low font-mono text-[11px] text-on-surface-variant uppercase tracking-wider border-b border-outline-variant select-none">
              <tr>
                <th className="py-3 px-4 w-28">ID</th>
                <th className="py-3 px-4 min-w-[280px]">Subject & Context</th>
                <th className="py-3 px-4 w-36">Status</th>
                <th className="py-3 px-4 w-32">Priority</th>
                <th className="py-3 px-4 w-36">Updated</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {isLoading || simulatedState === 'skeleton' ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    onOpenStatusModal={(t) => setStatusTicket(t)}
                    onOpenDeleteModal={(t) => setDeleteTicket(t)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EmptyState
                      title="No tickets match your filters"
                      description="Try adjusting your search criteria, clearing your filter pills, or creating a new support ticket."
                      actionText="Create Ticket"
                      onAction={() => navigate('/tickets/new')}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-surface-container-low/40 border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant font-mono">
          <span>
            Showing {filteredTickets.length} of {rawTickets.length} total records
          </span>
          <span className="text-primary font-medium">Page 1 of 1</span>
        </div>
      </div>

      {/* Status Update Modal */}
      <TicketStatusDialog
        ticket={statusTicket}
        isOpen={!!statusTicket}
        onClose={() => setStatusTicket(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTicket}
        onClose={() => setDeleteTicket(null)}
        onConfirm={() => {
          if (deleteTicket) {
            deleteMutation.mutate(deleteTicket.id);
          }
        }}
        title="Delete Ticket"
        message={`Are you sure you want to delete "${deleteTicket?.title}"?`}
        confirmText="Confirm Delete"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
