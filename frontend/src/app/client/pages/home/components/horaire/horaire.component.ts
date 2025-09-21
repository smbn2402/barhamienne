import { Component, Input } from "@angular/core";
import { DepartService } from "../../../../../core/services/depart/depart.service";
import { Depart } from "../../../../../core/interfaces/depart";
import { Caravane } from "../../../../../core/interfaces/caravane";
import { NgFor } from "@angular/common";
import { DateFormatComponent } from "../../../../../shared/date-format/date-format.component";

@Component({
  selector: "app-horaire",
  standalone: true,
  imports: [NgFor, DateFormatComponent],
  templateUrl: "./horaire.component.html",
  styleUrl: "./horaire.component.css",
})
export class HoraireComponent {
  @Input() caravane!: Caravane;
  departs: Depart[] = [];

  constructor(private departService: DepartService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDepartsByTrajet(this.caravane.trajet.id);
  }

  getDepartsByTrajet(trajetId: number): void {
    this.departService.getByTrajet(trajetId).subscribe(
      (data) => {
        this.departs = data;
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des points de départ:",
          error
        );
      }
    );
  }
}
