import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Caravane } from '../../interfaces/caravane';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CaravaneService {
  private apiUrl = `${environment.apiUrl}/api/caravanes`;

  constructor(private http: HttpClient) {}

  create(caravane: Caravane): Observable<any> {
    return this.http.post<Caravane>(this.apiUrl, caravane);
  }

  getAll(): Observable<Caravane[]> {
    return this.http.get<Caravane[]>(this.apiUrl);
  }

  getById(caravaneId: number): Observable<Caravane> {
    return this.http.get<Caravane>(`${this.apiUrl}/${caravaneId}`);
  }

  update(caravaneId: number, caravane: Caravane): Observable<Caravane> {
    return this.http.put<Caravane>(`${this.apiUrl}/${caravaneId}`, caravane);
  }

  delete(caravaneId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${caravaneId}`);
  }

  getByTrajet(trajetId: number): Observable<Caravane[]> {
    return this.http.get<Caravane[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  getByTrajetAndMoment(
    trajetId: number,
    momentId: number
  ): Observable<Caravane[]> {
    return this.http.get<Caravane[]>(
      `${this.apiUrl}/trajet/${trajetId}/moment/${momentId}`
    );
  }

  getCaravaneStats(): Observable<Caravane[]> {
    return this.http.get<Caravane[]>(`${this.apiUrl}/statistiques`);
  }
}
