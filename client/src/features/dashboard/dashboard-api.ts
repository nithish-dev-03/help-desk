import { Ticket } from '@/types/tickets';

export interface DashboardMetrics {
  total: number;
  open: number;
  inProgress: number;
  pending: number;
  resolved: number;
  closed: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  recentTickets: Ticket[];
  priorityBreakdown: Array<{ name: string; count: number; percentage: number; color: string }>;
  weeklyClearance: Array<{ day: string; count: number }>;
}

export function computeDashboardMetrics(tickets: Ticket[]): DashboardMetrics {
  const total = tickets.length;
  let open = 0;
  let inProgress = 0;
  let pending = 0;
  let resolved = 0;
  let closed = 0;

  let urgent = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  tickets.forEach((t) => {
    switch (t.status) {
      case 'open':
        open++;
        break;
      case 'in_progress':
        inProgress++;
        break;
      case 'pending':
        pending++;
        break;
      case 'resolved':
        resolved++;
        break;
      case 'closed':
        closed++;
        break;
    }

    switch (t.priority) {
      case 'high':
        high++;
        break;
      case 'medium':
        medium++;
        break;
      case 'low':
        low++;
        break;
    }
  });

  // Calculate day-of-week distribution from updated_at / created_at
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayCounts: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  tickets.forEach((t) => {
    try {
      const d = new Date(t.created_at);
      const dayName = days[d.getDay()];
      if (dayCounts[dayName] !== undefined) {
        dayCounts[dayName]++;
      }
    } catch {
      // Ignore invalid date
    }
  });

  const weeklyClearance = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (day) => ({
      day,
      count: dayCounts[day] || 0,
    })
  );

  const priorityBreakdown = [
    {
      name: 'High Priority',
      count: high,
      percentage: total > 0 ? Math.round((high / total) * 100) : 0,
      color: '#B44D45',
    },
    {
      name: 'Medium Priority',
      count: medium,
      percentage: total > 0 ? Math.round((medium / total) * 100) : 0,
      color: '#3F6B57',
    },
    {
      name: 'Low Priority',
      count: low,
      percentage: total > 0 ? Math.round((low / total) * 100) : 0,
      color: '#68716D',
    },
  ];

  return {
    total,
    open,
    inProgress,
    pending,
    resolved,
    closed,
    urgent,
    high,
    medium,
    low,
    recentTickets: [...tickets].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 6),
    priorityBreakdown,
    weeklyClearance,
  };
}
