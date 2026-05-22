import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  async init(): Promise<void> {
    this.oauthService.configure(authConfig);

    // Load discovery document (OIDC well-known endpoint) then
    // try to restore a prior session from in-memory token store.
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    // Configure automatic silent token refresh using refresh tokens.
    // angular-oauth2-oidc will call the token endpoint ~30s before expiry.
    this.oauthService.setupAutomaticSilentRefresh();
  }

  login(): void {
    // Initiates PKCE Authorization Code flow.
    // Library generates code_verifier + code_challenge internally.
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    // Revokes tokens at Keycloak and clears in-memory state.
    this.oauthService.logOut();
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get identityClaims(): Record<string, unknown> {
    return this.oauthService.getIdentityClaims() as Record<string, unknown>;
  }

  get username(): string {
    const claims = this.identityClaims;
    return (claims?.['preferred_username'] as string) ?? '';
  }
}
