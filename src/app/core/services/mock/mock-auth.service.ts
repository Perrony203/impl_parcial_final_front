import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../../../shared/models';
import { MOCK_USERS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  /**
   * Mock login
   * Why delay: Simulates network latency for realistic testing
   *
   * Test credentials:
   * - username: admin, password: admin123 (superadmin)
   * - username: daemon1, password: daemon123 (daemon)
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        const user = MOCK_USERS.find(u => u.username === credentials.username);

        // Validate credentials
        const validCredentials =
          (credentials.username === 'admin' && credentials.password === 'admin123') ||
          (credentials.username === 'daemon1' && credentials.password === 'daemon123') ||
          (credentials.username === 'daemon2' && credentials.password === 'daemon123');

        if (!validCredentials || !user) {
          return throwError(() => new Error('Invalid credentials'));
        }

        // Generate fake JWT token
        // Why: Create properly formatted JWT (header.payload.signature)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
          username: user.username,
          role: user.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
        }));
        const signature = btoa('mock-signature');

        const fakeToken = `${header}.${payload}.${signature}`;

        return of({
          token: fakeToken,
          user: user
        });
      })
    );
  }
}
