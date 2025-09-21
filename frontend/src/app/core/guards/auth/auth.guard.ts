import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  // canActivate(): Observable<boolean> {
  //   return this.auth.fetchUser().pipe(
  //     map((user) => {
  //       if (user) {
  //         return true;
  //       } else {
  //         this.router.navigate(['/login']);
  //         return false;
  //       }
  //     }),
  //     catchError(() => {
  //       this.router.navigate(['/login']);
  //       return of(false);
  //     })
  //   );
  // }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.fetchUser().pipe(
      map((user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRoles: string[] = route.data['roles'] || [];

        const userRoles: string[] = user.roles?.map((r: any) => r.name) || [];

        const hasAccess =
          requiredRoles.length === 0 ||
          requiredRoles.some((role) => userRoles.includes(role));

        if (!hasAccess) {
          this.router.navigate(['/admin/dashboard']); // ou une page d'erreur
        }

        return hasAccess;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
