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
import { DepartMomentService } from '../../../core/services/depart-moment/depart-moment.service';
import { DepartMoment } from '../../../core/interfaces/depart_moment';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { HeureDepartModalComponent } from './components/heure-depart-modal/heure-depart-modal.component';
import { SharedService } from '../../../core/services/shared/shared.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import { Trajet } from '../../../core/interfaces/trajet';
import { Moment } from '../../../core/interfaces/moment';
import { MomentService } from '../../../core/services/moment/moment.service';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-heure-depart',
  imports: [
    CommonModule,
    DataTablesModule,
    HeureDepartModalComponent,
    DragDropModule,
    BreadcrumbsComponent,
  ],
  templateUrl: './heure-depart.component.html',
  styleUrl: './heure-depart.component.css',
})
export class HeureDepartComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  trajetId!: number;
  momentId!: number;
  departMoments: DepartMoment[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;
  selectedDepartMoment: DepartMoment = {
    id: 0,
    depart: {
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
    heureDepart: '',
  };
  trajet!: Trajet;
  moment!: Moment;

  constructor(
    private activateRoute: ActivatedRoute,
    private departMomentService: DepartMomentService,
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
        this.getDepartMomentsByTrajetAndMoment(this.trajetId, this.momentId);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du moment', err);
      },
    });
  }

  getDepartMomentsByTrajetAndMoment(trajetId: number, momentId: number): void {
    this.departMomentService
      .getDepartMomentsByTrajetAndMoment(trajetId, momentId)
      .subscribe({
        next: async (res) => {
          this.departMoments = res;
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
          console.log('Erreur lors du chargement des points de départ', err);
          this.sharedService.hide();
this.isLoading = false;
        },
      });
  }

  selecteDepartMoment(departMoment: DepartMoment, modalId: string) {
    this.isEditMode = true;
    this.selectedDepartMoment = { ...departMoment };
    this.sharedService.openModal(modalId);
  }

  handleAdd(departMoment: DepartMoment): void {
    this.departMomentService.create(departMoment).subscribe({
      next: () => {
        this.getDepartMomentsByTrajetAndMoment(this.trajetId, this.momentId);
        this.sharedService.closeModal('addModal');
        this.alertService.showToast(
          '🎉 Heure de départ enregistré avec succès !'
        );
        this.isEditMode = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertService.showError(
            'Ce point de départ est déjà associé à ce moment. Veuillez en choisir un autre. ou modifier celui-ci.'
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

  handleUpdate(updatedYobante: DepartMoment) {
    this.departMomentService
      .update(this.selectedDepartMoment.id, updatedYobante)
      .subscribe({
        next: (res) => {
          this.getDepartMomentsByTrajetAndMoment(this.trajetId, this.momentId);
          this.sharedService.closeModal('addModal');
          this.alertService.showToast(
            '🎉 Heure de départ mise à jour avec succès !'
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

  handleDelete(departMoment: DepartMoment): void {
    const heure =
      departMoment.depart.libelle + ' (' + departMoment.heureDepart + ')';

    this.alertService.confirmDeleteAsync(`l'heure de départ ${heure}`, () =>
      this.departMomentService.delete(departMoment.id).pipe(
        tap(() => {
          this.getDepartMomentsByTrajetAndMoment(this.trajetId, this.momentId);
          this.alertService.showToast(
            `🎉 L'heure de départ ${heure} a été supprimée avec succès !`
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
