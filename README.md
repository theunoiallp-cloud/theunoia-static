# THEUNOiA — Full Stack Project

Complete self-hosted backend, persistent SQLite database, and administrative portal paired with the THEUNOiA React + Vite frontend.

---

## Architecture Overview

```
theunoia-react/
├── backend/                  # Self-hosted Node.js + Express + SQLite backend
│   ├── src/
│   │   ├── config/           # Database schema & initialization
│   │   ├── middleware/       # Session-based auth & validation
│   │   ├── routes/           # /api/contact, /api/maker, /api/admin
│   │   ├── scripts/          # Password management & SQLite backups
│   │   └── server.js         # Server entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── theunoia-react/           # React + Vite frontend (Vercel-ready)
│   ├── src/
│   │   ├── pages/            # Public pages, BecomeMaker, Admin, AdminLogin
│   │   ├── config/           # API client configuration
│   │   └── ...
│   ├── .env.example          # Frontend API base URL template
│   ├── vercel.json           # Vercel deployment & client-side routing rules
│   └── package.json
│
├── .gitignore                # Protects secrets (.env) and databases (*.db)
└── README.md
```

---

## 1. Backend Setup & Run

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
cd backend
npm install
```

### Environment Configuration
Copy the example environment configuration:
```bash
cp .env.example .env
```
Edit `.env` as appropriate:
- `PORT`: Server port (default: `4000`)
- `DATABASE_PATH`: Path to SQLite database file (e.g., `./data/theunoia.db`)
- `BACKUP_PATH`: Path for database backups (e.g., `./backups`)
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins (e.g., `http://localhost:5173,https://theunoia.com`)
- `ADMIN_INITIAL_PASSWORD`: Initial admin password seeded on first database creation.

### Running Backend
```bash
# Start backend server
node src/server.js
```
The backend starts at `http://localhost:4000`.
Health check: `http://localhost:4000/api/health`

### Admin Management
To update the admin password:
```bash
node src/scripts/set-admin-password.js "<new-secure-password>"
```

### Backup & Restore
- **Backup**: `node src/scripts/backup.js`
- **Restore**: `node src/scripts/restore.js <path-to-backup.db>`

---

## 2. Frontend Setup & Run

### Installation
```bash
cd theunoia-react
npm install
```

### Environment Configuration
Copy the example environment configuration:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your backend instance:
- Local development: `http://localhost:4000`
- Production VPS: `https://api.yourdomain.com`

### Running Frontend
```bash
npm run dev
```
Accessible by default at `http://localhost:5173`.

---

## 3. Production Deployment Notes

### Frontend (Vercel)
- Set Root Directory to `theunoia-react` in Vercel project settings.
- Add environment variable `VITE_API_BASE_URL` set to the backend API domain.
- `vercel.json` handles Single Page App (SPA) client-side routing rewrites.

### Backend (Linux VPS)
- Deploy the `backend/` directory to a persistent Linux server (Ubuntu/Debian).
- Use `pm2` or `systemd` to keep the Express server running continuously.
- Put reverse proxy (Nginx or Caddy) in front with Let's Encrypt SSL/TLS.
- Persist SQLite database on disk (`/var/lib/theunoia/theunoia.db`).
- Configure a cron job for automated daily backups using `backend/src/scripts/backup.js`.
