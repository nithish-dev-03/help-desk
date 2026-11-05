export interface ApiErrorDetail {
  code?: string;
  message: string;
  fields?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
  ticket?: T;
  items?: T;
  error?: ApiErrorDetail;
}

export interface HealthCheckResponse {
  status: boolean;
  message: string;
}
