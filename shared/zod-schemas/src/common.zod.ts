import z from 'zod';

export const PaginationSchema = z.object({
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
  page: z.number().int().min(1),
  pages: z.number().int().min(0),
});

export type PaginationType = z.infer<typeof PaginationSchema>;

export interface GetAllQueryResponse { data: any[]; pagination: PaginationType }

export const SortOrderEnum = z.enum(['asc', 'desc']);
export type SortOrder = z.infer<typeof SortOrderEnum>;
