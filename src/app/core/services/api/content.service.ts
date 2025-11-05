import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import {
  ResistanceContent,
  CreateContentRequest,
  UpdateContentRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private api = inject(ApiService);

  /**
   * Get all content with pagination
   * Why: Backend endpoint GET /content?page=1&limit=10 (public access)
   */
  getContent(params?: PaginationParams): Observable<PaginatedResponse<ResistanceContent>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get<PaginatedResponse<ResistanceContent>>(`/content${query}`);
  }

  /**
   * Get single content by ID
   * Why: Backend endpoint GET /content/:id (public access)
   */
  getContentById(id: number): Observable<ResistanceContent> {
    return this.api.get<ResistanceContent>(`/content/${id}`);
  }

  /**
   * Create new content
   * Why: Backend endpoint POST /content (superadmin only)
   */
  createContent(data: CreateContentRequest): Observable<ResistanceContent> {
    return this.api.post<ResistanceContent>('/content', data);
  }

  /**
   * Update content
   * Why: Backend endpoint PATCH /content/:id (superadmin only)
   */
  updateContent(id: number, data: UpdateContentRequest): Observable<ResistanceContent> {
    return this.api.patch<ResistanceContent>(`/content/${id}`, data);
  }

  /**
   * Delete content
   * Why: Backend endpoint DELETE /content/:id (superadmin only)
   */
  deleteContent(id: number): Observable<void> {
    return this.api.delete<void>(`/content/${id}`);
  }
}
