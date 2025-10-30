import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Api {
  // private HttpClient injected via function inject() to follow standalone/service style
  private readonly http = inject(HttpClient);

  // Backend base URL from environment config
  private readonly baseUrl: string = environment.apiUrl;

  // Default headers (JSON)
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Helper to build full URL from path
  private buildUrl(path: string): string {
    if (!path) return this.baseUrl;
    // if path is a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // ensure single slash separation
    return `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  // Generic error handler: returns an observable error
  private handleError(err: HttpErrorResponse) {
    // You can extend this to log to external services
    const message = err.error && err.error.message ? err.error.message : err.message || 'Unknown error';
    const payload = {
      status: err.status,
      message,
      url: err.url
    };
    return throwError(() => payload);
  }

  /**
   * GET request
   * @param path endpoint path or full URL
   * @param params optional query parameters
   */
  get<T = unknown>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const url = this.buildUrl(path);
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        httpParams = httpParams.set(k, String(params[k]));
      });
    }
    return this.http.get<T>(url, { params: httpParams }).pipe(
      catchError((e) => this.handleError(e))
    );
  }

  /**
   * POST request with JSON body
   */
  post<T = unknown, B = unknown>(path: string, body: B, headers?: HttpHeaders): Observable<T> {
    const url = this.buildUrl(path);
    const httpOptions = { headers: headers ?? this.jsonHeaders };
    return this.http.post<T>(url, body, httpOptions).pipe(
      catchError((e) => this.handleError(e))
    );
  }

  /**
   * PATCH request with JSON body
   */
  patch<T = unknown, B = unknown>(path: string, body: B, headers?: HttpHeaders): Observable<T> {
    const url = this.buildUrl(path);
    const httpOptions = { headers: headers ?? this.jsonHeaders };
    return this.http.patch<T>(url, body, httpOptions).pipe(
      catchError((e) => this.handleError(e))
    );
  }

  /**
   * DELETE request
   */
  delete<T = unknown>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const url = this.buildUrl(path);
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        httpParams = httpParams.set(k, String(params[k]));
      });
    }
    return this.http.delete<T>(url, { params: httpParams }).pipe(
      catchError((e) => this.handleError(e))
    );
  }
}

