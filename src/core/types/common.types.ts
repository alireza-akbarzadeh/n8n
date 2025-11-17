/**
 * Common TypeScript Types
 * Shared types used across the application
 */

/**
 * Generic Result type for error handling
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Result helper functions
 */
export const Result = {
  ok<T>(data: T): Result<T, never> {
    return { success: true, data };
  },
  fail<E>(error: E): Result<never, E> {
    return { success: false, error };
  },
};

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort params
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Search params
 */
export interface SearchParams {
  search?: string;
}

/**
 * Filter params
 */
export interface FilterParams {
  [key: string]: unknown;
}

/**
 * Query params (combines pagination, sort, search, and filters)
 */
export interface QueryParams extends PaginationParams, SortParams, SearchParams {
  filters?: FilterParams;
}

/**
 * Timestamps
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Soft delete
 */
export interface SoftDelete {
  deletedAt: Date | null;
}

/**
 * Entity with ID
 */
export interface WithId {
  id: string;
}

/**
 * Entity with user tracking
 */
export interface WithUser {
  userId: string;
}

/**
 * Base entity (combines common fields)
 */
export interface BaseEntity extends WithId, Timestamps, WithUser {}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  validationErrors?: ValidationError[];
}

/**
 * Success response
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * API response (success or error)
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Async function type
 */
export type AsyncFunction<T = void> = () => Promise<T>;

/**
 * Optional properties helper
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Require at least one property
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Make properties nullable
 */
export type Nullable<T> = { [K in keyof T]: T[K] | null };

/**
 * Deep partial type
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
