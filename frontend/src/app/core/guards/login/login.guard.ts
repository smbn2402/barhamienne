import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.peekUser().pipe(
      map((user) => {
        if (user) {
          return this.router.createUrlTree(['/']); // redirige vers accueil
        }
        return true; // accès autorisé à /login
      }),
      catchError(() => of(true)) // erreur = pas connecté = accès ok
    );
  }
}
