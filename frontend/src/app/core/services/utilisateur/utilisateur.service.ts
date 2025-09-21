import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Utilisateur } from '../../interfaces/utilisateur';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/api/utilisateurs`;

  constructor(private http: HttpClient) {}

  create(utilisateur: Utilisateur): Observable<any> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  update(id: number, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles`);
  }

  syncRoles(id: number, roles: string[]) {
    return this.http.put(`${this.apiUrl}/${id}/roles`, { roles });
  }

  sendResetPasswordLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-reset-password-link`, {
      email,
    });
  }
}
