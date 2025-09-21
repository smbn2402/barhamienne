import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { catchError, Subject, tap } from 'rxjs';
import { Moment } from '../../../core/interfaces/moment';
import { AlertService } from '../../../core/services/alert/alert.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { MomentService } from '../../../core/services/moment/moment.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { MomentModalComponent } from './moment-modal/moment-modal.component';

@Component({
  selector: 'app-moment',
  imports: [
    CommonModule,
    DataTablesModule,
    BreadcrumbsComponent,
    MomentModalComponent,
  ],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.css',
})
export class MomentComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  moments: Moment[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;
  selectedMoment: any = {};

  constructor(
    private momentService: MomentService,
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
    this.getMoments();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getMoments(): void {
    this.momentService.getAll().subscribe({
      next: async (res) => {
        this.moments = res;
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
        console.error('Erreur lors de la récupération des moments', err);
        this.sharedService.hide();
this.isLoading = false;
      },
    });
  }

  selecteMoment(moment: Moment) {
    this.isEditMode = true;
    this.selectedMoment = { ...moment };
    console.log('Moment sélectionné : ', this.selectedMoment);
    this.sharedService.openModal('genericModal');
  }

  handleAdd(moment: Moment): void {
    this.momentService.create(moment).subscribe({
      next: () => {
        this.getMoments();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Moment enregistré avec succès !');
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

  handleUpdate(moment: Moment) {
    this.momentService.update(this.selectedMoment.id, moment).subscribe({
      next: (res) => {
        this.getMoments();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Moment mise à jour avec succès !');
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

  handleDelete(moment: Moment): void {
    const title = moment.libelle;

    this.alertService.confirmDeleteAsync(`le moment ${title}`, () =>
      this.momentService.delete(moment.id).pipe(
        tap(() => {
          this.getMoments();
          this.alertService.showToast(
            `🎉 Le moment ${title} a été supprimée avec succès !`
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
