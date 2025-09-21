import { Component } from '@angular/core';
import { TrajetComponent } from "../home/components/trajet/trajet.component";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-reservation',
  imports: [TrajetComponent, HeaderComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {

}
