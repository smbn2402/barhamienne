import { Component } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { TrajetService } from "../../../core/services/trajet/trajet.service";
import { Trajet } from "../../../core/interfaces/trajet";
import { trigger, transition, style, animate } from "@angular/animations";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
import { DepartMoment } from "../../../core/interfaces/depart_moment";
import { DepartMomentService } from "../../../core/services/depart-moment/depart-moment.service";
import { RouterLink } from "@angular/router";
import { HeaderComponent } from "../../shared/header/header.component";
import { SharedService } from "../../../core/services/shared/shared.service";

@Component({
  selector: "app-horaire",
  imports: [NgFor, NgIf, RouterLink, HeaderComponent],
  standalone: true,
  templateUrl: "./horaire.component.html",
  styleUrl: "./horaire.component.css",
  animations: [
    trigger("fadeInAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "500ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
    ]),
  ],
})
export class HoraireComponent {
  trajets: Trajet[] = [];
  departMoments: DepartMoment[] = [];
  isLoading: boolean = true;

  constructor(
    private trajetService: TrajetService,
    private departMomentService: DepartMomentService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.show();
    this.loadData();
  }

  getTrajets(): void {
    this.trajetService.getAll().subscribe({
      next: (data) => {
        this.trajets = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des trajets", err);
      },
    });
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      departMoments: this.departMomentService.getDepartMoments(),
      trajets: this.trajetService.getAll(),
      // departMoments: this.departMomentService.getDepartMoments(),
    }).subscribe({
      next: (result) => {
        this.departMoments = result.departMoments;
        this.trajets = result.trajets;
        this.sharedService.hide();
        // this.departMoments = result.departMoments;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des données", err);
        this.sharedService.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.sharedService.hide();
      },
    });
  }

  getDepartMomentsByTrajet(trajetId: number): any[] {
    const groupedDeparts = new Map();

    this.departMoments
      .filter((dm) => dm.depart.trajet.id === trajetId)
      .forEach((dm) => {
        const departId = dm.depart.id;
        if (!groupedDeparts.has(departId)) {
          groupedDeparts.set(departId, {
            depart: dm.depart,
            moments: [],
          });
        }
        groupedDeparts
          .get(departId)
          .moments.push(`${dm.moment.libelle} (${dm.heureDepart})`);
      });
    return Array.from(groupedDeparts.values());
  }
}
