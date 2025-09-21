import { Component } from '@angular/core';
import { SharedService } from '../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-overlay.component.html',
  styleUrl: './loader-overlay.component.css',
})
export class LoaderOverlayComponent {
  constructor(public sharedService: SharedService) {}
}
