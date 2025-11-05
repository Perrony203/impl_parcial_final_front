import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import {
  Reward,
  CreateRewardRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private api = inject(ApiService);

  /**
   * Get rewards with pagination
   * Why: Backend endpoint GET /rewards?page=1&limit=10&daemonUsername=user
   * Note: Daemons can only see their own, backend filters automatically
   */
  getRewards(params?: PaginationParams & { daemonUsername?: string }): Observable<PaginatedResponse<Reward>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.daemonUsername) queryParams.append('daemonUsername', params.daemonUsername);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get<PaginatedResponse<Reward>>(`/rewards${query}`);
  }

  /**
   * Get single reward by ID
   * Why: Backend endpoint GET /rewards/:id
   */
  getReward(id: number): Observable<Reward> {
    return this.api.get<Reward>(`/rewards/${id}`);
  }

  /**
   * Create new reward/punishment
   * Why: Backend endpoint POST /rewards (superadmin only)
   */
  createReward(data: CreateRewardRequest): Observable<Reward> {
    return this.api.post<Reward>('/rewards', data);
  }

  /**
   * Delete reward
   * Why: Backend endpoint DELETE /rewards/:id (superadmin only)
   */
  deleteReward(id: number): Observable<void> {
    return this.api.delete<void>(`/rewards/${id}`);
  }
}
