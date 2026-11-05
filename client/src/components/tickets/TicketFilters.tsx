import React from 'react';
import { TicketPriority, TicketStatus } from '@/types/tickets';
import { Search, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  category: string;
  sortBy: 'newest' | 'priority_desc' | 'updated_desc';
}

interface TicketFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: string[];
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onChange,
  categories,
}) => {
  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const handleReset = () => {
    onChange({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'newest',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search by ID (e.g. #TK-0001) or title tokens..."
          className="w-full bg-surface-container-low rounded pl-9 pr-3 py-1.5 font-mono text-xs text-on-surface placeholder:text-on-surface-variant/70 placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary border border-outline-variant/60"
        />
      </div>

      {/* Select Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => update({ status: e.target.value as FilterState['status'] })}
          className="bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="all">Status: All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) =>
            update({ priority: e.target.value as FilterState['priority'] })
          }
          className="bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="all">Priority: All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category */}
        {categories.length > 0 && (
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            className="bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[140px] truncate"
          >
            <option value="all">Category: All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Sorting */}
        <select
          value={filters.sortBy}
          onChange={(e) =>
            update({ sortBy: e.target.value as FilterState['sortBy'] })
          }
          className="bg-surface-container-low border border-outline-variant/60 text-primary font-medium text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="priority_desc">Sort: Priority (High to Low)</option>
          <option value="updated_desc">Sort: Last Updated</option>
        </select>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
          title="Reset Filters"
          aria-label="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
