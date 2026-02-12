import { signToken } from '../utils/Jwt';
import bcrypt from 'bcryptjs';
import * as userService from './userService';

interface NewUser {
  name?: string;
  email: string;
  password: string;
}

export const signup = async ({ name, email, password }: NewUser) => {
  try {
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      return null;
    }

    const newUser: NewUser = {
      name: name || '',
      email,
      password
    };
    
    console.log('New user payload:', newUser);

    const createdUser = await userService.createUser(newUser);
    console.log('New user created:', createdUser);
    
    const token = signToken({ id: createdUser.id, email: createdUser.email });

    console.log('TOKEN:', token);
    
    return { 
      token, 
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email
      }
    };
  } catch (error) {
    console.error('Signup service error:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const user = await userService.getUserByEmail(email);
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return null; // pas d'user avec cet email
    }

    const valid = await bcrypt.compare(password, user.password);
    
    console.log('Password valid:', valid);
    
    if (!valid) {
      return null; // mot de passe incorrect
    }

    // création JWT
    const token = signToken({ id: user.id, email });

    console.log('Generated token:', token);
    
    return { 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email 
      } 
    };
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};