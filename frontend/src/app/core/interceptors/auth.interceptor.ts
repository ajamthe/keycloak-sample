import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Attaches the Bearer access token to every outbound /api request.
 * Skips requests to Keycloak itself (token endpoint, JWKS, etc.).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauth = inject(OAuthService);
  const token = oauth.getAccessToken();

  const isApiRequest = req.url.startsWith('/api') || req.url.includes('localhost:4200/api');
  const isKeycloakRequest = req.url.includes('localhost:8080');

  if (token && isApiRequest && !isKeycloakRequest) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
