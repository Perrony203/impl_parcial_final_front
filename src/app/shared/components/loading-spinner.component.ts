import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Why: Reusable loading spinner with configurable size
 * Usage: <app-loading-spinner [size]="'lg'" [message]="'Loading...'" />
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8">
      <span [class]="'loading loading-spinner ' + sizeClass()"></span>
      @if (message) {
        <p class="mt-4 text-base-content/60">{{ message }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;

  sizeClass(): string {
    const sizes = {
      sm: 'loading-sm',
      md: 'loading-md',
      lg: 'loading-lg'
    };
    return sizes[this.size];
  }
}
