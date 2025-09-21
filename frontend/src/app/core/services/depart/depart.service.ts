import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Depart } from '../../interfaces/depart';

@Injectable({
  providedIn: 'root',
})
export class DepartService {
  private apiUrl = `${environment.apiUrl}/api/departs`;

  constructor(private http: HttpClient) {}

  create(depart: Depart): Observable<any> {
    return this.http.post<Depart>(this.apiUrl, depart);
  }

  getAll(): Observable<Depart[]> {
    return this.http.get<Depart[]>(this.apiUrl);
  }

  getById(departId: number): Observable<Depart> {
    return this.http.get<Depart>(`${this.apiUrl}/${departId}`);
  }

  update(departId: number, depart: Depart): Observable<Depart> {
    return this.http.put<Depart>(`${this.apiUrl}/${departId}`, depart);
  }

  delete(departId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${departId}`);
  }

  getByTrajet(trajetId: number): Observable<Depart[]> {
    return this.http.get<Depart[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  updateOrder(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-order`, payload);
  }
}
