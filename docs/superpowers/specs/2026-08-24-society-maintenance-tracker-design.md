# Design Specification: Society Maintenance Tracker

## 1. Overview & Goals
The **Society Maintenance Tracker** is a mobile-first, full-stack web application designed for residential apartment communities. It resolves communication gaps between residents and society administrators by providing:
- Role-based access control (`Resident` and `Admin`).
- Complete complaint lifecycle tracking (`Open` -> `In Progress` -> `Resolved`) with an immutable, timestamped audit log.
- Configurable overdue issue detection that surfaces lingering problems to the top of the administrative queue.
- A community notice board supporting pinned important announcements.
- Automated email notification workflows for status changes and pinned notices.
- Visual dashboard analytics for tracking maintenance metrics across categories and statuses.

---

## 2. Tech Stack & Architectural Decisions
- **Framework**: Next.js 14 (App Router) + TypeScript.
- **Styling**: Tailwind CSS with Warm Residential Design Tokens (Terracotta, Warm Sand, Warm Amber, Sage Green) + Lucide Icons.
- **Database & ORM**: SQLite + Prisma ORM for type-safe, persistent local storage with zero cloud configuration needed.
- **File Storage**: Local persistent disk storage (`public/uploads/`) with UUID-based filenames.
- **Authentication**: Role-based JWT session cookies with bcrypt password hashing.
- **Email Service**: Dual-mode Nodemailer engine supporting live SMTP services (Gmail, Resend, Ethereal) with a fail-safe fallback dev logger.

---

## 3. Data Models (Prisma Schema)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  RESIDENT
  ADMIN
}

enum Status {
  OPEN
  IN_PROGRESS
  RESOLVED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Category {
  PLUMBING
  ELECTRICAL
  LIFT
  SECURITY
  CLEANING
  GENERAL
}

model User {
  id           String             @id @default(cuid())
  email        String             @unique
  passwordHash String
  name         String
  role         Role               @default(RESIDENT)
  flatNumber   String?            // e.g. "302"
  towerBlock   String?            // e.g. "Tower B"
  phone        String?
  complaints   Complaint[]
  historyLogs  ComplaintHistory[]
  notices      Notice[]
  createdAt    DateTime           @default(now())
}

model Complaint {
  id           String             @id @default(cuid())
  title        String
  category     Category           @default(GENERAL)
  description  String
  photoUrl     String?
  status       Status             @default(OPEN)
  priority     Priority           @default(LOW)
  residentId   String
  resident     User               @relation(fields: [residentId], references: [id])
  history      ComplaintHistory[]
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
  resolvedAt   DateTime?
}

model ComplaintHistory {
  id          String    @id @default(cuid())
  complaintId String
  complaint   Complaint @relation(fields: [complaintId], references: [id], onDelete: Cascade)
  status      Status
  priority    Priority?
  note        String?
  actorId     String
  actor       User      @relation(fields: [actorId], references: [id])
  createdAt   DateTime  @default(now())
}

model Notice {
  id          String    @id @default(cuid())
  title       String
  content     String
  isImportant Boolean   @default(false)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model AppConfig {
  key         String    @id
  value       String
}
```

---

## 4. Business Logic & Core Algorithms

### 4.1. Complaint Lifecycle & Audit Logger
1. **Creation**: Resident submits title, category, description, and optional photo. Status is initialized to `OPEN`. A creation history event is recorded.
2. **Management**: Admin changes priority (`LOW`, `MEDIUM`, `HIGH`) and transitions status (`OPEN` -> `IN_PROGRESS` -> `RESOLVED`).
3. **Audit Trail**: Every update writes to `ComplaintHistory` with `timestamp`, `actorId`, `newStatus`, and an optional note.
4. **Resolution**: Marking a complaint as `RESOLVED` timestamps `resolvedAt` and closes the ticket.

### 4.2. Overdue Detection Engine
- Overdue threshold is retrieved from `AppConfig` (default: 3 days).
- Formula: A complaint is flagged overdue when `status != RESOLVED` and `(now - createdAt) >= threshold_days`.
- Admin sorting displays overdue tickets first in descending age order.

### 4.3. Notice Board & Email Dispatch
- Admin creates announcements. Marking `isImportant: true` pins the notice to the top.
- Email triggers on:
  - Complaint status change (notifying the complaint owner).
  - Pinned notice publication (broadcasting to all residents).

---

## 5. Mobile-First Warm Design System
- **Background**: Warm Cream (`#FAF8F5`).
- **Cards**: Pure White (`#FFFFFF`) with warm sand borders (`#EADBCC`).
- **Primary Accent**: Warm Terracotta (`#D05A3F`).
- **Status Badges**:
  - `OPEN`: Amber (`#FEF3C7` / `#92400E`)
  - `IN_PROGRESS`: Indigo (`#E0E7FF` / `#3730A3`)
  - `RESOLVED`: Sage Emerald (`#DCFCE7` / `#166534`)
  - `OVERDUE`: Warm Crimson (`#FEE2E2` / `#991B1B`)
- **Ergonomics (Fitts's Law)**: Minimum 48px tap targets, bottom floating action button on mobile, clean bottom sheets for modals.

---

## 6. Deliverables & Verification Plan
1. Source code with clean structure and zero redundant dependencies.
2. `README.md` with complete setup instructions, API specs, and database documentation.
3. `SYSTEM_DESIGN.md` (800-word architectural write-up).
4. `Dockerfile` and `docker-compose.yml` for 1-command deployment.
5. Automated test suite for authentication, complaint lifecycle, and overdue logic.
