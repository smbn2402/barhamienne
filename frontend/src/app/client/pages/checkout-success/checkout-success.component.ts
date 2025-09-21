import { Component } from '@angular/core';
import { ReservationService } from '../../../core/services/reservation/reservation.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Reservation } from '../../../core/interfaces/reservation';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { DateFormatComponent } from '../../../shared/date-format/date-format.component';
import { SharedService } from '../../../core/services/shared/shared.service';

@Component({
  selector: 'app-checkout-success',
  imports: [
    CommonModule,
    HeaderComponent,
    DateFormatComponent,
    RouterLink
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css',
})
export class CheckoutSuccessComponent {
  reservation!: Reservation;
  message: string = '✅ Paiement réussi !';
  reservationId!: number;

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.show();
    this.reservationId = Number(
      this.route.snapshot.queryParamMap.get('reservation_id')!
    );
    console.log('Reservation ID:', this.reservationId);
    if (this.reservationId) {
      this.getReservation();
    }
  }

  getReservation(): void {
    this.reservationService.getById(this.reservationId).subscribe({
      next: (res) => {
        this.sharedService.hide();
        this.reservation = res;
        console.log('Reservation:', this.reservation);
      },
      error: (err) => {
        this.sharedService.hide();
        console.error('Erreur lors de la récupération de la réservation', err);
        this.message = '❌ Réservation introuvable.';
      },
    });
  }
}
