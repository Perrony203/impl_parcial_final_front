import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private readonly authService = inject(Auth);

  userName: string = 'User';
  userRole: string | null = null;

  ngOnInit(): void {
    // Get user role from auth service
    this.userRole = this.authService.getUserRole();

    // Try to get user info
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userName = user.name || user.email || 'User';
      },
      error: () => {
        // If user info fails, just use default
      }
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
