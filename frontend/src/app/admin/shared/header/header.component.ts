import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user$: typeof this.authService.user$;
  salutation: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    this.salutation = this.getSalutation();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    $(document).on('click', '.toggle-sidebar', function () {
      $('body').toggleClass('sidebar_minimize');
    });

    $(document).on('click', '.sidenav-toggler', function () {
      $('body').toggleClass('nav_open');
    });

    $(document).on('click', '.topbar-toggler', function () {
    $('html').toggleClass('topbar_open');
  });

    // $(document).on('click', '.topbar-toggler', function () {
    //   $('html').toggleClass('nav_open');
    // });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // ou la page d’accueil publique
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion :', err);
      },
    });
  }

  getSalutation(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 18) {
      return 'Bonjour';
    } else {
      return 'Bonsoir';
    }
  }
}
