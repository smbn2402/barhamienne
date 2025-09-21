import { Component } from '@angular/core';
import { CaravaneService } from '../../../../../../../core/services/caravane/caravane.service';
import { CommonModule, formatDate } from '@angular/common';
import { DateFormatComponent } from '../../../../../../../shared/date-format/date-format.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Caravane } from '../../../../../../../core/interfaces/caravane';
import { TrajetService } from '../../../../../../../core/services/trajet/trajet.service';
import { Trajet } from '../../../../../../../core/interfaces/trajet';
import { DepartMomentService } from '../../../../../../../core/services/depart-moment/depart-moment.service';
import { DepartMoment } from '../../../../../../../core/interfaces/depart_moment';
import { ArriveeMoment } from '../../../../../../../core/interfaces/arrivee_moment';
import { ArriveeMomentService } from '../../../../../../../core/services/arrivee-moment/arrivee-moment.service';
import { HeaderComponent } from '../../../../../../shared/header/header.component';
import { SharedService } from '../../../../../../../core/services/shared/shared.service';

type CaravaneAvecMoments = Caravane & {
  departMomentPrincipale?: DepartMoment;
  arriveeMomentPrincipale?: ArriveeMoment;
};

@Component({
  selector: 'app-caravane',
  standalone: true,
  imports: [CommonModule, DateFormatComponent, RouterModule, HeaderComponent],
  templateUrl: './caravane.component.html',
  styleUrl: './caravane.component.css',
})
export class CaravaneComponent {
  caravanes: CaravaneAvecMoments[] = [];

  isLoading: boolean = true;
  trajetId!: number;
  trajet!: Trajet;

  constructor(
    private caravaneService: CaravaneService,
    private trajetService: TrajetService,
    private departMomentService: DepartMomentService,
    private arriveeMomentService: ArriveeMomentService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sharedService.show();
    this.trajetId = Number(this.route.snapshot.paramMap.get('id'));
    this.getTrajetById(this.trajetId);
    this.getCaravanesByTrajet(this.trajetId);
  }

  getCaravanesByTrajet(trajetId: number): void {
    this.caravaneService.getByTrajet(trajetId).subscribe({
      next: (res) => {
        const caravanesPubliees = res.filter((c) => c.estPubliee);
        this.caravanes = caravanesPubliees;

        caravanesPubliees.forEach((caravane) => {
          this.departMomentService
            .getPrincipaleByCaravane(caravane.id)
            .subscribe({
              next: (res) => {
                caravane.departMomentPrincipale = res;
                this.sharedService.hide();
                this.isLoading = false;
              },
              error: (err) => {
                this.sharedService.hide();
                this.isLoading = false;
                console.log(
                  `Erreur chargement départ de la caravane ${caravane.id}`,
                  err
                );
              },
            });

          this.arriveeMomentService
            .getPrincipaleByCaravane(caravane.id)
            .subscribe({
              next: (res) => {
                caravane.arriveeMomentPrincipale = res;
                this.sharedService.hide();
                this.isLoading = false;
              },
              error: (err) => {
                console.log(
                  `Erreur chargement arrivée de la caravane ${caravane.id}`,
                  err
                );
                this.sharedService.hide();
                this.isLoading = false;
              },
            });
        });
      },
      error: (err) => {
        console.log('Erreur lors du chargement des caravanes : ', err);
        this.sharedService.hide();
        this.caravanes = [];
        this.isLoading = false;
      },
    });
  }

  getTrajetById(trajetId: number): void {
    this.trajetService.getById(trajetId).subscribe({
      next: (res) => (this.trajet = res),
      error: (err) =>
        console.log('Erreur lors de la récupération du trajet : ', err),
    });
  }

  openWhatsapp(caravane: Caravane) {
    const url = `https://api.whatsapp.com/send?text=${this.whatsappMessage(
      caravane
    )}`;
    window.open(url, '_blank');
  }

  private whatsappMessage(caravane: Caravane): string {
    const message = `Découvrez cette caravane : ${caravane.libelle}

Trajet: ${caravane.trajet.libelle}
Date: ${caravane.moment.libelle} du ${this.formattedDate(caravane.date)}

Cliquez sur le lien suivant pour effectuer votre réservation : https://barhamienne-transport.com/reservation/${
      caravane.id
    }

!!! Barhamienne-transport !!!`;

    return encodeURIComponent(message);
  }

  formattedDate(date: Date): string {
    return formatDate(date, 'EEEE d MMM à H:mm:ss', 'fr-FR');
  }

  onNavigate(path: string): void {
    this.router.navigate([path]);
  }
}
