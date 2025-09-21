import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-generic-modal",
  imports: [CommonModule],
  templateUrl: "./generic-modal.component.html",
  styleUrl: "./generic-modal.component.css",
})
export class GenericModalComponent {
  @Input() modalId: string = "";
  @Input() title: string = "";
  @Input() description: string = "";
  @Input() button: string = "";
  @Input() formTemplate: any;
  @Input() isFormValid: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
