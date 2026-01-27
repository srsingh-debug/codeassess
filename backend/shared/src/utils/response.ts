import { ApiResponse } from '../types';

export class ResponseBuilder {
  static success<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      ...(meta && { meta }),
    };
  }

  static error(message: string, code?: string, details?: any): ApiResponse {
    return {
      success: false,
      error: {
        message,
        code,
        details,
      },
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
}

