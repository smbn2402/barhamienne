import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SmsLog } from '../../interfaces/sms_log';

@Injectable({
  providedIn: 'root',
})
export class SmsLogService {
  private apiUrl = `${environment.apiUrl}/api/sms-logs`;

  constructor(private http: HttpClient) {}

  create(smsLog: SmsLog): Observable<any> {
    return this.http.post<SmsLog>(this.apiUrl, smsLog);
  }

  getAll(): Observable<SmsLog[]> {
    return this.http.get<SmsLog[]>(this.apiUrl);
  }
}
