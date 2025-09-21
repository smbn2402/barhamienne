import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private userRoles: string[] = [];

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.userRoles = user?.roles?.map((r: any) => r.name) || [];
    });
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  /**
   * Vérifie si l'utilisateur a au moins un des rôles spécifiés
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.userRoles.includes(role));
  }

  /**
   * Retourne tous les rôles de l'utilisateur
   */
  getRoles(): string[] {
    return this.userRoles;
  }
}
