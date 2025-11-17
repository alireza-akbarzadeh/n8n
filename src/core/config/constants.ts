/**
 * Application Constants
 * Centralized configuration constants
 */

export const APP_CONFIG = {
  name: 'Nodebase',
  description: 'Workflow automation platform',
  version: '0.1.0',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
} as const;

export const WORKFLOW = {
  MAX_NODES: 100,
  MAX_EDGES: 200,
  MAX_NAME_LENGTH: 255,
  DEFAULT_NAME: 'Untitled Workflow',
} as const;

export const EXECUTION = {
  MAX_DURATION_MS: 300000, // 5 minutes
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000, // 30 seconds per node
} as const;

export const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 900000, // 15 minutes
} as const;

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    maxWorkflows: 5,
    maxExecutionsPerMonth: 100,
    maxNodesPerWorkflow: 10,
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    maxWorkflows: 50,
    maxExecutionsPerMonth: 10000,
    maxNodesPerWorkflow: 50,
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    maxWorkflows: -1, // unlimited
    maxExecutionsPerMonth: -1, // unlimited
    maxNodesPerWorkflow: 100,
  },
} as const;

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
