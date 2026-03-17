import { zValidator } from '@hono/zod-validator';
import { LoginSchema } from '@ticketbasics/zod-schemas';
import { compare } from 'bcryptjs';
import { Hono } from 'hono';

import { UserRepository } from '@/repository';
import { JwtService } from '@/service/jwt.service';

const authHandler = new Hono()
  .post('/login', zValidator('json', LoginSchema), async (c) => {
    const { username, password } = c.req.valid('json');

    const user = await UserRepository.getByUsernameForAuth(username);

    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid Credentials');
    }

    const token = await JwtService.generateToken(user.id);

    return c.json({ message: 'Login successful', token }, 200);
  });

export default authHandler;
