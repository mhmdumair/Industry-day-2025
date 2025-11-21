# Industry Day 2025 - Project Workflows Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Workflows](#development-workflows)
4. [Backend API Workflows](#backend-api-workflows)
5. [Frontend Web Workflows](#frontend-web-workflows)
6. [Authentication & Authorization Workflows](#authentication--authorization-workflows)
7. [User Management Workflows](#user-management-workflows)
8. [Event Management Workflows](#event-management-workflows)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Deployment Workflows](#deployment-workflows)

---

## Project Overview

**Industry Day 2025** is a comprehensive event management platform built with a modern tech stack:
- **Monorepo**: Turborepo for managing multiple packages
- **Backend**: NestJS (Node.js framework)
- **Frontend**: Next.js 15 with React 19
- **Database**: MySQL with TypeORM
- **Styling**: TailwindCSS 4.x
- **Authentication**: JWT + Passport
- **File Storage**: Cloudinary
- **Package Manager**: npm (v11.2.0)

---

## Architecture

### Monorepo Structure
```
Industry-day-2025/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # Next.js Frontend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
├── turbo.json        # Turborepo configuration
└── package.json      # Root package configuration
```

### Technology Stack

#### Backend (NestJS)
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7.3
- **ORM**: TypeORM 0.3.x
- **Database**: MySQL2
- **Authentication**: Passport (Local, JWT)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Validation**: class-validator, class-transformer
- **Testing**: Jest 29.x

#### Frontend (Next.js)
- **Framework**: Next.js 15.3.3
- **React**: 19.0.0
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.1.11
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Maps**: React Leaflet
- **Theme**: next-themes (dark mode support)
- **Testing**: Jest + Testing Library

---

## Development Workflows

### 1. Initial Setup Workflow

```bash
# Clone repository
git clone <repository-url>
cd Industry-day-2025

# Install dependencies
npm install

# Setup environment variables
# Create .env files in apps/api and apps/web

# Start development servers
npm run dev
```

### 2. Turborepo Build Workflow

**Configuration**: `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Commands**:
- `npm run build` - Build all apps and packages
- `npm run dev` - Start all dev servers
- `npm run start` - Start production servers
- `npm run lint` - Lint all projects
- `npm run format` - Format code with Prettier

### 3. Package Scripts

#### Root Level
```bash
npm run build         # Build all workspaces
npm run dev          # Start all dev servers
npm run start        # Start all production servers
npm run lint         # Lint all projects
npm run format       # Format with Prettier
npm run check-types  # TypeScript type checking
```

#### API (apps/api)
```bash
npm run dev          # Start API in watch mode
npm run build        # Build API
npm run start        # Start API (production)
npm run start:prod   # Start with node dist/main
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:cov     # Run tests with coverage
npm run lint         # Lint and fix
```

#### Web (apps/web)
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build Next.js app
npm run start        # Start production server
npm run lint         # Lint with Next.js ESLint
```

---

## Backend API Workflows

### Module Architecture

The API follows NestJS modular architecture with the following modules:

1. **Core Modules**
   - `AuthModule` - Authentication & authorization
   - `UserModule` - User management
   - `ConfigModule` - Environment configuration

2. **User Role Modules**
   - `StudentModule` - Student profile & data
   - `AdminModule` - Admin operations
   - `RoomAdminModule` - Room admin functionality
   - `CompanyModule` - Company profiles & operations

3. **Event Management Modules**
   - `RoomModule` - Room/venue management
   - `StallModule` - Stall assignments
   - `AnnouncementModule` - Event announcements

4. **Recruitment Modules**
   - `JobPostsModule` - Job postings
   - `CvModule` - Student CV management
   - `ShortlistModule` - Company shortlists
   - `InterviewModule` - Interview scheduling
   - `FeedbackModule` - Interview feedback

### Database Entities

```typescript
// Core Entities
- User (userID, email, role, first_name, last_name, profile_picture)
- Student (studentID, regNo, nic, contact, linkedin, group, level)
- Admin (adminID, userID)
- RoomAdmin (roomAdminID, userID, roomID)
- Company (companyID, companyName, description, contactPerson, logo, sponsorship)

// Event Entities
- Room (roomID, name, capacity, location)
- Stall (stallID, stallNumber, companyID, roomID)
- Announcement (announcementID, title, content, audienceType)

// Recruitment Entities
- JobPost (jobPostID, companyID, title, description, requirements)
- StudentCV (cvID, studentID, resume_url, public_id)
- CompanyShortlist (shortlistID, companyID, studentID)
- Interview (interviewID, companyID, studentID, scheduledAt)
- Feedback (feedbackID, interviewID, rating, comments)
```

### Authentication Workflow

#### 1. User Registration
```
POST /auth/register
├── Validate user input (class-validator)
├── Hash password (bcrypt)
├── Create User entity
├── Create role-specific entity (Student/Company/Admin)
└── Return success response
```

#### 2. User Login
```
POST /auth/login
├── Validate credentials (email + password)
├── Verify password (bcrypt.compare)
├── Generate JWT token
├── Set HTTP-only cookie
└── Return user data + token
```

#### 3. JWT Authentication
```
Protected Routes
├── Extract JWT from cookie/header
├── Verify token signature
├── Decode user payload
├── Attach user to request object
└── Execute route handler
```

### API Endpoints Structure

#### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get current user profile
- `POST /auth/refresh` - Refresh JWT token

#### Student Routes
- `GET /student` - Get all students
- `GET /student/:id` - Get student by ID
- `GET /student/by-user` - Get student by user ID
- `PATCH /student/:id` - Update student profile
- `PATCH /student/profile-picture` - Update profile picture
- `DELETE /student/:id` - Delete student

#### Company Routes
- `POST /company/register` - Register company
- `GET /company` - Get all companies
- `GET /company/:id` - Get company by ID
- `GET /company/by-user` - Get company by user ID
- `PATCH /company/:id` - Update company profile
- `DELETE /company/:id` - Delete company

#### Room & Stall Routes
- `GET /room` - Get all rooms
- `POST /room` - Create room
- `PATCH /room/:id` - Update room
- `GET /stall` - Get all stalls
- `POST /stall` - Assign stall
- `PATCH /stall/:id` - Update stall

#### Announcement Routes
- `GET /announcement` - Get all announcements
- `POST /announcement` - Create announcement
- `PATCH /announcement/:id` - Update announcement
- `DELETE /announcement/:id` - Delete announcement

#### Job & Recruitment Routes
- `GET /job-posts` - Get all job posts
- `POST /job-posts` - Create job post
- `GET /cv/:studentId` - Get student CV
- `POST /cv/upload` - Upload CV
- `POST /shortlist` - Add to shortlist
- `GET /shortlist/company/:companyId` - Get company shortlist
- `POST /interview` - Schedule interview
- `PATCH /interview/:id` - Update interview
- `POST /feedback` - Submit feedback

---

## Frontend Web Workflows

### Application Structure

```
apps/web/src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── home/                       # Public home routes
│   │   ├── page.tsx               # Sponsors display
│   │   ├── map/                   # Interactive map
│   │   └── live/                  # Live queue system
│   ├── auth/
│   │   ├── login/                 # Login page
│   │   └── register/              # Registration pages
│   │       ├── student/
│   │       └── company/
│   └── (dashboards)/              # Protected dashboard routes
│       ├── student/
│       │   ├── profile/
│       │   ├── jobs/
│       │   ├── interviews/
│       │   └── stall-map/
│       ├── company/
│       │   ├── profile/
│       │   ├── post-jobs/
│       │   ├── shortlist/
│       │   └── interviews/
│       ├── admin/
│       │   ├── users/
│       │   ├── companies/
│       │   ├── announcements/
│       │   └── analytics/
│       └── room-admin/
│           ├── stalls/
│           └── queue/
├── components/
│   ├── ui/                        # Reusable UI components (Radix)
│   ├── student/                   # Student-specific components
│   ├── company/                   # Company-specific components
│   ├── admin/                     # Admin-specific components
│   └── home/                      # Public home components
└── lib/
    ├── axios.ts                   # HTTP client configuration
    └── utils.ts                   # Utility functions
```

### User Flows

#### 1. Student Registration Flow
```
/auth/register/student
├── Fill form (name, email, password, regNo, NIC, contact, group, level)
├── Client-side validation (Zod schema)
├── Submit to POST /company/register
├── Receive JWT token
├── Redirect to /student/profile
└── Display profile with edit capability
```

#### 2. Company Registration Flow
```
/auth/register/company
├── Fill company details form
│   ├── User credentials (name, email, password)
│   ├── Company info (name, description, website, location)
│   ├── Contact person details
│   └── Logo upload (Cloudinary)
├── Client-side validation
├── Submit multipart form to POST /company/register
├── Receive JWT token
├── Redirect to /company/profile
└── Display profile
```

#### 3. Login Flow
```
/auth/login
├── Enter email & password
├── Submit to POST /auth/login
├── Receive JWT token + user role
├── Store token in HTTP-only cookie
├── Role-based redirect:
│   ├── Student → /student/profile
│   ├── Company → /company/profile
│   ├── Admin → /admin/users
│   └── RoomAdmin → /room-admin/stalls
└── Load dashboard
```

#### 4. Student Dashboard Workflow
```
/student/*
├── Profile Management
│   ├── View profile (/student/profile)
│   ├── Edit details (personal info, contact, LinkedIn)
│   ├── Upload profile picture (Cloudinary)
│   └── Upload CV (PDF)
├── Job Applications
│   ├── Browse jobs (/student/jobs)
│   ├── View job details
│   ├── Apply to jobs
│   └── Track application status
├── Interviews
│   ├── View scheduled interviews (/student/interviews)
│   ├── Confirm/reschedule interviews
│   └── View feedback
└── Stall Map
    ├── Interactive venue map (/student/stall-map)
    ├── Find company locations
    └── View live queue status
```

#### 5. Company Dashboard Workflow
```
/company/*
├── Profile Management
│   ├── View company profile (/company/profile)
│   ├── Edit company details
│   ├── Update logo
│   └── Manage contact person info
├── Job Postings
│   ├── Create job posts (/company/post-jobs)
│   ├── Edit job descriptions
│   ├── View applicants
│   └── Close/delete postings
├── Candidate Management
│   ├── View student profiles
│   ├── Browse CVs
│   ├── Add to shortlist (/company/shortlist)
│   └── Filter by skills/group
├── Interview Management
│   ├── Schedule interviews (/company/interviews)
│   ├── View interview calendar
│   ├── Manage time slots
│   └── Submit feedback
└── Analytics
    ├── Application statistics
    ├── Interview metrics
    └── Shortlist analytics
```

#### 6. Admin Dashboard Workflow
```
/admin/*
├── User Management
│   ├── View all users (/admin/users)
│   ├── Create/edit/delete users
│   ├── Assign roles
│   └── Reset passwords
├── Company Management
│   ├── Approve company registrations
│   ├── Edit company profiles
│   └── Manage sponsorship levels
├── Announcements
│   ├── Create announcements (/admin/announcements)
│   ├── Target specific audiences (ALL/STUDENTS/COMPANIES)
│   ├── Edit/delete announcements
│   └── Schedule announcements
├── Event Configuration
│   ├── Create/edit rooms
│   ├── Assign stalls to companies
│   ├── Configure event settings
│   └── Manage event schedule
└── Analytics
    ├── Registration statistics
    ├── Application metrics
    ├── Interview analytics
    └── Export reports
```

#### 7. Room Admin Dashboard Workflow
```
/room-admin/*
├── Stall Management
│   ├── View assigned stalls (/room-admin/stalls)
│   ├── Check company assignments
│   └── Update stall status
├── Queue Management
│   ├── View live queue (/room-admin/queue)
│   ├── Manage student queue
│   ├── Update queue status
│   └── Real-time updates
└── Room Monitoring
    ├── Monitor room capacity
    ├── Track visitor flow
    └── Report issues
```

### Page Routes & Components

#### Public Routes
- `/` - Landing page with hero section
- `/home` - Public home with sponsors display
- `/home/map` - Interactive Leaflet map of venue
- `/home/live` - Live queue status display
- `/auth/login` - Login form
- `/auth/register/student` - Student registration
- `/auth/register/company` - Company registration

#### Protected Routes (Authenticated)
**Student Routes**:
- `/student/profile` - Student profile with avatar & details
- `/student/jobs` - Browse job postings
- `/student/interviews` - View scheduled interviews
- `/student/stall-map` - Interactive venue map

**Company Routes**:
- `/company/profile` - Company profile with logo & info
- `/company/post-jobs` - Create/manage job posts
- `/company/shortlist` - View shortlisted students
- `/company/interviews` - Schedule/manage interviews

**Admin Routes**:
- `/admin/users` - User management dashboard
- `/admin/companies` - Company management
- `/admin/announcements` - Create announcements
- `/admin/analytics` - View analytics

**Room Admin Routes**:
- `/room-admin/stalls` - Stall management
- `/room-admin/queue` - Queue management

### Component Library

#### Shared UI Components (`components/ui/`)
- `Button` - Button component with variants
- `Card` - Card container with header/content/footer
- `Dialog` - Modal dialog
- `Input` - Text input field
- `Label` - Form label
- `Badge` - Status badge
- `Avatar` - User avatar with image
- `Tabs` - Tabbed interface
- `Table` - Data table
- `Pagination` - Pagination controls
- `Spinner` - Loading spinner
- `Dropdown` - Dropdown menu
- `Select` - Select dropdown
- `Textarea` - Multi-line text input
- `Tooltip` - Hover tooltip
- `Separator` - Visual separator

#### Feature Components
**Home Components** (`components/home/`):
- `home-announcement.tsx` - Announcements table/cards
- `sponsor-dialog.tsx` - Sponsor details modal
- `home-navbar.tsx` - Public navigation bar

**Dashboard Navigation**:
- `student-navbar.tsx` - Student dashboard nav
- `company-navbar.tsx` - Company dashboard nav
- `admin-navbar.tsx` - Admin dashboard nav
- `roomadmin-navbar.tsx` - Room admin dashboard nav

---

## Authentication & Authorization Workflows

### JWT Token Flow

```
1. Login Request
   ├── POST /auth/login
   ├── Validate credentials
   ├── Generate JWT token
   │   ├── Payload: { userId, email, role }
   │   ├── Secret: process.env.JWT_SECRET
   │   └── Expiration: 24h
   ├── Set HTTP-only cookie
   └── Return user data

2. Authenticated Request
   ├── Client sends request with cookie
   ├── JWT Guard extracts token
   ├── Verify token signature
   ├── Decode payload
   ├── Attach user to request
   └── Route handler executes

3. Token Refresh
   ├── POST /auth/refresh
   ├── Validate existing token
   ├── Generate new token
   └── Update cookie
```

### Role-Based Access Control

```typescript
// Roles
enum UserRole {
  STUDENT = 'student',
  COMPANY = 'company',
  ADMIN = 'admin',
  ROOM_ADMIN = 'room_admin'
}

// Protected Routes with Role Guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('/admin/users')
getUsers() { }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COMPANY)
@Post('/job-posts')
createJobPost() { }
```

### Frontend Auth State Management

```typescript
// Axios interceptor for auth
api.interceptors.request.use((config) => {
  // Token sent via HTTP-only cookie
  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      router.push('/auth/login');
    }
    return Promise.reject(error);
  }
);
```

---

## User Management Workflows

### Profile Management

#### Student Profile Update
```
1. User edits profile
   ├── Change personal details
   ├── Update contact info
   ├── Modify LinkedIn URL
   └── Change group/level

2. Submit changes
   ├── Client-side validation (Zod)
   ├── PATCH /student/:id
   ├── Update Student entity
   ├── Update User entity
   └── Return updated profile

3. Profile Picture Upload
   ├── Select image file
   ├── PATCH /student/profile-picture
   ├── Upload to Cloudinary
   ├── Store URL in User entity
   └── Update UI with new image
```

#### Company Profile Update
```
1. Company edits profile
   ├── Update company details
   ├── Change contact person
   ├── Modify website/location
   └── Update description

2. Logo Upload
   ├── Select logo file
   ├── Upload to Cloudinary
   ├── Store URL in Company entity
   └── Display new logo

3. Submit changes
   ├── PATCH /company/:id
   ├── Validate input
   ├── Update Company entity
   └── Return updated profile
```

---

## Event Management Workflows

### Announcement System

```
1. Create Announcement (Admin)
   ├── POST /announcement
   ├── Set title & content
   ├── Select audience type:
   │   ├── ALL - Everyone
   │   ├── STUDENTS - Students only
   │   └── COMPANIES - Companies only
   ├── Save to database
   └── Broadcast to target audience

2. View Announcements (Public/Students/Companies)
   ├── GET /announcement
   ├── Filter by audience type
   ├── Sort by created_at DESC
   ├── Paginate results (2 per page)
   └── Display in table/cards
```

### Room & Stall Management

```
1. Room Creation (Admin)
   ├── POST /room
   ├── Define room details:
   │   ├── Name
   │   ├── Capacity
   │   └── Location
   └── Create Room entity

2. Stall Assignment (Admin)
   ├── POST /stall
   ├── Select company
   ├── Assign to room
   ├── Set stall number
   └── Create Stall entity

3. Stall Map Display
   ├── GET /stall
   ├── Fetch all stalls with companies
   ├── Render interactive map (Leaflet)
   ├── Show company locations
   └── Display company details on click
```

### Live Queue System

```
1. Queue Entry
   ├── Student joins queue at stall
   ├── POST /queue (hypothetical)
   ├── Add to queue list
   └── Assign queue number

2. Queue Management (Room Admin)
   ├── View queue status
   ├── Update current serving number
   ├── Mark student as served
   └── Real-time updates

3. Live Display
   ├── GET /queue/live
   ├── Fetch current queue status
   ├── Display on public screens
   └── Auto-refresh every 30 seconds
```

---

## Data Flow Diagrams

### Student Application Workflow

```
Student → Browse Jobs → View Job Details
    ↓
Apply to Job → POST /shortlist
    ↓
Company Reviews Application
    ↓
Company Adds to Shortlist
    ↓
Company Schedules Interview → POST /interview
    ↓
Student Receives Notification
    ↓
Student Attends Interview
    ↓
Company Submits Feedback → POST /feedback
    ↓
Student Views Feedback
```

### Company Recruitment Workflow

```
Company → Create Job Post → POST /job-posts
    ↓
Job Published
    ↓
Students Apply
    ↓
Company Reviews CVs → GET /cv/:studentId
    ↓
Company Shortlists → POST /shortlist
    ↓
Company Schedules Interviews → POST /interview
    ↓
Conduct Interviews
    ↓
Submit Feedback → POST /feedback
    ↓
Track Candidates
```

### Admin Event Setup Workflow

```
Admin → Create Event
    ↓
Create Rooms → POST /room
    ↓
Assign Stalls → POST /stall
    ↓
Approve Companies
    ↓
Create Announcements → POST /announcement
    ↓
Monitor Event
    ↓
Generate Reports
```

---

## Deployment Workflows

### Development Environment

```bash
# 1. Setup environment variables
# apps/api/.env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=industry_day
DB_SYNCHRONIZE=true
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# 2. Start database
# Using MySQL locally or Docker

# 3. Start development servers
npm run dev
# API: http://localhost:3001
# Web: http://localhost:3000
```

### Production Build

```bash
# 1. Build all applications
npm run build

# 2. Backend production
cd apps/api
npm run start:prod

# 3. Frontend production
cd apps/web
npm run start
```

### Testing Workflows

#### Backend Testing
```bash
cd apps/api

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

#### Frontend Testing
```bash
cd apps/web

# Run Jest tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

---

## Git Workflow

### Branch Strategy
```
main                    # Production-ready code
├── ui/responsive      # Current feature branch
├── dev                # Development branch
└── feature/*          # Feature branches
```

### Commit Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to remote
git push origin feature/new-feature

# 4. Create pull request
# Merge into dev → main
```

---

## API Integration Patterns

### Axios Configuration
```typescript
// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### API Call Patterns

```typescript
// GET request
const fetchProfile = async () => {
  const response = await api.get('/student/by-user');
  return response.data;
};

// POST request
const createJobPost = async (data) => {
  const response = await api.post('/job-posts', data);
  return response.data;
};

// PATCH request
const updateProfile = async (id, data) => {
  const response = await api.patch(`/student/${id}`, data);
  return response.data;
};

// File upload (multipart)
const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/cv/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
```

---

## Key Features & Workflows

### 1. Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- All components support dark mode (next-themes)
- Tailwind utility classes for responsive layouts

### 2. File Upload System
- **Profile Pictures**: Cloudinary upload via PATCH /student/profile-picture
- **Company Logos**: Cloudinary upload via registration/update
- **CVs**: PDF upload for student resumes
- **File Validation**: Type, size, and format checks

### 3. Real-time Features
- Live queue updates (polling every 30s)
- Interview notifications
- Announcement broadcasts

### 4. Search & Filter
- Job search by title, skills, location
- Student search by group, level, skills
- Filter announcements by audience type
- Room/stall search on map

### 5. Analytics & Reporting
- Application statistics
- Interview metrics
- Company engagement data
- Student participation tracking

---

## Environment Variables

### Backend (apps/api/.env)
```env
# Database
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=industry_day
DB_SYNCHRONIZE=true

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Session
SESSION_SECRET=your_session_secret
```

### Frontend (apps/web/.env.local)
```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Troubleshooting Common Workflows

### Issue: JWT Token Expired
```
Solution:
1. POST /auth/refresh to get new token
2. Or redirect to /auth/login
```

### Issue: CORS Errors
```
Solution:
1. Ensure withCredentials: true in axios config
2. Check NestJS CORS configuration
3. Verify API URL in environment variables
```

### Issue: File Upload Fails
```
Solution:
1. Check file size (max 5MB for images, 10MB for PDFs)
2. Verify file type (PNG, JPG, SVG for images; PDF for CVs)
3. Ensure Cloudinary credentials are correct
4. Check multipart/form-data header
```

### Issue: Database Connection Failed
```
Solution:
1. Verify MySQL is running
2. Check database credentials in .env
3. Ensure database exists
4. Check network connectivity
```

---

## Performance Optimization

### Backend
- Database query optimization with TypeORM
- Lazy loading of relations
- Pagination for large datasets
- Caching strategies (consider Redis)

### Frontend
- Next.js automatic code splitting
- Image optimization with next/image
- Lazy loading components
- Debouncing search inputs
- Memoization with React.memo

---

## Security Best Practices

1. **Password Security**
   - bcrypt hashing (rounds: 10)
   - Never store plain text passwords

2. **JWT Security**
   - HTTP-only cookies
   - Short expiration times (24h)
   - Secure flag in production

3. **Input Validation**
   - Backend: class-validator
   - Frontend: Zod schemas
   - Sanitize all user inputs

4. **File Upload Security**
   - Validate file types
   - Limit file sizes
   - Scan for malware (production)

5. **API Security**
   - Rate limiting
   - CORS configuration
   - Role-based access control

---

## Monitoring & Logging

### Development
- Console logs for debugging
- NestJS built-in logger
- React DevTools
- Network tab inspection

### Production (Recommended)
- Structured logging (Winston/Pino)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Database query logging

---

## Future Enhancements

1. **Real-time Chat**: WebSocket integration for live chat
2. **Email Notifications**: Nodemailer for automated emails
3. **SMS Notifications**: Twilio integration
4. **Advanced Analytics**: Charts with Recharts/Chart.js
5. **Mobile App**: React Native version
6. **API Documentation**: Swagger/OpenAPI
7. **Automated Testing**: Increased test coverage
8. **CI/CD Pipeline**: GitHub Actions/GitLab CI
9. **Containerization**: Docker & Docker Compose
10. **Cloud Deployment**: AWS/Azure/GCP

---

## Support & Documentation

### NestJS Documentation
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)

### UI Components
- [Radix UI](https://www.radix-ui.com)
- [TailwindCSS](https://tailwindcss.com)

### Package Management
- [Turborepo Docs](https://turborepo.com/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)

---

## Contributors

This project is maintained by the Industry Day 2025 development team.

---

## License

This project is proprietary and confidential.

---

**Last Updated**: 2025-01-21
**Version**: 1.0.0
