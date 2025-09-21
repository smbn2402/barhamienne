import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { Trajet } from '../../../../../core/interfaces/trajet';
import { Moment } from '../../../../../core/interfaces/moment';
import { TrajetService } from '../../../../../core/services/trajet/trajet.service';
import { MomentService } from '../../../../../core/services/moment/moment.service';

@Component({
  selector: 'app-caravane-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './caravane-modal.component.html',
  styleUrl: './caravane-modal.component.css',
})
export class CaravaneModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  form: FormGroup;
  formValid: boolean = false;
  trajets: Trajet[] = [];
  moments: Moment[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private trajetService: TrajetService,
    private momentService: MomentService
  ) {
    this.getTrajets();
    this.getMoments();
    this.form = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', Validators.required],
      prix: ['', Validators.required],
      telAgent: ['', [Validators.required, Validators.pattern('^([0-9]{9})$')]],
      trajet: ['', Validators.required],
      moment: ['', Validators.required],
      estPubliee: [false],
      estOuverte: [false],
    });
  }

  ngOnInit(): void {
    this.form.statusChanges.subscribe(() => {
      this.formValid = this.form.valid;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    // construire l’objet comme tu veux
    const caravane = {
      libelle: data.libelle,
      date: data.date,
      prix: data.prix,
      telAgent: data.telAgent,
      trajet: { id: data.trajet },
      moment: { id: data.moment },
      estPubliee: data.estPubliee || false,
      estOuverte: data.estOuverte || false,
    };

    this.onAdd.emit(caravane);
    this.closeModal();
  }

  closeModal(): void {
    this.sharedService.closeModal('caravaneModal');
    this.form.reset();
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

  getMoments(): void {
    this.momentService.getAll().subscribe({
      next: (res) => {
        this.moments = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des moments', err);
      },
    });
  }
}
