import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { catchError, Subject, tap } from 'rxjs';
import { Depart } from '../../../core/interfaces/depart';
import { DepartService } from '../../../core/services/depart/depart.service';
import { Trajet } from '../../../core/interfaces/trajet';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DepartModalComponent } from './components/depart-modal/depart-modal.component';
import { AlertService } from '../../../core/services/alert/alert.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-depart',
  imports: [
    DataTablesModule,
    NgIf,
    NgFor,
    DragDropModule,
    DepartModalComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './depart.component.html',
  styleUrl: './depart.component.css',
})
export class DepartComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  trajetId!: number;
  departs: Depart[] = [];
  isLoading: boolean = true;
  trajet!: Trajet;
  isEditMode: boolean = false;
  selectedDepart: any = {};

  constructor(
    private activateRoute: ActivatedRoute,
    private departService: DepartService,
    private trajetService: TrajetService,
    private sharedService: SharedService,
    private alertService: AlertService
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
      this.trajetId = Number(params.get('id')!);
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
        this.getDepartsByTrajet(this.trajet.id);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du trajet', err);
      },
    });
  }

  getDepartsByTrajet(trajetId: number): void {
    this.departService.getByTrajet(trajetId).subscribe({
      next: async (res) => {
        this.departs = res;
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

  selecteDepart(depart: Depart) {
    this.isEditMode = true;
    this.selectedDepart = { ...depart };
    this.sharedService.openModal('genericModal');
  }

  handleAdd(depart: Depart): void {
    this.departService.create(depart).subscribe({
      next: () => {
        this.getDepartsByTrajet(this.trajetId);
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast(
          '🎉 Point de départ enregistré avec succès !'
        );
        this.isEditMode = false;
      },
      error: (err) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.log("Erreur lors de l'ajout : ", err);
      },
    });
  }

  handleUpdate(updatedYobante: Depart) {
    this.departService
      .update(this.selectedDepart.id, updatedYobante)
      .subscribe({
        next: (res) => {
          this.getDepartsByTrajet(this.trajetId);
          this.sharedService.closeModal('genericModal');
          this.alertService.showToast(
            '🎉 Point de départ mise à jour avec succès !'
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

  handleDelete(depart: Depart): void {
    const title = depart.libelle;

    this.alertService.confirmDeleteAsync(`le point de départ ${title}`, () =>
      this.departService.delete(depart.id).pipe(
        tap(() => {
          this.getDepartsByTrajet(this.trajetId);
          this.alertService.showToast(
            `🎉 Le point de départ ${title} a été supprimée avec succès !`
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

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.departs, event.previousIndex, event.currentIndex);

    // Mettre à jour les ordres localement
    this.departs.forEach((item, index) => {
      item.order = index + 1;
    });

    // Appeler une méthode pour enregistrer le nouvel ordre côté serveur
    this.saveNewOrder();
  }

  saveNewOrder() {
    const payload = this.departs.map((item) => ({
      depart_id: item.id,
      new_order: item.order,
    }));

    this.departService.updateOrder(payload).subscribe({
      next: () => console.log('Ordre mis à jour'),
      error: (err) => console.error('Erreur mise à jour ordre', err),
    });
  }
}
