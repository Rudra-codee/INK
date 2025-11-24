export interface User {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

