export interface User {
  username: string;
  role: 'superadmin' | 'daemon';
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
