import { Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./../shared/footer/footer.component";

@Component({
  selector: "app-client-wrapper",
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent
  ],
  templateUrl: "./client-wrapper.component.html",
  styleUrl: "./client-wrapper.component.css",
  encapsulation: ViewEncapsulation.None,
})
export class ClientWrapperComponent {}
