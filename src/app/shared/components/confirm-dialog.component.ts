import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Why: Prevents accidental deletions with confirmation
 * Usage: <app-confirm-dialog [isOpen]="showDialog" [title]="'Delete User?'" (confirm)="delete()" (cancel)="closeDialog()" />
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <!-- Modal Backdrop -->
      <div class="modal modal-open">
        <div class="modal-box">
          <!-- Title -->
          <h3 class="font-bold text-lg mb-4">{{ title }}</h3>

          <!-- Message -->
          <p class="text-base-content/70 mb-6">{{ message }}</p>

          <!-- Actions -->
          <div class="modal-action">
            <button
              class="btn btn-ghost"
              (click)="onCancel()"
              [disabled]="isProcessing"
            >
              Cancel
            </button>
            <button
              [class]="'btn ' + confirmButtonClass"
              (click)="onConfirm()"
              [disabled]="isProcessing"
            >
              @if (isProcessing) {
                <span class="loading loading-spinner loading-sm"></span>
              }
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() confirmButtonClass = 'btn-error'; // Why: Red for destructive actions
  @Input() isProcessing = false; // Why: Show spinner during async operations

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
