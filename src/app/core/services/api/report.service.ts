import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import {
  Report,
  CreateReportRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private api = inject(ApiService);

  /**
   * Get all reports with pagination
   * Why: Backend endpoint GET /reports?page=1&limit=10 (superadmin only)
   */
  getReports(params?: PaginationParams): Observable<PaginatedResponse<Report>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get<PaginatedResponse<Report>>(`/reports${query}`);
  }

  /**
   * Get single report by ID
   * Why: Backend endpoint GET /reports/:id (superadmin only)
   */
  getReport(id: number): Observable<Report> {
    return this.api.get<Report>(`/reports/${id}`);
  }

  /**
   * Create new report
   * Why: Backend endpoint POST /reports (public - no auth required)
   * Note: This is the only endpoint that doesn't need authentication
   */
  createReport(data: CreateReportRequest): Observable<Report> {
    return this.api.post<Report>('/reports', data);
  }

  /**
   * Delete report
   * Why: Backend endpoint DELETE /reports/:id (superadmin only)
   */
  deleteReport(id: number): Observable<void> {
    return this.api.delete<void>(`/reports/${id}`);
  }
}
