import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  imageSrc: string = 'img/barhamienne1.jpeg'; // Image par défaut

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        if (result.matches) {
          this.imageSrc = 'img/barhamienne1.jpeg'; // Image pour ordinateur
        } else {
          this.imageSrc = 'img/barhamienne2.jpeg'; // Image pour mobile
        }
      });
  }
}
