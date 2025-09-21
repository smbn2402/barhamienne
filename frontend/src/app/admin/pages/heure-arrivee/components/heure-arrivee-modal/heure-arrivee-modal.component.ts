import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ArriveeMoment } from '../../../../../core/interfaces/arrivee_moment';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { CommonModule } from '@angular/common';
import { ArriveeService } from '../../../../../core/services/arrivee/arrivee.service';
import { Arrivee } from '../../../../../core/interfaces/arrivee';

@Component({
  selector: 'app-heure-arrivee-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './heure-arrivee-modal.component.html',
  styleUrl: './heure-arrivee-modal.component.css',
})
export class HeureArriveeModalComponent {
  @Output() onAdd = new EventEmitter<ArriveeMoment>();
  @Input() momentId!: number;
  @Input() trajetId!: number;
  form: FormGroup;
  @Input() arriveeMoment: any = {
    id: 0,
    arrivee: { libelle: '' },
    moment: { libelle: '' },
    heureArrivee: '',
  };
  @Input() isEditMode: boolean = false;
  formValid: any;
  isLoading: boolean = true;
  deprts: Arrivee[] = [];

  constructor(
    private fb: FormBuilder,
    private arriveeService: ArriveeService,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      arrivee: ['', Validators.required],
      heureArrivee: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getArriveesByTrajet(this.trajetId);
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['arriveeMoment'] && this.arriveeMoment) {
      this.form.patchValue({
        arrivee: this.arriveeMoment.arrivee?.id || '',
        heureArrivee: this.arriveeMoment.heureArrivee || '',
      });
    } else {
      this.form.patchValue({
        arrivee: '',
        heureArrivee: '',
      });
    }
  }

  checkFormValid(form: NgForm) {
    this.formValid = form.valid;
  }

  getArriveesByTrajet(trajetId: number): void {
    this.arriveeService.getByTrajet(trajetId).subscribe({
      next: (data) => {
        this.deprts = data;
         this.sharedService.hide();
this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement des départs', err);
         this.sharedService.hide();
this.isLoading = false;
      },
    });
  }

  addArriveeMoment(): void {
    if (this.form.valid) {
      const arriveeMoment: ArriveeMoment = {
        id: this.arriveeMoment.id || 0,
        arrivee: {
          id: this.form.get('arrivee')?.value,
          libelle: '',
          trajet: {
            id: this.trajetId,
            libelle: '',
            libelleWolof: '',
            prix: 3500,
          },
        },
        moment: {
          id: this.momentId,
          libelle: '',
        },
        heureArrivee: this.form.get('heureArrivee')?.value,
      };
      console.log('Arrivee Moment to add:', arriveeMoment);
      this.onAdd.emit(arriveeMoment);
      this.form.reset();
    }
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.onAdd.emit(this.arriveeMoment);
      this.form.reset;
    }
  }
}
