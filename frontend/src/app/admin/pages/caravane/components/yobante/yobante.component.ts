import { CommonModule, formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert/alert.service';
import { CaravaneService } from '../../../../../core/services/caravane/caravane.service';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { YobanteService } from '../../../../../core/services/yobante/yobante.service';
import { DateFormatComponent } from '../../../../../shared/date-format/date-format.component';
import { Caravane } from '../../../../../core/interfaces/caravane';
import { DepartMoment } from '../../../../../core/interfaces/depart_moment';
import { Yobante } from '../../../../../core/interfaces/yobante';
import { YobanteModalComponent } from './components/yobante-modal/yobante-modal.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { catchError, Subject, tap } from 'rxjs';
import { Config } from 'datatables.net';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-yobante',
  imports: [
    CommonModule,
    DateFormatComponent,
    FormsModule,
    YobanteModalComponent,
    BreadcrumbsComponent,
    DataTablesModule,
  ],
  templateUrl: './yobante.component.html',
  styleUrl: './yobante.component.css',
})
export class YobanteComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  yobantes: Yobante[] = [];
  selectedYobante: any = {
    id: 0,
    prenomExp: '',
    nomExp: '',
    telExp: '',
    typeColis: '',
    caravane: { id: 0, moment: { id: 0, libelle: '' } },
    departMoment: { id: 0, depart: { id: 0, libelle: '' } },
    retrait: 'campus 1 entre Village B et Village C',
    prenomDest: '',
    nomDest: '',
    telDest: '',
  };
  caravaneId!: number;
  caravane!: Caravane;
  dataTable: any;
  departMoments: DepartMoment[] = [];
  caravanes: Caravane[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = true;

  constructor(
    private yobanteService: YobanteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private caravaneService: CaravaneService,
    private alertService: AlertService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 57,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json',
      },
    };
    this.activatedRoute.paramMap.subscribe((params) => {
      this.caravaneId = Number(params.get('id'));
      this.getCaravane();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getCaravane() {
    if (!this.caravaneId) return;

    this.caravaneService.getById(Number(this.caravaneId)).subscribe({
      next: (res) => {
        this.caravane = res;
        this.getYobantesByCaravane(this.caravane.id);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la caravane', err);
      },
    });
  }

  getYobantesByCaravane(caravaneId: number): void {
    this.yobanteService.getByCaravane(caravaneId).subscribe({
      next: async (res) => {
        this.yobantes = res;
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
        console.error(
          "Erreur lors de la récupération des yoabntés de la caravane d'id : " +
            caravaneId,
          err
        );
        this.sharedService.hide();
        this.isLoading = false;
      },
    });
  }

  selecteYobante(yobante: Yobante, modalId: string) {
    this.isEditMode = true;
    this.selectedYobante = { ...yobante };
    this.sharedService.openModal(modalId);
  }

  handleAdd(newYobante: Yobante): void {
    this.yobanteService.create(newYobante).subscribe({
      next: () => {
        this.getCaravane();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Yobanté enregistré avec succès !');
        this.isEditMode = false;
      },
      error: (err) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.log("Erreur lors de l'ajout du yobanté : ", err);
      },
    });
  }

  handleUpdate(updatedYobante: Yobante) {
    this.yobanteService
      .update(this.selectedYobante.id, updatedYobante)
      .subscribe({
        next: (response) => {
          this.getCaravane();
          this.sharedService.closeModal('genericModal');
          this.alertService.showToast('🎉 Yobanté mise à jour avec succès !');
          this.isEditMode = false;
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

  handleDelete(yobante: Yobante): void {
    const title = yobante.prenomDest + ' ' + yobante.nomDest;

    this.alertService.confirmDeleteAsync(`le yobanté de ${title}`, () =>
      this.yobanteService.delete(yobante.id).pipe(
        tap(() => {
          this.getCaravane();
          this.alertService.showToast(
            `🎉 Le yobanté de ${title} a été supprimée avec succès !`
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

  openModal(modalId: string): void {
    this.sharedService.openModal(modalId);
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url;

    // Activer /admin/caravane si l'URL est /admin/caravane ou /admin/reservation/X
    if (route === '/admin/caravane') {
      return (
        currentUrl.startsWith('/admin/caravane') ||
        currentUrl.startsWith('/admin/reservation')
      );
    }

    // Sinon, vérifier juste si l'URL commence par la route donnée
    return currentUrl.startsWith(route);
  }
}
