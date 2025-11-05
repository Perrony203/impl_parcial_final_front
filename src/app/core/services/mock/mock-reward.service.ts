import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  Reward,
  CreateRewardRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';
import { MOCK_REWARDS, createPaginatedResponse } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockRewardService {
  private rewards: Reward[] = [...MOCK_REWARDS];
  private nextId = 4;

  /**
   * Get rewards (paginated)
   * Why: Supports filtering by daemon - users see only their own
   */
  getRewards(params?: PaginationParams & { daemonUsername?: string }): Observable<PaginatedResponse<Reward>> {
    let filteredRewards = this.rewards;

    // Filter by daemon if specified
    if (params?.daemonUsername) {
      filteredRewards = this.rewards.filter(r => r.daemonUsername === params.daemonUsername);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return of(createPaginatedResponse(filteredRewards, page, limit)).pipe(delay(300));
  }

  /**
   * Get single reward by ID
   */
  getReward(id: number): Observable<Reward> {
    const reward = this.rewards.find(r => r.id === id);

    if (!reward) {
      return throwError(() => new Error('Reward not found')).pipe(delay(300));
    }

    return of(reward).pipe(delay(300));
  }

  /**
   * Create new reward/punishment
   * Why: Only superadmins can create these
   */
  createReward(data: CreateRewardRequest): Observable<Reward> {
    const newReward: Reward = {
      id: this.nextId++,
      daemonUsername: data.daemonUsername,
      type: data.type,
      description: data.description,
      createdAt: new Date().toISOString()
    };

    this.rewards.push(newReward);
    return of(newReward).pipe(delay(300));
  }

  /**
   * Delete reward
   * Why: Only superadmins can delete
   */
  deleteReward(id: number): Observable<void> {
    const index = this.rewards.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Reward not found')).pipe(delay(300));
    }

    this.rewards.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
