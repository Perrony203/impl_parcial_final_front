import { Injectable, inject } from '@angular/core';
import { Api } from './api.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly api = inject(Api);
  private readonly tokenKey = 'auth_token';

  /** Call POST /auth/login with credentials, store token in localStorage and return the token payload */
  async login(credentials: LoginCredentials): Promise<JwtPayload> {
    try {
      const res = await this.api.post<{ token: string }, LoginCredentials>('/auth/login', credentials);
      const token = (res as any)?.token ?? (res as any)?.accessToken ?? null;
      if (!token) throw { message: 'No token returned from /auth/login', res };
      localStorage.setItem(this.tokenKey, token);
      const payload = this.decodeToken(token);
      return payload ?? {};
    } catch (err) {
      // rethrow so caller can handle it
      throw err;
    }
  }

  /** Retrieve token from localStorage */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** True if a token exists and is not expired (basic check) */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeToken(token);
    if (!payload) return false;
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    return true;
  }

  /** Decode JWT payload safely (does not verify signature) */
  getTokenPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  /** Extract user role from token payload */
  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    if (!payload) return null;
    // common claim names: role, roles, scope
  if (payload.role) return String(payload.role);
  if (payload['roles']) return Array.isArray(payload['roles']) ? String(payload['roles'][0]) : String(payload['roles']);
  if (payload['scope']) return String(payload['scope']);
    return null;
  }

  /** Clear token and any related auth state */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /** Get current user info from backend: GET /auth/me */
  async getCurrentUser(): Promise<User> {
    try {
      const user = await this.api.get<User>('/auth/me');
      return user as User;
    } catch (err) {
      throw err;
    }
  }

  // --- internal helpers ---
  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      // base64url -> base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // pad base64 string
      const pad = base64.length % 4;
      const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
      const json = atob(padded);
      return JSON.parse(json) as JwtPayload;
    } catch (e) {
      return null;
    }
  }
}
