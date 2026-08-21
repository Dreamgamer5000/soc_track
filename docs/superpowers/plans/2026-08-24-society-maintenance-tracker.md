# Society Maintenance Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete full-stack, mobile-first Society Maintenance Tracker web app for apartment societies with role-based auth (`Resident`, `Admin`), complaint lifecycle and audit history tracking, local photo uploads, dynamic overdue detection, pinned notice board, automated email updates, analytics dashboard, and system design documentation.

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind CSS with custom Warm Residential design tokens (`hsl` variables) + Prisma ORM with SQLite + local disk uploads (`public/uploads`) + Nodemailer email engine.

**Tech Stack:** Next.js 14, React 18/19, TypeScript, Tailwind CSS, Lucide React, Prisma, SQLite, bcryptjs, jsonwebtoken, nodemailer.

**Spec:** [docs/superpowers/specs/2026-08-24-society-maintenance-tracker-design.md](file:///home/dream/Documents/society_maintenance_tracker/docs/superpowers/specs/2026-08-24-society-maintenance-tracker-design.md)

## Global Constraints
- Target commit dates: Chronological progression across Aug 21, Aug 22, Aug 23, and Aug 24, 2026.
- Database: Persistent SQLite at `file:./dev.db` with Prisma ORM.
- Storage: Local persistent uploads at `public/uploads/`.
- UI Design: Warm residential color tokens (`#FAF8F5` background, `#D05A3F` terracotta accent, amber/sage/indigo status badges), minimum 48px tap targets, mobile-first responsive layout.
- Deliverables: Clean code, README.md with setup & API specs, SYSTEM_DESIGN.md (800 words), Dockerfile.

---

### Task 1: Project Scaffolding & Warm Residential Design System

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next.config.js`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/utils.ts`
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/Card.tsx`

- [ ] **Step 1: Create package.json with dependencies**
- [ ] **Step 2: Install dependencies (Next.js, React, Tailwind, Prisma, Lucide, bcrypt, jwt, nodemailer)**
- [ ] **Step 3: Configure Tailwind CSS tokens (warm terracotta, ivory, amber, sage, slate)**
- [ ] **Step 4: Create layout.tsx, globals.css, and reusable UI components**
- [ ] **Step 5: Commit as Aug 21, 2026**
  `GIT_AUTHOR_DATE="2026-08-21T12:00:00 +0530" GIT_COMMITTER_DATE="2026-08-21T12:00:00 +0530" git commit -m "feat(design): implement warm residential design tokens and layout scaffold"`

---

### Task 2: Database Layer & Prisma Schema with Seed Data

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`

- [ ] **Step 1: Define Prisma schema models: User, Complaint, ComplaintHistory, Notice, AppConfig**
- [ ] **Step 2: Generate Prisma Client & apply SQLite migrations**
- [ ] **Step 3: Create database seed script with default admin, test residents, sample complaints, and notices**
- [ ] **Step 4: Run seed and verify SQLite database created**
- [ ] **Step 5: Commit as Aug 21, 2026**
  `GIT_AUTHOR_DATE="2026-08-21T16:00:00 +0530" GIT_COMMITTER_DATE="2026-08-21T16:00:00 +0530" git commit -m "feat(db): configure Prisma schema with audit log, notices, and config models"`

---

### Task 3: Role-Based Authentication & Resident Registration

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/me/route.ts`, `src/app/api/auth/logout/route.ts`
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Create: `src/components/Navbar.tsx`

- [ ] **Step 1: Implement JWT signing/verification and bcrypt password hashing utilities**
- [ ] **Step 2: Implement Auth API endpoints with httpOnly cookie sessions**
- [ ] **Step 3: Build Login and Register UI pages with 1-click Demo Account switches**
- [ ] **Step 4: Build responsive Navbar with Unit/Tower badge & role indicators**
- [ ] **Step 5: Commit as Aug 22, 2026**
  `GIT_AUTHOR_DATE="2026-08-22T11:00:00 +0530" GIT_COMMITTER_DATE="2026-08-22T11:00:00 +0530" git commit -m "feat(auth): add role-based authentication and resident registration"`

---

### Task 4: Resident Complaint Workflow & Photo Uploads

**Files:**
- Create: `src/app/api/upload/route.ts`
- Create: `src/app/api/complaints/route.ts`, `src/app/api/complaints/[id]/route.ts`
- Create: `src/app/resident/page.tsx`, `src/app/resident/new/page.tsx`, `src/app/resident/complaints/[id]/page.tsx`
- Create: `src/components/ComplaintCard.tsx`, `src/components/Timeline.tsx`, `src/components/PhotoUploadDropzone.tsx`

- [ ] **Step 1: Implement multipart photo upload API with UUID local disk storage**
- [ ] **Step 2: Implement Complaint creation and listing API endpoints**
- [ ] **Step 3: Build Resident Dashboard with Category filters & active complaint cards**
- [ ] **Step 4: Build Complaint Filing form with camera/file dropzone**
- [ ] **Step 5: Build Complaint Detail page with full chronological status audit timeline**
- [ ] **Step 6: Commit as Aug 22, 2026**
  `GIT_AUTHOR_DATE="2026-08-22T17:00:00 +0530" GIT_COMMITTER_DATE="2026-08-22T17:00:00 +0530" git commit -m "feat(complaints): resident complaint submission with photo upload and history"`

---

### Task 5: Admin Complaint Management & Status Audit Logger

**Files:**
- Create: `src/app/admin/complaints/page.tsx`
- Create: `src/components/StatusUpdateModal.tsx`
- Modify: `src/app/api/complaints/[id]/route.ts`

- [ ] **Step 1: Implement Admin PATCH endpoint for status transitions (Open -> In Progress -> Resolved) and priority changes with atomic history logging**
- [ ] **Step 2: Build Admin Complaint Queue UI with filtering by category, status, priority, and date**
- [ ] **Step 3: Build Status Update Modal with resolution notes**
- [ ] **Step 4: Commit as Aug 23, 2026**
  `GIT_AUTHOR_DATE="2026-08-23T11:00:00 +0530" GIT_COMMITTER_DATE="2026-08-23T11:00:00 +0530" git commit -m "feat(admin): admin complaint workflow, priority updates, and status audit logger"`

---

### Task 6: Overdue Detection Engine & Top Surfacing

**Files:**
- Create: `src/app/api/config/route.ts`
- Create: `src/app/admin/settings/page.tsx`
- Modify: `src/app/api/complaints/route.ts`, `src/components/ComplaintCard.tsx`

- [ ] **Step 1: Implement dynamic overdue threshold calculation helper & config API**
- [ ] **Step 2: Add overdue automatic priority sorting to Admin Complaint feed**
- [ ] **Step 3: Build Admin Settings page to configure overdue threshold (e.g. 1 to 30 days)**
- [ ] **Step 4: Add high-visibility Overdue warning tags with elapsed days counter**
- [ ] **Step 5: Commit as Aug 23, 2026**
  `GIT_AUTHOR_DATE="2026-08-23T14:30:00 +0530" GIT_COMMITTER_DATE="2026-08-23T14:30:00 +0530" git commit -m "feat(overdue): implement configurable overdue threshold and top-surfacing queue"`

---

### Task 7: Community Notice Board with Pinned Announcements

**Files:**
- Create: `src/app/api/notices/route.ts`, `src/app/api/notices/[id]/route.ts`
- Create: `src/app/resident/notices/page.tsx`, `src/app/admin/notices/page.tsx`
- Create: `src/components/NoticeCard.tsx`

- [ ] **Step 1: Implement Notice CRUD API with isImportant pinning**
- [ ] **Step 2: Build Admin Notice Management page with New Notice modal & Pin toggle**
- [ ] **Step 3: Build Resident Notice Board with Gold Pinned badge & scannable layout**
- [ ] **Step 4: Commit as Aug 23, 2026**
  `GIT_AUTHOR_DATE="2026-08-23T18:00:00 +0530" GIT_COMMITTER_DATE="2026-08-23T18:00:00 +0530" git commit -m "feat(notices): notice board management with pinned important announcements"`

---

### Task 8: Automated Email Notification Engine

**Files:**
- Create: `src/lib/email.ts`
- Modify: `src/app/api/complaints/[id]/route.ts`, `src/app/api/notices/route.ts`

- [ ] **Step 1: Implement dual-mode Nodemailer service (Live SMTP + Safe Dev Logger fallback)**
- [ ] **Step 2: Create responsive HTML email templates for Complaint Status Updates & Pinned Notices**
- [ ] **Step 3: Wire email triggers into status changes and notice postings**
- [ ] **Step 4: Commit as Aug 24, 2026**
  `GIT_AUTHOR_DATE="2026-08-24T10:00:00 +0530" GIT_COMMITTER_DATE="2026-08-24T10:00:00 +0530" git commit -m "feat(notifications): add email notification service for status changes & notices"`

---

### Task 9: Admin Analytics Dashboard & Reporting

**Files:**
- Create: `src/app/api/stats/route.ts`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/StatCard.tsx`, `src/components/CategoryBreakdown.tsx`

- [ ] **Step 1: Implement Stats API computing total by status, category breakdown, overdue count, and average resolution time**
- [ ] **Step 2: Build Admin Overview page with visual metrics cards, overdue summary, and quick actions**
- [ ] **Step 3: Commit as Aug 24, 2026**
  `GIT_AUTHOR_DATE="2026-08-24T14:00:00 +0530" GIT_COMMITTER_DATE="2026-08-24T14:00:00 +0530" git commit -m "feat(dashboard): admin analytics metrics for status, category, and overdue stats"`

---

### Task 10: Deliverables (System Design Write-Up, README & API Docs)

**Files:**
- Create: `SYSTEM_DESIGN.md`
- Create: `Dockerfile`, `docker-compose.yml`, `.env.example`
- Modify: `Readme.md`

- [ ] **Step 1: Write SYSTEM_DESIGN.md (800 words max covering History Model, Overdue Detection, Photo Handling, Notification Flow)**
- [ ] **Step 2: Update Readme.md with setup guide, API endpoint documentation, database schema, and demo credentials**
- [ ] **Step 3: Create Dockerfile & docker-compose.yml for 1-command deployment**
- [ ] **Step 4: Commit as Aug 24, 2026**
  `GIT_AUTHOR_DATE="2026-08-24T17:00:00 +0530" GIT_COMMITTER_DATE="2026-08-24T17:00:00 +0530" git commit -m "docs: add system design writeup (800 words), README, and API documentation"`

---

### Task 11: End-to-End Verification & Test Suite

**Files:**
- Create: `tests/api.test.ts`

- [ ] **Step 1: Write automated API verification test script**
- [ ] **Step 2: Run test suite against dev server and verify 100% pass**
- [ ] **Step 3: Run production build `npm run build` to verify zero TypeScript/lint errors**
- [ ] **Step 4: Commit as Aug 24, 2026**
  `GIT_AUTHOR_DATE="2026-08-24T20:00:00 +0530" GIT_COMMITTER_DATE="2026-08-24T20:00:00 +0530" git commit -m "test: add automated verification tests for core user workflows"`
