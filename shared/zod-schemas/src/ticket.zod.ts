import { z } from 'zod';

export const TicketStatusEnum = z.enum(['open', 'closed', 'pending', 'in_progress']);
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

export const CreateTicketSchema = TicketSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: TicketStatusEnum.optional(),
});

export const UpdateTicketSchema = CreateTicketSchema.partial();

export type Ticket = z.infer<typeof TicketSchema>;
export type TicketCreatePayload = z.infer<typeof CreateTicketSchema>;
export type TicketUpdatePayload = z.infer<typeof UpdateTicketSchema>;
export type TicketStatus = z.infer<typeof TicketStatusEnum>;
export type TicketPriority = z.infer<typeof TicketPriorityEnum>;
