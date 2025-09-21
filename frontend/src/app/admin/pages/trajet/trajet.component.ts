import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { catchError, Subject, tap } from 'rxjs';
import { Trajet } from '../../../core/interfaces/trajet';
import { AlertService } from '../../../core/services/alert/alert.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { TrajetModalComponent } from './trajet-modal/trajet-modal.component';

@Component({
  selector: 'app-trajet',
  imports: [
    CommonModule,
    DataTablesModule,
    BreadcrumbsComponent,
    TrajetModalComponent,
  ],
  templateUrl: './trajet.component.html',
  styleUrl: './trajet.component.css',
})
export class TrajetComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  trajets: Trajet[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;
  selectedTrajet: any = {};

  constructor(
    private trajetService: TrajetService,
    private sharedService: SharedService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.sharedService.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json',
      },
    };
    this.getTrajets();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getTrajets(): void {
    this.trajetService.getAll().subscribe({
      next: async (res) => {
        this.trajets = res;
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
        console.error('Erreur lors de la récupération des trajets', err);
        this.sharedService.hide();
this.isLoading = false;
      },
    });
  }

  selecteTrajet(trajet: Trajet) {
    this.isEditMode = true;
    this.selectedTrajet = { ...trajet };
    console.log('Trajet sélectionné : ', this.selectedTrajet);
    this.sharedService.openModal('genericModal');
  }

  handleAdd(trajet: Trajet): void {
    this.trajetService.create(trajet).subscribe({
      next: () => {
        this.getTrajets();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Trajet enregistré avec succès !');
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

  handleUpdate(trajet: Trajet) {
    this.trajetService.update(this.selectedTrajet.id, trajet).subscribe({
      next: (res) => {
        this.getTrajets();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Trajet mise à jour avec succès !');
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

  handleDelete(trajet: Trajet): void {
    const title = trajet.libelle;

    this.alertService.confirmDeleteAsync(`le trajet ${title}`, () =>
      this.trajetService.delete(trajet.id).pipe(
        tap(() => {
          this.getTrajets();
          this.alertService.showToast(
            `🎉 Le trajet ${title} a été supprimée avec succès !`
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
