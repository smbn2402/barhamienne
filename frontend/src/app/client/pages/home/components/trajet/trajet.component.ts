import { Trajet } from "./../../../../../core/interfaces/trajet";
import { Component, ViewEncapsulation } from "@angular/core";
import { TrajetService } from "../../../../../core/services/trajet/trajet.service";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { SharedService } from "../../../../../core/services/shared/shared.service";

@Component({
  selector: "app-trajet",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./trajet.component.html",
  styleUrl: "./trajet.component.css",
})
export class TrajetComponent {
  trajets: Trajet[] = [];
  isLoading: boolean = true;

  constructor(private trajetService: TrajetService, private sharedService: SharedService, private router: Router) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.show();
    this.getTrajets();
  }

  getTrajets(): void {
    this.trajetService.getAll().subscribe({
      next: (res) => {
        this.trajets = res;
        this.isLoading = false;
         this.sharedService.hide();
      },
      error: (err) => {
        console.log("Erreur lors de la récupération des trajets : ", err);
        this.isLoading = false;
         this.sharedService.hide();
      },
    });
  }

  onNavigate(path: any[]): void {
    console.log('Navigation triggered with path:', path);
    this.router.navigate(path);
  }
}
