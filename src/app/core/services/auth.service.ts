import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, of } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, LoginResponse } from '../../shared/models';
import { Optional, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MockAuthService } from './mock/mock-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
   private mockAuthService = inject(MockAuthService); // ← Inject mock service directly

  // Why signals: Reactive state management in Angular 20
  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();
  // Why @Optional: Mock backend only exists in mock mode
  @Optional() @Inject('AUTH_BACKEND') private mockAuth: any;

  private readonly TOKEN_KEY = 'auth_token';

  constructor() {
    // Why: Restore user session on app load
    this.loadUserFromToken();
  }

  /**
   * Why: Decode JWT to extract user info without hitting the server
   * Security note: Never trust client-side JWT data for authorization - server validates
   */
  private decodeToken(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        username: decoded.username,
        role: decoded.role,
        createdAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString()
      };
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  /**
   * Why: Check if token exists on app startup to maintain logged-in state
   */
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      const user = this.decodeToken(token);
      if (user) {
        this.currentUserSignal.set(user);
      } else {
        this.logout(); // Invalid token, clear it
      }
    }
  }

  /**
   * Login - uses mock or real backend
   * Why check mockAuth: In mock mode, use MockAuthService, otherwise use real API
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const loginObservable = environment.useMockServices
      ? this.mockAuthService.login(credentials)  // Mock mode
      : this.api.post<LoginResponse>('/auth/login', credentials);  // Real mode

    return loginObservable.pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const user = this.decodeToken(response.token);
        if (user) {
          this.currentUserSignal.set(user);
        }
      })
    );
  }

  /**
   * Logout
   * Why: Clear auth state, remove token, redirect to login
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get stored token
   * Why: Used by HTTP interceptor to add Authorization header
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   * Why: Used by guards to protect routes
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  /**
   * Check if user is superadmin
   * Why: Used by guards and UI to show/hide features
   */
  isSuperAdmin(): boolean {
    return this.currentUser()?.role === 'superadmin';
  }

  /**
   * Get current user role
   * Why: Convenient helper for role-based UI logic
   */
  getUserRole(): 'superadmin' | 'daemon' | null {
    return this.currentUser()?.role || null;
  }
}
