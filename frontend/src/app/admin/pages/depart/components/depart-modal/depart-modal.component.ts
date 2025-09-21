import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { Depart } from '../../../../../core/interfaces/depart';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depart-modal',
  imports: [GenericModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './depart-modal.component.html',
  styleUrl: './depart-modal.component.css',
})
export class DepartModalComponent {
  @Output() onAdd = new EventEmitter<Depart>();
  @Input() trajetId!: number;
  form: FormGroup;
  @Input() depart: any = {};
  @Input() isEditMode: boolean = false;
  formValid: any;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      libelle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['depart'] && this.depart) {
      this.form.patchValue({
        libelle: this.depart.libelle || '',
      });
    } else {
      this.form.patchValue({
        libelle: '',
      });
    }
  }

  checkFormValid(form: NgForm) {
    this.formValid = form.valid;
  }

  addDepartMoment(): void {
    if (this.form.valid) {
      const depart: Depart = {
        id: this.depart.id || 0,
        libelle: this.form.get('libelle')?.value,
        trajet: {
          id: this.trajetId,
          libelle: '',
          libelleWolof: '',
          prix: 3500,
        },
      };
      this.onAdd.emit(depart);
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
      this.onAdd.emit(this.depart);
      this.form.reset;
    }
  }
}
