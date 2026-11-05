import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { commentsApi } from './comments-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatErrorMessage } from '@/lib/errors';
import { Bold, Italic, Code, Quote, List, Send, Lock } from 'lucide-react';

interface CommentComposerProps {
  ticketId: number;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({ ticketId }) => {
  const [content, setContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const finalContent = isInternalNote ? `[INTERNAL NOTE]\n${text}` : text;
      return commentsApi.createComment(ticketId, { content: finalContent });
    },
    onSuccess: () => {
      setContent('');
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    },
    onError: (err) => {
      setErrorMsg(formatErrorMessage(err));
    },
  });

  const handleFormat = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected}${suffix}`;
    const nextContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(nextContent);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selected.length
        );
      }
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg('Comment content cannot be empty.');
      return;
    }
    setErrorMsg(null);
    mutation.mutate(content.trim());
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-surface-container-low/70 border-b border-outline-variant flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface">Compose Response</span>
          <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
            PUT /tickets/{ticketId}/comments/
          </span>
        </div>

        {/* Staff Internal Note Toggle */}
        <label className="cursor-pointer flex items-center gap-1.5 select-none text-xs text-on-surface">
          <input
            type="checkbox"
            checked={isInternalNote}
            onChange={(e) => setIsInternalNote(e.target.checked)}
            className="w-3.5 h-3.5 text-primary rounded accent-primary"
          />
          <span className="flex items-center gap-1 text-[11px] font-medium text-tertiary">
            <Lock className="w-3 h-3 text-tertiary" />
            Internal Note
          </span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
        {errorMsg && (
          <Alert variant="error" onDismiss={() => setErrorMsg(null)}>
            {errorMsg}
          </Alert>
        )}

        {/* Markdown Toolbar */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded border border-outline-variant/50 text-on-surface-variant">
          <button
            type="button"
            onClick={() => handleFormat('**', '**')}
            className="p-1 hover:bg-surface-container hover:text-on-surface rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('*', '*')}
            className="p-1 hover:bg-surface-container hover:text-on-surface rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('`', '`')}
            className="p-1 hover:bg-surface-container hover:text-on-surface rounded transition-colors"
            title="Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('\n> ')}
            className="p-1 hover:bg-surface-container hover:text-on-surface rounded transition-colors"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('\n- ')}
            className="p-1 hover:bg-surface-container hover:text-on-surface rounded transition-colors"
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isInternalNote
              ? 'Add internal diagnostics and staff-only notes...'
              : 'Write your reply or customer response here...'
          }
          rows={4}
          className={`w-full p-3 rounded text-xs text-on-surface placeholder:text-outline transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary border ${
            isInternalNote
              ? 'bg-[#FAF3E8]/40 border-[#A66A22]/30'
              : 'bg-surface-container-low/40 border-outline-variant'
          }`}
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-on-surface-variant">
            {content.length} / 2000 chars
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setContent('')}
              disabled={!content || mutation.isPending}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={mutation.isPending}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Post {isInternalNote ? 'Internal Note' : 'Response'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};
