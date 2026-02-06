## Architecture

The codebase is organized into layers to ensure the "Core" business logic is framework-independent.

```
src/
├── core/                  # THE KERNEL (Node.js compatible, No UI deps)
│   ├── domain/            # Entities (User, Project), Use Cases, Repository Interfaces
│   └── infrastructure/    # Implementations (Mock DB, Zitadel Auth, DI)
├── routes/                # PRESENTATION (SvelteKit)
│   ├── profile/           # SSR Page (Public)
│   └── dashboard/         # Streaming/CSR Page (Private)
├── server/                # STANDALONE SERVER (Express)
│   └── index.ts           # REST API using the same 'core' logic
└── lib/                   # UI Components (Svelte 5 Runes + Snippets)
```

**Key Patterns:**

- **Svelte 5 Runes:** `$state`, `$derived`, `$props` used exclusively.
- **Dependency Injection:** `awilix` manages the `src/core` container.
- **Hybrid Rendering:** SSR for Profile (SEO), Streaming for Dashboard (Performance).
- **PWA:** Fully installable with Service Worker offline caching.

---


### 1. Prerequisites

- **Node.js 18+**
- **Docker Desktop** (for running Zitadel locally)

### 2. Initial Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd ext-proj
npm install
```

### 3. Start Infrastructure (Zitadel)

Start the local identity provider and database:

```bash
docker compose up -d
```

_Wait about 1-2 minutes for Zitadel to initialize._

### 4. Configure Zitadel (Automated)

The infrastructure setup includes a **Zero-Touch Configuration** strategy:

- **Service User:** A machine user (`admin-script`) is created automatically during the first boot.
- **Permissions:** This user is automatically granted `IAM_OWNER` and `ORG_OWNER` roles.
- **Access Token:** A Personal Access Token (PAT) is written to a local file named `admin.pat`.

1.  **Verify Token:** Ensure the file `admin.pat` exists in your root directory.
2.  **Run Setup Script:**
    This script reads `admin.pat`, creates the project, roles, frontend/backend apps, and test users.
    ```bash
    npm run setup:zitadel
    ```
3.  **Assign Roles (Manual):**
    - Go to `http://localhost:8080/ui/console/projects` -> **SoloDev** -> **Grants**.
    - Click **New**.
    - Add `freelancer@solodev.local` -> Select `FREELANCER`.
    - Add `client@solodev.local` -> Select `CLIENT`.

4.  **Update Environment:**
    The script will output a **Client ID** and **Secret**. Copy them into your `.env` file:

    ```bash
    # .env
    ZITADEL_CLIENT_ID=...
    ZITADEL_API_CLIENT_ID=...
    ZITADEL_API_CLIENT_SECRET=...
    ZITADEL_PROJECT_ID=...
    ```

### 5. Run the Application

#### Option A: SvelteKit UI (Full App)

Run the web application:

```bash
npm run dev
```

- Visit `http://localhost:5173`.
- **Login:**
  - **Freelancer:** `freelancer@solodev.local` / `Password1!`
  - **Client:** `client@solodev.local` / `Password1!`

#### Option B: Standalone API Server

Run the decoupled Node.js server (proves the Clean Architecture):

```bash
npx tsx src/server/index.ts
```

- Visit `http://localhost:3000/api/dashboard` (Returns JSON).

---

## Troubleshooting

### Zitadel Issues

- **"Connection Refused"**: Ensure Docker is running (`docker compose ps`).
- **"Issuer Discovery Failed"**: The app tries to connect to `http://localhost:8080`. If you are running inside another container, this networking might fail. Ensure you are running `npm run dev` on your host machine.
- **"Invalid Client"**: Did you copy the Client ID from the setup script output to `.env`?

### Build/Type Errors

- Run `npm run check` to verify SvelteKit types.
- If you see `process is not defined`, ensure `@types/node` is installed (it should be).

---

## Testing

You can verify the Core Logic (Use Cases) without starting any server/UI:

```bash
npx tsx src/test-di.ts
```

This runs the dependency injection container and executes the `GetFreelancerDashboard` use case in a pure Node.js environment.

---

## Details

- **Framework:** SvelteKit (Svelte 5)
- **Language:** TypeScript
- **Auth:** Zitadel (OIDC/PKCE) via `openid-client` v6
- **Styles:** CSS Variables (Dark/Light Mode)
- **Icons:** Lucide Svelte

# svelte-zitadel
