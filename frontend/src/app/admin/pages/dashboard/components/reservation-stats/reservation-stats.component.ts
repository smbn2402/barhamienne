import { Component } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ReservationService } from '../../../../../core/services/reservation/reservation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  colors: ['#28a745', '#dc3545', '#ffc107'];
};

@Component({
  selector: 'app-reservation-stats',
  imports: [NgApexchartsModule, FormsModule, CommonModule],
  templateUrl: './reservation-stats.component.html',
  styleUrl: './reservation-stats.component.css',
})
export class ReservationStatsComponent {
  chartOptions: Partial<ChartOptions> = {};
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.initYears();
    this.loadData(this.selectedYear);
  }

  initYears() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => current - i);
  }

  // loadData(year: number): void {
  //   this.reservationService.getStatistiquesParMois(year).subscribe((data) => {
  //     const mois = [
  //       'Jan',
  //       'Fév',
  //       'Mar',
  //       'Avr',
  //       'Mai',
  //       'Juin',
  //       'Juil',
  //       'Août',
  //       'Sep',
  //       'Oct',
  //       'Nov',
  //       'Déc',
  //     ];
  //     const seriesData = data.reservations_par_mois.map((m: any) => m.total);

  //     this.chartOptions = {
  //       series: [
  //         {
  //           name: 'Réservations',
  //           data: seriesData,
  //         },
  //       ],
  //       chart: {
  //         type: 'bar',
  //         height: 350,
  //       },
  //       title: {
  //         text: `Réservations par mois en ${year}`,
  //       },
  //       xaxis: {
  //         categories: mois,
  //       },
  //     };
  //   });
  // }

  loadData(year: number): void {
    this.reservationService
      .getStatistiquesParStatutParMois(year)
      .subscribe((data) => {
        const mois = [
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

        const validees = data.donnees.map((m: any) => m.validées);
        const annulees = data.donnees.map((m: any) => m.annulées);
        const attentes = data.donnees.map((m: any) => m.en_attente);

        this.chartOptions = {
          series: [
            { name: 'Validées', data: validees },
            { name: 'Annulées', data: annulees },
            { name: 'En attente', data: attentes },
          ],
          chart: {
            type: 'bar',
            height: 400,
            stacked: true,
          },
          title: {
            text: `Statistiques des réservations (${year})`,
          },
          xaxis: {
            categories: mois,
          },
        };
      });
  }

  onYearChange(): void {
    this.loadData(this.selectedYear);
  }
}
