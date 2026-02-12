import type { Request, Response } from 'express';
import * as userService from '../services/userService.ts';

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  if (!req.params.id || Array.isArray(req.params.id)) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  const user = await userService.getUserById(req.params.id);
  if (!user) res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
  }

  const newUser = await userService.createUser({ name, email, password });
  res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.params.id || Array.isArray(req.params.id)) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  const updated = await userService.updateUser(req.params.id, req.body);
  if (!updated) res.status(404).json({ message: 'User not found' });
  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!req.params.id || Array.isArray(req.params.id)) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  const success = await userService.deleteUser(req.params.id);
  if (!success) res.status(404).json({ message: 'User not found' });
  res.status(204).send();
};