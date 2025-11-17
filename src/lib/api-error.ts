import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@/prisma/generated/prisma/client';
import { logger } from './logger';

/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  // Predefined error factories
  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static conflict(message: string, details?: unknown) {
    return new ApiError(409, message, 'CONFLICT', details);
  }

  static unprocessableEntity(message: string, details?: unknown) {
    return new ApiError(422, message, 'UNPROCESSABLE_ENTITY', details);
  }

  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message, 'RATE_LIMIT_EXCEEDED');
  }

  static internal(message = 'Internal server error', details?: unknown) {
    return new ApiError(500, message, 'INTERNAL_ERROR', details);
  }

  static serviceUnavailable(message = 'Service unavailable') {
    return new ApiError(503, message, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * Handle API errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown, requestId?: string): NextResponse {
  const logContext = { requestId, err: error };

  // Custom ApiError
  if (error instanceof ApiError) {
    logger.error(logContext, `API Error: ${error.message}`);
    const response: Record<string, unknown> = {
      error: error.message,
      code: error.code,
      requestId,
    };
    if (error.details) {
      response.details = error.details;
    }
    return NextResponse.json(response, { status: error.statusCode });
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    logger.warn(logContext, 'Validation error');
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
        requestId,
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(logContext, `Prisma error: ${error.code}`);

    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return NextResponse.json(
          {
            error: 'A record with this value already exists',
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
            field: error.meta?.target,
            requestId,
          },
          { status: 409 }
        );

      case 'P2025': // Record not found
        return NextResponse.json(
          {
            error: 'Record not found',
            code: 'NOT_FOUND',
            requestId,
          },
          { status: 404 }
        );

      case 'P2003': // Foreign key constraint violation
        return NextResponse.json(
          {
            error: 'Related record not found',
            code: 'FOREIGN_KEY_VIOLATION',
            requestId,
          },
          { status: 400 }
        );

      default:
        return NextResponse.json(
          {
            error: 'Database error',
            code: 'DATABASE_ERROR',
            requestId,
          },
          { status: 500 }
        );
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error(logContext, 'Prisma validation error');
    return NextResponse.json(
      {
        error: 'Invalid data format',
        code: 'VALIDATION_ERROR',
        requestId,
      },
      { status: 400 }
    );
  }

  // Generic errors
  if (error instanceof Error) {
    logger.error(logContext, `Unexpected error: ${error.message}`);
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        requestId,
      },
      { status: 500 }
    );
  }

  // Unknown error type
  logger.error(logContext, 'Unknown error type');
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      requestId,
    },
    { status: 500 }
  );
}

/**
 * Async error handler wrapper for API routes
 *
 * @example
 * export const GET = withErrorHandler(async (request) => {
 *   const data = await fetchData();
 *   return NextResponse.json(data);
 * });
 */
export function withErrorHandler<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = args[0] as Request;
      const requestId = request.headers.get('x-request-id') || undefined;
      return handleApiError(error, requestId);
    }
  }) as T;
}
