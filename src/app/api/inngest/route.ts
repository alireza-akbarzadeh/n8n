import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { helloWorld } from '@/inngest/functions';

export const { GET, PUT, POST } = serve({ client: inngest, functions: [helloWorld] });
