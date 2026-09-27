# Service Information Management Portal

Professional internal portal for managing service/project information.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Excel: SheetJS (xlsx)

## Features
- Dashboard KPIs and recently updated services
- Search, filters, sorting, pagination
- Add / edit / view service profiles
- CODE uniqueness validation
- Excel import preview + confirmation
- Excel export (current results or all)
- English / Arabic with RTL support
- Viewer / Editor / Admin role-ready middleware
- Audit timestamps and updated-by tracking
- Sample seed data

## Quick start

### 1. Database
```bash
docker compose up -d db
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Database initialization
Docker automatically runs:
- `database/schema.sql`
- `database/seed.sql`

## Authentication
The current app uses temporary request headers so the UI can be developed before Elm SSO / Active Directory integration.

Backend recognizes:
- `x-user-name`
- `x-user-role` = viewer | editor | admin

Replace the auth middleware later with corporate SSO without changing service business logic.

## Environment
Never commit real credentials. Use the supplied `.env.example` files.
