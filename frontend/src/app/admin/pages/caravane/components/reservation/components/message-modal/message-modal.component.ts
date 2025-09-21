import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../../../../../core/services/shared/shared.service';

@Component({
  selector: 'app-message-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css',
})
export class MessageModalComponent {
  @Input() selectedReservations: any[] = [];
  @Output() onSend: EventEmitter<{ message: string; reservations: any[] }> =
    new EventEmitter();

  messageContent: string = '';

  constructor(private sharedService: SharedService) {}

  sendMessage() {
    if (!this.messageContent.trim()) return;
    this.onSend.emit({
      message: this.messageContent,
      reservations: this.selectedReservations,
    });

    this.closeModal();
  }

  closeModal(): void {
    this.sharedService.closeModal('messageModal');
    this.messageContent = '';
  }
}
