# HireHub

Job board with role-based access (Seeker, Recruiter, Admin), resume–job matching (ML), and admin dashboard.

## Features

- **Auth**: Register, login, forgot password, reset password (email link)
- **Seeker**: Profile + resume (PDF), browse jobs, apply with AI match score, track applications
- **Recruiter**: Post jobs (pending approval), my jobs, view/update application status
- **Admin**: Dashboard (counts, charts), approve/reject jobs
- **Backend**: Validation, error handler, indexes, extra APIs (GET job by id, my applications, my jobs, admin job list)
- **Frontend**: Responsive UI (Tailwind), all flows, mobile-friendly

## Run locally

### 1. Backend

```bash
cd backend
cp .env.example .env   # edit with your MongoDB, email, AWS, Cloudinary
npm install
npm run dev
```

Set `FRONTEND_URL=http://localhost:5173` for password reset links. Resume–job match scoring runs in the backend (Node.js, no separate ML service).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. API is proxied to `http://localhost:5004`.

## Scripts

| App       | Command       |
|----------|---------------|
| Backend  | `npm run dev` |
| Frontend | `npm run dev` |

## Roles

- **SEEKER**: Apply to jobs (resume required); match score and “recommended” from backend (TF-IDF + cosine similarity).
- **RECRUITER**: Create jobs (admin approval required), manage applications.
- **ADMIN**: Approve/reject jobs, view dashboard and charts.

## Forgot password

1. User requests reset on `/forgot-password` (email).
2. Backend sends email with link: `{FRONTEND_URL}/reset-password?token=...`
3. User sets new password on `/reset-password`; token valid 1 hour.
