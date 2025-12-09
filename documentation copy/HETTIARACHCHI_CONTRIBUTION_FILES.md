# A.D. Hettiarachchi (S20381) - Contribution Reference Files

This document lists all files relevant to A.D. Hettiarachchi's contributions to the Industry Day 2025 project.

## 2.1 Database Schema and ER Diagram

**Documentation:**
- `/README.md` (lines 748-893) - Complete ER diagram and database architecture

**Backend Entity Files:**
- `/apps/api/src/user/entities/user.entity.ts`
- `/apps/api/src/admin/entities/admin.entity.ts`
- `/apps/api/src/student/entities/student.entity.ts`
- `/apps/api/src/company/entities/company.entity.ts`
- `/apps/api/src/room-admin/entities/room-admin.entity.ts`
- `/apps/api/src/room/entities/room.entity.ts`
- `/apps/api/src/stall/entities/stall.entity.ts`
- `/apps/api/src/interview/entities/interview.entity.ts`
- `/apps/api/src/cv/entities/student-cv.entity.ts`
- `/apps/api/src/job-posts/entities/job-post.entity.ts`
- `/apps/api/src/shortlist/entities/company-shortlist.entity.ts`
- `/apps/api/src/announcement/entities/announcement.entity.ts`
- `/apps/api/src/feedback/entities/feedback.entity.ts`

**TypeORM Configuration:**
- `/apps/api/src/typeorm/typeorm.config.ts`
- `/apps/api/src/app.module.ts` (TypeORM module configuration)

---

## 2.2 UI/UX Design

**Design System:**
- `/apps/web/src/app/globals.css` - Global styles and theme variables
- `/apps/web/src/components/ui/` - All 30+ Shadcn UI components

**Layout Components:**
- `/apps/web/src/components/common/DashboardNavbar.tsx`
- `/apps/web/src/components/common/Footer.tsx`
- `/apps/web/src/components/common/ModeToggle.tsx`

---

## 3.2.1.1 Authentication - Local Strategy

**Backend:**
- `/apps/api/src/auth/auth.module.ts`
- `/apps/api/src/auth/auth.controller.ts`
- `/apps/api/src/auth/auth.service.ts`
- `/apps/api/src/auth/strategies/local.strategy.ts`
- `/apps/api/src/auth/strategies/jwt.strategy.ts`
- `/apps/api/src/auth/guards/local-auth.guard.ts`
- `/apps/api/src/auth/guards/jwt-auth.guard.ts`
- `/apps/api/src/auth/dto/login.dto.ts`

**Main Entry Point:**
- `/apps/api/src/main.ts` (CORS, cookie-parser, session configuration)

---

## 3.2.2 TypeORM and ER Implementation

**TypeORM Setup:**
- `/apps/api/src/typeorm/typeorm.config.ts`
- `/apps/api/src/app.module.ts` (TypeORM module imports)

**All Entity Files (13 entities):**
- `/apps/api/src/user/entities/user.entity.ts`
- `/apps/api/src/admin/entities/admin.entity.ts`
- `/apps/api/src/student/entities/student.entity.ts`
- `/apps/api/src/company/entities/company.entity.ts`
- `/apps/api/src/room-admin/entities/room-admin.entity.ts`
- `/apps/api/src/room/entities/room.entity.ts`
- `/apps/api/src/stall/entities/stall.entity.ts`
- `/apps/api/src/interview/entities/interview.entity.ts`
- `/apps/api/src/cv/entities/student-cv.entity.ts`
- `/apps/api/src/job-posts/entities/job-post.entity.ts`
- `/apps/api/src/shortlist/entities/company-shortlist.entity.ts`
- `/apps/api/src/announcement/entities/announcement.entity.ts`
- `/apps/api/src/feedback/entities/feedback.entity.ts`

---

## 3.2.9 Interview Scheduling Algorithm (Pre-listed & Walk-in)

**Backend:**
- `/apps/api/src/interview/interview.module.ts`
- `/apps/api/src/interview/interview.controller.ts`
- `/apps/api/src/interview/interview.service.ts`
- `/apps/api/src/interview/entities/interview.entity.ts`
- `/apps/api/src/interview/dto/create-interview.dto.ts`
- `/apps/api/src/interview/dto/update-interview.dto.ts`

**Key Endpoints:**
- POST `/api/interview/prelist`
- POST `/api/interview/walkin`
- POST `/api/interview/bulk`
- GET `/api/interview/company/:companyID/stall/:stallID/next-walkin`
- GET `/api/interview/company/:companyID/stall/:stallID/prelist-queue`
- GET `/api/interview/company/:companyID/stall/:stallID/walkin-queue`
- PATCH `/api/interview/:id/schedule`
- PATCH `/api/interview/:id/complete`
- PATCH `/api/interview/:id/cancel`

