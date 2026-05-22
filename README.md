# Keycloak PKCE Demo

Learning project demonstrating how Keycloak secures an Angular SPA and a Spring Boot API using the PKCE Authorization Code Flow.

## Architecture

```
Browser (localhost:4200)
  ├── /app/   → Angular 17 (angular-oauth2-oidc, PKCE)
  └── /api/   → Spring Boot 3 / Java 21 (JWT resource server, JWKS validation)

Keycloak (localhost:8080) — runs in Docker
```

## Pre-configured users

| Username | Password | Role    | Can call /api/protected/data? |
|----------|----------|---------|-------------------------------|
| alice    | pa55word | client  | Yes                           |
| bob      | pa55word | (none)  | No — 403                      |

## Running locally

### 1. Start Keycloak

```bash
docker compose up keycloak
```

Wait for the health check to pass (~30s), then visit http://localhost:8080.

### 2. Build and run the backend

```bash
cd backend
mvn spring-boot:run
```

Or via Docker:
```bash
docker compose up --build backend
```

### 3. Run the Angular frontend (dev mode)

```bash
cd frontend
npm install
npx ng serve --port 4200 --base-href /app/
```

Visit http://localhost:4200/app/

### 4. Full stack via Docker Compose

Build the frontend first:
```bash
cd frontend && npx ng build && cd ..
docker compose up --build
```

Visit http://localhost:4200/app/

## Observing the PKCE flow in the browser

1. Open DevTools → **Network** tab, check "Preserve log"
2. Click **Login**
3. Watch the redirect to `localhost:8080` with `code_challenge` and `code_challenge_method=S256`
4. After login, watch Keycloak redirect back with `?code=...`
5. Watch the `POST /realms/demo-realm/protocol/openid-connect/token` request with `code_verifier`
6. The response contains `access_token`, `refresh_token`, and `id_token`
7. Click **Protected** — watch `GET /api/protected/data` with `Authorization: Bearer <token>`

Tip: Paste any JWT at https://jwt.io to decode it, or use the DevTools Console:
```js
JSON.parse(atob(token.split('.')[1]))
```

## API Endpoints

| Method | Path                  | Auth required | Role required |
|--------|-----------------------|---------------|---------------|
| GET    | /api/public/health    | No            | —             |
| GET    | /api/me               | Yes           | —             |
| GET    | /api/user/profile     | Yes           | —             |
| GET    | /api/protected/data   | Yes           | client        |
