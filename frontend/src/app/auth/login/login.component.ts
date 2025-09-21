import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  isLoading = false;
  isCheckingAuth = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
         this.authService.setLoginSuccess(true);
        this.router.navigate(['/admin/dashboard']);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Email ou mot de passe incorrect';
        this.alertService.showToast(`❌ ${this.error}`, 'error');
        console.error('Échec de connexion', err);
        this.isLoading = false;
      },
    });
  }
}
