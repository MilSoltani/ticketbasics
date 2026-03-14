import { z } from 'zod';

export const TicketStatusEnum = z.enum(['open', 'pending', 'working', 'resolved', 'closed']);
export const TicketPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

export const TicketSchema = z.object({
  id: z.number().int(),
  subject: z.string().min(1, 'Subject is required').max(512),
  description: z.string().min(1, 'Description is required'),
  status: TicketStatusEnum.default('open'),
  priority: TicketPriorityEnum.default('low'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TicketCreateSchema = TicketSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: TicketStatusEnum.optional(),
  priority: TicketPriorityEnum.optional(),
});

export const TicketUpdateSchema = TicketCreateSchema.partial();

export const TicketQuerySchema = z.object({
  id: z.coerce.number().int().optional(),
  subject: z.string().optional(),
  statusIn: z.array(TicketStatusEnum).default([]),
  priorityIn: z.array(TicketPriorityEnum).default([]),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  sort: z.enum(['createdAt', 'priority', 'status', 'subject']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type Ticket = z.infer<typeof TicketSchema>;
export type TicketCreatePayload = z.infer<typeof TicketCreateSchema>;
export type TicketUpdatePayload = z.infer<typeof TicketUpdateSchema>;
export type TicketStatus = z.infer<typeof TicketStatusEnum>;
export type TicketPriority = z.infer<typeof TicketPriorityEnum>;
export type TicketQuery = z.infer<typeof TicketQuerySchema>;
