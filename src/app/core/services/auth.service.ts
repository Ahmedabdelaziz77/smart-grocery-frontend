import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, map, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  SignupRequest,
  UserRole
} from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorageService);
  private readonly authApi = `${environment.apiUrl}/auth`;

  private accessToken: string | null = null;
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  private readonly currentUserSignal = signal<AuthUser | null>(this.storage.getUser());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly role = computed<UserRole | null>(() => this.currentUserSignal()?.role ?? null);

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApi}/login`, body).pipe(
      tap((res) => this.setSession(res))
    );
  }

  signup(body: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApi}/signup`, body).pipe(
      tap((res) => this.setSession(res))
    );
  }

  refreshToken(): Observable<string> {
    if (this.refreshing) {
      return this.refreshSubject.pipe(
        filter((token): token is string => token !== null),
        take(1)
      );
    }

    const refreshToken = this.storage.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshing = true;
    this.refreshSubject.next(null);

    return this.http
      .post<AuthResponse>(`${this.authApi}/refresh`, { refreshToken })
      .pipe(
        tap((res) => this.setSession(res)),
        map((res) => res.accessToken),
        tap((token) => this.refreshSubject.next(token)),
        finalize(() => {
          this.refreshing = false;
        }),
        catchError((error) => {
          this.logout(true).subscribe({ error: () => {} });
          return throwError(() => error);
        })
      );
  }

  logout(fromInterceptor = false): Observable<unknown> {
    const request$ = this.http.post(`${this.authApi}/logout`, {});

    return request$.pipe(
      tap(() => this.clearSession()),
      catchError((error) => {
        this.clearSession();
        if (fromInterceptor) {
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }

  forceLogout(): void {
    this.clearSession();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  private setSession(response: AuthResponse): void {
    const user: AuthUser = {
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role
    };

    this.accessToken = response.accessToken;
    this.currentUserSignal.set(user);
    this.storage.setRefreshToken(response.refreshToken);
    this.storage.setUser(user);
  }

  private clearSession(): void {
    this.accessToken = null;
    this.currentUserSignal.set(null);
    this.storage.clear();
  }
}
