import { Injectable } from "@angular/core";
import { Yobante } from "../../interfaces/yobante";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class YobanteService {
  private apiUrl = `${environment.apiUrl}/api/yobantes`;

  constructor(private http: HttpClient) {
  }

  create(yobante: Yobante): Observable<any> {
    return this.http.post<Yobante>(this.apiUrl, yobante);
  }

  getAll(): Observable<Yobante[]> {
    return this.http.get<Yobante[]>(this.apiUrl);
  }

  getById(yobanteId: number): Observable<Yobante> {
    return this.http.get<Yobante>(`${this.apiUrl}/${yobanteId}`);
  }

  update(yobanteId: number, yobante: Yobante): Observable<Yobante> {
    return this.http.put<Yobante>(`${this.apiUrl}/${yobanteId}`, yobante);
  }

  delete(yobanteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${yobanteId}`);
  }

  getByCaravane(caravaneId: number): Observable<Yobante[]> {
    return this.http.get<Yobante[]>(`${this.apiUrl}/caravane/${caravaneId}`);
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistiques`);
  }
}
