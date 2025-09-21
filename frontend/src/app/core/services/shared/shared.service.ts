import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';

declare var bootstrap: any;
@Injectable({
  providedIn: "root",
})
export class SharedService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  constructor(private router: Router) {}

  openModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  closeModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);
    const modalInstance =
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
  }

  formattedDate(date: Date): string {
    return formatDate(date, 'EEEE d MMM', 'fr-FR');
  }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  onNavigate(path: string): void {
    this.router.navigate([path]);
  }
}
