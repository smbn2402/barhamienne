import { Component } from '@angular/core';
import { TrajetService } from '../../../core/services/trajet/trajet.service';
import { Trajet } from '../../../core/interfaces/trajet';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Moment } from '../../../core/interfaces/moment';
import { MomentService } from '../../../core/services/moment/moment.service';
import { CaravaneService } from '../../../core/services/caravane/caravane.service';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RoleService } from '../../../core/services/role/role.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  trajets: Trajet[] = [];
  moments: Moment[] = [];
  isLoading: boolean = true;
  activeTrajetId: number | null = null;
  activeMomentId: number | null = null;
  currentUser: any;

  constructor(
    private router: Router,
    private trajetService: TrajetService,
    private momentService: MomentService,
    private caravaneService: CaravaneService,
    private authService: AuthService,
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTrajets();
    this.getMoments();
    this.updateActiveNav();
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });

    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      $('body').removeClass('nav_open'); // Ferme la sidebar sur mobile
    });
  }

  hasRole(roles: string[]): boolean {
    if (!this.currentUser || !this.currentUser.roles) return false;
    return roles.some((role) => this.currentUser.roles.includes(role));
  }

  updateActiveNav(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const match = url.match(/\/(?:reservations|yobantes)\/(\d+)/);

        if (match) {
          const caravaneId = match[1];
          this.caravaneService
            .getById(Number(caravaneId))
            .subscribe((caravane) => {
              this.activeTrajetId = caravane.trajet?.id;
              this.activeMomentId = caravane.moment?.id;
            });
        } else {
          // Si on est dans /caravanes/:trajetId/:momentId
          const parts = url.split('/');
          if (parts[2] === 'caravanes' && parts.length >= 4) {
            this.activeTrajetId = Number(parts[3]);
            this.activeMomentId = Number(parts[4]);
          } else {
            this.activeTrajetId = null;
            this.activeMomentId = null;
          }
        }
      });
  }

  getTrajets(): void {
    this.trajetService.getAll().subscribe({
      next: (data) => {
        this.trajets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement trajets', err),
          (this.isLoading = false);
      },
    });
  }

  getMoments(): void {
    this.momentService.getAll().subscribe({
      next: (data) => {
        this.moments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement moments', err),
          (this.isLoading = false);
      },
    });
  }
}
