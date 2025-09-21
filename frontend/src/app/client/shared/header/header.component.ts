import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-header',
  imports: [NgClass],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @ViewChild('offcanvasNavbar', { static: true }) offcanvasRef!: ElementRef;

  @Input() logoSrc: string = 'logo.png';
  @Input() heroImageSrc: string = 'barhamienne.jpeg';
  @Input() heroTitle: string = 'Des solutions de transport modernes et fiables';
  // @Input()
  // heroText: string = `Barhamienne Transport vous propose des services de
  // logistique et de transport adaptés à vos besoins, avec une
  // approche personnalisée et des partenariats à long terme
  // basés sur la confiance et l'efficacité.`;
  @Input()
  heroText: string = `Barhamienne Transport vous propose des services de
logistique, de transport et d’envoi de colis - Yobanté, adaptés à vos besoins.
Nous misons sur une approche personnalisée et des partenariats à long terme,
fondés sur la confiance, la fiabilité et l’efficacité.`;

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  onNavigate(path: string): void {
    const offcanvasEl = this.offcanvasRef?.nativeElement;

    // Vérifie si le offcanvas est visible (affiché dans le DOM)
    const isOffcanvasVisible = offcanvasEl?.classList.contains('show');

    if (offcanvasEl && isOffcanvasVisible) {
      const instance =
        bootstrap.Offcanvas.getInstance(offcanvasEl) ||
        new bootstrap.Offcanvas(offcanvasEl);
      instance.hide();

      // Naviguer après fermeture
      offcanvasEl.addEventListener(
        'hidden.bs.offcanvas',
        () => {
          this.router.navigate([path]).then(() => {
            document.body.classList.remove('offcanvas-backdrop', 'modal-open');
            document.body.style.overflow = 'auto';
          });
        },
        { once: true }
      );
    } else {
      // Pas de offcanvas visible → navigation directe
      this.router.navigate([path]);
    }
  }
}
