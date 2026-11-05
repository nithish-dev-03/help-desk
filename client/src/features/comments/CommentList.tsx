import React from 'react';
import { Comment } from '@/types/comments';
import { formatTimeAgo } from '@/lib/utils';
import { useAuth } from '@/features/auth/useAuth';
import { MessageSquare, Shield, User } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, isLoading }) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 animate-pulse flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-surface-container-highest rounded" />
              <div className="h-3 w-16 bg-surface-container-highest rounded" />
            </div>
            <div className="h-4 w-full bg-surface-container-highest rounded" />
            <div className="h-4 w-3/4 bg-surface-container-highest rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="w-5 h-5 text-on-surface-variant" />}
        title="No comments recorded yet"
        description="This ticket has no conversation entries. Use the composer below to begin troubleshooting."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {comments.map((comment) => {
        const isSelf = user?.id === comment.user_id;

        return (
          <div
            key={comment.id}
            className={`rounded-xl border transition-colors overflow-hidden flex flex-col shadow-2xs ${
              isSelf
                ? 'bg-surface-container-lowest border-primary/30'
                : 'bg-surface-container-lowest border-outline-variant'
            }`}
          >
            {/* Header bar */}
            <div className="px-4 py-2 bg-surface-container-low/60 border-b border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelf
                      ? 'bg-secondary-container text-primary'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  {isSelf ? <User className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                </div>
                <span className="text-xs font-semibold text-on-surface">
                  {comment.author?.name || (isSelf ? 'You' : `User #${comment.user_id}`)}
                </span>
                {comment.author?.role && (
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">
                    {comment.author.role}
                  </span>
                )}
                {isSelf && (
                  <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-secondary-container text-primary font-medium">
                    You
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
              {comment.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
