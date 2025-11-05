import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  Report,
  CreateReportRequest,
  PaginatedResponse,
  PaginationParams
} from '../../../shared/models';
import { MOCK_REPORTS, createPaginatedResponse } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockReportService {
  private reports: Report[] = [...MOCK_REPORTS];
  private nextId = 4;

  /**
   * Get all reports (paginated)
   * Why: Only superadmins can view all reports
   */
  getReports(params?: PaginationParams): Observable<PaginatedResponse<Report>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return of(createPaginatedResponse(this.reports, page, limit)).pipe(delay(300));
  }

  /**
   * Get single report by ID
   */
  getReport(id: number): Observable<Report> {
    const report = this.reports.find(r => r.id === id);

    if (!report) {
      return throwError(() => new Error('Report not found')).pipe(delay(300));
    }

    return of(report).pipe(delay(300));
  }

  /**
   * Create new report
   * Why: Anonymous - no authentication required
   */
  createReport(data: CreateReportRequest): Observable<Report> {
    const newReport: Report = {
      id: this.nextId++,
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString()
    };

    this.reports.push(newReport);
    return of(newReport).pipe(delay(300));
  }

  /**
   * Delete report
   * Why: Only superadmins can delete reports
   */
  deleteReport(id: number): Observable<void> {
    const index = this.reports.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Report not found')).pipe(delay(300));
    }

    this.reports.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
