import React from 'react';
import { DashboardMetrics } from './dashboard-api';
import { TicketRow } from '@/components/tickets/TicketRow';
import { Ticket } from '@/types/tickets';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Hourglass, Plus, Inbox, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserDashboardProps {
  metrics: DashboardMetrics;
  onOpenStatusModal?: (ticket: Ticket) => void;
  onOpenDeleteModal?: (ticket: Ticket) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  metrics,
  onOpenStatusModal,
  onOpenDeleteModal,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* 3 Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* My Open Requests */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              My Open Requests
            </span>
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-on-surface">
                {metrics.open + metrics.inProgress}
              </span>
              <span className="text-xs text-on-surface-variant">
                tickets under review
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Standard initial SLA response window is within 1 business hour.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between">
            <span className="font-mono text-xs text-primary font-medium">
              {metrics.open} Open, {metrics.inProgress} In Progress
            </span>
          </div>
        </div>

        {/* Awaiting Action / Pending */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Pending Action
            </span>
            <Hourglass className="w-4 h-4 text-tertiary" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-tertiary">
                {metrics.pending}
              </span>
              <span className="text-xs text-on-surface-variant">
                tickets awaiting user reply
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Our support engineers may have requested diagnostic logs or clarification.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/60">
            <button
              onClick={() => navigate('/tickets?filter=pending')}
              className="font-mono text-xs text-tertiary hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>View pending requests</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Submit a New Ticket Banner */}
        <div className="bg-primary-container text-on-primary p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider opacity-80">
              Need Assistance?
            </span>
            <h3 className="text-base font-semibold mt-1">Submit a New Request</h3>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              Our technical engineering desk is available 24/7 for incidents, questions, and feature requests.
            </p>
          </div>
          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/tickets/new')}
              className="w-full text-primary font-semibold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Zero State / Onboarding Preview Banner if total tickets === 0 */}
      {metrics.total === 0 && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-surface-container-low/60 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 border border-outline-variant shadow-xs">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-on-surface">
                    User Onboarding Preview
                  </span>
                  <span className="font-mono text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded uppercase">
                    First-Use State
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  No tickets submitted yet. Experience quick support from our technical team.
                  All responses are tracked with full conversation timelines and status updates.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/tickets/new')}
              className="shrink-0"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create First Ticket
            </Button>
          </div>
        </div>
      )}

      {/* User Tickets List */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-on-surface">Your Recent Tickets</h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
              {metrics.recentTickets.length} items
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tickets')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All
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
                    You have not submitted any tickets yet.
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
