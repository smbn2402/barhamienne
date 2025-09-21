import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SharedService } from './core/services/shared/shared.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Barhamienne Transport';

  constructor(public router: Router, public sharedService: SharedService, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.sharedService.show();
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // window.scrollTo({ top: 0, behavior: 'smooth' });

        // Attendre le chargement complet des images avant de masquer le loader
        this.waitForImagesToLoad().then(() => {
          this.sharedService.hide();
           this.cdr.detectChanges();
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationCancel || event instanceof NavigationError
        )
      )
      .subscribe(() => {
        this.sharedService.hide(); // masquer si erreur ou annulation de navigation
      });
  }

  waitForImagesToLoad(timeoutMs = 7000): Promise<void> {
    const images = Array.from(document.images);
    const loadingPromises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // on ignore les erreurs
      });
    });

    const timeout = new Promise<void>((resolve) =>
      setTimeout(() => resolve(), timeoutMs)
    );

    return Promise.race([
      Promise.all(loadingPromises).then(() => {}),
      timeout,
    ]);
  }
}
