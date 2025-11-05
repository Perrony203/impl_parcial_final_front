import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  ResistanceContent,
  CreateContentRequest,
  UpdateContentRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';
import { MOCK_CONTENT, createPaginatedResponse } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockContentService {
  private content: ResistanceContent[] = [...MOCK_CONTENT];
  private nextId = 4;

  /**
   * Get all content (paginated)
   * Why: Public access - no authentication required
   */
  getContent(params?: PaginationParams): Observable<PaginatedResponse<ResistanceContent>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return of(createPaginatedResponse(this.content, page, limit)).pipe(delay(300));
  }

  /**
   * Get single content by ID
   * Why: Public access for reading
   */
  getContentById(id: number): Observable<ResistanceContent> {
    const content = this.content.find(c => c.id === id);

    if (!content) {
      return throwError(() => new Error('Content not found')).pipe(delay(300));
    }

    return of(content).pipe(delay(300));
  }

  /**
   * Create new content
   * Why: Only superadmins can create
   */
  createContent(data: CreateContentRequest): Observable<ResistanceContent> {
    const newContent: ResistanceContent = {
      id: this.nextId++,
      title: data.title,
      body: data.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.content.push(newContent);
    return of(newContent).pipe(delay(300));
  }

  /**
   * Update content
   * Why: Only superadmins can update, updates timestamp
   */
  updateContent(id: number, data: UpdateContentRequest): Observable<ResistanceContent> {
    const index = this.content.findIndex(c => c.id === id);

    if (index === -1) {
      return throwError(() => new Error('Content not found')).pipe(delay(300));
    }

    this.content[index] = {
      ...this.content[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return of(this.content[index]).pipe(delay(300));
  }

  /**
   * Delete content
   * Why: Only superadmins can delete
   */
  deleteContent(id: number): Observable<void> {
    const index = this.content.findIndex(c => c.id === id);

    if (index === -1) {
      return throwError(() => new Error('Content not found')).pipe(delay(300));
    }

    this.content.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
