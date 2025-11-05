import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

/**
 * Why: Shows current user and provides logout functionality
 * Displays role badge for easy identification (superadmin vs daemon)
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private authService = inject(AuthService);

  // Why computed: Auto-updates when auth state changes
  currentUser = this.authService.currentUser;

  // Why computed: Derives role badge styling from user data
  roleBadgeClass = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'superadmin' ? 'badge-primary' : 'badge-secondary';
  });

  /**
   * Toggle mobile sidebar
   * Why: Mobile navigation drawer control
   */
  toggleSidebar(): void {
    const drawer = document.getElementById('sidebar-drawer') as HTMLInputElement;
    if (drawer) {
      drawer.checked = !drawer.checked;
    }
  }

  /**
   * Logout user
   * Why: Clears auth state and redirects to login
   */
  logout(): void {
    this.authService.logout();
  }
}
