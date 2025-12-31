import { z } from 'zod';
import { insertMessageSchema, messages } from './schema';

export const errorSchemas = {
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/query',
      input: z.object({ query: z.string() }),
      responses: {
        200: z.object({
            message: z.string(),
            citations: z.array(z.object({source: z.string(), page: z.string(), text: z.string()})),
            confidence: z.enum(['low', 'medium', 'high']),
            ragContext: z.array(z.string())
        }),
        500: errorSchemas.internal
      },
    },
  },
  files: {
    upload: {
      method: 'POST' as const,
      path: '/api/upload',
      input: z.any(),
      responses: {
        200: z.object({
          files: z.array(z.string()),
          message: z.string(),
        }),
        400: errorSchemas.internal,
        500: errorSchemas.internal,
      },
    },
  },
  hospitals: {
    list: {
      method: 'GET' as const,
      path: '/api/nearby-hospitals',
      input: z.object({ lat: z.number().optional(), lng: z.number().optional() }).optional(),
      responses: {
        200: z.array(z.object({
          id: z.number(),
          name: z.string(),
          distance: z.string(),
          rating: z.number(),
          address: z.string()
        })),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
