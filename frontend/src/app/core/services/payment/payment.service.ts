import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  payerAvecOrangeMoney(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/om`, data);
  }

  payerAvecWave(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/wave`, data);
  }
}
