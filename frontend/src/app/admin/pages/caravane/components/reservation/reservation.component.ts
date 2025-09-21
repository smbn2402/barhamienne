import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert/alert.service';
import { ArriveeService } from '../../../../../core/services/arrivee/arrivee.service';
import { CaravaneService } from '../../../../../core/services/caravane/caravane.service';
import { DepartMomentService } from '../../../../../core/services/depart-moment/depart-moment.service';
import { ReservationService } from '../../../../../core/services/reservation/reservation.service';
import { Arrivee } from '../../../../../core/interfaces/arrivee';
import { Caravane } from '../../../../../core/interfaces/caravane';
import { DepartMoment } from '../../../../../core/interfaces/depart_moment';
import { Reservation } from '../../../../../core/interfaces/reservation';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { catchError, Subject, tap } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { DateFormatComponent } from '../../../../../shared/date-format/date-format.component';
import { ReservationModalComponent } from './components/reservation-modal/reservation-modal.component';
import { MessageModalComponent } from './components/message-modal/message-modal.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reservation',
  imports: [
    CommonModule,
    DataTablesModule,
    DragDropModule,
    BreadcrumbsComponent,
    DateFormatComponent,
    ReservationModalComponent,
    MessageModalComponent,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  caravaneId!: number;
  caravane!: Caravane;
  reservations: Reservation[] = [];
  selectedReservation!: Reservation;
  departMoments: DepartMoment[] = [];
  arrivees: Arrivee[] = [];
  selectedReservations: any[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private caravaneService: CaravaneService,
    private reservationService: ReservationService,
    private departMomentService: DepartMomentService,
    private arriveeService: ArriveeService,
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
    this.caravaneService.getById(this.caravaneId).subscribe({
      next: (res) => {
        this.caravane = res;
        this.getReservationsByCaravane(this.caravane.id);
        if (this.caravane.trajet && this.caravane.trajet.id) {
          this.getDepartMomentsByTrajetAndMoment(
            this.caravane.trajet.id,
            this.caravane.moment.id
          );
          this.getArriveesByTrajet(this.caravane.trajet.id);
        } else {
          console.warn('Le trajet de la caravane est manquant ou invalide.');
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la caravane', err);
      },
    });
  }

  getReservationsByCaravane(caravaneId: number): void {
    this.reservationService.getReservationsByCaravane(caravaneId).subscribe({
      next: async (res) => {
        this.reservations = res;
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
          "Erreur lors de la récupération des réservations de la caravane d'id : " +
            caravaneId,
          err
        );
         this.sharedService.hide();
this.isLoading = false;
      },
    });
  }

  getDepartMomentsByTrajetAndMoment(trajetId: number, momentId: number): void {
    this.departMomentService
      .getDepartMomentsByTrajetAndMoment(trajetId, momentId)
      .subscribe({
        next: (res) => {
          this.departMoments = res;
        },
        error: (err) =>
          console.log(
            'Erreur lors de la récupérations des points de départs',
            err
          ),
      });
  }

  getArriveesByTrajet(trajetId: number): void {
    this.arriveeService.getByTrajet(trajetId).subscribe(
      (res) => {
        this.arrivees = res;
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des points d'arrivée:",
          error
        );
      }
    );
  }

  selecteReservation(reservation: Reservation) {
    this.isEditMode = true;
    this.selectedReservation = { ...reservation }; // Clone pour éviter de modifier l'original
    this.sharedService.openModal('genericModal');
  }

  handleAdd(newReservation: Reservation) {
    this.reservationService.create(newReservation).subscribe({
      next: (res) => {
        this.getCaravane();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Réservation enregistrée avec succès !');
        this.isEditMode = false;
      },
      error: (error) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error("Erreur lors de l'ajout de la réservation", error);
      },
    });
  }

  handleUpdate(updatedReservation: Reservation) {
    this.reservationService
      .update(this.selectedReservation.id, updatedReservation)
      .subscribe({
        next: (res) => {
          console.log('updatedReservation :', res);
          this.getCaravane();
          this.sharedService.closeModal('genericModal');
          this.alertService.showToast(
            '🎉 Réservation mise à jour avec succès !'
          );
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

  handleDelete(reservation: Reservation): void {
    const title = reservation.client.prenom + ' ' + reservation.client.nom;

    this.alertService.confirmDeleteAsync(`la réservation de ${title}`, () =>
      this.reservationService.delete(reservation.id).pipe(
        tap(() => {
          this.getCaravane();
          this.alertService.showToast(
            `🎉 La réservation de ${title} a été supprimée avec succès !`
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

  toggleSelection(reservation: any, event: any) {
    if (event.target.checked) {
      this.selectedReservations.push(reservation);
    } else {
      this.selectedReservations = this.selectedReservations.filter(
        (r) => r.id !== reservation.id
      );
    }
  }

  selectAll(event: any) {
    if (event.target.checked) {
      this.selectedReservations = [...this.reservations];
    } else {
      this.selectedReservations = [];
    }
  }

  handleBulkMessage(event: { message: string; reservations: any[] }) {
    this.reservationService
      .sendBulkMessage(event.message, event.reservations)
      .subscribe({
        next: (res) => {
          this.alertService.showToast('🎉 Messages envoyés avec succès');
          this.sharedService.closeModal('messageModal');
        },
        error: (err) => {
          console.error(err);
          this.alertService.showToast(
            '❌ Erreur lors de l’envoi des messages',
            'error'
          );
        },
      });
  }

  exportConfirmedReservationsToPDF(): void {
    const confirmed = this.reservations.filter(
      (r) => r.statut.toUpperCase() === 'CONFIRMEE'
    );

    const doc = new jsPDF();
    doc.text('Liste des réservations confirmées', 14, 15);

    const rows = confirmed.map((r, i) => [
      i + 1,
      r.client.prenom,
      r.client.nom,
      r.client.tel,
      `${r.departMoment.depart.libelle} (${r.departMoment.heureDepart})`,
      r.arrivee.libelle,
      new Date(r.date).toLocaleDateString(), // ✅ Date convertie en string
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['#', 'Prénom', 'Nom', 'Téléphone', 'Départ', 'Arrivée', 'Date']],
      body: rows,
      styles: { fontSize: 9 },
    });

    doc.save(
      `reservations_confirmées_${new Date().toISOString().split('T')[0]}.pdf`
    );
  }

  exportToExcel(): void {
    const exportData = this.reservations.map((res, index) => ({
      '#': index + 1,
      Prénom: res.client?.prenom,
      Nom: res.client?.nom,
      Numéro: res.client?.tel,
      'Point de départ': `${res.departMoment?.depart?.libelle} (${res.departMoment?.heureDepart})`,
      "Point d'arrivée": res.arrivee?.libelle,
      Statut: res.statut,
      Date: res.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = {
      Sheets: { Réservations: worksheet },
      SheetNames: ['Réservations'],
    };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `reservations_${new Date().toISOString()}.xlsx`);
  }

  exportConfirmedReservations(): void {
    const confirmed = this.reservations.filter(
      (r) => r.statut === 'CONFIRMEE' || r.statut === 'CONFIRMEE'
    );

    const data = confirmed.map((r, i) => ({
      '#': i + 1,
      Prénom: r.client.prenom,
      Nom: r.client.nom,
      Téléphone: r.client.tel,
      Départ: `${r.departMoment.depart.libelle} (${r.departMoment.heureDepart})`,
      Arrivée: r.arrivee.libelle,
      Statut: r.statut,
      Date: r.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Réservations confirmées'
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `reservations_confirmees_${new Date().toISOString()}.xlsx`);
  }
}
