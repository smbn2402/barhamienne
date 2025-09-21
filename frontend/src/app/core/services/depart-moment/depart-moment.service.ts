import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DepartMoment } from '../../interfaces/depart_moment';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartMomentService {
  private apiUrl = `${environment.apiUrl}/api/depart-moments`;

  constructor(private http: HttpClient) {}

  create(departMoment: DepartMoment): Observable<any> {
    return this.http.post<DepartMoment>(this.apiUrl, departMoment);
  }

  getAll(): Observable<DepartMoment[]> {
    return this.http.get<DepartMoment[]>(this.apiUrl);
  }

  getById(departMomentId: number): Observable<DepartMoment> {
    return this.http.get<DepartMoment>(`${this.apiUrl}/${departMomentId}`);
  }

  update(
    departMomentId: number,
    departMoment: DepartMoment
  ): Observable<DepartMoment> {
    return this.http.put<DepartMoment>(
      `${this.apiUrl}/${departMomentId}`,
      departMoment
    );
  }

  delete(departMomentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${departMomentId}`);
  }

  getByTrajet(trajetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  getDepartMoments(): Observable<DepartMoment[]> {
    return this.http.get<DepartMoment[]>(this.apiUrl);
  }

  getMomentsByDepart(departId: number): Observable<DepartMoment[]> {
    return this.http.get<DepartMoment[]>(`${this.apiUrl}/moments/${departId}`);
  }

  getDepartsByTrajet(trajetId: number): Observable<DepartMoment[]> {
    return this.http.get<DepartMoment[]>(`${this.apiUrl}/trajet/${trajetId}`);
  }

  // getDepartMomentsByTrajet(trajetId: number): Observable<DepartMoment[]> {
  //   return this.http.get<DepartMoment[]>(`${this.apiUrl}/trajet/${trajetId}`);
  // }

  getDepartMomentsByTrajet(trajetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trajet/${trajetId}`).pipe(
      map((departMoments) => {
        const groupedDeparts = new Map();
        departMoments.forEach((dm) => {
          const departId = dm.depart.id;
          if (!groupedDeparts.has(departId)) {
            groupedDeparts.set(departId, {
              depart: dm.depart,
              moments: [],
            });
          }
          groupedDeparts
            .get(departId)
            .moments.push(`${dm.moment.libelle} (${dm.heureDepart})`);
        });
        return Array.from(groupedDeparts.values());
      })
    );
  }

  getDepartMomentsByTrajetAndMoment(
    trajetId: number,
    momentId: number
  ): Observable<DepartMoment[]> {
    return this.http.get<DepartMoment[]>(
      `${this.apiUrl}/trajet/${trajetId}/moment/${momentId}`
    );
  }

  getByCaravane(caravaneId: number): Observable<DepartMoment[]> {
    return this.http.get<DepartMoment[]>(
      `${this.apiUrl}/caravane/${caravaneId}`
    );
  }

  getPrincipaleByCaravane(caravaneId: number): Observable<DepartMoment> {
    return this.http.get<DepartMoment>(
      `${this.apiUrl}/principale/caravane/${caravaneId}`
    );
  }
}
