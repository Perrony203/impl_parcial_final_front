import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';

// A minimal environment lookup. If you have an environment file, prefer importing from there.
const DEFAULT_BACKEND = 'http://localhost:3000/badPlan';

@Injectable({ providedIn: 'root' })
export class Api {
  // private HttpClient injected via function inject() to follow standalone/service style
  private readonly http = inject(HttpClient);

  // Backend base URL (could be replaced by an import from environments)
  private readonly baseUrl: string = (window as any)?.env?.BACKEND_URL || DEFAULT_BACKEND;

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
  get<T = unknown>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = this.buildUrl(path);
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        httpParams = httpParams.set(k, String(params[k]));
      });
    }
    const obs: Observable<T> = this.http.get<T>(url, { params: httpParams }).pipe(catchError((e) => this.handleError(e)));
    return firstValueFrom(obs);
  }

  /**
   * POST request with JSON body
   */
  post<T = unknown, B = unknown>(path: string, body: B, headers?: HttpHeaders): Promise<T> {
    const url = this.buildUrl(path);
    const httpOptions = { headers: headers ?? this.jsonHeaders };
    const obs: Observable<T> = this.http.post<T>(url, body, httpOptions).pipe(catchError((e) => this.handleError(e)));
    return firstValueFrom(obs);
  }

  /**
   * PATCH request with JSON body
   */
  patch<T = unknown, B = unknown>(path: string, body: B, headers?: HttpHeaders): Promise<T> {
    const url = this.buildUrl(path);
    const httpOptions = { headers: headers ?? this.jsonHeaders };
    const obs: Observable<T> = this.http.patch<T>(url, body, httpOptions).pipe(catchError((e) => this.handleError(e)));
    return firstValueFrom(obs);
  }

  /**
   * DELETE request
   */
  delete<T = unknown>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = this.buildUrl(path);
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        httpParams = httpParams.set(k, String(params[k]));
      });
    }
    const obs: Observable<T> = this.http.delete<T>(url, { params: httpParams }).pipe(catchError((e) => this.handleError(e)));
    return firstValueFrom(obs);
  }
}

