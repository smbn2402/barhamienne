import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Config } from 'datatables.net';
import { catchError, Subject, tap } from 'rxjs';
import { ArriveeMomentService } from '../../../core/services/arrivee-moment/arrivee-moment.service';
import { ArriveeMoment } from '../../../core/interfaces/arrivee_moment';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { HeureArriveeModalComponent } from './components/heure-arrivee-modal/heure-arrivee-modal.component';
import { SharedService } from '../../../core/services/shared/shared.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import { Trajet } from '../../../core/interfaces/trajet';
import { Moment } from '../../../core/interfaces/moment';
import { MomentService } from '../../../core/services/moment/moment.service';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-heure-arrivee',
  imports: [
    CommonModule,
    DataTablesModule,
    HeureArriveeModalComponent,
    DragDropModule,
    BreadcrumbsComponent,
  ],
  templateUrl: './heure-arrivee.component.html',
  styleUrl: './heure-arrivee.component.css',
})
export class HeureArriveeComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  trajetId!: number;
  momentId!: number;
  arriveeMoments: ArriveeMoment[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;
  selectedArriveeMoment: ArriveeMoment = {
    id: 0,
    arrivee: {
      id: 0,
      libelle: '',
      trajet: {
        id: this.trajetId,
        libelle: '',
        libelleWolof: '',
        prix: 3500,
      },
    },
    moment: {
      id: this.momentId,
      libelle: '',
    },
    heureArrivee: '',
  };
  trajet!: Trajet;
  moment!: Moment;

  constructor(
    private activateRoute: ActivatedRoute,
    private arriveeMomentService: ArriveeMomentService,
    private sharedService: SharedService,
    private alertService: AlertService,
    private trajetService: TrajetService,
    private momentService: MomentService
  ) {}

  ngOnInit() {
    this.sharedService.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json',
      },
    };
    this.activateRoute.paramMap.subscribe((params) => {
      this.trajetId = Number(params.get('trajetId')!);
      this.momentId = Number(params.get('momentId')!);
      this.getTrajet(this.trajetId);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getTrajet(trajetId: number): void {
    this.trajetService.getById(trajetId).subscribe({
      next: (res) => {
        this.trajet = res;
        this.getMoment(this.momentId);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du trajet', err);
      },
    });
  }

  getMoment(momentId: number): void {
    this.momentService.getById(momentId).subscribe({
      next: (res) => {
        this.moment = res;
        this.getArriveeMomentsByTrajetAndMoment(this.trajetId, this.momentId);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du moment', err);
      },
    });
  }

  getArriveeMomentsByTrajetAndMoment(trajetId: number, momentId: number): void {
    this.arriveeMomentService
      .getArriveeMomentsByTrajetAndMoment(trajetId, momentId)
      .subscribe({
        next: async (res) => {
          this.arriveeMoments = res;
          this.sharedService.hide();
this.isLoading = false;
          if (this.dtElement && this.dtElement.dtInstance) {
            const dtInstance = await this.dtElement.dtInstance;
            dtInstance.destroy(); // détruit l'ancienne instance DataTables
            this.dtTrigger.next(null); // réinitialise DataTables avec les nouvelles données
          } else {
            this.dtTrigger.next(null); // 1ère initialisation
          }
        },
        error: (err) => {
          console.log("Erreur lors du chargement des points d'arrivée", err);
          this.sharedService.hide();
this.isLoading = false;
        },
      });
  }

  selecteArriveeMoment(arriveeMoment: ArriveeMoment) {
    this.isEditMode = true;
    this.selectedArriveeMoment = { ...arriveeMoment };
    this.sharedService.openModal('genericModal');
  }

  handleAdd(arriveeMoment: ArriveeMoment): void {
    this.arriveeMomentService.create(arriveeMoment).subscribe({
      next: () => {
        this.getArriveeMomentsByTrajetAndMoment(this.trajetId, this.momentId);
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast(
          "🎉 Heure d'arrivée enregistré avec succès !"
        );
        this.isEditMode = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertService.showError(
            "Ce point d'arrivée est déjà associé à ce moment. Veuillez en choisir un autre. ou modifier celui-ci."
          );
        } else {
          this.alertService.showToast(
            "❌ Une erreur s'est produite. Réessaye plus tard.",
            'error'
          );
        }
        console.error("Erreur lors de l'ajout :", err);
      },
    });
  }

  handleUpdate(updatedYobante: ArriveeMoment) {
    this.arriveeMomentService
      .update(this.selectedArriveeMoment.id, updatedYobante)
      .subscribe({
        next: (res) => {
          this.getArriveeMomentsByTrajetAndMoment(this.trajetId, this.momentId);
          this.sharedService.closeModal('genericModal');
          this.alertService.showToast(
            "🎉 Heure d'arrivée mise à jour avec succès !"
          );
          this.isEditMode = false;
        },
        error: (err) => {
          this.alertService.showToast(
            "❌ Une erreur s'est produite. Réessaye plus tard.",
            'error'
          );
          console.error('Erreur lors de la mise à jour : ', err);
        },
      });
  }

  handleDelete(arriveeMoment: ArriveeMoment): void {
    const heure =
      arriveeMoment.arrivee.libelle + ' (' + arriveeMoment.heureArrivee + ')';

    this.alertService.confirmDeleteAsync(`l'heure d\'arrivée ${heure}`, () =>
      this.arriveeMomentService.delete(arriveeMoment.id).pipe(
        tap(() => {
          this.getArriveeMomentsByTrajetAndMoment(this.trajetId, this.momentId);
          this.alertService.showToast(
            `🎉 L'heure d\'arrivée ${heure} a été supprimée avec succès !`
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
}
