import { Component } from "@angular/core";
import { TrajetComponent } from "./components/trajet/trajet.component";
import { AboutComponent } from "./components/about/about.component";
import { TestimonialComponent } from "./components/testimonial/testimonial.component";
import { WhyUsComponent } from "./components/why-us/why-us.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { YobanteProcessComponent } from "./components/yobante-process/yobante-process.component";
import { BlogComponent } from "./components/blog/blog.component";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    TrajetComponent,
    AboutComponent,
    TestimonialComponent,
    WhyUsComponent,
    HeaderComponent,
    YobanteProcessComponent,
    BlogComponent
],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {}
