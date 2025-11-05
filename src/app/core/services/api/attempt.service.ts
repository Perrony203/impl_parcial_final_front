import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import {
  ResistanceAttempt,
  CreateAttemptRequest,
  UpdateAttemptRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AttemptService {
  private api = inject(ApiService);

  /**
   * Get all attempts with pagination
   * Why: Backend endpoint GET /attempts?page=1&limit=10&daemonUsername=user
   * Note: Backend filters by logged-in daemon automatically for daemon role
   */
  getAttempts(params?: PaginationParams & { daemonUsername?: string }): Observable<PaginatedResponse<ResistanceAttempt>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.daemonUsername) queryParams.append('daemonUsername', params.daemonUsername);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get<PaginatedResponse<ResistanceAttempt>>(`/attempts${query}`);
  }

  /**
   * Get single attempt by ID
   * Why: Backend endpoint GET /attempts/:id
   */
  getAttempt(id: number): Observable<ResistanceAttempt> {
    return this.api.get<ResistanceAttempt>(`/attempts/${id}`);
  }

  /**
   * Create new attempt
   * Why: Backend endpoint POST /attempts
   * Note: Backend auto-assigns daemonUsername from JWT token
   */
  createAttempt(data: CreateAttemptRequest): Observable<ResistanceAttempt> {
    return this.api.post<ResistanceAttempt>('/attempts', data);
  }

  /**
   * Update attempt
   * Why: Backend endpoint PATCH /attempts/:id
   */
  updateAttempt(id: number, data: UpdateAttemptRequest): Observable<ResistanceAttempt> {
    return this.api.patch<ResistanceAttempt>(`/attempts/${id}`, data);
  }

  /**
   * Delete attempt
   * Why: Backend endpoint DELETE /attempts/:id
   */
  deleteAttempt(id: number): Observable<void> {
    return this.api.delete<void>(`/attempts/${id}`);
  }
}
