import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientWrapperComponent } from './client-wrapper/client-wrapper.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { HoraireComponent } from './pages/horaire/horaire.component';
import { ReservationComponent } from './pages/home/components/trajet/components/caravane/components/reservation/reservation.component';
import { CaravaneComponent } from './pages/home/components/trajet/components/caravane/caravane.component';
import { YobanteComponent } from './pages/yobante/yobante.component';
import { CheckoutErrorComponent } from './pages/checkout-error/checkout-error.component';
import { CheckoutSuccessComponent } from './pages/checkout-success/checkout-success.component';
import { ReservationComponent as ReservationComponentPage} from './pages/reservation/reservation.component';

const routes: Routes = [
  {
    path: '',
    component: ClientWrapperComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'caravanes/:id', component: CaravaneComponent },
      { path: 'reservation', component: ReservationComponentPage },
      { path: 'reservation/:id', component: ReservationComponent },
      { path: 'yobante', component: YobanteComponent },
      { path: 'horaire', component: HoraireComponent },
      { path: 'contact', component: ContactComponent },
      {
        path: 'checkout-success',
        component: CheckoutSuccessComponent,
      },
      {
        path: 'checkout-error',
        component: CheckoutErrorComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ClientModule {}
