import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArriveeMoment } from '../../interfaces/arrivee_moment';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArriveeMomentService {
  private apiUrl = `${environment.apiUrl}/api/arrivee-moments`;

  constructor(private http: HttpClient) {}

  create(arriveeMoment: ArriveeMoment): Observable<any> {
    return this.http.post<ArriveeMoment>(this.apiUrl, arriveeMoment);
  }

  getAll(): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(this.apiUrl);
  }

  getById(arriveeMomentId: number): Observable<ArriveeMoment> {
    return this.http.get<ArriveeMoment>(`${this.apiUrl}/${arriveeMomentId}`);
  }

  update(
    arriveeMomentId: number,
    arriveeMoment: ArriveeMoment
  ): Observable<ArriveeMoment> {
    return this.http.put<ArriveeMoment>(
      `${this.apiUrl}/${arriveeMomentId}`,
      arriveeMoment
    );
  }

  delete(arriveeMomentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${arriveeMomentId}`);
  }

  getByTrajet(trajetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  getArriveeMoments(): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(this.apiUrl);
  }

  getMomentsByArrivee(arriveeId: number): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(
      `${this.apiUrl}/moments/${arriveeId}`
    );
  }

  getArriveesByTrajet(trajetId: number): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  getArriveeMomentsByTrajet(trajetId: number): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  getArriveeMomentsByTrajetAndMoment(
    trajetId: number,
    momentId: number
  ): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(
      `${this.apiUrl}/trajet/${trajetId}/moment/${momentId}`
    );
  }

  getByCaravane(caravaneId: number): Observable<ArriveeMoment[]> {
    return this.http.get<ArriveeMoment[]>(
      `${this.apiUrl}/caravane/${caravaneId}`
    );
  }

  getPrincipaleByCaravane(caravaneId: number): Observable<ArriveeMoment> {
    return this.http.get<ArriveeMoment>(
      `${this.apiUrl}/principale/caravane/${caravaneId}`
    );
  }
}
