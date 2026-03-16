import { zValidator } from '@hono/zod-validator';
import { LoginSchema } from '@ticketbasics/zod-schemas';
import { Hono } from 'hono';

import { UserRepository } from '@/repository';
import { JwtService } from '@/service/jwt.service';

const authHandler = new Hono()
  .post('/login', zValidator('json', LoginSchema), async (c) => {
    const { username } = c.req.valid('json');

    const user = await UserRepository.getByUsername(username);

    const token = await JwtService.generateToken(user.id);

    return c.json({ message: 'Login successful', token }, 200);
  });

export default authHandler;
