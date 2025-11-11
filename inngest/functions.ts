import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { inngest } from './client';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI();

export const helloWorld = inngest.createFunction(
  { id: 'execute-ai' },
  { event: 'execute/ai' },
  async ({ step }) => {
    const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
      prompt: 'what is the meaning of life?',
      model: google('gemini-2.5-flash'),
      system: 'You are a helpful assistant.',
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return steps;
  }
);
