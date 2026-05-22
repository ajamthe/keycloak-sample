import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">Keycloak PKCE Demo</div>
      <div class="nav-links">
        <a routerLink="/home" routerLinkActive="active">Home</a>
        @if (auth.isLoggedIn) {
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <a routerLink="/protected" routerLinkActive="active">Protected</a>
          <span class="nav-user">{{ auth.username }}</span>
          <button (click)="auth.logout()">Logout</button>
        } @else {
          <button (click)="auth.login()">Login</button>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #1a1a2e;
      color: white;
    }
    .nav-brand { font-size: 1.2rem; font-weight: bold; }
    .nav-links { display: flex; gap: 1rem; align-items: center; }
    .nav-links a { color: #ccc; text-decoration: none; }
    .nav-links a.active { color: white; font-weight: bold; }
    .nav-user { color: #aef; font-size: 0.9rem; }
    button { padding: 0.4rem 1rem; cursor: pointer; border: 1px solid #aaa; background: transparent; color: white; border-radius: 4px; }
  `]
})
export class NavComponent {
  auth = inject(AuthService);
}
