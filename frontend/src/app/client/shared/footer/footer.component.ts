import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-footer",
  imports: [],
  standalone: true,
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
