import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../shared/models';

/**
 * Why standalone: Angular 20 modern approach - no need for modules
 * Why signals: Reactive state management for loading/error states
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Why FormsModule: Template-driven forms with ngModel
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form data
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  // State signals
  // Why signals: Reactive updates trigger re-renders automatically
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  /**
   * Handle login submission
   * Why async: Waits for API response before navigating
   */
  onLogin(): void {
    // Clear previous errors
    this.errorMessage.set(null);

    // Validation
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }

    // Set loading state
    this.isLoading.set(true);

    // Call auth service
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Success - navigate to dashboard
        // Why: User is now authenticated with token stored
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // Failure - show error message
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please check your credentials.');
        console.error('Login error:', error);
      }
    });
  }

  /**
   * Quick fill for testing
   * Why: Convenient during development to test different roles
   */
  fillAdmin(): void {
    this.credentials = { username: 'admin', password: 'admin123' };
  }

  fillDaemon(): void {
    this.credentials = { username: 'daemon1', password: 'daemon123' };
  }
}
