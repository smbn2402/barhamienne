import { Component } from '@angular/core';
import { CaravaneService } from '../../../../../core/services/caravane/caravane.service';
import { CommonModule } from '@angular/common';
import { Caravane } from '../../../../../core/interfaces/caravane';
import { DateFormatComponent } from '../../../../../shared/date-format/date-format.component';
import { Router } from '@angular/router';
import { SharedService } from '../../../../../core/services/shared/shared.service';

@Component({
  selector: 'app-caravane-stats',
  imports: [CommonModule, DateFormatComponent],
  templateUrl: './caravane-stats.component.html',
  styleUrl: './caravane-stats.component.css',
})
export class CaravaneStatsComponent {
  caravanes: Caravane[] = [];
  selectedCaravane: any = {};

  constructor(
    private caravaneService: CaravaneService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.show();
    this.caravaneService.getCaravaneStats().subscribe({
      next: (res) => {
        this.caravanes = res;
        this.sharedService.hide();
      },
      error: (err) => {
        console.error('Error fetching caravane stats:', err);
        this.sharedService.hide();
      },
    });
  }

  voirReservations(caravaneId: number) {
    this.router.navigate(['/reservations', caravaneId]);
  }

  voirYobantes(caravaneId: number) {
    this.router.navigate(['/yobantes', caravaneId]);
  }
}
