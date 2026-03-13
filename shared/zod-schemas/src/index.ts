import z from 'zod';

export * from './ticket.zod';

export const PaginationSchema = z.object({
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
  page: z.number().int().min(1),
  pages: z.number().int().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;
