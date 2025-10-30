import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Protected routes with layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'victims',
        loadChildren: () => import('./features/victims/victims-module').then(m => m.VictimsModule)
      },
      {
        path: 'attempts',
        loadChildren: () => import('./features/attempts/attempts-module').then(m => m.AttemptsModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports-module').then(m => m.ReportsModule)
      },
      {
        path: 'rewards',
        loadChildren: () => import('./features/rewards/rewards-module').then(m => m.RewardsModule)
      },
      {
        path: 'content',
        loadChildren: () => import('./features/content/content-module').then(m => m.ContentModule)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Wildcard route - must be last
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
