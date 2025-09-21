import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../core/services/alert/alert.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm: FormGroup;
  private apiUrl = `${environment.apiUrl}/api/contact-messages`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.http.post<any>(this.apiUrl, this.contactForm.value).subscribe({
      next: () => {
        this.alertService.showToast(
          '🎉 Votre demande a été soumis avec succès !'
        );
        this.contactForm.reset();
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error(err);
      },
    });
  }
}
