export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorBody(error: unknown): {
  error: { code: string; message: string; retryAfter?: number };
} {
  if (error instanceof ApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        ...(error.retryAfter === undefined
          ? {}
          : { retryAfter: error.retryAfter }),
      },
    };
  }
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Não foi possível concluir a solicitação.',
    },
  };
}
