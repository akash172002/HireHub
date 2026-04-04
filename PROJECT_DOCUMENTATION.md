# HireHub — Full Project Documentation
### Job Portal Web Application
**Academic Year:** 2025–2026 | **Viva Date:** April 4, 2026

---

## TABLE OF CONTENTS

1. [Project Abstract](#1-project-abstract)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [Module-wise Feature Description](#7-module-wise-feature-description)
8. [API Documentation](#8-api-documentation)
9. [AI / Resume Matching Algorithm](#9-ai--resume-matching-algorithm)
10. [Security Implementation](#10-security-implementation)
11. [File Upload & Cloud Storage](#11-file-upload--cloud-storage)
12. [Email Notification System](#12-email-notification-system)
13. [Frontend Architecture](#13-frontend-architecture)
14. [Team Contributions](#14-team-contributions)
15. [Installation & Setup Guide](#15-installation--setup-guide)
16. [Project Limitations & Future Scope](#16-project-limitations--future-scope)
17. [Viva Q&A — Expected Questions with Answers](#17-viva-qa--expected-questions-with-answers)

---

## 1. PROJECT ABSTRACT

**HireHub** is a full-stack web-based job portal that connects job seekers, recruiters, and administrators on a single unified platform. The application enables recruiters to post job vacancies, job seekers to search and apply for positions, and administrators to moderate and approve job listings.

A key differentiator of HireHub is its built-in **AI-powered resume matching system** that uses **TF-IDF (Term Frequency–Inverse Document Frequency)** vectorization combined with **cosine similarity** to automatically calculate how well a candidate's resume matches a job description. This score is computed in real-time at the point of application and presented to recruiters to help them shortlist candidates efficiently.

The application is built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and follows a RESTful API architecture. Files (resumes and profile photos) are stored on **Cloudinary**, and transactional emails are delivered via **Nodemailer** using Gmail SMTP.

---

## 2. PROBLEM STATEMENT

Traditional hiring processes are slow, manual, and inefficient:

- Recruiters receive hundreds of applications but have no easy way to rank candidates.
- Job seekers apply to jobs without knowing how well their profile fits the role.
- There is no centralized moderation — fraudulent or duplicate job posts go unchecked.
- Email-based applications result in lost data and zero tracking.
- Small companies cannot afford enterprise ATS (Applicant Tracking Systems) like Workday or Greenhouse.

**HireHub solves these problems by:**
- Automating resume-to-job matching using NLP algorithms.
- Providing a transparent application tracking system for seekers.
- Giving recruiters a ranked list of applicants by match score.
- Enforcing an admin approval workflow before jobs go live.
- Being a lightweight, open-source alternative to expensive ATS platforms.

---

## 3. PROJECT OBJECTIVES

1. Build a multi-role authentication system (Seeker, Recruiter, Admin) using JWT.
2. Allow recruiters to post jobs that go through an admin approval workflow before being visible to seekers.
3. Implement a job search and filter system (by keyword, location, company, skills).
4. Enable job seekers to upload their resumes (PDF) and apply to jobs.
5. Automatically compute a **match score (0–100%)** between resume content and job description using TF-IDF + cosine similarity.
6. Allow recruiters to view all applicants ranked by match score and update application statuses.
7. Build an admin dashboard with analytics charts (jobs posted per month, approval ratio).
8. Send automated email notifications at key events (registration, job post, application confirmation, status update).
9. Store all files securely on Cloudinary CDN.
10. Build a responsive, modern UI with React and Tailwind CSS.

---

## 4. TECHNOLOGY STACK

### 4.1 Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime for server-side code |
| **Express.js** | 5.2.1 | HTTP web framework, routing, middleware |
| **MongoDB** | Atlas (Cloud) | NoSQL document database for flexible schemas |
| **Mongoose** | 9.0.1 | MongoDB ODM — schema definition, validation, queries |
| **JSON Web Token (JWT)** | 9.0.3 | Stateless authentication tokens |
| **bcryptjs** | 2.x | Password hashing with salt rounds |
| **Cloudinary** | 2.x | Cloud-based file storage (resumes, photos) |
| **Multer** | 1.x | Multipart form data handling for file uploads |
| **Nodemailer** | 6.x | Email delivery via Gmail SMTP |
| **pdf-parse** | 1.x | PDF text extraction for resume parsing |
| **dotenv** | 16.x | Environment variable management |
| **nodemon** | 3.x | Dev server auto-restart |

### 4.2 Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 19.2.0 | UI component library |
| **React Router** | 7.13.0 | Client-side routing and navigation |
| **Axios** | 1.13.5 | HTTP client for API calls |
| **Vite** | 7.3.1 | Frontend build tool and dev server |
| **Tailwind CSS** | 4.2.0 | Utility-first CSS framework |
| **Lucide React** | Latest | SVG icon library |
| **Context API** | Built-in | Global state management for auth |

### 4.3 Why MERN Stack?

- **MongoDB** is schema-flexible, perfect for a job portal where job descriptions and user profiles have varying fields.
- **Express.js** is minimal and un-opinionated — ideal for building REST APIs quickly.
- **React.js** enables component reuse, fast rendering via virtual DOM, and a rich ecosystem.
- **Node.js** allows the same language (JavaScript) across frontend and backend, reducing context-switching and improving team productivity.

---

## 5. SYSTEM ARCHITECTURE

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│   React.js (Vite) — running on localhost:5173 / Vercel      │
│   Components → Pages → Context (AuthContext) → Axios API    │
└───────────────────────────┬─────────────────────────────────┘
                            │  HTTPS REST API calls
                            │  Authorization: Bearer <JWT>
┌───────────────────────────▼─────────────────────────────────┐
│                        SERVER LAYER                          │
│         Express.js — running on localhost:5004               │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────┐ │
│  │  /auth   │  │ /users   │  │    /jobs    │  │ /admin  │ │
│  │ Routes   │  │ Routes   │  │   Routes    │  │ Routes  │ │
│  └────┬─────┘  └────┬─────┘  └─────┬───────┘  └────┬────┘ │
│       │             │              │                │       │
│  ┌────▼─────────────▼──────────────▼────────────────▼────┐ │
│  │              Middleware Layer                          │ │
│  │  protect (JWT verify) → authorize (role check)        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Controller Layer                           │ │
│  │  authController | jobController | applicationController │ │
│  │  adminController | userController                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │               Utility Layer                             │ │
│  │  matchScore.js (TF-IDF) | pdfParser.js | sendEmail.js  │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────┬─────────────────────────────────────────┘
                    │
       ┌────────────┼──────────────┐
       │            │              │
┌──────▼──────┐  ┌──▼──────┐  ┌──▼──────────┐
│  MongoDB    │  │Cloudinary│  │  Gmail SMTP  │
│  Atlas      │  │  CDN     │  │  Nodemailer  │
│  (Database) │  │(Files)   │  │  (Emails)    │
└─────────────┘  └──────────┘  └─────────────┘
```

### 5.2 Request-Response Lifecycle

```
User Action (e.g., Apply to Job)
  → React Component (JobDetail.jsx)
  → Axios POST /api/applications  [with JWT token in header]
  → Express Router (applicationRoutes.js)
  → protect middleware (validates JWT, attaches req.user)
  → authorize("SEEKER") middleware (checks role)
  → applicationController.applyJob()
    → Check if user has resume (User model)
    → Check duplicate application (Application model)
    → Fetch resume PDF from Cloudinary URL
    → pdfParser.js → extract resume text
    → matchScore.js → TF-IDF + cosine similarity
    → Save Application document to MongoDB
    → sendEmail.js → confirmation to user
  → Response: { matchScore, recommended, status }
  → React updates UI (success message, match score displayed)
```

---

## 6. DATABASE DESIGN

### 6.1 Collections Overview

HireHub uses **4 MongoDB collections**:

```
hirehub_db
├── users          (stores all users: seekers, recruiters, admins)
├── jobs           (stores all job postings)
├── applications   (stores all job applications)
└── resettokens    (stores temporary password reset tokens)
```

### 6.2 Entity Relationship (Logical)

```
USER (1) ──────< JOBS (posted by recruiter)
USER (1) ──────< APPLICATIONS (submitted by seeker)
JOB  (1) ──────< APPLICATIONS (received for a job)
USER (1) ──── RESETTOKEN (for password recovery)
```

### 6.3 User Schema

```javascript
{
  _id:           ObjectId  (auto-generated primary key)
  name:          String    (display name)
  email:         String    (unique, used for login)
  password:      String    (bcrypt hashed, 10 salt rounds)
  role:          String    (enum: "SEEKER" | "RECRUITER" | "ADMIN")
  bio:           String    (personal/professional summary)
  skills:        [String]  (array of skill tags)
  profilePhoto:  String    (Cloudinary URL)
  resume:        String    (Cloudinary URL to PDF)
  resumePublicId: String   (Cloudinary public_id for management)
  createdAt:     Date
  updatedAt:     Date
}
Indexes: email (unique), role
```

### 6.4 Job Schema

```javascript
{
  _id:         ObjectId
  title:       String   (job title, e.g., "React Developer")
  description: String   (full job description — used for AI matching)
  skills:      [String] (required skills, e.g., ["React", "Node.js"])
  salary:      String   (e.g., "₹8–12 LPA")
  location:    String   (e.g., "Bengaluru")
  company:     String   (company name)
  postedBy:    ObjectId (ref: User — the recruiter)
  status:      String   (enum: "PENDING" | "APPROVED" | "REJECTED")
  createdAt:   Date
  updatedAt:   Date
}
Indexes: text index on title+description+company (for search)
         compound index on status+createdAt (for filtering)
         index on postedBy (for recruiter's job list)
```

### 6.5 Application Schema

```javascript
{
  _id:          ObjectId
  jobId:        ObjectId  (ref: Job)
  userId:       ObjectId  (ref: User — the applicant)
  resume:       String    (snapshot of resume URL at time of apply)
  status:       String    (enum: "Applied" | "Shortlisted" | "Rejected")
  matchScore:   Number    (0–100, calculated by TF-IDF algorithm)
  recommended:  Boolean   (true if matchScore >= 60)
  createdAt:    Date
  updatedAt:    Date
}
Unique Index: { jobId, userId }  ← prevents duplicate applications
```

### 6.6 ResetToken Schema

```javascript
{
  _id:       ObjectId
  userId:    ObjectId  (ref: User)
  token:     String    (crypto.randomBytes(32).toString("hex"))
  expiresAt: Date      (createdAt + 1 hour)
}
TTL Index on expiresAt → MongoDB auto-deletes expired tokens
```

---

## 7. MODULE-WISE FEATURE DESCRIPTION

### MODULE 1: Authentication System

**Pages:** `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`
**Backend:** `authController.js`, `authRoutes.js`

**Features:**
- **Registration:** Users select their role (Seeker or Recruiter) during signup. Passwords are hashed with bcrypt before storage. Admin accounts are created manually in the database.
- **Login:** Email + password validation. On success, a JWT token (7-day expiry) is returned and stored in `localStorage`.
- **Forgot Password:** User submits their email. A cryptographically secure token (32 random bytes) is generated, stored in `resettokens` collection with 1-hour TTL, and emailed as a link.
- **Reset Password:** Token is validated, checked for expiry, and new password is hashed and saved. Token is deleted after use.

**Security Measures:**
- The forgot-password response is the same whether the email exists or not — prevents user enumeration attacks.
- JWT tokens carry only `{ id, role }` — minimal payload.

---

### MODULE 2: User Profile Management

**Page:** `Profile.jsx`
**Backend:** `userController.js`, `userRoutes.js`

**Features:**
- Users can update their name, bio, and skills (comma-separated).
- Upload a **profile photo** (any image format, max 5MB) — stored on Cloudinary.
- Seekers can upload their **resume as PDF** (max 5MB) — stored on Cloudinary.
- Profile photo preview updates instantly before save.
- Resume viewer opens the Cloudinary PDF in a new browser tab.

**Upload Flow:**
```
Frontend FormData → Multer (memoryStorage) → Cloudinary stream upload
→ Cloudinary returns secure_url → saved to User document in MongoDB
```

---

### MODULE 3: Job Management

**Pages:** `Jobs.jsx`, `JobDetail.jsx`, `PostJob.jsx`, `RecruiterJobs.jsx`
**Backend:** `jobController.js`, `jobRoutes.js`

**Features:**
- **Post Job (Recruiter):** Recruiter fills in title, description, skills, salary, location, company. Job is created with `status: "PENDING"`. Admin is notified by email. All registered seekers also receive a notification email.
- **Browse Jobs (Public):** Only `APPROVED` jobs are shown. Supports text search (title, description, company), filter by location and company, and pagination.
- **Job Detail (Public):** Full description, skills, company info. Seekers see an "Apply" button.
- **Recruiter Dashboard:** Recruiter can view all their posted jobs with current status (PENDING/APPROVED/REJECTED) and pagination.

---

### MODULE 4: Application System

**Pages:** `JobDetail.jsx`, `MyApplications.jsx`, `JobApplications.jsx`
**Backend:** `applicationController.js`, `applicationRoutes.js`

**Features:**
- **Apply to Job (Seeker):** Seeker must have a resume uploaded. System checks for duplicate application. Resume is downloaded from Cloudinary, parsed, and a match score is calculated. Application is saved with the score.
- **My Applications (Seeker):** Shows all applications with job title, company, current status, match score, and a colour-coded progress bar.
- **View Applicants (Recruiter):** All applicants for a job, sorted by match score (highest first). Shows recommended flag for scores ≥ 60%.
- **Update Status (Recruiter):** Recruiter can move an application from `Applied` → `Shortlisted` or `Rejected`. An email is automatically sent to the seeker.

---

### MODULE 5: Admin Dashboard

**Page:** `AdminDashboard.jsx`
**Backend:** `adminController.js`, `adminRoutes.js`

**Features:**
- **Stats Cards:** Total jobs, approved jobs, rejected jobs, unique companies, total recruiters — fetched via MongoDB aggregation.
- **Bar Chart (Jobs Posted by Month):** Uses MongoDB `$group` aggregation on `createdAt` field to show monthly job posting trends.
- **Pie Chart (Approval Status):** Aggregates jobs by status (PENDING / APPROVED / REJECTED).
- **Job Approval Queue:** Paginated list of all jobs. Admin can filter by status. Each pending job has Approve/Reject buttons.
- **Approval Action:** On clicking Approve/Reject, job status is updated in MongoDB and an email is sent to the recruiter.

---

## 8. API DOCUMENTATION

**Base URL:** `http://localhost:5004/api`
**Auth Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 8.1 Authentication Endpoints

#### POST `/auth/register`
**Description:** Register a new user account.
**Auth:** None
**Request Body:**
```json
{
  "name": "Akash Sarraf",
  "email": "akash@example.com",
  "password": "SecurePass123",
  "role": "SEEKER"
}
```
**Response (201):**
```json
{ "message": "Registration successful" }
```
**Errors:** `400` — Email already registered | `400` — Empty body

---

#### POST `/auth/login`
**Description:** Login and receive JWT token.
**Auth:** None
**Request Body:**
```json
{ "email": "akash@example.com", "password": "SecurePass123" }
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Akash Sarraf",
    "email": "akash@example.com",
    "role": "SEEKER",
    "bio": null,
    "skills": [],
    "profilePhoto": null,
    "resume": null
  }
}
```

---

#### POST `/auth/forgot-password`
**Description:** Send password reset email.
**Auth:** None
**Request Body:** `{ "email": "akash@example.com" }`
**Response (200):** `{ "message": "If that email exists, we sent a reset link." }`

---

#### POST `/auth/reset-password`
**Description:** Set a new password using reset token.
**Auth:** None
**Request Body:** `{ "token": "abc123...", "newPassword": "NewPass456" }`
**Response (200):** `{ "message": "Password updated. You can log in now." }`

---

### 8.2 User Endpoints

#### GET `/users/me`
**Auth:** JWT (any role)
**Response (200):** Full user object (password excluded)

#### PUT `/users/me`
**Auth:** JWT (any role)
**Content-Type:** `multipart/form-data`
**Fields:** `name`, `bio`, `skills` (text) + `photo` (image file) + `resume` (PDF file)
**Response (200):** Updated user object

#### GET `/users/me/resume`
**Auth:** JWT (any role)
**Response (200):** `{ "url": "https://res.cloudinary.com/..." }`

---

### 8.3 Job Endpoints

#### POST `/jobs`
**Auth:** JWT (RECRUITER only)
**Request Body:**
```json
{
  "title": "Full Stack Developer",
  "description": "We are looking for...",
  "skills": ["React", "Node.js", "MongoDB"],
  "salary": "₹10–15 LPA",
  "location": "Hyderabad",
  "company": "TechCorp Pvt Ltd"
}
```
**Response (201):** Created job object with `status: "PENDING"`

#### GET `/jobs`
**Auth:** None
**Query Params:** `?page=1&limit=9&search=react&location=Bangalore&company=TechCorp&skills=Node.js`
**Response (200):**
```json
{
  "jobs": [...],
  "total": 45,
  "page": 1,
  "pages": 5
}
```

#### GET `/jobs/:id`
**Auth:** None
**Response (200):** Job object with `postedBy` populated (recruiter name + email)

#### GET `/jobs/my`
**Auth:** JWT (RECRUITER)
**Query:** `?page=1&limit=10`
**Response (200):** `{ "jobs": [...], "total": 8, "pages": 1 }`

---

### 8.4 Application Endpoints

#### POST `/applications`
**Auth:** JWT (SEEKER)
**Request Body:** `{ "jobId": "64f1a2b3c4d5e6f7a8b9c0d1" }`
**Response (201):**
```json
{
  "message": "Application submitted",
  "matchScore": 74,
  "recommended": true
}
```
**Errors:** `400` — No resume uploaded | `400` — Already applied | `404` — Job not found

#### GET `/applications/my`
**Auth:** JWT (SEEKER)
**Response (200):** Array of applications with populated job details

#### GET `/applications/job/:jobId`
**Auth:** JWT (RECRUITER)
**Response (200):** Array of applications sorted by matchScore descending

#### PUT `/applications/:id`
**Auth:** JWT (RECRUITER)
**Request Body:** `{ "status": "Shortlisted" }`
**Response (200):** Updated application object

---

### 8.5 Admin Endpoints

#### GET `/admin/dashboard/counts`
**Auth:** JWT (ADMIN)
**Response (200):**
```json
{
  "totalJobs": 120,
  "approvedJobs": 85,
  "rejectedJobs": 20,
  "totalCompanies": 34,
  "totalRecruiters": 41
}
```

#### GET `/admin/dashboard/jobs-chart`
**Auth:** JWT (ADMIN)
**Response (200):** `[{ "_id": "2026-01", "count": 12 }, ...]`

#### GET `/admin/dashboard/approval-chart`
**Auth:** JWT (ADMIN)
**Response (200):** `[{ "_id": "APPROVED", "count": 85 }, ...]`

#### GET `/admin/jobs`
**Auth:** JWT (ADMIN)
**Query:** `?page=1&limit=10&status=PENDING`
**Response (200):** `{ "jobs": [...], "total": 15, "pages": 2 }`

#### PUT `/admin/job/:id/status`
**Auth:** JWT (ADMIN)
**Request Body:** `{ "status": "APPROVED" }` or `{ "status": "REJECTED" }`
**Response (200):** Updated job object

---

## 9. AI / RESUME MATCHING ALGORITHM

### 9.1 Overview

When a seeker applies to a job, HireHub automatically calculates a **compatibility score (0–100%)** by comparing the seeker's resume content with the job description. This is implemented in `/backend/utils/matchScore.js` using standard NLP techniques — no external ML API is required.

### 9.2 Algorithm: TF-IDF + Cosine Similarity

**Step 1 — Text Collection**
```
Input A: Resume text (extracted from PDF via pdf-parse)
Input B: Job description + job title + required skills (concatenated)
```

**Step 2 — Tokenization & Normalization**
```
- Convert to lowercase
- Split by whitespace and punctuation
- Remove stop words (common words like "the", "and", "is")
- Result: two arrays of meaningful tokens
```

**Step 3 — TF-IDF Vectorization**
```
TF (Term Frequency)  = (count of term in document) / (total terms in document)
IDF (Inverse Document Frequency) = log(total documents / documents containing term)
TF-IDF score = TF × IDF

Each document is represented as a vector of TF-IDF scores for all unique terms
```

**Step 4 — Cosine Similarity**
```
similarity = (A · B) / (|A| × |B|)

Where:
  A · B = dot product of resume vector and job vector
  |A|   = magnitude of resume vector
  |B|   = magnitude of job vector

Result: a value between 0 and 1
```

**Step 5 — Score & Recommendation**
```
matchScore  = similarity × 100     (rounded to nearest integer)
recommended = matchScore >= 60     (boolean flag)
```

### 9.3 Why TF-IDF?

| Approach | Pros | Cons |
|---|---|---|
| **TF-IDF (chosen)** | No external API, fast, interpretable, works offline | Misses semantic meaning ("developer" ≠ "engineer") |
| Word2Vec / BERT | Understands semantic similarity | Requires GPU/heavy model, complex setup |
| Simple keyword matching | Very fast | Too crude, easily gamed |

TF-IDF is the right choice for an academic project — it demonstrates NLP knowledge without infrastructure complexity.

### 9.4 Example

**Job Description:** *"We need a React developer with experience in Node.js and MongoDB for a full stack role."*

**Resume:** *"Proficient in React.js, Express.js, MongoDB. Built multiple full stack applications."*

**Result:** Score ~72%, Recommended = true (because "React", "MongoDB", "full stack" appear in both)

---

## 10. SECURITY IMPLEMENTATION

### 10.1 Authentication — JWT (JSON Web Tokens)

```
1. User logs in → server generates: jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" })
2. Token stored in browser localStorage
3. Every API request sends: Authorization: Bearer <token>
4. Server verifies: jwt.verify(token, JWT_SECRET) → extracts { id, role }
5. Expired/tampered tokens throw errors → user is redirected to login
```

**Why JWT over Sessions?**
- Stateless — server doesn't store session state, scales horizontally
- Self-contained — payload carries role without DB lookup
- Cross-domain friendly

### 10.2 Password Security — bcrypt

```javascript
// Registration: hash with 10 salt rounds
const hashed = await bcrypt.hash(password, 10);

// Login: compare plaintext against hash
const isMatch = await bcrypt.compare(password, user.password);
```
- 10 salt rounds = 2^10 = 1024 hashing iterations
- Even if the database is compromised, passwords cannot be reversed

### 10.3 Role-Based Access Control (RBAC)

```
Public Routes:     /auth/*, GET /jobs, GET /jobs/:id
SEEKER only:       POST /applications, GET /applications/my, GET/PUT /users/me
RECRUITER only:    POST /jobs, GET /jobs/my, GET /applications/job/:id, PUT /applications/:id
ADMIN only:        GET/PUT /admin/*
```

The `authorize(...roles)` middleware checks `req.user.role` against the allowed roles array. Unauthorized access returns `403 Forbidden`.

### 10.4 Other Security Measures

- **User enumeration prevention:** Forgot-password returns the same message regardless of whether the email exists.
- **Duplicate application prevention:** Unique compound index `{jobId, userId}` at the database level.
- **Token expiry:** Reset tokens have a 1-hour TTL enforced by MongoDB's TTL index.
- **File type validation:** Multer restricts photo uploads to images and resume uploads to PDFs.
- **CORS:** The backend only accepts requests from the configured `FRONTEND_URL`.
- **Environment Variables:** All secrets (JWT_SECRET, DB URI, Cloudinary keys) are in `.env`, never hardcoded.

---

## 11. FILE UPLOAD & CLOUD STORAGE

### 11.1 Upload Pipeline

```
User selects file in browser
  → React reads file into FormData object
  → Axios POST with Content-Type: multipart/form-data
  → Multer middleware (memoryStorage) — file buffered in RAM, not disk
  → userController reads req.files.photo[0].buffer or req.files.resume[0].buffer
  → cloudinary.uploader.upload_stream() — streams buffer to Cloudinary
  → Cloudinary stores file, returns { secure_url, public_id }
  → secure_url saved to User.profilePhoto or User.resume in MongoDB
```

### 11.2 Why Cloudinary?

- Free tier supports up to 25 GB storage and 25 GB bandwidth/month.
- Automatic CDN delivery — files load fast globally.
- Supports image transformations (resize, crop, format convert).
- HTTPS URLs by default — secure for resume delivery.
- No need to manage your own file server.

### 11.3 Why memoryStorage (not diskStorage)?

- `diskStorage` writes temp files to the server's filesystem — problematic on cloud platforms (Heroku, Vercel) where the filesystem is ephemeral.
- `memoryStorage` keeps the file in RAM as a `Buffer`, which we pipe directly to Cloudinary without touching disk.
- Cleaner, serverless-compatible architecture.

---

## 12. EMAIL NOTIFICATION SYSTEM

### 12.1 Events That Trigger Emails

| Event | Recipient | Content |
|---|---|---|
| New job posted by recruiter | Admin + all registered Seekers | Job title, company, link to apply |
| Application submitted | Seeker (applicant) | Job title, match score, tracking info |
| Application status changed | Seeker | New status (Shortlisted / Rejected) |
| Job status updated by admin | Recruiter | Approved or rejected |
| Password reset requested | User | Reset link (expires 1 hour) |

### 12.2 Implementation

```javascript
// utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER) return; // gracefully skip if not configured
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};
```

**Note:** Gmail requires an **App Password** (not the regular account password) when 2-Step Verification is enabled.

---

## 13. FRONTEND ARCHITECTURE

### 13.1 Folder Structure

```
frontend/src/
├── api/
│   └── axios.js          ← Axios instance with JWT interceptor
├── context/
│   └── AuthContext.jsx   ← Global auth state (login/logout/updateUser)
├── components/
│   ├── Layout.jsx        ← Navigation, header, footer wrapper
│   └── ProtectedRoute.jsx ← Role-based route guard
└── pages/
    ├── Home.jsx
    ├── Login.jsx
    ├── Register.jsx
    ├── ForgotPassword.jsx
    ├── ResetPassword.jsx
    ├── Profile.jsx
    ├── Jobs.jsx
    ├── JobDetail.jsx
    ├── MyApplications.jsx
    ├── PostJob.jsx
    ├── RecruiterJobs.jsx
    ├── JobApplications.jsx
    └── AdminDashboard.jsx
```

### 13.2 Auth Context & State Management

```javascript
// AuthContext provides:
{
  user: { _id, name, email, role, profilePhoto, resume, ... },
  login(token, userData),   // saves to localStorage + state
  logout(),                 // clears localStorage + state
  updateUser(updatedData),  // updates profile without re-login
}
```

- Context is consumed via the `useAuth()` hook across all pages.
- On browser tab focus, the context re-syncs with localStorage (multi-tab safety).

### 13.3 Axios Interceptors

```
Request Interceptor:
  → Reads token from localStorage
  → Adds "Authorization: Bearer <token>" to every request automatically

Response Interceptor:
  → 401 Unauthorized → redirect to /login (token expired)
  → 403 Forbidden    → redirect to /    (wrong role)
```

### 13.4 Protected Routes

```
<ProtectedRoute roles={["SEEKER"]}>
  <MyApplications />
</ProtectedRoute>
```

The `ProtectedRoute` component checks:
1. Is the user logged in? (if not → redirect to /login)
2. Does the user have the required role? (if not → redirect to /)

### 13.5 Routing Structure

| Path | Component | Access |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | ForgotPassword | Public |
| `/reset-password` | ResetPassword | Public |
| `/jobs` | Jobs | Public |
| `/jobs/:id` | JobDetail | Public |
| `/profile` | Profile | Any logged-in user |
| `/my-applications` | MyApplications | SEEKER |
| `/recruiter/post` | PostJob | RECRUITER |
| `/recruiter/jobs` | RecruiterJobs | RECRUITER |
| `/recruiter/jobs/:id/applications` | JobApplications | RECRUITER |
| `/admin` | AdminDashboard | ADMIN |

---

## 14. TEAM CONTRIBUTIONS

> **Note:** Replace "Member 1", "Member 2", "Member 3" with your actual team member names.

---

### Member 1 — [Your Name Here]
**Role: Backend Developer & System Architect**

| Area | Contribution |
|---|---|
| Project Setup | Initialized Node.js/Express server, configured MongoDB Atlas, set up project folder structure, `.env` configuration |
| Authentication | Built complete `authController.js` — register, login, forgot password, reset password with JWT and bcrypt |
| Middleware | Wrote `authMiddleware.js` — JWT `protect` and role-based `authorize` middleware |
| Job Controller | Built `jobController.js` — post job, get jobs with filters/pagination, get recruiter jobs, get job by ID |
| Database | Designed all 4 Mongoose schemas (User, Job, Application, ResetToken) with proper indexes and TTL |
| Email System | Built `sendEmail.js` using Nodemailer — integrated email triggers across all controllers |
| Security | Implemented password hashing, user enumeration prevention, duplicate application prevention |
| API Design | Defined all RESTful routes across 5 route files |

---

### Member 2 — [Teammate Name Here]
**Role: Frontend Developer & UI/UX Designer**

| Area | Contribution |
|---|---|
| Project Setup | Initialized React + Vite project, configured Tailwind CSS, set up React Router |
| Auth Pages | Built `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` with form validation |
| Job Pages | Built `Jobs.jsx` (search, filter, pagination), `JobDetail.jsx` (full detail + apply button) |
| Recruiter Pages | Built `PostJob.jsx` (job form), `RecruiterJobs.jsx` (job list), `JobApplications.jsx` (applicants table with match scores) |
| Profile Page | Built `Profile.jsx` with photo upload, resume upload, skills editor, live preview |
| Layout | Built `Layout.jsx` (responsive nav, role-aware menu), `ProtectedRoute.jsx` |
| Styling | Designed gradient UI system, card components, animations, responsive breakpoints |
| UX | Implemented loading spinners, error/success states, empty state screens |

---

### Member 3 — [Teammate Name Here]
**Role: Full-Stack Integration & AI/ML Developer**

| Area | Contribution |
|---|---|
| AI Matching | Researched and implemented `matchScore.js` — TF-IDF algorithm + cosine similarity for resume matching |
| PDF Parsing | Implemented `pdfParser.js` using pdf-parse to extract text from Cloudinary-hosted PDFs |
| Application System | Built `applicationController.js` — apply logic, duplicate checks, match score pipeline, status updates |
| Admin Module | Built `adminController.js` + `AdminDashboard.jsx` — stats aggregation, charts, job approval workflow |
| File Uploads | Configured Multer (memoryStorage) + Cloudinary integration in `upload.js` and `userController.js` |
| Auth Context | Built `AuthContext.jsx` + `axios.js` with JWT interceptors and tab-sync logic |
| My Applications | Built `MyApplications.jsx` — match score bars, status tracker, progress visualization |
| Integration Testing | Tested all API endpoints, fixed route-controller mismatches, verified end-to-end flows |

---

## 15. INSTALLATION & SETUP GUIDE

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd HireHub
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `/backend/.env`:
```env
PORT=5004
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirehub
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
```

```bash
npm run dev    # starts backend with nodemon on port 5004
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
```

Create `/frontend/.env`:
```env
VITE_API_URL=http://localhost:5004/api
```

```bash
npm run dev    # starts Vite dev server on port 5173
```

### Step 4: Create Admin Account
Since there is no admin registration UI, create an admin user directly in MongoDB:
```javascript
// In MongoDB Atlas or Compass:
db.users.insertOne({
  name: "Admin",
  email: "admin@hirehub.com",
  password: "<bcrypt hash of your password>",
  role: "ADMIN"
})
```

### Step 5: Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5004/api`
- Health Check: `http://localhost:5004/api/health`

---

## 16. PROJECT LIMITATIONS & FUTURE SCOPE

### Current Limitations

1. **No real-time notifications** — Status updates are email-only; no WebSocket or push notifications.
2. **Basic resume parsing** — PDF text extraction may fail on image-based or heavily formatted PDFs.
3. **TF-IDF semantic gap** — "Software Engineer" and "Developer" are treated as different terms; semantic similarity (like BERT) would improve matching.
4. **No pagination on applications** — If a job gets thousands of applications, performance could degrade.
5. **No resume builder** — Users must upload an existing PDF; there's no in-app resume creation.
6. **Admin created manually** — No admin registration flow exists in the UI.
7. **Single file size limit** — 5MB may be too small for high-resolution profile photos.

### Future Scope

1. **Advanced AI Matching** — Replace TF-IDF with a pre-trained BERT/Sentence-Transformer model for semantic similarity.
2. **Real-time Chat** — Add WebSocket-based messaging between recruiter and applicant using Socket.io.
3. **Video Interviews** — Integrate WebRTC for in-platform video screening.
4. **Resume Builder** — Drag-and-drop resume creation with PDF export.
5. **Company Profiles** — Dedicated company pages with culture, perks, team info.
6. **Mobile App** — React Native app using the same backend APIs.
7. **OAuth Login** — Google / LinkedIn login via Passport.js.
8. **Analytics for Recruiters** — Track job views, application conversion rates.
9. **Salary Benchmarking** — Show salary ranges for similar roles in the same city.
10. **Saved Jobs** — Bookmarking functionality for seekers.

---

## 17. VIVA Q&A — EXPECTED QUESTIONS WITH ANSWERS

---

### SECTION A: General & Project Overview Questions

---

**Q1. In one line, what is HireHub?**
> HireHub is a full-stack MERN job portal that connects job seekers and recruiters through an AI-powered resume matching system, with an admin moderation layer.

---

**Q2. Why did you choose the MERN stack for this project?**
> The MERN stack allows us to use JavaScript end-to-end — both frontend and backend — which reduces context switching and makes team collaboration easier. MongoDB's flexible document schema is ideal for a job portal where fields like job descriptions and user profiles vary in structure. React enables component reusability and fast rendering, and Express.js is lightweight and ideal for REST API design.

---

**Q3. How is your project different from existing job portals like Naukri or LinkedIn?**
> HireHub differs in three key ways: First, it has a built-in AI resume matching system that automatically scores how well a candidate's resume fits each job — existing portals charge employers premium for this. Second, it enforces an admin approval workflow before jobs go live, preventing spam. Third, it's lightweight and open-source — built specifically for small companies that cannot afford enterprise ATS software.

---

**Q4. What are the three roles in your system and what can each do?**
> - **SEEKER:** Can browse approved jobs, apply to jobs, track application status and match score, manage their profile and resume.
> - **RECRUITER:** Can post jobs (which go pending), view their posted jobs, see all applicants for each job sorted by match score, and update application statuses.
> - **ADMIN:** Can view analytics on the dashboard, see all jobs, and approve or reject job postings. Admin access unlocks the entire job visibility pipeline.

---

### SECTION B: Backend & Database Questions

---

**Q5. Why did you use MongoDB instead of a relational database like MySQL?**
> A job portal has varying data — different jobs require different fields, user profiles have dynamic skills arrays, and job descriptions can be long text. MongoDB's document model handles these naturally without requiring schema migrations. The aggregation pipeline also makes analytics queries (monthly job counts, approval ratios) very clean. However, for a banking system we would prefer MySQL for ACID transactions.

---

**Q6. Explain the JWT authentication flow in detail.**
> On login, the server takes the user's email and password, queries MongoDB for the user, verifies the password with bcrypt, and if valid, generates a JWT token signed with our JWT_SECRET — containing the user's `id` and `role`, with a 7-day expiry. This token is returned to the frontend and stored in `localStorage`. On every subsequent API request, the Axios interceptor automatically attaches it as `Authorization: Bearer <token>`. The `protect` middleware on the backend calls `jwt.verify()` to decode it — if the token is valid, `req.user` is set with the user's id and role. If expired or tampered, a `401` is returned and the frontend redirects to login.

---

**Q7. What is the difference between authentication and authorization? How do you implement both?**
> **Authentication** is verifying *who* the user is — done via JWT token verification in our `protect` middleware. **Authorization** is verifying *what* they can do — done via our `authorize(...roles)` middleware which checks `req.user.role` against the allowed roles. For example, `POST /jobs` uses `protect` (authentication) followed by `authorize("RECRUITER")` (authorization) — so even a logged-in SEEKER gets a `403 Forbidden`.

---

**Q8. Why did you store files on Cloudinary instead of MongoDB or the local server?**
> MongoDB is a database — storing binary file data in it (GridFS) is inefficient and expensive at scale. Storing files locally on the server is problematic on cloud platforms where the filesystem resets on each deployment. Cloudinary is purpose-built for media storage: it provides a CDN, automatic HTTPS, and generous free tier. It also generates a `public_id` that lets us update or delete files programmatically.

---

**Q9. Explain the difference between `diskStorage` and `memoryStorage` in Multer. Which did you use and why?**
> `diskStorage` writes uploaded files to the server's filesystem as temporary files. `memoryStorage` holds the file as a `Buffer` in RAM. We used `memoryStorage` because our cloud pipeline (Multer → Cloudinary) never needs the file on disk — we stream the buffer directly to Cloudinary via `upload_stream()`. This is cleaner, faster, and compatible with serverless/cloud deployments where the disk is ephemeral.

---

**Q10. What indexes have you created in MongoDB and why?**
> - **User.email — unique index:** Enforces email uniqueness and makes login queries fast.
> - **User.role — index:** Speeds up admin's query for counting total recruiters.
> - **Job text index (title + description + company):** Enables full-text search with MongoDB's `$text` operator.
> - **Job compound index (status + createdAt):** Optimizes the most common query — fetching APPROVED jobs sorted by date.
> - **Job.postedBy — index:** Speeds up recruiter's "my jobs" query.
> - **Application unique index (jobId + userId):** Prevents duplicate applications at the database level.
> - **ResetToken TTL index (expiresAt):** MongoDB automatically deletes expired tokens without manual cleanup.

---

**Q11. How do you prevent a user from applying to the same job twice?**
> Two layers of protection: First, the `applicationController` queries the database before saving — if an existing application with the same `jobId` and `userId` is found, it returns a `400` error. Second, a unique compound index `{ jobId: 1, userId: 1 }` on the Application collection enforces this at the database level — even if the application-level check fails, MongoDB will throw a duplicate key error.

---

**Q12. What is a TTL (Time To Live) index? How did you use it?**
> A TTL index in MongoDB is a special single-field index on a date field that instructs MongoDB to automatically delete documents after a specified number of seconds. We used it on the `ResetToken` collection's `expiresAt` field with `expireAfterSeconds: 0` — this means MongoDB deletes the document exactly at the datetime specified in `expiresAt`. This eliminates the need for a scheduled cleanup job to remove expired password reset tokens.

---

### SECTION C: AI / Algorithm Questions

---

**Q13. Explain your resume matching algorithm step by step.**
> When a seeker applies, we:
> 1. Download the PDF from Cloudinary and extract its text using `pdf-parse`
> 2. Combine the job's title, description, and skills into a single string
> 3. Tokenize both texts — lowercase, split by spaces/punctuation, remove stop words
> 4. Build a vocabulary of all unique terms across both documents
> 5. Calculate TF-IDF vectors for each document — TF (how often term appears in document) × IDF (log of total docs / docs containing the term)
> 6. Compute cosine similarity between the two vectors: dot product divided by product of magnitudes
> 7. Multiply by 100 to get a percentage score. If score ≥ 60, mark `recommended = true`

---

**Q14. What is TF-IDF and why is it used in NLP?**
> TF-IDF stands for Term Frequency–Inverse Document Frequency. TF measures how often a word appears in a document — frequent words get higher TF scores. IDF penalizes words that appear in many documents (like "the", "and") by taking the log of total documents divided by documents containing that word. Multiplying them gives a weight that highlights words important to a specific document but rare overall. This is ideal for resume matching because it amplifies domain-specific keywords like "React" or "MongoDB" while ignoring common words.

---

**Q15. What is cosine similarity? Why use it instead of Euclidean distance?**
> Cosine similarity measures the angle between two vectors — it equals the dot product of the vectors divided by the product of their magnitudes. The result is between 0 (completely different) and 1 (identical). We prefer it over Euclidean distance because cosine similarity is **length-invariant** — a short resume and a long resume with similar content will still score high, whereas Euclidean distance would penalize the length difference. In NLP, document length varies greatly, so cosine similarity is the standard.

---

**Q16. What would you improve about your matching algorithm if you had more time?**
> The current TF-IDF approach doesn't understand semantics — "developer" and "engineer" are treated as completely different terms. Given more time, I would replace it with a pre-trained **sentence transformer model (like all-MiniLM-L6-v2 from Hugging Face)**. This would embed both the resume and job description into dense semantic vectors and compute similarity — it would correctly match "JS developer" with "JavaScript engineer". We'd run this as a Python microservice using FastAPI, and the Node.js backend would call it via HTTP.

---

**Q17. What is pdf-parse and how does it work in your project?**
> `pdf-parse` is a Node.js library that extracts plain text from PDF files. It parses the PDF binary structure to find text content streams and returns them as a string. In our project, when a seeker applies to a job, we fetch the PDF from its Cloudinary URL (using axios), pass the response buffer to `pdf-parse`, and it returns all the text. This text is then fed into our TF-IDF matching algorithm. If parsing fails (e.g., image-based PDF), we fall back to an empty string, resulting in a 0 match score.

---

### SECTION D: Frontend & React Questions

---

**Q18. What is React Context API and why did you use it instead of Redux?**
> Context API is React's built-in mechanism for sharing state across components without prop drilling. We used it for `AuthContext` to provide `user`, `login`, `logout`, and `updateUser` to any component in the tree. We chose Context API over Redux because our global state is simple — just the authenticated user object. Redux adds significant boilerplate (actions, reducers, store) that's only justified for large-scale apps with complex state interactions. Context + `useReducer` would be the next step up if needed.

---

**Q19. What are Axios interceptors and what do you use them for?**
> Interceptors are middleware functions that run before every request is sent or after every response is received. Our **request interceptor** automatically reads the JWT token from localStorage and appends it to every outgoing request's `Authorization` header — so individual pages don't need to manually attach the token. Our **response interceptor** globally handles `401 Unauthorized` (token expired → redirect to login) and `403 Forbidden` (wrong role → redirect to home), so every page gets this behavior automatically.

---

**Q20. What is `ProtectedRoute` and how does it work?**
> `ProtectedRoute` is a custom React component that wraps pages requiring authentication. It reads the `user` from `AuthContext` — if the user is not logged in, it redirects to `/login` using React Router's `<Navigate>`. If a `roles` prop is provided and the user's role isn't in that list, it redirects to `/`. This is used throughout `App.jsx` to guard role-specific pages — for example, the admin dashboard is only accessible if `user.role === "ADMIN"`.

---

**Q21. Why did you use Vite instead of Create React App (CRA)?**
> Vite is significantly faster than CRA in both dev startup and hot module replacement. CRA bundles everything with Webpack on every change; Vite uses native ES modules in development and only transforms changed files — making the dev server near-instant. Vite also produces a smaller production build and has better support for modern React (React 19). CRA is largely unmaintained now and Vite has become the industry standard for new React projects.

---

### SECTION E: Advanced & Design Questions

---

**Q22. What is CORS and how did you configure it?**
> CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks requests from one origin (e.g., `localhost:5173`) to a different origin (e.g., `localhost:5004`). Without CORS headers, the browser rejects our frontend's API calls. In `server.js`, we use the `cors` middleware with `origin: process.env.FRONTEND_URL` — this tells the browser that requests from our frontend URL are allowed. We keep the allowed origin strict (not `*`) to prevent other websites from calling our API.

---

**Q23. What is the approval workflow for job postings? Why is it needed?**
> When a recruiter posts a job, it's created with `status: "PENDING"`. It does not appear in the public job listing (`GET /jobs` only returns APPROVED jobs). The admin reviews it in the dashboard and clicks Approve or Reject. On approval, the job becomes visible to seekers and the recruiter is notified by email. This workflow prevents spam job postings, fraudulent listings, and jobs with inappropriate content — important for maintaining platform trust.

---

**Q24. How would you handle scaling this application to 1 million users?**
> Several changes would be needed:
> 1. **Horizontal scaling** — Run multiple Node.js instances behind a load balancer (e.g., AWS ELB). JWT's statelessness makes this easy — no shared session store needed.
> 2. **Database scaling** — MongoDB Atlas supports sharding for distributed writes. Add read replicas for heavy read operations.
> 3. **Queue-based emails** — Move email sending to a background queue (Bull + Redis) so it doesn't block API responses.
> 4. **Caching** — Cache job listings in Redis (they don't change frequently), reducing MongoDB load.
> 5. **CDN** — Cloudinary already handles file CDN. Use a CDN for the static React build too.
> 6. **Rate limiting** — Add express-rate-limit to prevent brute-force attacks on auth endpoints.

---

**Q25. What is the difference between `PUT` and `PATCH` HTTP methods? Which did you use and why?**
> `PUT` replaces the entire resource — the request body must contain the full updated object. `PATCH` partially updates a resource — only the provided fields are changed. We used `PUT` for `/users/me` and `/applications/:id` because in both cases we're updating the whole entity's mutable fields (profile data or application status). Technically, `PATCH` would be more semantically correct for partial updates like just changing `status`, but `PUT` is widely acceptable in practice and simpler to implement.

---

**Q26. How does the password reset flow work and what makes it secure?**
> 1. User submits email → we generate `crypto.randomBytes(32).toString("hex")` — a 64-character random hex string — stored in `resettokens` collection with a 1-hour expiry.
> 2. A link containing this token is emailed to the user.
> 3. User clicks the link → frontend extracts the token and shows a new password form.
> 4. User submits new password → backend finds the token in DB, checks it's not expired, hashes new password with bcrypt, saves to user, and deletes the token.
>
> **Security features:**
> - Token is cryptographically random — cannot be guessed.
> - Token is single-use — deleted after use.
> - Token expires in 1 hour — limits the attack window.
> - Same API response for valid and invalid emails — prevents user enumeration.

---

**Q27. What is the health check endpoint and why did you add it?**
> `GET /api/health` returns the current MongoDB connection state and a user count. It serves as a diagnostic endpoint — in production, monitoring tools (like UptimeRobot, AWS CloudWatch, or Kubernetes health probes) call this endpoint to verify the server is running and the database is connected. If it returns an error, the monitoring system raises an alert. It doesn't require authentication so it can be called externally.

---

**Q28. If a PDF is image-based (scanned document), will your resume matching work?**
> No. `pdf-parse` extracts text from PDFs that have actual text layers — the standard for digitally created PDFs. If the PDF is a scanned image, `pdf-parse` will return an empty or near-empty string, resulting in a match score near zero. To handle this, we would need **OCR (Optical Character Recognition)** — tools like Tesseract.js or Google Cloud Vision API can extract text from image-based PDFs. This is noted in our future scope.

---

**Q29. How does tab synchronization work in your AuthContext?**
> In `AuthContext.jsx`, we attach a `focus` event listener to the browser window. When the user switches back to our tab, the handler reads the token from localStorage and re-syncs the React state. This handles the case where a user logs out in one tab — when they switch back to another tab, the state is updated and they see the logged-out view without needing a page refresh.

---

**Q30. What testing did you do on this project?**
> We conducted manual end-to-end testing for all user flows:
> - Registration and login for all three roles
> - Full job posting → admin approval → seeker application → recruiter shortlisting cycle
> - File upload for profile photos and resumes
> - Email delivery for all notification events
> - Error states: duplicate email, wrong password, applying without resume, duplicate application
> - Route protection: attempting to access admin routes as a seeker/recruiter
>
> For future improvement, we would add automated tests using **Jest** (unit tests for controllers and the matching algorithm) and **Supertest** (integration tests for API endpoints).

---

*End of Documentation*

---
> **Document prepared for:** HireHub Viva Examination — April 4, 2026
> **Project:** HireHub Job Portal
> **Team:** Member 1 | Member 2 | Member 3
> **Tech Stack:** MongoDB · Express.js · React.js · Node.js (MERN)
