import { createLoader } from 'nuqs/server';
import { baseQueryParams } from '../params';

export const baseLoaderParams = createLoader(baseQueryParams);

// Alias for backward compatibility
export const loadWorkflowParams = baseLoaderParams;
