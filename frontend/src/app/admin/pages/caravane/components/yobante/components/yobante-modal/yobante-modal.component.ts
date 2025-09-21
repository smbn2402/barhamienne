import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModalComponent } from '../../../../../../shared/generic-modal/generic-modal.component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Caravane } from '../../../../../../../core/interfaces/caravane';
import { DepartMoment } from '../../../../../../../core/interfaces/depart_moment';
import { Yobante } from '../../../../../../../core/interfaces/yobante';
import { DepartMomentService } from '../../../../../../../core/services/depart-moment/depart-moment.service';
import { SharedService } from '../../../../../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yobante-modal',
  standalone: true,
  imports: [
    GenericModalComponent,
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './yobante-modal.component.html',
  styleUrl: './yobante-modal.component.css',
})
export class YobanteModalComponent {
  @Output() onAdd = new EventEmitter<Yobante>();
  @Input() caravane: any = {};
  @Input() newYobante: any = {
    id: 0,
    prenomExp: '',
    nomExp: '',
    telExp: '',
    typeColis: '',
    caravane: { id: 0, moment: { libelle: '' } },
    departMoment: { id: 0, depart: { libelle: '' } },
    retrait: 'campus 1 entre Village B et Village C',
    prenomDest: '',
    nomDest: '',
    telDest: '',
  };
  @Input() departMoments: DepartMoment[] = [];
  @Input() caravanes: Caravane[] = [];
  @Input() isEditMode: boolean = false;
   form: FormGroup;
  formValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private departMomentService: DepartMomentService,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      expediteur: this.fb.group({
        firstName: [this.newYobante.prenomEx, Validators.required],
        lastName: ['', Validators.required],
        tel: ['', Validators.required],
      }),
      colis: this.fb.group({
        type_colis: ['', Validators.required],
        depot: ['', Validators.required],
        retrait: [
          { value: 'campus 1 entre Village B et Village C', disabled: true },
          Validators.required,
        ],
      }),
      destinataire: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        tel: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDepartMomentsByCaravane();
    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  ngOnChanges() {
    if (this.newYobante && this.form) {
      this.form.patchValue({
        expediteur: {
          firstName: this.newYobante.prenomExp,
          lastName: this.newYobante.nomExp,
          tel: this.newYobante.telExp,
        },
        colis: {
          type_colis: this.newYobante.typeColis,
          depot: this.newYobante.departMoment?.id || '',
          retrait: this.newYobante.retrait,
        },
        destinataire: {
          firstName: this.newYobante.prenomDest,
          lastName: this.newYobante.nomDest,
          tel: this.newYobante.telDest,
        },
      });
    }

    this.form.statusChanges.subscribe((status) => {
      this.formValid = this.form.valid;
    });
  }

  getDepartMomentsByCaravane(): void {
    this.departMomentService.getByCaravane(this.caravane.id).subscribe({
      next: (res) => {
        this.departMoments = res;
      },
      error: (err) => {
        console.error('Erreur de chargement des lieux de dépôt :', err);
        this.departMoments = [];
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();
      const yobante: Yobante = {
        id: 0,
        prenomExp: this.form.get('expediteur.firstName')?.value,
        nomExp: this.form.get('expediteur.lastName')?.value,
        telExp: this.form.get('expediteur.tel')?.value,
        typeColis: this.form.get('colis.type_colis')?.value,
        caravane: this.caravane.id,
        departMoment: this.form.get('colis.depot')?.value,
        retrait: rawForm.colis.retrait,
        prenomDest: this.form.get('destinataire.firstName')?.value,
        nomDest: this.form.get('destinataire.lastName')?.value,
        telDest: this.form.get('destinataire.tel')?.value,
      };
      this.onAdd.emit(yobante);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }
}
