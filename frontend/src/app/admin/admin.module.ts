import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { ArriveeComponent } from './pages/arrivee/arrivee.component';
import { CaravaneComponent } from './pages/caravane/caravane.component';
import { ReservationComponent } from './pages/caravane/components/reservation/reservation.component';
import { YobanteComponent } from './pages/caravane/components/yobante/yobante.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepartComponent } from './pages/depart/depart.component';
import { HeureArriveeComponent } from './pages/heure-arrivee/heure-arrivee.component';
import { HeureDepartComponent } from './pages/heure-depart/heure-depart.component';
import { MomentComponent } from './pages/moment/moment.component';
import { SmsComponent } from './pages/sms/sms.component';
import { TrajetComponent } from './pages/trajet/trajet.component';
import { ClientComponent } from './pages/client/client.component';
import { UtilisateurComponent } from './pages/utilisateur/utilisateur.component';
import { WebhookComponent } from './pages/webhook/webhook.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


const adminRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'caravanes/:trajetId/:momentId',
        component: CaravaneComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reservations/:id',
        component: ReservationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'yobantes/:id',
        component: YobanteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'sms',
        component: SmsComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'clients',
        component: ClientComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'utilisateurs',
        component: UtilisateurComponent,
        data: { roles: ['super-admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'departs/:id',
        component: DepartComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'heures-depart/:trajetId/:momentId',
        component: HeureDepartComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'arrivees/:id',
        component: ArriveeComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'heures-arrivee/:trajetId/:momentId',
        component: HeureArriveeComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'trajets',
        component: TrajetComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'moments',
        component: MomentComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'webhook',
        component: WebhookComponent,
        data: { roles: ['super-admin', 'admin'] },
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    RouterModule.forChild(adminRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class AdminModule {}
