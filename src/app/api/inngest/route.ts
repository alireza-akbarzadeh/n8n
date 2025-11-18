import { serve } from 'inngest/next';
import { inngest } from '@/core/inngest/client';
import { helloWorld } from '@/core/inngest/functions';

export const { GET, PUT, POST } = serve({ client: inngest, functions: [helloWorld] });
