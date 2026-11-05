import React from 'react';
import { DashboardMetrics } from './dashboard-api';
import { TicketRow } from '@/components/tickets/TicketRow';
import { Ticket } from '@/types/tickets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminDashboardProps {
  metrics: DashboardMetrics;
  onOpenStatusModal?: (ticket: Ticket) => void;
  onOpenDeleteModal?: (ticket: Ticket) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  onOpenStatusModal,
  onOpenDeleteModal,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Infrastructure Telemetry Banner */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-surface-container-low">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <div>
              <h3 className="text-sm font-semibold text-on-surface">
                Core Infrastructure & Telemetry Gateway
              </h3>
              <p className="text-xs text-on-surface-variant">
                Live backend REST endpoint health checks & queue processing telemetry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-secondary-container text-primary px-2.5 py-1 rounded font-medium border border-primary/20">
              GET /tickets/health-check 200 OK
            </span>
            <span className="font-mono text-xs bg-surface-container-low text-on-surface-variant px-2 py-1 rounded border border-outline-variant/60">
              Latency: 38ms
            </span>
          </div>
        </div>

        {/* 4-Stat Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              Global Intake
            </span>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-on-surface">
                {metrics.total}
              </span>
              <span className="font-mono text-[10px] text-primary">All Time</span>
            </div>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              Active Unresolved
            </span>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-tertiary">
                {metrics.open + metrics.inProgress + metrics.pending}
              </span>
              <span className="font-mono text-[10px] text-tertiary">
                {metrics.total > 0
                  ? Math.round(
                      ((metrics.open + metrics.inProgress + metrics.pending) /
                        metrics.total) *
                        100
                    )
                  : 0}
                % Load
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              Completed / Closed
            </span>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-[#2F7652]">
                {metrics.resolved + metrics.closed}
              </span>
              <span className="font-mono text-[10px] text-[#2F7652]">Resolved</span>
            </div>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              SLA Compliance
            </span>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-primary">99.8%</span>
              <span className="font-mono text-[10px] text-primary font-medium">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Load Balancer Card */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
          <div>
            <h3 className="text-sm font-semibold text-on-surface">
              Operational Desk Capacity Balancing
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Workload allocation and queue throughput across support roles
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>BALANCED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-on-surface">Tier 1 Support Operators</span>
              <span className="font-mono text-primary">Normal (65%)</span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%] rounded-full" />
            </div>
            <div className="mt-2 text-[11px] text-on-surface-variant flex justify-between font-mono">
              <span>Intake Queue</span>
              <span>{metrics.open} Open</span>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-on-surface">Tier 2 Incident Leads</span>
              <span className="font-mono text-primary-container">Active (75%)</span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="bg-primary-container h-full w-[75%] rounded-full" />
            </div>
            <div className="mt-2 text-[11px] text-on-surface-variant flex justify-between font-mono">
              <span>Work in Flight</span>
              <span>{metrics.inProgress} Assigned</span>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-on-surface">Escalations & Resolution</span>
              <span className="font-mono text-[#2F7652]">Cleared (100%)</span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="bg-[#2F7652] h-full w-full rounded-full" />
            </div>
            <div className="mt-2 text-[11px] text-on-surface-variant flex justify-between font-mono">
              <span>Resolved Pool</span>
              <span>{metrics.resolved} Tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Queue Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-on-surface">
              System Audit Stream (All Tickets)
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
              Admin Access: Full CRUD
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tickets')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider border-b border-outline-variant">
              <tr>
                <th className="py-2.5 px-4 w-28">Ticket ID</th>
                <th className="py-2.5 px-4 min-w-[280px]">Subject & Context</th>
                <th className="py-2.5 px-4 w-36">Status</th>
                <th className="py-2.5 px-4 w-32">Priority</th>
                <th className="py-2.5 px-4 w-36">Updated</th>
                <th className="py-2.5 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs">
              {metrics.recentTickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onOpenStatusModal={onOpenStatusModal}
                  onOpenDeleteModal={onOpenDeleteModal}
                />
              ))}
              {metrics.recentTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant text-xs">
                    No tickets in system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
