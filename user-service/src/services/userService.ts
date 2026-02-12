import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import type { NewUser, User, UserUpdate } from '../models/userModel.ts';


export const getAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true
    }
  });
  return users.map((u : User) => ({
    id: u.id.toString(),
    name: u.name,
    email: u.email
  })) as Omit<User, 'password'>[];
};

export const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true
    }
  });
  
  if (!user) return null;
  
  return {
    id: user.id.toString(),
    name: user.username,
    email: user.email
  } as any;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true
    }
  });
  
  if (!user) return null;
  
  return {
    id: user.id.toString(),
    name: user.username,
    email: user.email,
    password: user.password
  } as any;
};

export const createUser = async (userData: NewUser): Promise<Omit<User, 'password'>> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const user = await prisma.user.create({
    data: {
      username: userData.name || '',
      email: userData.email,
      password: hashedPassword
    },
    select: {
      id: true,
      username: true,
      email: true
    }
  });
  
  return {
    id: user.id.toString(),
    name: user.username,
    email: user.email
  } as any;
};

export const updateUser = async (
  id: string,
  updates: UserUpdate
): Promise<Omit<User, 'password'> | null> => {
  try {
    const data: any = {};
    
    if (updates.name) data.username = updates.name;
    if (updates.email) data.email = updates.email;
    if (updates.password) {
      data.password = await bcrypt.hash(updates.password, 10);
    }
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        username: true,
        email: true
      }
    });
    
    return {
      id: user.id.toString(),
      name: user.username,
      email: user.email
    } as any;
  } catch (error) {
    return null;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    return false;
  }
};

