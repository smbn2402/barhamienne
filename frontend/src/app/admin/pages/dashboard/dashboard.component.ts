import { Component } from '@angular/core';
import { CaravaneStatsComponent } from './components/caravane-stats/caravane-stats.component';
import { SharedService } from '../../../core/services/shared/shared.service';
import { CaravaneModalComponent } from './components/caravane-modal/caravane-modal.component';
import { ReservationModalComponent } from './components/reservation-modal/reservation-modal.component';
import { CaravaneService } from '../../../core/services/caravane/caravane.service';
import { Caravane } from '../../../core/interfaces/caravane';
import { AlertService } from '../../../core/services/alert/alert.service';
import { Reservation } from '../../../core/interfaces/reservation';
import { ReservationService } from '../../../core/services/reservation/reservation.service';
import { ClientService } from '../../../core/services/client/client.service';
import { ReservationComponent } from '../caravane/components/reservation/reservation.component';
import { ReservationStatsComponent } from './components/reservation-stats/reservation-stats.component';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CaravaneCalendarComponent } from "./components/caravane-calendar/caravane-calendar.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    CaravaneStatsComponent,
    CaravaneModalComponent,
    ReservationModalComponent,
    FormsModule,
    CommonModule,
    CaravaneCalendarComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  total_clients: number = 0;
  reservations_validees: number = 0;
  total_yobantes: number = 0;
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  chart: any;

  constructor(
    private sharedService: SharedService,
    private caravaneService: CaravaneService,
    private reservationService: ReservationService,
    private alertService: AlertService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // Initialization logic can go here if needed
    this.getClientsCount();
    this.getReservationsCount();
    this.getYobantesCount();
    this.initYears();
  }

  ngAfterViewInit(): void {
    this.loadChartData(this.selectedYear);
  }

  initYears() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => current - i);
  }

  onYearChange(): void {
    this.chart?.destroy();
    this.loadChartData(this.selectedYear);
  }

  loadChartData(year: number): void {
    this.reservationService
      .getStatistiquesParStatutParMois(year)
      .subscribe((data) => {
        const labels = [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Juin',
          'Juil',
          'Août',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ];

        const valides = data.donnees.map((m: any) => m.validées);
        const annulees = data.donnees.map((m: any) => m.annulées);
        const attentes = data.donnees.map((m: any) => m.en_attente);

        const ctx = document.getElementById(
          'statisticsChart'
        ) as HTMLCanvasElement;

        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Validées',
                backgroundColor: '#28a745',
                data: valides,
              },
              {
                label: 'Annulées',
                backgroundColor: '#dc3545',
                data: annulees,
              },
              {
                label: 'En attente',
                backgroundColor: '#ffc107',
                data: attentes,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              // title: {
              //   display: true,
              //   text: `Réservations par mois en ${year}`,
              // },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }

  // Export en PDF
  exportToPDF(): void {
    const canvas = document.getElementById('statisticsChart') as HTMLCanvasElement;

    html2canvas(canvas).then(canvasData => {
      const imgData = canvasData.toDataURL('image/png');
      const doc = new jsPDF();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 150); // x, y, width, height
      doc.save('statistiques_reservations.pdf');
    });
  }

  openModal(modalId: string): void {
    this.sharedService.openModal(modalId);
  }

  handleAddCaravane(newCaravane: Caravane): void {
    this.caravaneService.create(newCaravane).subscribe({
      next: (res) => {
        this.sharedService.closeModal('caravaneModal');
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

  handleAddReservation(newReservation: Reservation) {
    this.reservationService.create(newReservation).subscribe({
      next: (res) => {
        this.sharedService.closeModal('reservationModal');
        this.alertService.showToast('🎉 Réservation enregistrée avec succès !');
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

  getClientsCount(): void {
    this.clientService.getClientStats().subscribe({
      next: (clients) => {
        this.total_clients = clients;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients', err);
      },
    });
  }

  getReservationsCount(): void {
    this.reservationService.getStatistiques().subscribe({
      next: (res) => {
        this.reservations_validees = res.reservations_validees;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des réservations', err);
      },
    });
  }

  getYobantesCount(): void {
    this.reservationService.getStatistiques().subscribe({
      next: (res) => {
        this.total_yobantes = res.total_yobantes | 0;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des Yobantes', err);
      },
    });
  }
}
