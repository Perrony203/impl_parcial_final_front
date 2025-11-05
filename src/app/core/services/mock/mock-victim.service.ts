import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  Victim,
  CreateVictimRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';
import { MOCK_VICTIMS, createPaginatedResponse } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockVictimService {
  // Why: In-memory storage that persists during session
  private victims: Victim[] = [...MOCK_VICTIMS];

  /**
   * Get all victims (paginated)
   * Why delay: Simulate network call
   */
  getVictims(params?: PaginationParams): Observable<PaginatedResponse<Victim>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return of(createPaginatedResponse(this.victims, page, limit)).pipe(delay(300));
  }

  /**
   * Get single victim by name
   */
  getVictim(name: string): Observable<Victim> {
    const victim = this.victims.find(v => v.name === name);

    if (!victim) {
      return throwError(() => new Error('Victim not found')).pipe(delay(300));
    }

    return of(victim).pipe(delay(300));
  }

  /**
   * Create new victim
   * Why: Simulates POST request, generates timestamps
   */
  createVictim(data: CreateVictimRequest): Observable<Victim> {
    // Check if victim with same name exists
    if (this.victims.some(v => v.name === data.name)) {
      return throwError(() => new Error('Victim with this name already exists')).pipe(delay(300));
    }

    const newVictim: Victim = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.victims.push(newVictim);
    return of(newVictim).pipe(delay(300));
  }

  /**
   * Update victim
   * Why: Simulates PATCH request, updates timestamp
   */
  updateVictim(name: string, data: Partial<CreateVictimRequest>): Observable<Victim> {
    const index = this.victims.findIndex(v => v.name === name);

    if (index === -1) {
      return throwError(() => new Error('Victim not found')).pipe(delay(300));
    }

    this.victims[index] = {
      ...this.victims[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return of(this.victims[index]).pipe(delay(300));
  }

  /**
   * Delete victim
   * Why: Removes from in-memory array
   */
  deleteVictim(name: string): Observable<void> {
    const index = this.victims.findIndex(v => v.name === name);

    if (index === -1) {
      return throwError(() => new Error('Victim not found')).pipe(delay(300));
    }

    this.victims.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
