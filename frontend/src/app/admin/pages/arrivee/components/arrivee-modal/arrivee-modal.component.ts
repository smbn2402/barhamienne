import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { Arrivee } from '../../../../../core/interfaces/arrivee';
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
  selector: 'app-arrivee-modal',
  imports: [GenericModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './arrivee-modal.component.html',
  styleUrl: './arrivee-modal.component.css',
})
export class ArriveeModalComponent {
  @Output() onAdd = new EventEmitter<Arrivee>();
  @Input() trajetId!: number;
  form: FormGroup;
  @Input() arrivee: any = {};
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
    if (changes['arrivee'] && this.arrivee) {
      this.form.patchValue({
        libelle: this.arrivee.libelle || '',
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

  addArriveeMoment(): void {
    if (this.form.valid) {
      const arrivee: Arrivee = {
        id: this.arrivee.id || 0,
        libelle: this.form.get('libelle')?.value,
        trajet: {
          id: this.trajetId,
          libelle: '',
          libelleWolof: '',
          prix: 3500,
        },
      };
      this.onAdd.emit(arrivee);
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
      this.onAdd.emit(this.arrivee);
      this.form.reset;
    }
  }
}
