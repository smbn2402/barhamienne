import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../../../../shared/generic-modal/generic-modal.component';
import { DepartMoment } from '../../../../../../../core/interfaces/depart_moment';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { DepartMomentService } from '../../../../../../../core/services/depart-moment/depart-moment.service';
import { SharedService } from '../../../../../../../core/services/shared/shared.service';
import { Caravane } from '../../../../../../../core/interfaces/caravane';
import { ArriveeService } from '../../../../../../../core/services/arrivee/arrivee.service';
import { Arrivee } from '../../../../../../../core/interfaces/arrivee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-modal',
  imports: [GenericModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './reservation-modal.component.html',
  styleUrl: './reservation-modal.component.css',
})
export class ReservationModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Input() caravane!: Caravane;
  @Input() reservation: any = {};
  @Input() isEditMode: boolean = false;
  form: FormGroup;
  formValid: boolean = false;
  departMoments: DepartMoment[] = [];
  arrivees: Arrivee[] = [];

  constructor(
    private fb: FormBuilder,
    private departMomentService: DepartMomentService,
    private arriveeService: ArriveeService,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
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
    this.getDepartMomentsByCaravane();
    this.getArriveesByTrajet();
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservation'] && this.reservation) {
      this.form.patchValue({
        prenom: this.reservation.client?.prenom || '',
        nom: this.reservation.client?.nom || '',
        tel: this.reservation.client?.tel || '',
        departMomentId: this.reservation.departMoment?.id || '',
        arriveeId: this.reservation.arrivee?.id || '',
        statut: this.reservation.statut || '',
      });
    } else {
      this.form.reset();
    }
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
      caravane: { id: this.caravane.id },
      departMoment: { id: formData.departMomentId },
      arrivee: { id: formData.arriveeId },
      statut: formData.statut,
    };

    // Envoie du newReservation
    this.onAdd.emit(newReservation);
    this.closeModal();
  }

  getDepartMomentsByCaravane(): void {
    this.departMomentService.getByCaravane(this.caravane.id).subscribe({
      next: (data) => {
        this.departMoments = data;
      },
      error: (err) => {
        console.error('Erreur chargement des heures de départs', err);
      },
    });
  }

  getArriveesByTrajet(): void {
    this.arriveeService.getByTrajet(this.caravane.trajet.id).subscribe(
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

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }
}
