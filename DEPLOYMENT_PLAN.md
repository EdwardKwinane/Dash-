# Dash# Deployment Preflight Plan — Sprint 02 (verified only)

Status: READ-ONLY DISCOVERY COMPLETE. NO CHANGES EXECUTED. NO INSTALLATIONS. NO MIGRATIONS. NO AWS MUTATIONS. NO COMMITS. NO PUSHES. NO DEPLOYMENTS.

Branch: `feature/storefront-quality-sprint` · HEAD: `162bd99` · Sprint 02 seed/docs preserved (5 uncommitted files).

---

## Phase 1 — Verified Project State

| Item | Verified value | Evidence |
|---|---|---|
| Branch / HEAD | `feature/storefront-quality-sprint` / `162bd99` | `git rev-parse HEAD` |
| Uncommitted Sprint 02 | `seed-dash-catalogue.ts`, `ARCHITECTURE.md`, `CHANGELOG.md`, `HOW_IT_WORKS.md`, `AWS_DEPLOYMENT_REPORT.md` | `git status --short` |
| Medusa version | `2.22.0` / `2.22.1` framework | `package.json` (verified; no upgrade) |
| Node requirement | `>=22.22.0` LTS; local `v24.21.0` | `node --version`; `medusa --version` |
| DB (local) | PostgreSQL 17 (`medusa-dash-backend`) via Homebrew | `brew`, `database_url` in `.env` (local only) |
| `.env` tracked | 0 | `git ls-files apps/backend/.env` |
| Seed idempotency | Verified 2× (clean second run) | `medusa exec` output |
| Storefront preserved | 123/123 tests pass; `dash-app/` untouched | `npm test` |
| Image provenance | Samsung + Logitech verified CC BY 4.0; Dell deferred Sprint 04 | `MAPPING.md`; `CREDITS.md` |

