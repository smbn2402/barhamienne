import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private loginSuccessSubject = new BehaviorSubject<boolean>(false);
  loginSuccess$ = this.loginSuccessSubject.asObservable();

  constructor(private http: HttpClient) {}

  get csrfCookie(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  getTokenFromCookie(): string | null {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  login(email: string, password: string): Observable<any> {
    return this.logout().pipe(
      catchError(() => {
        // On ignore les erreurs si aucun utilisateur n'était connecté
        return this.csrfCookie;
      }),
      switchMap(() => this.csrfCookie),
      switchMap(() =>
        this.http.post(
          `${this.apiUrl}/login`,
          { email, password },
          {
            withCredentials: true,
          }
        )
      ),
      switchMap(() => this.fetchUser()),
      catchError((err) => {
        console.error('Login error', err);
        return throwError(() => err);
      })
    );
  }

  setLoginSuccess(status: boolean) {
    this.loginSuccessSubject.next(status);
  }

  fetchUser(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/api/user`, { withCredentials: true })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  peekUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user`, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(tap(() => this.userSubject.next(null)));
  }

  getUser(): any {
    return this.userSubject;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  resetPassword(payload: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.logout().pipe(
      catchError(() => this.csrfCookie), // ignore si pas connecté
      switchMap(() => this.csrfCookie),
      switchMap(() =>
        this.http.post(`${this.apiUrl}/reset-password`, payload, {
          withCredentials: true,
        })
      ),
      catchError((err) => {
        console.error('Erreur resetPassword', err);
        return throwError(() => err);
      })
    );
  }
}
