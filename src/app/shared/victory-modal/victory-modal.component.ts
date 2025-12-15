import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VictoryStat {
  label: string;
  value: string | number;
  icon?: string;
}

export interface VictoryButton {
  label: string;
  icon?: string;
  action: string;
  style?: 'primary' | 'secondary';
}

@Component({
  selector: 'app-victory-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './victory-modal.component.html',
  styleUrls: ['./victory-modal.component.css']
})
export class VictoryModalComponent {
  @Input() show = false;
  @Input() title = 'Puzzle Completed!';
  @Input() message = '';
  @Input() stats: VictoryStat[] = [];
  @Input() buttons: VictoryButton[] = [];
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<string>();

  onClose(): void {
    this.closeModal.emit();
  }

  onButtonClick(action: string): void {
    this.buttonClick.emit(action);
  }

  onOverlayClick(): void {
    this.onClose();
  }
}
