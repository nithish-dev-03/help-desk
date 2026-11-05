import { describe, it, expect } from 'vitest';
import { formatTicketId, cn } from './utils';
import { AppApiError, formatErrorMessage } from './errors';

describe('formatTicketId', () => {
  it('formats numeric ids to 4-digit padded ticket tokens', () => {
    expect(formatTicketId(1)).toBe('#TK-0001');
    expect(formatTicketId(42)).toBe('#TK-0042');
    expect(formatTicketId(4821)).toBe('#TK-4821');
  });

  it('formats string numbers correctly', () => {
    expect(formatTicketId('7')).toBe('#TK-0007');
  });
});

describe('cn utility', () => {
  it('merges tailwind class names cleanly', () => {
    expect(cn('p-2', 'p-4', 'text-sm')).toBe('p-4 text-sm');
  });
});

describe('formatErrorMessage', () => {
  it('formats basic AppApiError', () => {
    const error = new AppApiError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    expect(formatErrorMessage(error)).toBe('Ticket not found');
  });

  it('formats field validation errors', () => {
    const error = new AppApiError(422, 'Invalid request', 'VALIDATION_ERROR', [
      { loc: ['body', 'title'], msg: 'Too short', type: 'string_too_short' },
    ]);
    expect(formatErrorMessage(error)).toBe('body.title: Too short');
  });
});
