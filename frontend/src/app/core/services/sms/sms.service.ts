import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private apiUrl = `${environment.apiUrl}/api/sms`;

  constructor(private http: HttpClient) {}

  sendSMS(payload: {
    phone: string;
    message: string;
    type?: string;
    scheduled_at?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, payload);
  }

  sendBulkMessage(message: string, clients: { phone: string }[]) {
    const payload = {
      campaign_name: `bulk‑${Date.now()}`, // ou toute règle métier
      campaign_lines: clients.map((c) => ({
        phone: c.phone,
        text: message,
      })),
      sms_type: 'text', // optionnel
      // scheduled_at: '2025-07-13T14:00:00Z'  // si vous planifiez
    };

    return this.http.post<any>(`${this.apiUrl}/send-bulk`, payload);
  }

  getBalance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/balance`);
  }

  getStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statistics`);
  }
}
