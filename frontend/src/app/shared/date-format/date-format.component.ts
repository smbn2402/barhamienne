import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-format',
  standalone: true,
  imports: [],
  templateUrl: './date-format.component.html',
  styleUrl: './date-format.component.css'
})
export class DateFormatComponent {
  @Input() date!: Date; // Reçoit la date en format string

  get formattedDate(): string {
    return formatDate(this.date, 'EEEE d MMM', 'fr-FR');
  }
}
