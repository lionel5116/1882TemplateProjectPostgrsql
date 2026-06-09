# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Developer Preferences

- **Backend language:** Plain JavaScript (CommonJS `require`/`module.exports`) — not TypeScript. Preferred for Express backends for its cleaner, no-build-step simplicity.

---

## Project

HISD 1882 Cost Tracking — a decoupled full-stack app for Houston Independent School District to track and bill employee service hours at 1882 schools.

---

## Project Structure

```
/                               ← root (concurrently runner)
├── package.json                ← root scripts: dev, install:all
├── backend/                    ← Express REST API (Node.js, CommonJS)
│   ├── server.js               ← entry point: connects DB, starts Express on port 4000
│   ├── schema.sql              ← PostgreSQL DDL (run once to create table + indexes)
│   ├── .env                    ← local credentials (not committed)
│   ├── .env.example            ← env template
│   ├── db/
│   │   └── config.js           ← pg connection pool (getPool export)
│   ├── helpers/
│   │   └── timeCalculator.js   ← 30-min billing rule + cost calculation
│   ├── routes/
│   │   └── timeEntries.js      ← mounts all /api/* routes
│   └── controllers/
│       └── timeEntriesController.js  ← query logic for all 3 endpoints
└── frontend/                   ← Next.js 14 App Router (TypeScript + Tailwind)
    ├── next.config.js          ← rewrites /api/* → backend:4000
    ├── tailwind.config.js      ← HISD brand colors under `hisd.*`
    ├── app/
    │   ├── layout.tsx          ← root layout, mounts <Header>
    │   ├── globals.css         ← Tailwind base + shared component classes
    │   ├── page.tsx            ← Dashboard (Server Component)
    │   └── time-entry/
    │       └── page.tsx        ← Log Time Entry page
    ├── components/
    │   ├── Header.tsx          ← HISD-branded nav (Client Component)
    │   ├── MetricCard.tsx      ← KPI tile with colored accent bar
    │   ├── EntriesTable.tsx    ← recent entries table
    │   ├── CampusSummary.tsx   ← campus bar chart + service type breakdown
    │   └── TimeEntryForm.tsx   ← controlled form with client-side validation (Client Component)
    └── lib/
        └── api.ts              ← all fetch calls + shared TypeScript types
```

---

## Starting the App

### Both servers with one command (recommended)

From the **project root**:

```bash
npm run dev       # start both servers
npm run kill      # kill ports 3000 and 4000
npm run kill && npm run dev   # bounce both servers cleanly
```

Starts backend (port 4000) and frontend (port 3000) simultaneously with color-coded output via `concurrently`.

### Individual servers

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

### First-time setup

```bash
# 1. Install all dependencies
npm run install:all          # installs backend + frontend node_modules
npm install                  # installs root concurrently

# 2. Create the database and table (run once against local PostgreSQL)
#    The database 1882costtrackingdb already exists on the local instance.
#    To recreate: connect as postgres user and run backend/schema.sql
#    psql path on this machine: /Applications/pgAdmin 4.app/Contents/SharedSupport/psql
#    PGPASSWORD=5116 psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE \"1882costtrackingdb\";"
#    PGPASSWORD=5116 psql -U postgres -h localhost -p 5432 -d 1882costtrackingdb -f backend/schema.sql

# 3. Configure environment
#    backend/.env is already configured for local PostgreSQL

# 4. Start
npm run dev
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/time-entries` | Create entry — validates, calculates total time/cost, inserts |
| `GET` | `/api/time-entries` | All entries ordered by date desc |
| `GET` | `/api/dashboard-summary` | Totals, by-campus, by-service-type aggregates + last 10 entries |

---

## Key Business Rule — 30-Minute Minimum

`backend/helpers/timeCalculator.js`:
- Throws 400 if duration < 30 minutes.
- Rounds duration **up** to the nearest 30-minute block.
- Returns total hours as a decimal (e.g., 1.5 hrs).

`frontend/components/TimeEntryForm.tsx` mirrors this client-side — submit is disabled while duration < 30 min.

**Hourly rate** defaults to `$50/hr`, set via `HOURLY_RATE` in `backend/.env`.

---

## Database

- **Engine:** PostgreSQL 18 (local instance, accessed via pgAdmin 4)
- **Database name:** `1882costtrackingdb`
- **Table:** `time_entries` (snake_case — Postgres convention)
- **Driver:** `pg` (node-postgres) — no ORM
- **`psql` binary:** `/Applications/pgAdmin 4.app/Contents/SharedSupport/psql` (not in PATH)

### Key schema differences from original SQL Server design

| SQL Server | PostgreSQL |
|------------|------------|
| `INT IDENTITY(1,1)` | `SERIAL` |
| `NVARCHAR` / `NVARCHAR(MAX)` | `VARCHAR` / `TEXT` |
| `DATETIME2` | `TIMESTAMPTZ` |
| `GETDATE()` | `NOW()` |
| `OUTPUT INSERTED.*` | `RETURNING *` |
| `SELECT TOP 10` | `LIMIT 10` |
| `@param` placeholders | `$1, $2, ...` placeholders |

---

## Environment Variables

**`backend/.env`** (PostgreSQL via `DATABASE_URL`):
```
PORT=4000
DATABASE_URL=postgresql://postgres:5116@localhost:5432/1882costtrackingdb
HOURLY_RATE=50
```

**`frontend/.env.local`**:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
