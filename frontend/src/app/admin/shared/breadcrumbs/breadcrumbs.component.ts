import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

// breadcrumb.model.ts
export interface Breadcrumb {
  label: string;
  url?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent {
  @Input() title!: string;
  @Input() breadcrumbs: Breadcrumb[] = [];
}
