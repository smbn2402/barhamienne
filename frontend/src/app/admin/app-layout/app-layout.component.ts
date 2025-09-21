import { Component, ViewEncapsulation } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AlertService } from '../../core/services/alert/alert.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppLayoutComponent {
  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) {
    // Constructor logic can go here if needed
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class if you want to use this lifecycle hook.
    this.authService.loginSuccess$.subscribe((status) => {
      if (status) {
        this.alertService.showToast(`🎉 Vous êtes actuellement connecté !`);
        this.authService.setLoginSuccess(false); // Réinitialiser pour éviter les doublons
      }
    });
  }
}
