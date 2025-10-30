import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loginForm!: FormGroup;
  loginError: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    // Initialize reactive form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    // Reset error message
    this.loginError = null;

    // Check form validity
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Get form values
    const credentials = this.loginForm.value;

    // Call authService.login
    this.authService.login(credentials).subscribe({
      next: () => {
        // On success, navigate to dashboard
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // On error, display error message
        this.isLoading = false;
        this.loginError = error?.message || 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  // Helper methods for template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
