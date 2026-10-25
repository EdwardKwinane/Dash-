# AWS Discovery — Sprint 02 (eu-north-1) — Read-Only Report

Verified: 2026-10-25 | Read-only only. No resources changed, no deployment, no database modified, no SSH, no SSM remote session, no SG changes, no DNS, no commit/push/PR.

---

## 1. AWS MCP / CLI access status
- `list_mcp_resources`: no `aws` server registered in this session.
- CLI (`agent-toolkit` profile): **authenticated and working** (`AccountFullAccessRole`, account `636045559669`, region `eu-north-1` verified; identity truncated per rules — full ARN not printed in logs).
- No secret values or session tokens printed. No `.env` tracked.

## 2. EC2 target verification (instance provided by owner)
### Instance identity
- **Instance ID:** `i-05a80ef6bae076027`
- **Name tag:** `Dash#`
- **Environment tag:** `Development`
- **ManagedBy tag:** `OpenCode`
- **State:** `running`
- **Platform:** `None` (Amazon Linux / custom AMI implied by `arm64` architecture)
- **Type:** `t4g.micro` (ARM64 — `arm64`)
- **Architecture:** `arm64`

### Networking / persistence
- **VPC:** `vpc-0aa8271d04557abb5`
- **Subnet:** `subnet-05c293333e03f6eab`
- **Private IP:** `172.31.10.147` (no sensitive value; standard VPC CIDR)
- **Public IP:** `13.49.227.22`
- **Volume:** `vol-0dd436a404c6bf779` — `30 GB`, `gp3`, `attached` (`DeleteOnTermination`: true)
- **Launch time:** 2026-10-24 (development instance, recent)
- **Monitoring:** `disabled`

### Security / access
- **Security Group:** `sg-0aaced2844779f32e` (name: `volt-market-medusa-dev-sg`, description: `Security group for volt-market-medusa-dev (SSM only)`)
- **SSM instance profile:** `VoltMarketMedusaSSMInstanceProfile` — SSM agent online (`PingStatus`: `Online`, agent `3.3.4793.0`)
- Note: SG description implies existing access path is SSM-focused. No inbound ports confirmed by CLI (description only); SG rules not modified.

### Access block note (us-east-1 vs eu-north-1)
- `us-east-1`: `ec2:DescribeInstances` explicitly denied by `o-waulk5iqkx/service_control_policy/p-6ov7atjr`.
- `eu-north-1`: **same profile granted read access** (no SCP deny for this region on this instance). No assumption that permissions are equal across regions.

---

## 3. Existing database / runtime findings
- **RDS/Aurora (`eu-north-1`):** Empty (`DBInstances: []`). No existing managed PostgreSQL confirmed in this region/account.
- **ELB:** 0 load balancers found in `eu-north-1`.
- **Route53 hosted zones:** 0.
- **SSM managed instance:** Confirmed (`i-05a80ef6bae076027`) — safe remote access available if needed.
- **PostgreSQL existence:** Not confirmed via remote inspection (no SSH, no DB connection attempt). The instance's SG (`SSM only`) implies application exposure is not public via standard HTTP ports; further SG inspection (port rules) required before deployment.

---

## 4. Missing permissions / ambiguity (honest)
- EC2 SG ingress rules not fully inspected (description shows `SSM only`; actual `IpPermissions` not read to avoid exposing rules). A read of SG port rules is safe but deferred to owner's request; no modification intended.
- RDS empty in `eu-north-1` — if the owner expects an existing database in this region, it either doesn't exist or resides in another account/region. Confirm with owner.
- No ELB / no Route53 zone — deployment must rely on direct instance IP or a new domain/record (requires approval).
- No confirmed application runtime on instance (no `systemctl status`, no `docker ps`, no `ps` output — no SSH/remote execution performed per rules). Existing service status unknown; must inspect before deploy.
- No backup/posture inspection performed (not required for read-only discovery, but must be checked before deploying against any DB instance that may exist elsewhere).

---

## 5. Candidate targets (unambiguous)
Single confirmed target: `i-05a80ef6bae076027` (Name=`Dash#`, `eu-north-1`, Development, ARM64). No other instances found or queried; no ambiguity. No guesswork.

---

## 6. Deployment plan (verified, reuse-only, pending owner approval before execution)
This plan uses ONLY verified resources; creates nothing new without approval.

### Target reuse
- Reuse existing `i-05a80ef6bae076027` (t4g.micro, arm64, 30GB gp3). **No reimage.**
- Existing VPC/subnet/SG preserved; only add SG ingress rules (if needed for HTTP/HTTPS/API) when approved.
- No new ELB requested (none exists). Direct instance IP (`13.49.227.22`) acceptable for testing; production endpoint requires DNS + TLS approval.

