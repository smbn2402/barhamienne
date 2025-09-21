import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Arrivee } from '../../interfaces/arrivee';

@Injectable({
  providedIn: 'root',
})
export class ArriveeService {
  private apiUrl = `${environment.apiUrl}/api/arrivees`;

  constructor(private http: HttpClient) {}

  create(arrivee: Arrivee): Observable<any> {
    return this.http.post<Arrivee>(this.apiUrl, arrivee);
  }

  getAll(): Observable<Arrivee[]> {
    return this.http.get<Arrivee[]>(this.apiUrl);
  }

  getById(arriveeId: number): Observable<Arrivee> {
    return this.http.get<Arrivee>(`${this.apiUrl}/${arriveeId}`);
  }

  update(arriveeId: number, arrivee: Arrivee): Observable<Arrivee> {
    return this.http.put<Arrivee>(`${this.apiUrl}/${arriveeId}`, arrivee);
  }

  delete(arriveeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${arriveeId}`);
  }

  getByTrajet(trajetId: number): Observable<Arrivee[]> {
    return this.http.get<Arrivee[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  getByCaravane(caravaneId: number): Observable<Arrivee[]> {
    return this.http.get<Arrivee[]>(`${this.apiUrl}/caravane/${caravaneId}`);
  }

  updateOrder(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-order`, payload);
  }
}
