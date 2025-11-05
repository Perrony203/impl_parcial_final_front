import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import {
  Victim,
  CreateVictimRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class VictimService {
  private api = inject(ApiService);

  /**
   * Get all victims with pagination
   * Why: Backend endpoint GET /victims?page=1&limit=10
   */
  getVictims(params?: PaginationParams): Observable<PaginatedResponse<Victim>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get<PaginatedResponse<Victim>>(`/victims${query}`);
  }

  /**
   * Get single victim by name
   * Why: Backend endpoint GET /victims/:name
   */
  getVictim(name: string): Observable<Victim> {
    return this.api.get<Victim>(`/victims/${encodeURIComponent(name)}`);
  }

  /**
   * Create new victim
   * Why: Backend endpoint POST /victims
   */
  createVictim(data: CreateVictimRequest): Observable<Victim> {
    return this.api.post<Victim>('/victims', data);
  }

  /**
   * Update victim
   * Why: Backend endpoint PATCH /victims/:name
   */
  updateVictim(name: string, data: Partial<CreateVictimRequest>): Observable<Victim> {
    return this.api.patch<Victim>(`/victims/${encodeURIComponent(name)}`, data);
  }

  /**
   * Delete victim
   * Why: Backend endpoint DELETE /victims/:name
   */
  deleteVictim(name: string): Observable<void> {
    return this.api.delete<void>(`/victims/${encodeURIComponent(name)}`);
  }
}
