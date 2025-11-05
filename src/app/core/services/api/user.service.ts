import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { User, PaginatedResponse, PaginationParams } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = inject(ApiService);

  /**
   * Get all users with pagination
   * Why: Backend endpoint GET /users?page=1&limit=10 (superadmin only)
   */
  getUsers(params?: PaginationParams): Observable<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get<PaginatedResponse<User>>(`/users${query}`);
  }

  /**
   * Get single user by username
   * Why: Backend endpoint GET /users/:username (superadmin only)
   */
  getUser(username: string): Observable<User> {
    return this.api.get<User>(`/users/${encodeURIComponent(username)}`);
  }

  /**
   * Create new user
   * Why: Backend endpoint POST /users (superadmin only)
   */
  createUser(data: { username: string; password: string; role: 'superadmin' | 'daemon' }): Observable<User> {
    return this.api.post<User>('/users', data);
  }

  /**
   * Delete user
   * Why: Backend endpoint DELETE /users/:username (superadmin only)
   */
  deleteUser(username: string): Observable<void> {
    return this.api.delete<void>(`/users/${encodeURIComponent(username)}`);
  }
}
