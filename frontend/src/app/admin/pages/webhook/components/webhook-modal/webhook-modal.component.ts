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
import { WebhookService } from '../../../../../core/services/webhook/webhook.service';

@Component({
  selector: 'app-webhook-modal',
  imports: [GenericModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './webhook-modal.component.html',
  styleUrl: './webhook-modal.component.css',
})
export class WebhookModalComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Input() webhook: any = {};
  @Input() isEditMode: boolean = false;
  form: FormGroup;
  formValid: boolean = false;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      url: ['', [Validators.required, Validators.minLength(2)]]
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
    if (changes['webhook'] && this.webhook) {
      this.form.patchValue({
        url: this.webhook?.url || '',
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
    const  url = formData.url;

    this.onAdd.emit(url);
    this.closeModal();
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.form.reset();
  }
}
