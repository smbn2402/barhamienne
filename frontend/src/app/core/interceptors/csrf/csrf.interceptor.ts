import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpClient
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si ce n’est pas une requête unsafe (POST/PUT/DELETE), on continue sans CSRF
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return from(this.http.get('/sanctum/csrf-cookie', { withCredentials: true }).toPromise()).pipe(
        switchMap(() => {
          const cloned = req.clone({ withCredentials: true });
          return next.handle(cloned);
        })
      );
    }

    return next.handle(req);
  }
}
