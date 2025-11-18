import { serve } from 'inngest/next';
import { inngest } from '@/src/core/inngest/client';
import { helloWorld } from '@/src/core/inngest/functions';

export const { GET, PUT, POST } = serve({ client: inngest, functions: [helloWorld] });
