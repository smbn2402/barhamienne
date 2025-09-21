import { Reservation } from '../../interfaces/reservation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  create(reservation: Reservation): Observable<any> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  getReservationsByCaravane(caravaneId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/caravanes/${caravaneId}`
    );
  }

  getById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${reservationId}`);
  }

  update(
    reservationId: number,
    reservation: Reservation
  ): Observable<Reservation> {
    return this.http.put<Reservation>(
      `${this.apiUrl}/${reservationId}`,
      reservation
    );
  }

  delete(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reservationId}`);
  }

  getStatistiquesByCaravane(caravaneId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/statistiques/caravane/${caravaneId}`
    );
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistiques`);
  }

  getStatistiquesParMois(year: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/statistiques-par-mois?annee=${year}`
    );
  }

  getStatistiquesParStatutParMois(year: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/statistiques-statut-par-mois?annee=${year}`
    );
  }

  sendMessagesToReservations(
    reservations: any[],
    message: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-messages`, {
      reservations,
      message,
    });
  }

  sendBulkMessage(message: string, reservations: any[]): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/send-bulk-message`,
        {
          message,
          reservations,
        },
        {
          responseType: 'text', // 👈 on force Angular à traiter la réponse comme du texte brut
        }
      )
      .pipe(
        map((response) => {
          try {
            return JSON.parse(response); // 👈 on tente de parser nous-mêmes
          } catch (error) {
            console.warn(
              'Réponse non JSON (probablement pollution côté Laravel) :',
              response
            );
            return response; // on retourne brut si JSON invalide
          }
        })
      );
  }

  payerAvecWave(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payer-avec-wave`, data);
  }
}
