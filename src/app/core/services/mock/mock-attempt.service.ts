import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  ResistanceAttempt,
  CreateAttemptRequest,
  UpdateAttemptRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';
import { MOCK_ATTEMPTS, createPaginatedResponse } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockAttemptService {
  private attempts: ResistanceAttempt[] = [...MOCK_ATTEMPTS];
  private nextId = 5; // Why: Continue from existing mock data IDs

  /**
   * Get all attempts (paginated)
   * Why: Supports filtering by daemon username for role-based access
   */
  getAttempts(params?: PaginationParams & { daemonUsername?: string }): Observable<PaginatedResponse<ResistanceAttempt>> {
    let filteredAttempts = this.attempts;

    // Filter by daemon if specified (for daemon role viewing only their attempts)
    if (params?.daemonUsername) {
      filteredAttempts = this.attempts.filter(a => a.daemonUsername === params.daemonUsername);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return of(createPaginatedResponse(filteredAttempts, page, limit)).pipe(delay(300));
  }

  /**
   * Get single attempt by ID
   */
  getAttempt(id: number): Observable<ResistanceAttempt> {
    const attempt = this.attempts.find(a => a.id === id);

    if (!attempt) {
      return throwError(() => new Error('Attempt not found')).pipe(delay(300));
    }

    return of(attempt).pipe(delay(300));
  }

  /**
   * Create new attempt
   * Why: Auto-assigns current user as daemon, generates ID and timestamps
   */
  createAttempt(data: CreateAttemptRequest, daemonUsername: string): Observable<ResistanceAttempt> {
    const newAttempt: ResistanceAttempt = {
      id: this.nextId++,
      victimName: data.victimName,
      description: data.description,
      state: 'Pending', // Why: New attempts always start as Pending
      daemonUsername: daemonUsername,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.attempts.push(newAttempt);
    return of(newAttempt).pipe(delay(300));
  }

  /**
   * Update attempt
   * Why: Allows changing description and state, updates timestamp
   */
  updateAttempt(id: number, data: UpdateAttemptRequest): Observable<ResistanceAttempt> {
    const index = this.attempts.findIndex(a => a.id === id);

    if (index === -1) {
      return throwError(() => new Error('Attempt not found')).pipe(delay(300));
    }

    this.attempts[index] = {
      ...this.attempts[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return of(this.attempts[index]).pipe(delay(300));
  }

  /**
   * Delete attempt
   */
  deleteAttempt(id: number): Observable<void> {
    const index = this.attempts.findIndex(a => a.id === id);

    if (index === -1) {
      return throwError(() => new Error('Attempt not found')).pipe(delay(300));
    }

    this.attempts.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
