import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface-container-highest/70 rounded animate-pulse',
        className
      )}
      {...props}
    />
  );
};

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 6 }) => {
  return (
    <tr className="border-b border-surface-container-low">
      <td className="py-3.5 px-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="py-3.5 px-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-32" />
        </div>
      </td>
      <td className="py-3.5 px-4">
        <Skeleton className="h-5 w-20 rounded" />
      </td>
      <td className="py-3.5 px-4">
        <Skeleton className="h-5 w-16 rounded" />
      </td>
      <td className="py-3.5 px-4">
        <Skeleton className="h-4 w-24" />
      </td>
      {columns > 5 && (
        <td className="py-3.5 px-4 text-right">
          <Skeleton className="h-7 w-16 ml-auto rounded" />
        </td>
      )}
    </tr>
  );
};
