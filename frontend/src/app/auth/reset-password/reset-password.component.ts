import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');
    this.resetForm.patchValue({ token, email });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;
    this.isLoading = true;
    this.authService.resetPassword(this.resetForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.showToast(`🎉 Mot de passe réinitialisé avec succès`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur inconnue';
        this.alertService.showToast(`❌ ${this.error}`, 'error');
        console.error('Erreur lors de la réinitialisation', err);
        this.isLoading = false;
      },
    });
  }
}