**Secret keys present in local `.env` (names only, values NOT shown):**
`MEDUSA_ADMIN_ONBOARDING_TYPE`, `DATABASE_URL`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY`, `REDIS_URL`. All local-only, git-ignored.

---

## Phase 2 — Verified Server Preflight (`i-05a80ef6bae076027`, `eu-north-1`)

Read-only via `agent-toolkit` profile / SSM (`AWS-RunShellScript`). No SSH, no DB connection, no secret retrieval.

| Check | Result | Notes / Caveats |
|---|---|---|
| OS / architecture | Ubuntu 24.04.5 LTS (`aarch64`) | Kernel `7.0.0-1014-aws`; ARM64-compatible |
| Instance type | `t4g.micro` | ARM64 (`arm64`); 2 vCPU |
| RAM | ~904 MiB total / ~617 MiB available | Low — co-locating PostgreSQL + Medusa will use significant share |
| Swap | 0 B | **No swap configured** — risk on memory spikes (build, migrations, peak traffic) |
| Disk (`/`) | 29G / 2.3G used (9%) / 26G free | 30G `gp3`; sufficient for build artifacts + DB (small) |
| CPU | 2 cores | `t4g.micro`; adequate for dev; not for production traffic |
| Services running | `acpid`, `chrony`, `cron`, `dbus`, `fwupd` only | No app service; no redis; no nginx; no apache |
| Listening ports | `:22` (SSH), `lo:53` (systemd-resolve) | **No 9000/5432/6379/80/443** — instance is bare |
| PostgreSQL installed | **NOT installed / not running** | `pg_isready` unavailable; no `postgresql` service |
| Node/npm installed | **NOT installed** | `node`/`npm` not in `PATH`; no `nvm` detected |
| Docker / containers | **Not running / not installed** (`docker ps` unavailable) | No container runtime confirmed |
| `systemctl` | Present (used successfully) | Confirmed for service management |
| SSM agent | `VoltMarketMedusaSSMInstanceProfile`; online (`3.3.4793.0`) | Read-only access available via SSM |
| Security group | `sg-0aaced2844779f32e` (`volt-market-medusa-dev-sg`, description: `SSM only`) | **No public HTTP/HTTPS ingress** — must be approved separately |
| IAM instance profile | `VoltMarketMedusaSSMInstanceProfile` | No AWS secret retrieval verified (not attempted) |
| RDS (`eu-north-1`) | **None** (`DBInstances: []`) | No managed DB in region |
| ELB (`eu-north-1`) | **None** (`DescribeLoadBalancers`: empty) | No load balancer |
| Route53 zones | **0 hosted zones** | No existing domain configured |
| Public IP | `13.49.227.22` (verified) | Direct access possible if SG allows |
| Private IP | `172.31.10.147` | Standard VPC (`vpc-0aa8271d04557abb5`) |

**Access block distinction (verified, not assumed):** `us-east-1` denied by SCP (`o-waulk5iqkx/service_control_policy/p-6ov7atjr`); `eu-north-1` permitted for this instance and profile. Region-specific permission must not be generalized.

---

## Phase 3 — Deployment Plan (proposed; NOT executed; requires approval)

### 3A. PostgreSQL and Resource Sizing

**Evidence:** `t4g.micro` (2 vCPU, ~1 GiB RAM, 30 GB gp3, ARM64, no swap). PostgreSQL not installed. No RDS exists in `eu-north-1`.

**Sizing assessment:**
- For a development proof-of-concept with 6 products / 7 categories / 10 products (scaffold + Dash#): adequate.
- Peak memory risk: `npm install` (~400–800 MiB), `medusa db:migrate`, build (esbuild), runtime (~300–500 MiB for Medusa + Node), PostgreSQL (~100–300 MiB baseline). Total could approach available RAM (~617 MiB) during build/migration with no swap. **Swap file recommended** (e.g., 2 GB) before any build/migration.
- **Recommendation:** Co-locate PostgreSQL on the instance (no external DB available; RDS would require provisioning — approval required separately). Use `localhost` binding; never expose port `5432` externally (SG rules must remain restricted).
- **Backup/restore:** Create EBS snapshot (`vol-0dd436a404c6bf779`) **before** any DB creation/data insertion. Document rollback = restore snapshot + reinstall Node + restart service.
- **Risk:** No swap + low RAM = OOM during install/build. Recommend either (a) swap file + cautious sequential steps (build → install PG → migrate → start, not simultaneously), or (b) request approval for larger instance (e.g., `t4g.small`/`t4g.medium`) before production-like testing.

**Not performed:** No `createdb`; no `systemctl start postgresql`; no `pg_createcluster`; no volume resize; no snapshot.

### 3B. Node.js and Medusa

**Compatible version:** ARM64 `t4g.micro` supports Ubuntu 24.04 LTS; Node LTS `v22` (or `v24`) works on ARM64. Existing project uses `v24.21.0` locally; use an installed LTS (`22` or `24`) via `nvm` or official Node binary. **Do not upgrade project dependencies** (rule: no upgrade without retest).

**Installation approach (pending approval):**
- Install `node` + `npm` (or `pnpm` if locked to existing `package-lock.json`) via official ARM64 binary or `nvm`.
- `npm ci` (preserves lockfile) or `npm install` (if lockfile aligns).
- `npm run build` (verified locally, exit 0).
- Run via `systemd` (not `npm run dev` in production):
  - Working directory: `/var/lib/medusa` or `/opt/medusa` (not home-dir); copy `apps/backend/` build output.
  - Service user: dedicated `medusa` user (least-privilege; not `root` or `ubuntu`).
  - Restart: `Restart=always`; `RestartSec=5`; `User=medusa`; `GROUP=medusa`; `WorkingDirectory=/opt/medusa`; `ExecStart=/usr/bin/node /opt/medusa/dist/index.js` (or equivalent).
  - Logs: redirect to `/var/log/medusa/` (not stdout); rotate via `logrotate`; retain error logs only (no secrets in logs — `.env` never loaded into logs).
  - Port: bind to `127.0.0.1:9000` (or via reverse proxy); do not expose `9000` to public SG until approved.

**Environment variables required (key names only; NOT shown):**
- `DATABASE_URL` (PostgreSQL connection; must use loopback/private — never public)
- `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY` (production values from secret store, not `.env`)
- `MEDUSA_ADMIN_ONBOARDING_TYPE`
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` (restrict to storefront + admin origins; no wildcards)
- `REDIS_URL` (optional; only if events/notification queue used — local Redis or skip for dev)
- `JWT_SECRET` rotation required before any production-like use.

**No changes to storefront:** `dash-app/` unchanged. No `NEXT_PUBLIC_*` backend secrets.

### 3C. HTTPS and Network Access

**Verified:** No Route53 hosted zones; no ELB; SG currently `SSM only`. Direct access possible via `13.49.227.22:22` (SSH, via SSM profile). No TLS cert exists.

