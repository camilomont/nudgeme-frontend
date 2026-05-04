import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  get<T>(path: string): Observable<T> {
    return this.http
      .get<{ data: T }>(`${this.base}${path}`)
      .pipe(map((res) => res.data));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<{ data: T }>(`${this.base}${path}`, body)
      .pipe(map((res) => res.data));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<{ data: T }>(`${this.base}${path}`, body)
      .pipe(map((res) => res.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<{ data: T }>(`${this.base}${path}`)
      .pipe(map((res) => res.data));
  }
}
