import { CommonModule, formatDate } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Yobante } from "../../../core/interfaces/yobante";
import { YobanteService } from "../../../core/services/yobante/yobante.service";
import { DepartMoment } from "../../../core/interfaces/depart_moment";
import { CaravaneService } from "../../../core/services/caravane/caravane.service";
import { DepartMomentService } from "../../../core/services/depart-moment/depart-moment.service";
import { Caravane } from "../../../core/interfaces/caravane";
import { AlertService } from "../../../core/services/alert/alert.service";
import { Router } from "@angular/router";
import { HeaderComponent } from "../../shared/header/header.component";
import { SharedService } from "../../../core/services/shared/shared.service";
import { Trajet } from "../../../core/interfaces/trajet";
import { TrajetService } from "../../../core/services/trajet/trajet.service";

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: "app-yobante",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: "./yobante.component.html",
  styleUrl: "./yobante.component.css",
})
export class YobanteComponent {
  step: number = 1; // Étape actuelle
  form: FormGroup;
  departMoments: DepartMoment[] = [];
  caravanes: Caravane[] = [];
  trajets: Trajet [] = [];

  constructor(
    private fb: FormBuilder,
    private yobanteService: YobanteService,
    private caravaneService: CaravaneService,
    private departMomentService: DepartMomentService,
    private alertService: AlertService,
    private router: Router,
    private sharedService: SharedService,
    private trajetService: TrajetService
  ) {
    this.form = this.fb.group({
      expediteur: this.fb.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        tel: ["", Validators.required],
      }),
      colis: this.fb.group({
        type_colis: ["", Validators.required],
        trajet: ["", Validators.required],
        caravane: ["", Validators.required],
        depot: ["", Validators.required],
        retrait: [
          { value: "campus 1 entre Village B et Village C", disabled: true },
          Validators.required,
        ],
      }),
      destinataire: this.fb.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        tel: ["", Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.show();
    this.getCaravanes();
    // Abonnement au changement de la date choisie
    this.getTrajets();
    this.form.get('colis.trajet')?.valueChanges.subscribe((trajetId: number) => {
      if (trajetId) {
        this.getCaravanesByTrajet(trajetId);
        this.form
          .get('colis.caravane')
          ?.valueChanges.subscribe((caravaneId: number) => {
            if (caravaneId) {
              this.getDepartMomentsByCaravane(caravaneId);
            } else {
              this.departMoments = [];
            }
          });
      } else {
        this.trajets = [];
      }
    });
  }

  // Aller à l'étape suivante
  nextStep() {
    if (this.step === 1) {
      if (this.form.get("expediteur")?.valid) {
        this.step++;
      } else {
        this.form.get("expediteur")?.markAllAsTouched();
      }
    } else if (this.step === 2) {
      if (this.form.get("colis")?.valid) {
        this.step++;
      } else {
        this.form.get("colis")?.markAllAsTouched();
      }
    } else if (this.step === 3) {
      if (this.form.get("destinataire")?.valid) {
        this.step++;
      } else {
        this.form.get("destinataire")?.markAllAsTouched();
      }
    }
  }

  // Revenir à l'étape précédente
  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  addYobante(yobante: Yobante): void {
    this.yobanteService.create(yobante).subscribe({
      next: () => {
        this.alertService.showToast("🎉 Yobanté soumis avec succès !");
        this.router.navigateByUrl("/");
      },
      error: (err) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          "error"
        );
        console.log("Erreur lors de l'ajout du yobanté : ", err);
      },
    });
  }

  getCaravanesByTrajet(trajetId: number): void {
    this.caravaneService.getByTrajet(trajetId).subscribe(
      (res) => {
        this.caravanes = res.filter((c) => c.estPubliee);
      },
      (error) => {
        console.error('Erreur lors du chargement', error);
      }
    );
  }

  getTrajets(): void {
    this.trajetService.getAll().subscribe({
      next: (res) => {
        this.trajets = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des trajets', err);
      },
    });
  }

  getDepartMomentsByTrajetAndMoment(trajetId: number, momentId: number): void {
    this.departMomentService
      .getDepartMomentsByTrajetAndMoment(trajetId, momentId)
      .subscribe({
        next: (res) => {
          this.departMoments = res;
        },
        error: (err) =>
          console.log(
            "Erreur lors de la récupérations des points de départs",
            err
          ),
      });
  }

  getCaravanes(): void {
    this.caravaneService.getAll().subscribe(
      (res) => {
        this.caravanes = res.filter((c) => c.estPubliee);
        this.sharedService.hide();
      },
      (error) => {
        console.error("Erreur lors du chargement", error);
        this.sharedService.hide();
      }
    );
  }

  getDepartMomentsByCaravane(caravaneId: number): void {
    this.departMomentService.getByCaravane(caravaneId).subscribe({
      next: (res) => {
        this.departMoments = res;
      },
      error: (err) => {
        console.error("Erreur de chargement des lieux de dépôt :", err);
        this.departMoments = [];
      },
    });
  }

  formattedDate(date: Date): string {
    return formatDate(date, "EEEE d MMM", "fr-FR");
  }

  // Soumettre le formulaire
  onSubmit() {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();
      const yobante: Yobante = {
        id: 0,
        prenomExp: this.form.get("expediteur.firstName")?.value,
        nomExp: this.form.get("expediteur.lastName")?.value,
        telExp: this.form.get("expediteur.tel")?.value,
        typeColis: this.form.get("colis.type_colis")?.value,
        caravane: this.form.get("colis.caravane")?.value,
        departMoment: this.form.get("colis.depot")?.value,
        retrait: rawForm.colis.retrait,
        prenomDest: this.form.get("destinataire.firstName")?.value,
        nomDest: this.form.get("destinataire.lastName")?.value,
        telDest: this.form.get("destinataire.tel")?.value,
      };
      this.addYobante(yobante);
    }
  }
}