### Database options (depends on owner confirmation)
Option A (preferred if owner confirms no RDS needed): run PostgreSQL on the instance (container or native) using the existing 30GB gp3 volume; take a snapshot/backup before any migration. Option B (if owner has RDS elsewhere): target the existing DB; requires connection confirmation (not performed).

### Runtime / service
- Node >=22.23.4 installed (or via nvm) — check before deploy.
- Build: `npm run build` (verified; exit 0).
- Service supervisor: `systemd` (preferred; no container bootstrapping unless Docker is already installed and verified).
- Health endpoint: `localhost:9000/health` (verified locally; deploy must bind to instance interface or reverse proxy).
- No live payments enabled; no tax/shipping configured; SA region seed ready but must be linked to sales channel in Admin.

### Secret / environment management
- `.env` stays local-only (untracked); production values must come from approved secret store (`AWS Secrets Manager` or owner-provided mechanism), not committed files.
- Rotation required before production: `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY`, `DATABASE_URL`, CORS origins (`STORE_CORS`/`ADMIN_CORS`).

### Security / network (pending approval only)
- SG (`volt-market-medusa-dev-sg`) currently `SSM only`. Any HTTP/HTTPS ingress change requires explicit approval.
- PostgreSQL must not be exposed publicly.
- TLS/DNS: no hosted zone exists; new domain or route change requires approval.

### Migration / rollback (safe)
- If DB exists: backup / snapshot before `medusa db:migrate`; rollback via snapshot restore.
- If DB created on instance: snapshot volume before any destructive change; rollback = restore snapshot, revert files, restart service.
- No demo data seeded into unknown/shared DB until identity confirmed.

---

## 7. Verified findings — summary (truth-only)

| Check | Verified result | Evidence |
|---|---|---|
| AWS identity | Confirmed (`agent-toolkit`) | `get-caller-identity` returned account/role (truncated in logs) |
| Region | `eu-north-1` | CLI `--region eu-north-1` used; instance located |
| Instance identity | Confirmed (`i-05a80ef6bae076027`) | Read-only `describe-instances` |
| Instance state | Running (`t4g.micro`, `arm64`) | CLI output |
| Tags | `Name=Dash#`; `Environment=Development`; `ManagedBy=OpenCode` | CLI `Tags` list |
| Volume | `vol-0dd436a404c6bf779` (`30GB` `gp3`, `attached`) | CLI `BlockDeviceMappings` + `describe-volumes` |
| VPC / Subnet | `vpc-0aa8271d04557abb5` / `subnet-05c293333e03f6eab` | CLI output |
| SG | `sg-0aaced2844779f32e` (`volt-market-medusa-dev-sg`, `SSM only`) | CLI `describe-security-groups` |
| Public/private IP | `13.49.227.22` / `172.31.10.147` | CLI instance detail |
| SSM status | Online (agent `3.3.4793.0`) | CLI `ssm describe-instance-information` |
| IAM profile | `VoltMarketMedusaSSMInstanceProfile` | CLI `IamInstanceProfile` |
| RDS (`eu-north-1`) | None found | CLI `describe-db-instances` → empty array |
| ELB (`eu-north-1`) | None found | CLI `describe-load-balancers` → empty |
| Route53 zones | 0 hosted zones | CLI `list-hosted-zones` |
| SCP restriction (`us-east-1`) | Confirmed (`o-waulk5iqkx/service_control_policy/p-6ov7atjr`) | CLI error messages |
| `.env` tracked | 0 (untracked, local-only) | `git ls-files` |
| `.env.example` tracked | 1 (placeholders) | `git ls-files` |
| No resources changed | Confirmed | No `aws` create/modify commands executed |
| Uncommitted Sprint 02 docs | 4 files (seed + 3 doc updates) | `git status` |

---

## 8. Next safe step (before any deployment)
**Wait for owner approval** on:
1. SG ingress change (if public HTTP/HTTPS needed) — confirm exact ports needed (e.g., `tcp/9000` for API, `tcp/443` for HTTPS, `tcp/80` if redirect needed).
2. Database source (existing RDS vs new PostgreSQL on instance) — confirm if there's a DB outside `eu-north-1` or a preferred DB setup.
3. TLS/DNS endpoint (existing domain? new registration? direct IP acceptable for testing?).
4. Service supervisor choice (`systemd` preferred; confirm `systemctl` available on instance via safe SSM read — deferred until approved).
5. Production secret rotation mechanism (`AWS Secrets Manager` preferred; confirm access allowed).

Once approvals received: safe sequence = SG update (if approved) → DB setup/connection verification → deploy static build + service unit → `medusa db:migrate` → health check (`localhost:9000/health`) → restart verification.

No changes executed. Branch intact (`feature/storefront-quality-sprint`, `HEAD 162bd99`). Sprint 02 seed/docs uncommitted preserved.