**Frontend Queue Management:**
- `/apps/web/src/app/(dashboards)/company/interviews/queue/page.tsx`

**Documentation:**
- `/README.md` (lines 210-241) - Interview module documentation

---

## 3.1.7 Login Page

**Frontend:**
- `/apps/web/src/app/auth/login/page.tsx`
- `/apps/web/src/components/auth/LoginForm.tsx` (if exists)

**Backend Integration:**
- `/apps/api/src/auth/auth.controller.ts` (login endpoint)

---

## 3.1.1 Homepage

**Frontend:**
- `/apps/web/src/app/page.tsx` - Landing page
- `/apps/web/src/app/home/page.tsx` - Main home page
- `/apps/web/src/components/home/HomeNavbar.tsx`
- `/apps/web/src/components/home/HomeAnnouncement.tsx`
- `/apps/web/src/components/home/SponsorDialog.tsx`

---

## 3.2.4 Company Backend Implementation

**Backend:**
- `/apps/api/src/company/company.module.ts`
- `/apps/api/src/company/company.controller.ts`
- `/apps/api/src/company/company.service.ts`
- `/apps/api/src/company/entities/company.entity.ts`
- `/apps/api/src/company/dto/create-company.dto.ts`
- `/apps/api/src/company/dto/update-company.dto.ts`

**Key Endpoints:**
- GET `/api/company`
- GET `/api/company/:id`
- POST `/api/company`
- PATCH `/api/company/:id`

**Documentation:**
- `/README.md` (lines 120-136) - Company module documentation

---

## 3.1.3 Company Dashboard - Profile Page (Cloudinary)

**Frontend:**
- `/apps/web/src/app/(dashboards)/company/profile/page.tsx`
- `/apps/web/src/components/company/CompanyProfile.tsx` (if exists)

**Backend - Cloudinary Integration:**
- `/apps/api/src/cloudinary/cloudinary.module.ts`
- `/apps/api/src/cloudinary/cloudinary.service.ts`
- `/apps/api/src/cloudinary/cloudinary.provider.ts` (if exists)
- `/apps/api/src/company/company.service.ts` (logo upload logic)

**Documentation:**
- `/README.md` (lines 314-323) - Cloudinary module

---

## 3.1.3 Company Dashboard - Pre-List Students

**Frontend:**
- `/apps/web/src/app/(dashboards)/company/pre-listed/page.tsx`
- `/apps/web/src/components/company/PreListStudents.tsx` (if exists)

**Backend:**
- `/apps/api/src/interview/interview.service.ts` (pre-list creation logic)

---

## 3.2.10/3.1.3 Company Dashboard - Posting Vacancies (Google Drive)

**Frontend:**
- `/apps/web/src/app/(dashboards)/company/vacancies/page.tsx`

**Backend:**
- `/apps/api/src/job-posts/job-posts.module.ts`
- `/apps/api/src/job-posts/job-posts.controller.ts`
- `/apps/api/src/job-posts/job-posts.service.ts`
- `/apps/api/src/job-posts/entities/job-post.entity.ts`
- `/apps/api/src/job-posts/dto/create-job-post.dto.ts`

**Google Drive Integration:**
- `/apps/api/src/google-drive/google-drive.module.ts`
- `/apps/api/src/google-drive/google-drive.service.ts`

**Key Endpoints:**
- GET `/api/job-posts`
- GET `/api/job-posts/company/:companyID`
- POST `/api/job-posts`
- DELETE `/api/job-posts/:id`

**Documentation:**
- `/README.md` (lines 264-277) - Job Posts module
- `/README.md` (lines 326-337) - Google Drive module

---

## 3.2.12/3.1.3 Company Dashboard - Posting Feedback

**Frontend:**
- `/apps/web/src/app/(dashboards)/company/feedback/page.tsx`
- `/apps/web/src/components/custom/FeedbackForm.tsx`

**Backend:**
- `/apps/api/src/feedback/feedback.module.ts`
- `/apps/api/src/feedback/feedback.controller.ts`
- `/apps/api/src/feedback/feedback.service.ts`
- `/apps/api/src/feedback/entities/feedback.entity.ts`
- `/apps/api/src/feedback/dto/create-feedback.dto.ts`

**Key Endpoints:**
- POST `/api/feedback`
- GET `/api/feedback`
- GET `/api/feedback/:id`

