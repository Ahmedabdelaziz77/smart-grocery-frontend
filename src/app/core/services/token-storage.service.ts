import { Injectable } from '@angular/core';
import { AuthUser } from '../models/auth.model';

const REFRESH_TOKEN_KEY = 'sg_refresh_token';
const USER_KEY = 'sg_user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  setRefreshToken(token: string): void {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setUser(user: AuthUser): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const raw = sessionStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  getRole(): 'ADMIN' | 'USER' | null {
    return this.getUser()?.role ?? null;
  }

  clear(): void {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getRefreshToken();
  }
}
