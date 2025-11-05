import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Why: Reusable error alert with optional dismiss
 * Usage: <app-error-message [message]="errorMsg" (dismiss)="clearError()" />
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ message }}</span>
        @if (dismissible) {
          <button class="btn btn-sm btn-ghost" (click)="onDismiss()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }
      </div>
    }
  `
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
  @Input() dismissible = true;
  @Output() dismiss = new EventEmitter<void>();

  onDismiss(): void {
    this.dismiss.emit();
  }
}
