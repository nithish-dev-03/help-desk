import { ApiErrorDetail } from '@/types/api';

export class AppApiError extends Error {
  status: number;
  code?: string;
  fields?: ApiErrorDetail['fields'];

  constructor(status: number, message: string, code?: string, fields?: ApiErrorDetail['fields']) {
    super(message);
    this.name = 'AppApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof AppApiError) {
    if (error.fields && error.fields.length > 0) {
      return error.fields.map((f) => `${f.loc.join('.')}: ${f.msg}`).join(', ');
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
