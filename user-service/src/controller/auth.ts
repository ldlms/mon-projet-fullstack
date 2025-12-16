import type { Request, Response } from 'express';
import * as authService from '../services/auth.ts';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Missing fields' });
  }

  const result = await authService.signup({ name, email, password });

  if (!result) {
    res.status(409).json({ message: 'User already exists' });
  }

  res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Missing credentials' });
  }

  const result = await authService.login(email, password);

  if (!result) {
    res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json(result);
};

export const logout = (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful (client must discard token)' });
};