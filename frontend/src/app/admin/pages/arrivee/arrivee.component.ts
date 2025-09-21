import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { catchError, Subject, tap } from 'rxjs';
import { Arrivee } from '../../../core/interfaces/arrivee';
import { ArriveeService } from '../../../core/services/arrivee/arrivee.service';
import { Trajet } from '../../../core/interfaces/trajet';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ArriveeModalComponent } from './components/arrivee-modal/arrivee-modal.component';
import { AlertService } from '../../../core/services/alert/alert.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-arrivee',
  imports: [
    DataTablesModule,
    NgIf,
    NgFor,
    DragDropModule,
    ArriveeModalComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './arrivee.component.html',
  styleUrl: './arrivee.component.css',
})
export class ArriveeComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  trajetId!: number;
  arrivees: Arrivee[] = [];
  isLoading: boolean = true;
  trajet!: Trajet;
  isEditMode: boolean = false;
  selectedArrivee: any = {};

  constructor(
    private activateRoute: ActivatedRoute,
    private arriveeService: ArriveeService,
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
        this.getArriveesByTrajet(this.trajet.id);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du trajet', err);
      },
    });
  }

  getArriveesByTrajet(trajetId: number): void {
    this.arriveeService.getByTrajet(trajetId).subscribe({
      next: async (res) => {
        this.arrivees = res;
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
        console.log('Erreur lors du chargement des points de arrivée', err);
        this.sharedService.hide();
this.isLoading = false;
      },
    });
  }

  selecteArrivee(arrivee: Arrivee) {
    this.isEditMode = true;
    this.selectedArrivee = { ...arrivee };
    console.log('Arrivee sélectionné : ', this.selectedArrivee);
    this.sharedService.openModal('genericModal');
  }

  handleAdd(arrivee: Arrivee): void {
    this.arriveeService.create(arrivee).subscribe({
      next: () => {
        this.getArriveesByTrajet(this.trajetId);
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast(
          '🎉 Point de arrivée enregistré avec succès !'
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

  handleUpdate(updatedYobante: Arrivee) {
    this.arriveeService
      .update(this.selectedArrivee.id, updatedYobante)
      .subscribe({
        next: (res) => {
          this.getArriveesByTrajet(this.trajetId);
          this.sharedService.closeModal('genericModal');
          this.alertService.showToast(
            '🎉 Point de arrivée mise à jour avec succès !'
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

  handleDelete(arrivee: Arrivee): void {
    const title = arrivee.libelle;

    this.alertService.confirmDeleteAsync(`le point de arrivée ${title}`, () =>
      this.arriveeService.delete(arrivee.id).pipe(
        tap(() => {
          this.getArriveesByTrajet(this.trajetId);
          this.alertService.showToast(
            `🎉 Le point de arrivée ${title} a été supprimée avec succès !`
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
    moveItemInArray(this.arrivees, event.previousIndex, event.currentIndex);

    // Mettre à jour les ordres localement
    this.arrivees.forEach((item, index) => {
      item.order = index + 1;
    });

    // Appeler une méthode pour enregistrer le nouvel ordre côté serveur
    this.saveNewOrder();
  }

  saveNewOrder() {
    const payload = this.arrivees.map((item) => ({
      arrivee_id: item.id,
      new_order: item.order,
    }));

    this.arriveeService.updateOrder(payload).subscribe({
      next: () => console.log('Ordre mis à jour'),
      error: (err) => console.error('Erreur mise à jour ordre', err),
    });
  }
}