**Documentation:**
- `/README.md` (lines 296-309) - Feedback module

---

## 3.2.11/3.1.3 Short-listing Students

**Frontend:**
- `/apps/web/src/app/(dashboards)/company/shortlists/page.tsx`

**Backend:**
- `/apps/api/src/shortlist/shortlist.module.ts`
- `/apps/api/src/shortlist/shortlist.controller.ts`
- `/apps/api/src/shortlist/shortlist.service.ts`
- `/apps/api/src/shortlist/entities/company-shortlist.entity.ts`
- `/apps/api/src/shortlist/dto/create-shortlist.dto.ts`

**Key Endpoints:**
- GET `/api/shortlist`
- GET `/api/shortlist/company/:companyID`
- POST `/api/shortlist`
- DELETE `/api/shortlist/:id`

**Documentation:**
- `/README.md` (lines 280-294) - Shortlist module

---

## 3.1.3 Handling CVs (Google Drive Integration)

**Frontend:**
- `/apps/web/src/app/(dashboards)/student/profile/page.tsx` (CV upload UI)
- `/apps/web/src/app/(dashboards)/company/shortlists/page.tsx` (CV viewing)

**Backend:**
- `/apps/api/src/cv/cv.module.ts`
- `/apps/api/src/cv/cv.controller.ts`
- `/apps/api/src/cv/cv.service.ts`
- `/apps/api/src/cv/entities/student-cv.entity.ts`
- `/apps/api/src/cv/dto/create-cv.dto.ts`

**Google Drive Service:**
- `/apps/api/src/google-drive/google-drive.service.ts`

**Key Endpoints:**
- POST `/api/cv/upload`
- GET `/api/cv/:id`
- GET `/api/cv/student/:studentID`
- GET `/api/cv/:id/share-link`
- DELETE `/api/cv/:id`

**Documentation:**
- `/README.md` (lines 244-263) - CV module

---

## 3.1.3 Company Interviews Report Generation (CSV)

**Frontend:**
- `/apps/web/src/app/(dashboards)/company/interviews/page.tsx`
- Client-side CSV generation logic (likely in component)

**Backend Data Sources:**
- `/apps/api/src/interview/interview.controller.ts` (endpoints for fetching interview data)
- GET `/api/interview/company/:companyID`

---

## 3.1.1.2 Live Queues

**Frontend:**
- `/apps/web/src/app/home/live/page.tsx`
- `/apps/web/src/app/(dashboards)/company/interviews/queue/page.tsx`

**Backend:**
- `/apps/api/src/interview/interview.service.ts` (queue retrieval logic)
- GET `/api/interview/company/:companyID/stall/:stallID/prelist-queue`
- GET `/api/interview/company/:companyID/stall/:stallID/walkin-queue`
- GET `/api/interview/company/:companyID/stall/:stallID/next-walkin`

---

## 3.1.8 Company Registration - RESEND Email Integration

**Frontend:**
- `/apps/web/src/app/auth/register/company/page.tsx`

**Backend API Route:**
- `/apps/web/src/app/api/email/company-registration-request/route.ts`

**Email Service:**
- Resend API integration (Next.js API route)

**Documentation:**
- `/README.md` (lines 406-416) - Company registration section

---

## 3.2.7 Room Backend Implementation

**Backend:**
- `/apps/api/src/room/room.module.ts`
- `/apps/api/src/room/room.controller.ts`
- `/apps/api/src/room/room.service.ts`
- `/apps/api/src/room/entities/room.entity.ts`
- `/apps/api/src/room/dto/create-room.dto.ts`
- `/apps/api/src/room/dto/update-room.dto.ts`

**Key Endpoints:**
- GET `/api/room`
- POST `/api/room`
- POST `/api/room/bulk`
- PATCH `/api/room/:id`
- DELETE `/api/room/:id`

**Documentation:**
- `/README.md` (lines 174-189) - Room module

---

## Supporting/Configuration Files

**Project Configuration:**
- `/package.json` - Root monorepo configuration
- `/turbo.json` - Turborepo build configuration
- `/apps/api/package.json` - API dependencies
- `/apps/web/package.json` - Web dependencies

**TypeScript:**
- `/tsconfig.json` - Root TypeScript config
- `/apps/api/tsconfig.json`
- `/apps/web/tsconfig.json`

**Environment:**
- `/apps/api/.env` (template in README)
- `/apps/web/.env.local` (template in README)

**Documentation:**
- `/README.md` - Complete project documentation
- `/CLAUDE.md` - Development guide
