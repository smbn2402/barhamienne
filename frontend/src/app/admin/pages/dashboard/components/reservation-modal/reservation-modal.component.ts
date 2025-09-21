import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { DepartMoment } from '../../../../../core/interfaces/depart_moment';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { DepartMomentService } from '../../../../../core/services/depart-moment/depart-moment.service';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { Caravane } from '../../../../../core/interfaces/caravane';
import { ArriveeService } from '../../../../../core/services/arrivee/arrivee.service';
import { Arrivee } from '../../../../../core/interfaces/arrivee';
import { CommonModule } from '@angular/common';
import { DateFormatComponent } from '../../../../../shared/date-format/date-format.component';
import { CaravaneService } from '../../../../../core/services/caravane/caravane.service';
import { Trajet } from '../../../../../core/interfaces/trajet';
import { TrajetService } from '../../../../../core/services/trajet/trajet.service';

@Component({
  selector: 'app-reservation-modal',
  imports: [
    GenericModalComponent,
    ReactiveFormsModule,
    CommonModule,
    DateFormatComponent,
  ],
  templateUrl: './reservation-modal.component.html',
  styleUrl: './reservation-modal.component.css',
})
export class ReservationModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  form: FormGroup;
  formValid: boolean = false;
  departMoments: DepartMoment[] = [];
  arrivees: Arrivee[] = [];
  caravanes: Caravane[] = [];
  trajets: Trajet[] = [];

  constructor(
    private fb: FormBuilder,
    private departMomentService: DepartMomentService,
    private arriveeService: ArriveeService,
    private caravaneService: CaravaneService,
    private trajetService: TrajetService,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      trajet: ['', Validators.required],
      caravane: ['', Validators.required],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      tel: ['', [Validators.required, Validators.pattern('^([0-9]{9})$')]],
      departMomentId: ['', Validators.required],
      arriveeId: ['', Validators.required],
      statut: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTrajets();
    this.form.get('trajet')?.valueChanges.subscribe((trajetId: number) => {
      if (trajetId) {
        this.getCaravanesByTrajet(trajetId);
        this.form
          .get('caravane')
          ?.valueChanges.subscribe((caravaneId: number) => {
            if (caravaneId) {
              this.getDepartMomentsByCaravane(caravaneId);
              this.getArriveesByCaravane(caravaneId);
            } else {
              this.departMoments = [];
              this.arrivees = [];
            }
          });
      } else {
        this.trajets = [];
      }
    });
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    const newReservation = {
      client: {
        prenom: formData.prenom,
        nom: formData.nom,
        tel: formData.tel,
      },
      caravane: { id: formData.caravane },
      departMoment: { id: formData.departMomentId },
      arrivee: { id: formData.arriveeId },
      statut: formData.statut,
    };

    // Envoie du newReservation
    this.onAdd.emit(newReservation);
    this.closeModal();
  }

  getDepartMomentsByCaravane(caravaneId: number): void {
    this.departMomentService.getByCaravane(caravaneId).subscribe({
      next: (data) => {
        this.departMoments = data;
      },
      error: (err) => {
        console.error('Erreur chargement des heures de départs', err);
      },
    });
  }

  getArriveesByCaravane(caravaneId: number): void {
    this.arriveeService.getByCaravane(caravaneId).subscribe(
      (res) => {
        this.arrivees = res;
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des points d'arrivée:",
          error
        );
      }
    );
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

  closeModal(): void {
    this.sharedService.closeModal('reservationModal');
    this.form.reset();
  }
}
