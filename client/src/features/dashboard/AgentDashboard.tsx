import React from 'react';
import { DashboardMetrics } from './dashboard-api';
import { TicketRow } from '@/components/tickets/TicketRow';
import { Ticket } from '@/types/tickets';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AgentDashboardProps {
  metrics: DashboardMetrics;
  onOpenStatusModal?: (ticket: Ticket) => void;
  onOpenDeleteModal?: (ticket: Ticket) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  metrics,
  onOpenStatusModal,
  onOpenDeleteModal,
}) => {
  const navigate = useNavigate();
  const maxWeekly = Math.max(...metrics.weeklyClearance.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* 5-Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Active */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total Queue
            </span>
            <Inbox className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-on-surface">
              {metrics.total}
            </span>
            <span className="font-mono text-[10px] text-primary">
              {metrics.open} Open
            </span>
          </div>
          <div className="mt-2.5 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{
                width: `${metrics.total > 0 ? (metrics.open / metrics.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              High Priority
            </span>
            <AlertTriangle className="w-4 h-4 text-tertiary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-tertiary">
              {metrics.high}
            </span>
            <span className="font-mono text-[10px] text-tertiary">
              Requires Touch
            </span>
          </div>
          <div className="mt-2.5 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-tertiary h-full rounded-full transition-all duration-500"
              style={{
                width: `${metrics.total > 0 ? (metrics.high / metrics.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              In Progress
            </span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-on-surface">
              {metrics.inProgress}
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant">
              {metrics.total > 0
                ? Math.round((metrics.inProgress / metrics.total) * 100)
                : 0}
              % of queue
            </span>
          </div>
          <div className="mt-2.5 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-container h-full rounded-full transition-all duration-500"
              style={{
                width: `${metrics.total > 0 ? (metrics.inProgress / metrics.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Resolved
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2F7652]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-[#2F7652]">
              {metrics.resolved}
            </span>
            <span className="font-mono text-[10px] text-[#2F7652]">
              {metrics.closed} Closed
            </span>
          </div>
          <div className="mt-2.5 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2F7652] h-full rounded-full transition-all duration-500"
              style={{
                width: `${metrics.total > 0 ? (metrics.resolved / metrics.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* System Health */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              SLA Health
            </span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-primary">100%</span>
            <span className="font-mono text-[10px] text-primary">Active</span>
          </div>
          <div className="mt-2.5 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Distribution Grid + Weekly Sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Priority Spread */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">
                Queue Distribution & Priority Spread
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Real-time breakdown of assigned tickets by priority level
              </p>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-low text-on-surface font-medium">
              {metrics.total} Total
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {metrics.priorityBreakdown.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 text-on-surface">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-mono text-xs font-medium text-on-surface">
                    {item.count} tickets ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-surface-container-low flex items-center justify-between text-on-surface-variant font-mono text-[11px]">
            <span>Active Response Target: &lt; 30m</span>
            <span className="text-primary font-medium">Target SLA Compliance: 99.4%</span>
          </div>
        </div>

        {/* Weekly Ingestion / Clearance Chart */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
              <h3 className="text-sm font-semibold text-on-surface">
                Weekly Intake
              </h3>
              <span className="font-mono text-[11px] text-on-surface-variant">
                7 Days
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Ingested tickets by day of week.
            </p>

            {/* Sparkline chart */}
            <div className="mt-4">
              <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
                {metrics.weeklyClearance.map((item) => {
                  const barHeight = Math.max(
                    Math.round((item.count / maxWeekly) * 80),
                    item.count > 0 ? 8 : 4
                  );
                  return (
                    <div
                      key={item.day}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-full rounded-t transition-all ${
                          item.count > 0 ? 'bg-primary' : 'bg-surface-container'
                        }`}
                        style={{ height: `${barHeight}px` }}
                        title={`${item.day}: ${item.count} tickets`}
                      />
                      <span className="font-mono text-[10px] text-on-surface-variant">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-surface-container-low rounded text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Live Telemetry
            </span>
            <span className="font-mono text-[11px] text-primary font-medium">
              Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Active Operational Queue Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-on-surface">
              Recent Operational Queue
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
              Showing {metrics.recentTickets.length} of {metrics.total}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tickets')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All Tickets
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
                    No tickets found in the queue.
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
