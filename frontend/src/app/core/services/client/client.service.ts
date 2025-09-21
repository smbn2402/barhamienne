import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client } from '../../interfaces/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  create(client: Client): Observable<any> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getById(clientId: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${clientId}`);
  }

  update(clientId: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${clientId}`, client);
  }

  delete(clientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}`);
  }

  getClientStats(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/statistiques`);
  }
}
