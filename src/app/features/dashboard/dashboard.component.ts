import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { VictimService } from '../../core/services/api/victim.service';
import { AttemptService } from '../../core/services/api/attempt.service';
import { ReportService } from '../../core/services/api/report.service';
import { RewardService } from '../../core/services/api/reward.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

/**
 * Why: Dashboard provides quick overview and navigation
 * Shows stats relevant to user's role (superadmin sees more)
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private victimService = inject(VictimService);
  private attemptService = inject(AttemptService);
  private reportService = inject(ReportService);
  private rewardService = inject(RewardService);
  private router = inject(Router);

  // Why signals: Reactive state management
  isLoading = signal(true);
  currentUser = this.authService.currentUser;
  userRole = computed(() => this.currentUser()?.role);

  // Stats signals
  stats = signal({
    totalVictims: 0,
    activeAttempts: 0,
    pendingReports: 0,
    myRewards: 0
  });

  /**
   * Load dashboard data on init
   * Why: Fetches stats from all relevant services
   */
  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load all dashboard statistics
   * Why: Parallel requests for faster loading
   */
  private loadDashboardData(): void {
    this.isLoading.set(true);
    const username = this.currentUser()?.username;

    // Load victims count
    this.victimService.getVictims({ page: 1, limit: 1 }).subscribe({
      next: (response) => {
        this.stats.update(s => ({ ...s, totalVictims: response.pagination.totalItems }));
      },
      error: (err) => console.error('Error loading victims:', err)
    });

    // Load active attempts count (In_progress state)
    const attemptParams = username ? { page: 1, limit: 100, daemonUsername: username } : { page: 1, limit: 100 };
    this.attemptService.getAttempts(attemptParams).subscribe({
      next: (response) => {
        const activeCount = response.data.filter(a => a.state === 'In_progress').length;
        this.stats.update(s => ({ ...s, activeAttempts: activeCount }));
      },
      error: (err) => console.error('Error loading attempts:', err)
    });

    // Load pending reports (superadmin only)
    if (this.userRole() === 'superadmin') {
      this.reportService.getReports({ page: 1, limit: 1 }).subscribe({
        next: (response) => {
          this.stats.update(s => ({ ...s, pendingReports: response.pagination.totalItems }));
        },
        error: (err) => console.error('Error loading reports:', err)
      });
    }

    // Load user's rewards count
    if (username) {
      this.rewardService.getRewards({ page: 1, limit: 100, daemonUsername: username }).subscribe({
        next: (response) => {
          const rewardCount = response.data.filter(r => r.type === 'reward').length;
          this.stats.update(s => ({ ...s, myRewards: rewardCount }));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading rewards:', err);
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  /**
   * Quick action navigation methods
   * Why: Convenient shortcuts from dashboard
   */
  navigateToCreateAttempt(): void {
    this.router.navigate(['/attempts/create']);
  }

  navigateToReportIncident(): void {
    this.router.navigate(['/reports/create']);
  }
}
