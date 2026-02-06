# implementation Plan: SoloDev (Freelancer Workspace)

This document outlines the step-by-step implementation plan for the SvelteKit 5 + Clean Architecture MVP. The goal is to build a PWA with a decoupled core that can serve both the SvelteKit UI and potentially a standalone Node.js API in the future.

## 1. Architecture Overview

We follow strict **Clean Architecture**:
*   **`src/core/domain`**: Pure TS entities & interfaces. (No dependencies).
*   **`src/core/application`**: Use Cases & DTOs. (Depends on Domain).
*   **`src/core/infrastructure`**: Implementations (DB, Auth, Logging), DI Container. (Depends on App & Domain).
*   **`src/routes` (Presentation)**: SvelteKit acting as the Controller/View layer. (Depends on App via DI).

## 2. Phased Development

### Phase 1: Foundation & Infrastructure Setup
**Goal:** A running SvelteKit app, a Zitadel instance, and the "Clean" folder structure ready for logic.
1.  **Scaffold Project:** Initialize SvelteKit (TypeScript).
2.  **Environment:** Create `docker-compose.yaml` for Zitadel.
3.  **Directory Structure:** Create `src/core/{domain,application,infrastructure}`.
4.  **Dependency Injection:** Install `awilix`. Create `container.ts` to export a configured container.
5.  **Logging:** Implement a basic `Logger` interface and adapter.
*   **Checkpoint 1:** Review folder structure and verify DI container resolves a test service.

### Phase 2: Domain & Authentication
**Goal:** Define *what* we are building and *who* is using it.
1.  **Domain Entities:** Define `User`, `Project`, `Skill`, `Money` (Value Object).
2.  **Repositories (Interfaces):** `IUserRepository`, `IProjectRepository`.
3.  **Auth Implementation:**
    *   Implement OIDC Client using `openid-client` or similar in `infrastructure/auth`.
    *   Create `AuthService` to handle login/logout/userinfo.
    *   *Note:* We will use `hooks.server.ts` to bridge SvelteKit cookies with our `AuthService`.
*   **Checkpoint 2:** Verify we can log in via Zitadel and see user details in the console.

### Phase 3: Application Core (The "Node Server" Logic)
**Goal:** Implement the business logic completely decoupled from the UI.
1.  **Mock Repository:** Implement `FileUserRepository` (or `Mock...`) using the JSON data strategy.
2.  **Use Cases:**
    *   `GetPublicProfile` (For the public page).
    *   `GetFreelancerDashboard` (Aggregates stats, charts, active projects).
    *   `UpdateUserStatus` (Toggle "Available for work").
3.  **Testing:** Write unit tests for `GetFreelancerDashboard` to prove independence from SvelteKit.
*   **Checkpoint 3:** Review code for Use Cases. Ensure no `import ... from '$app/...'` exists in `src/core`.

### Phase 4: Presentation Layer (Svelte 5 + UI)
**Goal:** Visuals and User Interaction.
1.  **App Shell:** Layout, Navigation, Theme Toggle (Dark/Light).
2.  **Profile Page (SSR):**
    *   `+page.server.ts`: Call `GetPublicProfile`.
    *   `+page.svelte`: Render using Snippets and Runes.
3.  **Dashboard Page (Streaming):**
    *   `+page.server.ts`: Call `GetFreelancerDashboard`. Use `Promise` streaming for heavy chart data.
    *   `+page.svelte`: Skeleton loaders, Charts.
4.  **Components:** `Card`, `Button`, `Badge` (Atomic design).
*   **Checkpoint 4:** UI Review. Check responsiveness and Theme toggle.

### Phase 5: PWA & Polish
**Goal:** Installability and Performance.
1.  **Manifest:** `manifest.json` (Icons, colors).
2.  **Service Worker:** Configure SvelteKit service worker for offline fallback (Profile page).
3.  **Final Polish:** Accessibility checks, performance audit.
4.  **Documentation:** Write `README.md` with setup instructions.

## 3. Deployment & Usage (Future Proofing)
The `src/core` directory will be self-contained. To "attach" a different server later:
1.  Create `server/index.ts` (Express/Fastify).
2.  Import `container` from `../src/core/infrastructure/di`.
3.  Map REST routes `GET /api/dashboard` -> `container.resolve('getFreelancerDashboard').execute()`.

## 4. Setup Instructions (Preview)
*   `npm install`
*   `docker compose up -d` (Start Zitadel)
*   `npm run dev`
