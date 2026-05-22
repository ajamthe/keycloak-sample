import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Keycloak PKCE Demo</h1>
      <p>This app demonstrates the PKCE Authorization Code Flow secured by Keycloak.</p>

      @if (auth.isLoggedIn) {
        <div class="card success">
          <h3>Logged in as <strong>{{ auth.username }}</strong></h3>
          <p>Use the nav links to explore protected endpoints.</p>
          <details>
            <summary>View raw Access Token (inspect in browser Network tab for full PKCE flow)</summary>
            <pre class="token-display">{{ auth.accessToken }}</pre>
          </details>
        </div>
      } @else {
        <div class="card">
          <h3>You are not logged in</h3>
          <p>Click Login to start the PKCE flow. Watch the Network tab and URL bar to see:</p>
          <ol>
            <li>Redirect to Keycloak with <code>code_challenge</code></li>
            <li>Keycloak redirect back with <code>code</code></li>
            <li>Token exchange with <code>code_verifier</code></li>
            <li>Access + Refresh + ID tokens returned</li>
          </ol>
          <button (click)="auth.login()">Login with Keycloak</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .card { background: #f5f5f5; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .card.success { background: #e8f5e9; border-left: 4px solid #4caf50; }
    .token-display { font-size: 0.7rem; word-break: break-all; white-space: pre-wrap; background: #222; color: #afa; padding: 1rem; border-radius: 4px; max-height: 200px; overflow-y: auto; }
    button { margin-top: 1rem; padding: 0.6rem 1.5rem; font-size: 1rem; cursor: pointer; background: #1a1a2e; color: white; border: none; border-radius: 4px; }
    code { background: #eee; padding: 2px 6px; border-radius: 3px; font-size: 0.9rem; }
  `]
})
export class HomeComponent {
  auth = inject(AuthService);
}
