import { http, HttpResponse } from 'msw';

// Define your mock API handlers here
export const handlers = [
  // Example handler - adjust based on your API routes
  http.get('/api/trpc/workflows.list', () => {
    return HttpResponse.json({
      result: {
        data: [],
      },
    });
  }),
];
