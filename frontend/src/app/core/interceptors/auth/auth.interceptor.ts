import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  private getTokenFromCookie(): string | null {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const xsrfToken = this.getTokenFromCookie();

    // Clone la requête pour y ajouter le token CSRF si présent
    const clonedRequest = req.clone({
      withCredentials: true,
      setHeaders: xsrfToken
        ? {
            'X-XSRF-TOKEN': xsrfToken,
          }
        : {},
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 419) {
          // 🔒 Session expirée ou non authentifié
          console.warn('Utilisateur non authentifié ou session expirée');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
