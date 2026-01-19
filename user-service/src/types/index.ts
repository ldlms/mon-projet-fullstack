export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface Card {
  id: string;
  userId: string;
  title: string;
  content: string;
}