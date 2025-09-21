import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // 🔁 Confirmation générique
  confirmAction(
    title: string,
    text: string,
    icon: 'warning' | 'info' | 'question' = 'warning',
    confirmButtonText: string = 'Confirmer',
    cancelButtonText: string = 'Annuler',
    onConfirm: () => void
  ): void {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#E30613',
      cancelButtonColor: '#000000',
      confirmButtonText,
      cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  // ✅ Toggle (ex: publier/fermer)
  confirmToggle(
    currentValue: boolean,
    confirmTitle: string,
    confirmText: string,
    successMessage: string,
    onConfirm: () => void
  ): void {
    this.confirmAction(
      confirmTitle,
      confirmText,
      'warning',
      'Oui, confirmer',
      'Annuler',
      () => {
        onConfirm();
        this.showToast(successMessage, 'success');
      }
    );
  }

  // ❌ Confirmation de suppression
  confirmDelete(onConfirm: () => void): void {
    this.confirmAction(
      'Supprimer ?',
      'Cette action est irréversible.',
      'warning',
      'Oui, supprimer',
      'Annuler',
      onConfirm
    );
  }

  confirmDeleteAsync(
    itemName: string, // exemple : "l'heure de départ 10h15"
    onConfirmAsync: () => Promise<void> | Observable<void>
  ): void {
    Swal.fire({
      title: `Supprimer ${itemName} ?`,
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E30613',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: false,
      preConfirm: () => {
        Swal.showLoading();
        const result = onConfirmAsync();
        return result instanceof Observable ? result.toPromise() : result;
      },
    });
  }

  confirmActionAsync(
    itemName: string, // exemple : "l'heure de départ 10h15"
    buttonName: string,
    onConfirmAsync: () => Promise<void> | Observable<void>
  ): void {
    Swal.fire({
      title: `${itemName} ?`,
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E30613',
      cancelButtonColor: '#000000',
      confirmButtonText: `Oui, ${buttonName}`,
      cancelButtonText: 'Annuler',
      allowOutsideClick: false,
      preConfirm: () => {
        Swal.showLoading();
        const result = onConfirmAsync();
        return result instanceof Observable ? result.toPromise() : result;
      },
    });
  }

  // ✅ Toast de succès
  showToast(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info' = 'success'
  ): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
  }

  // ❌ Erreur
  showError(message: string = 'Une erreur est survenue'): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
    });
  }
}
