import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebhookService {
  private apiUrl = environment.apiUrl + '/api/webhooks';

  constructor(private http: HttpClient) {}

  create(webhook: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, webhook);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(webhookId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${webhookId}`);
  }

  update(webhookId: number, webhook: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${webhookId}`, webhook);
  }

  delete(webhookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${webhookId}`);
  }

  registerWebhook(callbackUrl: string) {
    return this.http.post(`${this.apiUrl}/om`, { callbackUrl });
  }

  getAllWebhooks() : Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/om`);
  }
}
