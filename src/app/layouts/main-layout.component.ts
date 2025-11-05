import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';

/**
 * Why: Main app layout wrapper for all authenticated pages
 * Combines header, sidebar, and router-outlet in responsive layout
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {}
