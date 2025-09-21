import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trajet } from '../../interfaces/trajet';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrajetService {
  private apiUrl = `${environment.apiUrl}/api/trajets`;

  constructor(private http: HttpClient) {}

  create(trajet: Trajet): Observable<any> {
    return this.http.post<Trajet>(this.apiUrl, trajet);
  }

  getAll(): Observable<Trajet[]> {
    return this.http.get<Trajet[]>(this.apiUrl);
  }

  getById(trajetId: number): Observable<Trajet> {
    return this.http.get<Trajet>(`${this.apiUrl}/${trajetId}`);
  }

  update(trajetId: number, trajet: Trajet): Observable<Trajet> {
    return this.http.put<Trajet>(`${this.apiUrl}/${trajetId}`, trajet);
  }

  delete(trajetId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${trajetId}`);
  }
}
