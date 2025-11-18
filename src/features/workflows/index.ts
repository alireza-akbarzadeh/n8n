// Domain (safe for client)
export * from './domain';

// Presentation (client-safe)
export * from './presentation';

// API (client-safe tRPC router definitions)
export * from './api';

// Server-side only exports - DO NOT re-export here
// Import directly from these paths when needed server-side:
// - './application' (use cases)
// - './infrastructure' (repositories, mappers)
