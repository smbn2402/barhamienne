import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../../../core/services/utilisateur/utilisateur.service';

@Component({
  selector: 'app-utilisateur-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './utilisateur-modal.component.html',
  styleUrl: './utilisateur-modal.component.css',
})
export class UtilisateurModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Input() utilisateur: any = {};
  @Input() isEditMode: boolean = false;
  form: FormGroup;
  formValid: boolean = false;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private utilisateurService: UtilisateurService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^([0-9]{9})$')]],
      roles: this.fb.array([], Validators.required),
    });
  }

  get rolesFormArray(): FormArray<FormControl<boolean>> {
    return this.form.get('roles') as FormArray<FormControl<boolean>>;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['utilisateur'] && this.utilisateur) {
      this.form.patchValue({
        name: this.utilisateur?.name || '',
        email: this.utilisateur?.email || '',
        phone: this.utilisateur?.phone || '',
      });
    } else {
      this.form.reset();
    }
  }

  getRoles(): void {
    this.utilisateurService.getRoles().subscribe({
      next: (res) => {
        this.roles = res;
        const rolesControls = res.map(() => this.fb.control(false));
        this.form.setControl(
          'roles',
          this.fb.array(rolesControls, this.minSelectedRoles(1))
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rôles', err);
      },
    });
  }

  minSelectedRoles(min = 1) {
    return (control: import('@angular/forms').AbstractControl) => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map((ctrl) => ctrl.value)
        .reduce((acc, selected) => (selected ? acc + 1 : acc), 0);

      return totalSelected >= min ? null : { required: true };
    };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    const selectedRoles = this.form.value.roles
      .map((checked: boolean, i: number) =>
        checked ? this.roles[i].name : null
      )
      .filter((v: string | null) => v !== null);

    const newUtilisateur = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      roles: selectedRoles,
    };

    this.onAdd.emit(newUtilisateur);
    this.closeModal();
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
  }
}
