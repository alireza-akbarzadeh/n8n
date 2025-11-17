import { randomUUID } from 'crypto';

/**
 * Request ID utilities for tracking requests across the application
 * Useful for debugging, logging, and tracing requests
 */

/**
 * Generate a unique request ID
 * @returns A UUID v4 string
 */
export function generateRequestId(): string {
  return randomUUID();
}

/**
 * Extract request ID from headers or generate a new one
 * @param headers - Request headers object
 * @returns Request ID string
 */
export function getOrCreateRequestId(headers: Headers | Record<string, string>): string {
  const headerValue =
    headers instanceof Headers
      ? headers.get('x-request-id')
      : headers['x-request-id'] || headers['X-Request-Id'];

  return headerValue || generateRequestId();
}

/**
 * Add request ID to response headers
 * @param headers - Response headers object
 * @param requestId - The request ID to add
 */
export function addRequestIdToHeaders(headers: Headers, requestId: string): void {
  headers.set('X-Request-Id', requestId);
}

/**
 * Create a request ID middleware context
 * Usage in tRPC context or API routes
 */
export function createRequestIdContext(headers: Headers | Record<string, string>): {
  requestId: string;
} {
  const requestId = getOrCreateRequestId(headers);
  return { requestId };
}

/**
 * Format log message with request ID
 * @param requestId - The request ID
 * @param message - Log message
 * @returns Formatted log message
 */
export function formatLogWithRequestId(requestId: string, message: string): string {
  return `[${requestId}] ${message}`;
}
