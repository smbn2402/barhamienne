import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenericModalComponent } from '../../../shared/generic-modal/generic-modal.component';
import { Moment } from '../../../../core/interfaces/moment';
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
  selector: 'app-moment-modal',
  imports: [GenericModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './moment-modal.component.html',
  styleUrl: './moment-modal.component.css',
})
export class MomentModalComponent {
  @Output() onAdd = new EventEmitter<Moment>();
  form: FormGroup;
  @Input() moment: any = {};
  @Input() isEditMode: boolean = false;
  formValid: any;
  isLoading: boolean = true;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {
    this.form = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(2)]]
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
    if (changes['moment'] && this.moment) {
      this.form.patchValue({
        libelle: this.moment.libelle || ''
      });
    } else {
      this.form.patchValue({
        libelle: ''
      });
    }
  }

  checkFormValid(form: NgForm) {
    this.formValid = form.valid;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const moment: Moment = {
        id: this.moment.id || 0,
        libelle: this.form.get('libelle')?.value
      };
      this.onAdd.emit(moment);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
    this.isEditMode = false;
  }
}
