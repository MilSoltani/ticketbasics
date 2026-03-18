import { zValidator } from '@hono/zod-validator';
import { LoginSchema, SignupSchema } from '@ticketbasics/zod-schemas';
import { compare, hash } from 'bcryptjs';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

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

    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'Lax',
    });

    return c.json({ message: 'Logged in' });
  })
  .post('/signup', zValidator('json', SignupSchema), async (c) => {
    const { firstName, lastName, username, password } = c.req.valid('json');

    const existingUser = await UserRepository.getByUsernameForAuth(username);

    if (existingUser) {
      throw new Error('Conflict username already exists!');
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await UserRepository.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const token = await JwtService.generateToken(newUser.id);

    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'Lax',
    });

    return c.json({ message: 'Signup success' });
  });

export default authHandler;
