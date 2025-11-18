import { serve } from 'inngest/next';
import { inngest } from '@/core/inngest/client';
import { excecuteWorkflow } from '@/core/inngest/functions';

export const { GET, PUT, POST } = serve({ client: inngest, functions: [excecuteWorkflow] });