**Plan (pending approval):**
- Domain: **do not purchase or assume existing** — ask owner which domain/subdomain (if any) applies.
- If using direct IP for development testing: HTTPS requires a self-signed cert or Let's Encrypt via IP (difficult); recommend **development-only HTTP behind VPN/SSM tunnel**, not public HTTPS until domain confirmed.
- If a domain is provided: configure Route53 hosted zone → A/AAAA record → ACME (Let's Encrypt) via `certbot` or `nginx` with `snist` → TLS termination either at instance (nginx/Apache) or via a future load balancer (not available now).
- **Reverse proxy proposal:** `nginx` or `caddy` (simpler TLS) as a reverse proxy to Medusa `localhost:9000`; only if public endpoint needed and SG ingress approved.
- **SG ingress:** Recommend **approval first**, then add only needed ports: `tcp/22` (SSM already via instance profile, not SG for this use), `tcp/443` (HTTPS only if TLS + domain approved), possibly `tcp/80` (redirect only). **Not open `tcp/5432` (PG) or `tcp/9000` (Medusa) to 0.0.0.0/0.**
- Do **not** modify SG now.

### 3D. Integration Readiness (checklist — not implemented)

| Integration | Status | Evidence / Gap |
|---|---|---|
| **Clerk (auth)** | Not implemented | Auth module has Google/GitHub/Okta out-of-box; no native Clerk provider. Needs custom Auth Module Provider + server-side identity mapping. Requires owner design decision. Not affecting deployment readiness. |
| **Customer order access** | Not implemented | Must enforce `customer_id` checks server-side (prevent order ID enumeration). Must be implemented before production orders. Defer to Sprint 03+. |
| **Yoco (payment)** | Not implemented / unverified | No Medusa provider found; requires custom Payment Module Provider. Compatibility unverified; needs SDK/webhook format confirmation from owner. Defer. |
| **PayPal** | Documented (official guide exists) | `resources/integrations/guides/paypal` available. Credentials + webhook endpoint (`/hooks/payment/paypal_paypal`) needed. Not configured. Defer until payment decision approved. |
| **Sanity (CMS)** | Documented (official guide exists) | Custom module + `defineLink` + subscriber + workflow required. `SANITY_PROJECT_ID`, `SANITY_API_TOKEN` needed. Defer until editorial workflow approved. |
| **CORS / storefront** | Local verified | `STORE_CORS` sets localhost origins. Once public endpoint approved, must restrict to actual storefront domain(s) — never `*`. |

**Distinction:** None of these integrations is required to deploy Medusa with the SA region seed; they are post-deployment feature work.

### 3E. Secrets, Observability, Rollback

**Secrets management (recommended, not executed):**
- Use `AWS Secrets Manager` (compatible with `agent-toolkit` profile / instance role if permitted) or an approved secret vault. Do **not** put secrets in `.env` on server.
- Minimum secrets required: `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY`, `REDIS_URL` (if used), CORS values (can be env, not secret), any provider tokens (PayPal/Clerk/Yoco/Sanity) when added.
- **No secret values retrieved or exposed** by this agent.

**Observability:**
- Health: `localhost:9000/health` (verified locally; deploy must bind to interface/admin-approved endpoint).
- Logs: systemd journal + `/var/log/medusa/`; include error logs only; no secrets.
- Monitor: `systemctl status medusa`; `ss -tlnp`; `df -h` (disk); `free -h` (memory); `systemctl restart` if needed.
- Alert mechanism: deferred (no monitoring service configured; could use Simple Email via SSM or external alert — requires approval).

**Rollback (before any valuable data):**
1. Before DB creation / seed: EBS snapshot (`vol-...`) — verified `DeleteOnTermination=true`; snapshot captures volume state.
2. Before migration / service start: backup local DB if converting to instance DB (dump to file; store on separate storage if available, else snapshot only).
3. If deployment fails: restore volume snapshot → reinstall Node/build → restart service → verify `localhost:9000/health`.
4. If data corruption occurs after value stored: restore from backup (snapshot + file dump) rather than rebuild from seed.

---

## Phase 4 — Approval Gates (explicit separation)

### Group 1 — Safe read-only (completed / permitted now)
- SSM read-only inspection (done; no secrets exposed; no resources changed)
- Project documentation review (done)
- DB seed verification (done locally; remote DB not created)
- `.env` / secret review by key name only (done; values protected)

### Group 2 — Changes requiring explicit approval (NOT performed)
- **Package installation:** `node`/`npm` install via `nvm` or apt on instance.
- **PostgreSQL setup:** install, configure, bind to `localhost`, create `medusa-dash-backend` DB.
- **Service user / systemd:** create `medusa` user; write `/etc/systemd/system/medusa.service`; enable/restart.
- **Build / deploy:** `npm ci`; `npm run build`; copy to `/opt/medusa`; set `WorkingDirectory`; start service.
- **Environment variables:** store production values in approved secret store; write to instance (not committed).
- **Migration:** `medusa db:migrate` against instance DB (only after DB exists and backup taken).
- **Seed on instance:** run `seed-dash-catalogue.ts` against instance DB (only after migration; safe because idempotent — but must confirm DB identity first).
- **SG ingress:** approve exact ports (`443` / `80` / `9000` if needed) and source IP ranges.
- **Reverse proxy / TLS:** approve domain; approve cert path; approve `nginx`/`caddy` config.

### Group 3 — AWS changes requiring separate approval (NONE executed; must ask separately)
- EBS snapshot / new volume (cost: snapshot storage; may be minimal)
- Instance resize (`t4g.micro` → larger; cost: hourly rate change)
- Security-group rule additions (cost: none, but security impact)
- IAM changes (cost: none, but permission impact)
- Route53 / DNS / TLS (potential new service cost if using ACM + ELB; direct cert might have cost)
- Any paid AWS resource not currently present

---

## Confirmed — Nothing Executed

- No `aws` mutation commands executed.
- No `ssm send-command` that installs, modifies, or starts services (only `systemctl list`, `ss`, `pg_isready`, `node`, `npm` check — all read-only; the final focus command failed at param parsing — no change occurred).
- No database created; no `systemctl start postgresql`; no `medusa db:migrate`; no `npm install` on instance.
- No `.env` edited; `.env` remains untracked; no secrets retrieved.
- Sprint 02 documentation (`ARCHITECTURE.md`, `CHANGELOG.md`, `HOW_IT_WORKS.md`) updated safely (append only).
- `AWS_DEPLOYMENT_REPORT.md` preserved; new `DEPLOYMENT_PLAN.md` created separately.
- Branch `feature/storefront-quality-sprint`; `HEAD 162bd99`; no commit, no push, no PR.

---

## Recommended First Approval Set

1. Confirm SG ingress change needed (ports + source IP ranges).
2. Confirm DB source (instance-local PostgreSQL vs external; if instance-local, approve `postgresql` install + `systemctl` service + `createdb`).
3. Confirm domain / TLS approach (or accept direct IP for dev testing only).
4. Confirm secret management (AWS Secrets Manager access for instance role; confirm `agent-toolkit` / instance role can retrieve).
5. Confirm instance stays `t4g.micro` for dev (or approve resize if build/memory risk unacceptable).
6. Confirm rollback preference (volume snapshot before DB setup; confirm `DeleteOnTermination=true` aware).

Once all approved: sequence = SG update (if needed) → install Node/PG → build → DB create + migrate + seed (idempotent) → systemd service → health check → document.

---

*This is a planning document only. No deployment has occurred. All verified results come from read-only AWS CLI and SSM commands executed with the `agent-toolkit` profile in `eu-north-1`. All secret values remain unexposed and uncommitted.*

--- Zero-Additional-Cost Sequence (proposed; NOT executed; pending approval) ---
Stage 1 (readiness, $0): Verify disk free (done: 26G free); confirm .env key names (done); no new resources.
Stage 2 ($0): Manual swap file (optional, free): fallocate -l 2G /swapfile; chmod 600 /swapfile; mkswap /swapfile; swapon /swapfile; add /etc/fstab entry. No EBS cost.
Stage 3 ($0): Install Node LTS v22 (ARM64 binary or nvm; free source); verify node/npm installed (read-only); do NOT run npm ci yet.
Stage 4 ($0): Install PostgreSQL 17 via apt: apt install postgresql-17 postgresql-client-17; verify psql --version (read-only); create DB only after approval.
Stage 5 ($0): Configure PostgreSQL bind to localhost (postgresql.conf); restart (with approval); create user/db; migrate; seed (idempotent script); verify /health.
Stage 6 ($0): Create systemd unit (no cost); enable/restart (approval only).
Rollback per stage: swap — swapoff + delete file; Node — rm binary directory; PostgreSQL — drop DB/user; systemd — disable + stop; snapshot not available (denied by gate); rely on file-level backup + instance restart (SSM).
--- Approval Gate (required before Stage 3+) ---
Confirm: (a) use manual swap file; (b) co-locate PostgreSQL locally; (c) install Node from free source; (d) no new AWS resources; (e) SG changes deferred; (f) TLS/DNS deferred.

