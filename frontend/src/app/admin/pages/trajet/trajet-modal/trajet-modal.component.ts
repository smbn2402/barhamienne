import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../shared/generic-modal/generic-modal.component';
import { Trajet } from '../../../../core/interfaces/trajet';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trajet-modal',
  imports: [GenericModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './trajet-modal.component.html',
  styleUrl: './trajet-modal.component.css',
})
export class TrajetModalComponent {
  @Output() onAdd = new EventEmitter<Trajet>();
  form: FormGroup;
  @Input() trajet: any = {};
  @Input() isEditMode: boolean = false;
  formValid: any;
  isLoading: boolean = true;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {
    this.form = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      libelleWolof: ['', [Validators.required, Validators.minLength(2)]],
      prix: [0, [Validators.required, Validators.min(0)]],
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
    if (changes['trajet'] && this.trajet) {
      this.form.patchValue({
        libelle: this.trajet.libelle || '',
        libelleWolof: this.trajet.libelleWolof || '',
        prix: this.trajet.prix || '',
      });
    } else {
      this.form.patchValue({
        libelle: '',
        libelleWolof: '',
        prix: ''
      });
    }
  }

  checkFormValid(form: NgForm) {
    this.formValid = form.valid;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const trajet: Trajet = {
        id: this.trajet.id || 0,
        libelle: this.form.get('libelle')?.value,
        libelleWolof: this.form.get('libelleWolof')?.value,
        prix: this.form.get('prix')?.value,
      };
      this.onAdd.emit(trajet);
      this.form.reset();
    }
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }
}
