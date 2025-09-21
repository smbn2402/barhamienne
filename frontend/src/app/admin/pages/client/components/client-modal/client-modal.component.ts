import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { GenericModalComponent } from "../../../../shared/generic-modal/generic-modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './client-modal.component.html',
  styleUrl: './client-modal.component.css',
})
export class ClientModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Input() client: any = {};
  @Input() isEditMode: boolean = false;
  form: FormGroup;
  formValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      tel: ['', [Validators.required, Validators.pattern('^([0-9]{9})$')]]
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
    if (changes['client'] && this.client) {
      this.form.patchValue({
        prenom: this.client?.prenom || '',
        nom: this.client?.nom || '',
        tel: this.client?.tel || ''
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
    const newClient = {
        prenom: formData.prenom,
        nom: formData.nom,
        tel: formData.tel,
    };

    // Envoie du newClient
    this.onAdd.emit(newClient);
    this.closeModal();
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }
}
