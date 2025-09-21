import { Injectable } from '@angular/core';
import { Moment } from '../../interfaces/moment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MomentService {
  private apiUrl = `${environment.apiUrl}/api/moments`;

  constructor(private http: HttpClient) {}

  create(moment: Moment): Observable<any> {
    return this.http.post<Moment>(this.apiUrl, moment);
  }

  getAll(): Observable<Moment[]> {
    return this.http.get<Moment[]>(this.apiUrl);
  }

  getById(momentId: number): Observable<Moment> {
    return this.http.get<Moment>(`${this.apiUrl}/${momentId}`);
  }

  update(momentId: number, moment: Moment): Observable<Moment> {
    return this.http.put<Moment>(`${this.apiUrl}/${momentId}`, moment);
  }

  delete(momentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${momentId}`);
  }
}
