import { Component } from '@angular/core';
import { ThemeComponent } from "../theme/theme.component";
import { HeaderComponent } from "../header/header.component";
import { SvgComponent } from "../svg/svg.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  imports: [ThemeComponent, HeaderComponent, SvgComponent, RouterOutlet],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.css'
})
export class WrapperComponent {

}
