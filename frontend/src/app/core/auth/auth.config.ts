import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: window.location.origin + '/login/realms/demo-realm',
  redirectUri: window.location.origin + '/app/',
  postLogoutRedirectUri: window.location.origin + '/app/',
  clientId: 'angular-app',
  responseType: 'code',
  scope: 'openid profile email',
  useSilentRefresh: false,
  showDebugInformation: true,   // logs OIDC flow details to the browser console
  requireHttps: false,          // localhost only — remove for production
  clearHashAfterLogin: true,
};
