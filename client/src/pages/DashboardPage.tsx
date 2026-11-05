import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/features/tickets/tickets-api';
import { computeDashboardMetrics } from '@/features/dashboard/dashboard-api';
import { AgentDashboard } from '@/features/dashboard/AgentDashboard';
import { UserDashboard } from '@/features/dashboard/UserDashboard';
import { AdminDashboard } from '@/features/dashboard/AdminDashboard';
import { useAuth } from '@/features/auth/useAuth';
import { Ticket } from '@/types/tickets';
import { TicketStatusDialog } from '@/components/tickets/TicketStatusDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const activeRoleView = user?.role || 'user';
  const [selectedTicketForStatus, setSelectedTicketForStatus] = useState<Ticket | null>(null);
  const [selectedTicketForDelete, setSelectedTicketForDelete] = useState<Ticket | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketsApi.getAllTickets,
    refetchInterval: 1000 * 15, // 15s live polling
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return ticketsApi.deleteTicket(id);
    },
    onSuccess: () => {
      setSelectedTicketForDelete(null);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const metrics = computeDashboardMetrics(tickets);

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
      {/* Top Command Strip: Assigned Role & Workspace State */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
            Assigned Role:
          </span>
          <span className="px-3 py-1 text-xs rounded capitalize bg-secondary-container text-primary font-semibold">
            {activeRoleView}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>POLLING (15s)</span>
            <span className="text-outline-variant">|</span>
            <span className="text-on-surface font-medium">SYS LATENCY: ~40ms</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              isLoading={isRefetching}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/tickets/new')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Role-Specific Dashboard Views */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-28 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 animate-pulse flex flex-col justify-between"
              >
                <div className="h-3 w-20 bg-surface-container-highest rounded" />
                <div className="h-6 w-12 bg-surface-container-highest rounded" />
                <div className="h-1.5 w-full bg-surface-container-highest rounded" />
              </div>
            ))}
          </div>
          <div className="h-64 bg-surface-container-lowest border border-outline-variant rounded-xl animate-pulse" />
        </div>
      ) : activeRoleView === 'agent' ? (
        <AgentDashboard
          metrics={metrics}
          onOpenStatusModal={(ticket) => setSelectedTicketForStatus(ticket)}
          onOpenDeleteModal={(ticket) => setSelectedTicketForDelete(ticket)}
        />
      ) : activeRoleView === 'user' ? (
        <UserDashboard
          metrics={metrics}
            onOpenStatusModal={(ticket) => setSelectedTicketForStatus(ticket)}
            onOpenDeleteModal={(ticket) => setSelectedTicketForDelete(ticket)}
        />
      ) : (
        <AdminDashboard
          metrics={metrics}
            onOpenStatusModal={(ticket) => setSelectedTicketForStatus(ticket)}
            onOpenDeleteModal={(ticket) => setSelectedTicketForDelete(ticket)}
        />
      )}

      {/* Status Update Modal */}
      <TicketStatusDialog
        ticket={selectedTicketForStatus}
        isOpen={!!selectedTicketForStatus}
        onClose={() => setSelectedTicketForStatus(null)}
      />

      {/* Delete Ticket Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedTicketForDelete}
        onClose={() => setSelectedTicketForDelete(null)}
        onConfirm={() => {
          if (selectedTicketForDelete) {
            deleteMutation.mutate(selectedTicketForDelete.id);
          }
        }}
        title="Confirm Ticket Deletion"
        message={`Are you sure you want to permanently delete "${selectedTicketForDelete?.title}"? This administrative action cannot be undone.`}
        confirmText="Delete Ticket"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
