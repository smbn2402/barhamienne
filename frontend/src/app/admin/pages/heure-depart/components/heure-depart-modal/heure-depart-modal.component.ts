import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DepartMoment } from '../../../../../core/interfaces/depart_moment';
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
import { DepartService } from '../../../../../core/services/depart/depart.service';
import { Depart } from '../../../../../core/interfaces/depart';

@Component({
  selector: 'app-heure-depart-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './heure-depart-modal.component.html',
  styleUrl: './heure-depart-modal.component.css',
})
export class HeureDepartModalComponent {
  @Output() onAdd = new EventEmitter<DepartMoment>();
  @Input() momentId!: number;
  @Input() trajetId!: number;
  form: FormGroup;
  @Input() departMoment: any = {
    id: 0,
    depart: { libelle: '' },
    moment: { libelle: '' },
    heureDepart: '',
  };
  @Input() isEditMode: boolean = false;
  formValid: any;
  isLoading: boolean = true;
  deprts: Depart[] = [];

  constructor(
    private fb: FormBuilder,
    private departService: DepartService,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      depart: ['', Validators.required],
      heureDepart: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDepartsByTrajet(this.trajetId);
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departMoment'] && this.departMoment) {
      this.form.patchValue({
        depart: this.departMoment.depart?.id || '',
        heureDepart: this.departMoment.heureDepart || '',
      });
    } else {
      this.form.patchValue({
        depart: '',
        heureDepart: '',
      });
    }
  }

  checkFormValid(form: NgForm) {
    this.formValid = form.valid;
  }

  getDepartsByTrajet(trajetId: number): void {
    this.departService.getByTrajet(trajetId).subscribe({
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

  addDepartMoment(): void {
    if (this.form.valid) {
      const departMoment: DepartMoment = {
        id: this.departMoment.id || 0,
        depart: {
          id: this.form.get('depart')?.value,
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
        heureDepart: this.form.get('heureDepart')?.value,
      };
      console.log('Depart Moment to add:', departMoment);
      this.onAdd.emit(departMoment);
      this.form.reset();
    }
  }

  closeModal(): void {
    this.sharedService.closeModal('addModal');
    this.form.reset();
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.onAdd.emit(this.departMoment);
      this.form.reset;
    }
  }
}
