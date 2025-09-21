import { Component } from '@angular/core';
import { CaravaneService } from '../../../core/services/caravane/caravane.service';
import { DateFormatComponent } from '../../../shared/date-format/date-format.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import { MomentService } from '../../../core/services/moment/moment.service';
import { Moment } from '../../../core/interfaces/moment';
import { Trajet } from '../../../core/interfaces/trajet';
import { Caravane } from '../../../core/interfaces/caravane';
import { AlertService } from '../../../core/services/alert/alert.service';
import { ArriveeMoment } from '../../../core/interfaces/arrivee_moment';
import { DepartMoment } from '../../../core/interfaces/depart_moment';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { CaravaneModalComponent } from './components/caravane-modal/caravane-modal.component';
import { SharedService } from '../../../core/services/shared/shared.service';
import { catchError, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { ReservationService } from '../../../core/services/reservation/reservation.service';

@Component({
  selector: 'app-caravane',
  imports: [
    DateFormatComponent,
    RouterModule,
    CommonModule,
    BreadcrumbsComponent,
    CaravaneModalComponent,
  ],
  templateUrl: './caravane.component.html',
  styleUrl: './caravane.component.css',
})
export class CaravaneComponent {
  caravanes: Caravane[] = [];
  isLoading: boolean = true;
  moments: Moment[] = [];
  trajets: Trajet[] = [];
  selectedCaravane!: Caravane;
  trajetId!: number;
  momentId!: number;
  trajet!: Trajet;
  moment!: Moment;
  departMomentPrincipale!: DepartMoment;
  arriveeMomentPrincipale!: ArriveeMoment;
  isEditMode: boolean = false;
  caravaneStats: { [id: number]: any } = {};

  constructor(
    private caravaneService: CaravaneService,
    private trajetService: TrajetService,
    private momentService: MomentService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private sharedService: SharedService,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.sharedService.show();
    this.activatedRoute.paramMap.subscribe((params) => {
      this.trajetId = Number(params.get('trajetId'));
      this.momentId = Number(params.get('momentId'));
      this.getMoment();
    });
  }

  getMoment(): void {
    this.momentService.getById(this.momentId).subscribe({
      next: (res) => {
        this.moment = res;
        this.getTrajet();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du moment', err);
      },
    });
  }

  getTrajet(): void {
    this.trajetService.getById(this.trajetId).subscribe({
      next: (res) => {
        this.trajet = res;
        this.getCaravanesByTrajetAndMoment();
      },
      error: (err) => console.log('Erreur lors de la  des trajets', err),
    });
  }

  getCaravanesByTrajetAndMoment(): void {
    this.caravaneService
      .getByTrajetAndMoment(this.trajetId, this.momentId)
      .subscribe({
        next: (res) => {
          this.caravanes = res;
          this.caravanes.forEach((caravane) => {
            this.getStatistiques(caravane.id);
          });
          this.sharedService.hide();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Erreur lors du chargement des caravanes : ', err);
          this.sharedService.hide();
          this.isLoading = false;
        },
      });
  }

  selecteCaravane(caravane: Caravane) {
    this.isEditMode = true;
    this.selectedCaravane = { ...caravane }; // Clone pour éviter de modifier l'original
    this.sharedService.openModal('genericModal');
  }

  handleAdd(newCaravane: Caravane): void {
    this.caravaneService.create(newCaravane).subscribe({
      next: (res) => {
        this.getCaravanesByTrajetAndMoment();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Caravane ajoutée avec succès !');
      },
      error: (error) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error("Erreur lors de l'ajout de la caravane", error);
      },
    });
  }

  handleUpdate(caravane: Caravane): void {
    this.caravaneService.update(this.selectedCaravane.id, caravane).subscribe({
      next: () => {
        this.getCaravanesByTrajetAndMoment();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Caravane mise à jour avec succès !');
      },
      error: (err) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error('Erreur lors de la mise à jour', err);
      },
    });
  }

  handleDelete(caravane: Caravane): void {
    const title =
      this.sharedService.formattedDate(caravane.date) +
      ' ' +
      caravane.moment.libelle;

    this.alertService.confirmDeleteAsync(`la caravane du ${title}`, () =>
      this.caravaneService.delete(caravane.id).pipe(
        tap(() => {
          this.getCaravanesByTrajetAndMoment();
          this.alertService.showToast(
            `🎉 La caravane du ${title} a été supprimée avec succès !`
          );
        }),
        catchError((err) => {
          console.error('Erreur lors de la suppression:', err);
          this.alertService.showToast(
            "❌ Une erreur s'est produite. Réessaye plus tard.",
            'error'
          );
          throw err;
        })
      )
    );
  }

  togglePublication(caravane: any): void {
    const titre = caravane.estPubliee
      ? 'Retirer la publication ?'
      : 'Publier cette caravane ?';
    const texte = caravane.estPubliee
      ? 'Elle ne sera plus visible par les utilisateurs.'
      : 'Elle sera visible par les utilisateurs.';
    this.confirmToggle(
      caravane,
      'estPubliee',
      titre,
      texte,
      'Statut de publication mis à jour'
    );
  }

  toggleOuverture(caravane: any): void {
    const titre = caravane.estOuverte
      ? 'Fermer la caravane ?'
      : 'Ouvrir la caravane ?';
    const texte = caravane.estOuverte
      ? 'Les utilisateurs ne pourront plus réserver.'
      : 'Les utilisateurs pourront réserver à nouveau.';
    this.confirmToggle(
      caravane,
      'estOuverte',
      titre,
      texte,
      "Statut d'ouverture mis à jour"
    );
  }

  confirmToggle(
    caravane: any,
    property: 'estPubliee' | 'estOuverte',
    confirmTitle: string,
    confirmText: string,
    successMessage: string
  ): void {
    const currentValue = caravane[property];

    Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E30613',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        caravane[property] = !currentValue;

        this.caravaneService.update(caravane.id, caravane).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: successMessage,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.getCaravanesByTrajetAndMoment();
          },
          error: (err) => console.error('Erreur lors de la mise à jour', err),
        });
      }
    });
  }

  getStatistiques(caravaneId: number): void {
    this.reservationService.getStatistiquesByCaravane(caravaneId).subscribe({
      next: (stats) => (this.caravaneStats[caravaneId] = stats),
      error: () =>
        (this.caravaneStats[caravaneId] = {
          total: 0,
          confirmees: 0,
          en_attente: 0,
        }),
    });
  }
}
