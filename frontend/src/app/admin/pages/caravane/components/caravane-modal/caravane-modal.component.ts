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

@Component({
  selector: 'app-caravane-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './caravane-modal.component.html',
  styleUrl: './caravane-modal.component.css',
})
export class CaravaneModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Input() trajetId!: number;
  @Input() momentId!: number;
  @Input() caravane: any = {};
  @Input() isEditMode: boolean = false;
  form: FormGroup;
  formValid: boolean = false;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {
    this.form = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', Validators.required],
      prix: ['', Validators.required],
      telAgent: ['', [Validators.required, Validators.pattern('^([0-9]{9})$')]],
      estPubliee: [false],
      estOuverte: [false],
    });
  }

  ngOnInit(): void {
    this.form.statusChanges.subscribe(() => {
      this.formValid = this.form.valid;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caravane'] && this.caravane) {
      this.form.patchValue({
        libelle: this.caravane.libelle || '',
        date: this.caravane.date || '',
        prix: this.caravane.prix || '',
        telAgent: this.caravane.telAgent || '',
        estPubliee: this.caravane.estPubliee || false,
        estOuverte: this.caravane.estOuverte || false,
      });
    }
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
      trajet: { id: this.trajetId },
      moment: { id: this.momentId },
      estPubliee: data.estPubliee || false,
      estOuverte: data.estOuverte || false,
    };

    this.onAdd.emit(caravane);
    this.closeModal();
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }
}
