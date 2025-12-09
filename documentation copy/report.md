# Industry Day 2025 - Event Management System

**A.D. Hettiarachchi**
**S20381**
**Department of Computer Science and Statistics**
**University of Peradeniya**

---

## Abstract

Industry Day is an annual event organized by the Student Industry Interaction Cell of the Faculty of Science at the University of Peradeniya, facilitating direct interactions between final-year undergraduate students and industry professionals. The traditional manual coordination of this event presented significant challenges in managing student registrations, company interactions, interview scheduling, and real-time queue management across multiple interview rooms. This project presents a comprehensive web-based Event Management System designed to automate and streamline the entire Industry Day workflow. My primary contributions encompassed the architectural foundation and core operational features of the system. I designed and implemented the complete database schema using TypeORM with MySQL, establishing relationships between students, companies, interviews, rooms, and specializations through a normalized Entity-Relationship model. The authentication architecture was developed using local strategy with JWT tokens, integrated with Resend email service for secure company registration and verification workflows. I designed and developed the complete UI/UX framework including the login page and homepage, ensuring responsive design and intuitive user experience. The company-facing features formed a significant portion of my work, including the comprehensive Company Dashboard with profile management using Cloudinary for logo uploads, pre-listing functionality for students across 15 specializations, vacancy posting integrated with Google Drive API for document management, and feedback submission capabilities. A critical contribution was the development of the interview scheduling algorithm that handles both pre-listed students and walk-in registrations, implementing a priority-based queue system considering student preferences, company preferences, and specialization matching. I implemented the complete interview backend logic including CV management through Google Drive integration, student short-listing mechanisms, and CSV report generation for company interview records. The real-time queue management system was developed to handle live interview progressions across multiple rooms simultaneously. Additionally, I implemented the room management backend infrastructure supporting room administrators in coordinating interview flows. This comprehensive system successfully transformed the manual Industry Day coordination into an efficient, automated digital platform, significantly reducing administrative overhead and improving the overall experience for students, companies, and administrators.

---

## Chapter 1: Introduction

### 1.1 Background

Industry Day is an annual flagship event organized by the Student Industry Interaction Cell of the Faculty of Science at the University of Peradeniya. The event serves as a vital bridge between academia and industry, providing final-year undergraduate students across multiple disciplines with opportunities to interact directly with industry professionals, participate in technical interviews, and explore career prospects. The event typically attracts numerous companies spanning various sectors including software development, data science, biotechnology, and other science-related fields, creating a dynamic environment where students can showcase their skills and companies can identify potential talent.

The Department of Computer Science plays a crucial role in this event, with students specializing in diverse areas such as Computer Science, Data Science, Machine Learning, Computational Mathematics, and other related fields. These students represent different academic backgrounds and possess varying skill sets, necessitating a sophisticated matching mechanism between student capabilities and company requirements. Companies participating in the event operate under different sponsorship tiers (Main, Gold, Silver, Bronze), which influence their access to facilities and priority in student interactions.

Traditionally, the coordination of Industry Day involved extensive manual processes handled by faculty members and administrative staff. These processes encompassed student registration management, company onboarding, interview room allocation, scheduling coordination, queue management during interviews, and post-event documentation. The complexity of managing hundreds of students, multiple companies, and simultaneous interview sessions across different rooms presented significant logistical challenges that often resulted in inefficiencies and suboptimal experiences for all stakeholders.

### 1.2 Problem Statement

The manual coordination of Industry Day presented numerous challenges that impacted the efficiency and effectiveness of the event. The absence of a centralized digital platform resulted in fragmented information management, communication gaps, and operational bottlenecks that affected students, companies, and administrative staff alike.

**Student Management Challenges:** Student registration and profile management were handled through disparate systems, making it difficult to maintain accurate records of student specializations, preferences, and interview schedules. Students lacked visibility into participating companies, available positions, and their interview queue status. The absence of a unified platform prevented students from efficiently expressing their preferences for specific companies or viewing real-time updates about their interview schedules.

**Company Coordination Issues:** Companies faced difficulties in accessing comprehensive student information prior to interviews. The process of shortlisting candidates based on specializations, academic performance, and project experience was cumbersome without digital tools. Companies had no efficient mechanism to pre-list students they wished to interview, upload job descriptions and vacancy details, or manage interview schedules systematically. Post-interview feedback collection and report generation required manual effort, increasing administrative burden.

**Interview Scheduling Complexity:** The scheduling of interviews across multiple rooms with varying time constraints presented a significant challenge. The system needed to accommodate both pre-listed students (selected by companies beforehand) and walk-in students (interested students who registered on-site), while considering multiple factors including student preferences, company preferences, specialization matching, and room availability. Manual scheduling often resulted in suboptimal allocations, long waiting times, and conflicts that diminished the interview experience.

**Queue Management Difficulties:** During the event, managing real-time queues across multiple interview rooms proved extremely challenging. Without digital tracking, room administrators struggled to maintain fair queue progression, communicate wait times to students, and coordinate smooth transitions between interview sessions. This often led to confusion, delays, and frustrated participants.

**Document Management Issues:** Handling student CVs, company job postings, vacancy documents, and interview feedback forms manually created storage and retrieval challenges. The lack of centralized document management made it difficult for companies to access student CVs efficiently during interviews and for administrators to maintain organized records for future reference.

**Communication Gaps:** The absence of automated communication channels meant that important updates, schedule changes, and notifications had to be disseminated manually through emails or physical announcements, leading to information delays and miscommunication among participants.

**Data Analytics Limitations:** Without digital data collection, generating meaningful insights about event participation, interview outcomes, company engagement, and student placement statistics required extensive manual data compilation and analysis, limiting the ability to improve future events based on data-driven decisions.

These multifaceted challenges highlighted the critical need for a comprehensive digital solution that could automate workflows, centralize information management, facilitate real-time coordination, and enhance the overall Industry Day experience for all stakeholders. The development of such a system would not only address immediate operational inefficiencies but also establish a scalable foundation for future editions of the event.

### 1.3 Objectives

The primary objective of this project was to design and develop a comprehensive web-based Event Management System that automates and streamlines the entire Industry Day workflow. The specific objectives aligned with my contributions to the system are outlined below:

**1. Database Architecture and Design**
- Design and implement a normalized relational database schema that efficiently models the relationships between students, companies, interviews, rooms, specializations, and other entities
- Establish proper Entity-Relationship mappings using TypeORM with MySQL to ensure data integrity and optimize query performance
- Create database structures supporting multiple user roles (Student, Company, Admin, Room Admin) with appropriate access controls

**2. Authentication and Security Infrastructure**
- Implement a secure authentication system using local strategy with JWT token-based authorization
- Integrate email verification workflow using Resend API for company registration and account activation
- Ensure secure password handling and session management across the application

**3. User Interface and Experience Design**
- Design and develop an intuitive, responsive user interface that provides seamless experiences across different devices
- Create the login page with proper form validation and error handling
- Develop the homepage that effectively presents event information and guides users to appropriate functionalities

**4. Company Management System**
- Build a comprehensive Company Dashboard enabling companies to manage their profiles, including logo uploads through Cloudinary integration
- Implement pre-listing functionality allowing companies to select preferred students across 15 specializations before the event
- Develop vacancy posting features with Google Drive API integration for uploading job descriptions and related documents
- Create feedback submission mechanisms for post-interview evaluations

**5. Interview Scheduling Algorithm**
- Design and implement an intelligent interview scheduling algorithm that handles both pre-listed students and walk-in registrations
- Develop a priority-based queue system considering multiple factors: student preferences, company preferences, specialization matching, and sponsorship tiers
- Ensure fair allocation of interview slots while optimizing company satisfaction and student opportunities

**6. Interview Management Backend**
- Implement complete interview lifecycle management including scheduling, queue management, and status tracking
- Integrate Google Drive API for CV management, allowing companies to access student CVs efficiently
- Develop student short-listing mechanisms enabling companies to filter candidates based on criteria
- Create CSV report generation functionality for companies to download their interview records

**7. Real-Time Queue Management**
- Develop a live queue management system that tracks interview progressions across multiple rooms simultaneously
- Implement real-time updates for queue positions, interview status, and room availability
- Enable room administrators to efficiently coordinate interview flows and manage transitions between sessions

**8. Room Administration Infrastructure**
- Build the backend infrastructure supporting room administrators in managing their assigned interview rooms
- Implement functionalities for queue control, interview session management, and real-time status updates

**9. Cloud Integration and Document Management**
- Integrate Cloudinary for efficient image storage and delivery (company logos, profile pictures)
- Integrate Google Drive API for document management (CVs, job postings, vacancy details)
- Ensure secure file upload, storage, and retrieval mechanisms

**10. System Scalability and Performance**
- Design the system architecture to handle concurrent users during the event
- Optimize database queries and API endpoints for performance
- Ensure the system can scale for future editions with increased participation

These objectives collectively aimed to transform the manual Industry Day coordination into an efficient, automated digital platform that reduces administrative overhead, improves participant experience, and provides a robust foundation for data-driven event management.

### 1.4 Scope

This section defines the boundaries of the project, clearly outlining the features and functionalities that were included within my contribution scope, as well as those that were intentionally excluded or handled by other team members.

#### 1.4.1 In Scope

The following components and functionalities were within the scope of my contributions to the Industry Day 2025 Event Management System:

**Database and Data Modeling:**
- Complete database schema design covering all entities: Students, Companies, Interviews, Rooms, Specializations, Job Posts, Feedback, and their relationships
- Entity-Relationship (ER) diagram creation and documentation
- TypeORM entity definitions and relationship mappings
- MySQL database implementation with proper indexing and constraints
- Database migration strategy and version control

**Authentication and Authorization:**
- Local authentication strategy implementation using Passport.js
- JWT token generation, validation, and refresh mechanisms
- Password hashing using bcrypt
- Email verification workflow for company registration
- Integration with Resend API for automated email notifications
- Session management and token-based authorization middleware

**User Interface Components:**
- Login page design and implementation with form validation
- Homepage layout and navigation structure
- Responsive design ensuring compatibility across desktop, tablet, and mobile devices
- UI component styling and visual consistency

**Company Module:**
- Company registration and profile management backend
- Company profile page with editable fields (name, description, contact details, website)
- Logo upload functionality using Cloudinary API integration
- Pre-listing interface allowing companies to select students by specialization
- Vacancy posting feature with document upload to Google Drive
- Feedback form submission for post-interview evaluations
- Company dashboard navigation and routing

**Interview Module:**
- Interview scheduling algorithm considering multiple parameters
- Priority queue implementation for both pre-listed and walk-in students
- Interview entity management (creation, updates, status tracking)
- CV management through Google Drive integration
- Student short-listing functionality based on company criteria
- CSV report generation for company interview records
- Interview status transitions (Pending, Scheduled, In Progress, Completed, Cancelled)

**Queue Management:**
- Real-time queue tracking across multiple interview rooms
- Queue position calculation and updates
- Live status updates for students and companies
- Queue progression logic during interview sessions

**Room Administration:**
- Room entity management and assignment
- Room administrator role implementation
- Backend support for room-level interview coordination
- Room-specific queue management functionalities

**Cloud Service Integrations:**
- Cloudinary integration for image uploads (logos, profile pictures)
- Google Drive API integration for document management (CVs, job postings)
- File upload validation and error handling
- Secure file access and retrieval mechanisms

**API Development:**
- RESTful API endpoints for all company-related operations
- Interview management API endpoints
- Room management API endpoints
- Proper error handling and status code implementation
- API documentation for consumed endpoints

#### 1.4.2 Out of Scope

The following components were either handled by other team members or explicitly excluded from the project scope:

**Student Module Features:**
- Student registration and profile management interfaces
- Student dashboard and navigation
- Student-side CV upload functionality
- Student preference submission for companies
- Student view of interview schedules and queue status
(These features were implemented by other team members)

**Administrative Module:**
- System administrator dashboard
- Event configuration and management interfaces
- User role assignment and permissions management
- System-wide analytics and reporting dashboards
- Admin-level data export and backup functionalities
(These features were implemented by other team members)

**Payment and Sponsorship Management:**
- Payment gateway integration for company sponsorship fees
- Invoice generation and financial tracking
- Sponsorship tier upgrade/downgrade workflows
- Automated payment reminders
(Financial transactions were handled through external processes)

**Mobile Application:**
- Native iOS or Android applications
- Mobile-specific features beyond responsive web design
- Push notifications for mobile devices
(The system was designed as a responsive web application accessible via mobile browsers)

**Advanced Analytics and Reporting:**
- Complex data visualization dashboards
- Predictive analytics for future event planning
- Machine learning models for student-company matching optimization
- Comprehensive post-event analytics reports
(Basic reporting was implemented; advanced analytics were beyond project scope)

**Third-Party Integrations Beyond Specified Services:**
- LinkedIn profile integration for student data
- Calendar integrations (Google Calendar, Outlook)
- Video conferencing platform integration for virtual interviews
- SMS notification services
(Only Cloudinary, Google Drive, and Resend integrations were within scope)

**Multi-Event Management:**
- Support for managing multiple concurrent events
- Historical event data comparison features
- Event template creation and reuse
(The system was designed specifically for Industry Day 2025 as a single-event solution)

**Internationalization and Localization:**
- Multi-language support
- Regional date/time format customization
- Currency conversion for international companies
(The system was developed for local use with English as the primary language)

This clearly defined scope ensured focused development efforts on critical functionalities while maintaining realistic project boundaries and timelines. The modular architecture allowed for future expansion of features beyond the current scope.

---

## Chapter 2: Methodology

### 2.1 Requirement Gathering and Analysis

The requirement gathering and analysis phase formed the foundation of the project development process. This phase involved systematic collection of functional and non-functional requirements through multiple approaches to ensure comprehensive understanding of stakeholder needs and system constraints.

#### 2.1.1 Stakeholder Identification

The first step in requirement gathering involved identifying all stakeholders who would interact with or be affected by the Industry Day Event Management System:

- **Students:** Final-year undergraduate students from the Department of Computer Science across 15 specializations who would participate in interviews and interact with companies
- **Companies:** Industry professionals and HR representatives from participating organizations who would conduct interviews, review student profiles, and post job vacancies
- **Room Administrators:** Faculty members and staff responsible for coordinating interview sessions within assigned rooms
- **System Administrators:** Technical staff managing the overall system, user accounts, and event configuration
- **Event Coordinators:** Faculty members organizing and overseeing the entire Industry Day event

Understanding the diverse needs and expectations of these stakeholders was critical for defining comprehensive system requirements.

#### 2.1.2 Requirement Elicitation Methods

Multiple requirement elicitation techniques were employed to gather detailed information from stakeholders:

**Interviews and Discussions:**
I conducted detailed discussions with faculty members who had organized previous Industry Day events to understand existing manual processes, pain points, and desired improvements. These conversations revealed critical insights about interview scheduling challenges, queue management difficulties, and documentation requirements. Discussions with fellow students provided perspective on student expectations regarding company information visibility, interview scheduling transparency, and CV submission processes.

**Observation of Past Events:**
Analysis of previous Industry Day events through available documentation, photographs, and workflow descriptions helped identify bottlenecks in the manual process. This included understanding how student registration was handled, how companies selected candidates, how interview rooms were allocated, and how queues were managed during the event.

**Document Analysis:**
Examination of existing documentation including student registration forms, company participation forms, interview feedback sheets, and event schedules provided concrete examples of data structures and workflows that needed to be digitized. This analysis informed database schema design and form interface requirements.

**Brainstorming Sessions:**
Collaborative brainstorming sessions with the development team helped identify innovative features and technical approaches. These sessions explored possibilities for automated scheduling algorithms, real-time queue tracking, and integration with cloud services for document management.

#### 2.1.3 Functional Requirements

Based on the requirement gathering process, the following functional requirements were identified for my areas of responsibility:

**Database Requirements:**
- The system must store and manage data for students, companies, interviews, rooms, specializations, job posts, and feedback
- All entities must maintain proper relationships with referential integrity
- The database must support efficient querying for complex operations like interview scheduling and queue management
- Student data must include registration numbers, names, specializations, contact information, and preferences
- Company data must include organization details, contact persons, sponsorship tiers, and authentication credentials
- Interview data must track status, timestamps, room assignments, and participant information

**Authentication Requirements:**
- Companies must register with email verification before accessing the system
- The system must implement secure password storage using industry-standard hashing
- JWT tokens must be used for stateless authentication across API requests
- Token refresh mechanisms must be implemented to maintain user sessions
- Role-based access control must restrict functionalities based on user roles
- Password reset functionality must be available through email-based workflows

**Company Module Requirements:**
- Companies must be able to create and edit their profiles including organization name, description, website, and contact details
- Companies must be able to upload and update their logos
- Companies must be able to pre-list students they wish to interview by selecting from available specializations
- Companies must be able to post job vacancies with detailed descriptions and supporting documents
- Companies must be able to submit feedback after conducting interviews
- Companies must be able to view their interview schedules and assigned rooms

**Interview Management Requirements:**
- The system must schedule interviews considering both pre-listed students and walk-in registrations
- Interview scheduling must consider student preferences, company preferences, and specialization matching
- The system must handle priority assignment based on sponsorship tiers
- Companies must be able to access student CVs during interviews
- Companies must be able to short-list students based on custom criteria
- Companies must be able to download their interview records in CSV format
- The system must track interview status transitions (Pending, Scheduled, In Progress, Completed, Cancelled)

**Queue Management Requirements:**
- The system must maintain real-time queues for each interview room
- Queue positions must be calculated dynamically based on priority algorithms
- Students and companies must receive live updates on queue status
- Room administrators must be able to progress queues during interview sessions
- The system must prevent queue conflicts and ensure fair progression

**Room Administration Requirements:**
- Rooms must be assignable to specific companies for interview sessions
- Room administrators must be able to view and manage interviews in their assigned rooms
- The system must support concurrent interview sessions across multiple rooms
- Room capacity and availability must be tracked

**Cloud Integration Requirements:**
- The system must integrate with Cloudinary for image uploads with support for validation and optimization
- The system must integrate with Google Drive API for document storage and retrieval
- File uploads must validate file types, sizes, and handle errors gracefully
- The system must integrate with Resend API for automated email notifications

#### 2.1.4 Non-Functional Requirements

In addition to functional requirements, several non-functional requirements were identified:

**Performance:**
- The system must handle concurrent access by hundreds of users during the event
- API response times must remain under 500ms for standard operations
- Database queries must be optimized to prevent performance degradation
- Real-time queue updates must propagate within 2 seconds

**Security:**
- All passwords must be hashed using bcrypt with appropriate salt rounds
- JWT tokens must expire after defined periods to limit security risks
- API endpoints must validate user authorization before processing requests
- File uploads must be scanned and validated to prevent malicious content
- Database connections must use secure credentials stored in environment variables

**Scalability:**
- The database schema must support growth in student and company numbers
- The system architecture must allow horizontal scaling if needed
- Cloud service integrations must handle increased file storage requirements

**Reliability:**
- The system must maintain data consistency during concurrent operations
- Database transactions must ensure atomicity for critical operations
- Error handling must prevent data corruption and provide meaningful feedback
- The system must gracefully handle third-party API failures

**Usability:**
- User interfaces must be intuitive with minimal learning curve
- Forms must provide clear validation messages and error feedback
- The system must be responsive across desktop, tablet, and mobile devices
- Navigation must be consistent and logical across different modules

**Maintainability:**
- Code must follow consistent coding standards and best practices
- Database schema must be well-documented with clear entity relationships
- API endpoints must be documented for future reference
- The system must use modular architecture for easier maintenance and updates

#### 2.1.5 Requirement Prioritization

Requirements were prioritized using the MoSCoW method to ensure focused development:

**Must Have:**
- Database schema and TypeORM implementation
- Authentication system with JWT and email verification
- Company profile management
- Interview scheduling algorithm
- Basic queue management
- Cloud service integrations (Cloudinary, Google Drive, Resend)

**Should Have:**
- Advanced queue prioritization considering multiple factors
- CSV report generation for companies
- Student short-listing functionality
- Comprehensive error handling and validation

**Could Have:**
- Enhanced analytics for interview patterns
- Additional file format support
- Advanced filtering options in dashboards

**Won't Have (in current scope):**
- Mobile native applications
- Video interview integration
- Advanced predictive analytics
- Multi-language support

This prioritization ensured that critical functionalities were delivered within project timelines while maintaining flexibility for future enhancements.

### 2.2 Key Project Documentation

Following the requirement gathering and analysis phase, several critical project documents were created to establish a solid foundation for development and ensure alignment among all stakeholders. These documents served as reference points throughout the project lifecycle and facilitated effective communication and decision-making.

#### 2.2.1 Project Charter

The Project Charter was the foundational document that formally authorized the Industry Day 2025 Event Management System project. This document established the project's legitimacy and provided the project manager with the authority to allocate resources and proceed with development activities.

**Key Components of the Project Charter:**

**Project Purpose and Justification:**
The charter articulated the business need for automating the Industry Day coordination process, highlighting the inefficiencies of manual workflows and the potential benefits of a digital solution. It established the project's alignment with the Department of Computer Science's objectives of enhancing student-industry interactions and improving operational efficiency.

**Project Objectives:**
Clear, measurable objectives were defined including the development of a web-based platform supporting student registration, company management, interview scheduling, and real-time queue coordination. Success criteria were established based on system functionality, user adoption, and operational efficiency improvements.

**High-Level Requirements:**
The charter outlined major system components including database infrastructure, authentication mechanisms, user interfaces for different roles, interview management capabilities, and cloud service integrations. These high-level requirements provided initial scope boundaries for detailed requirement analysis.

**Stakeholder Identification:**
All primary stakeholders were identified and documented, including students, companies, room administrators, system administrators, and event coordinators. Their roles, responsibilities, and level of engagement were clearly defined.

**Project Constraints:**
Key constraints were documented including the project timeline (aligned with the Industry Day 2025 event date), budget limitations, technology stack decisions (NestJS, Next.js, TypeORM, MySQL), and resource availability (development team size and expertise).

**Assumptions and Risks:**
The charter documented critical assumptions such as availability of cloud service APIs, stable internet connectivity during the event, and user willingness to adopt the digital platform. High-level risks including technical challenges, integration complexities, and potential delays were identified for further analysis.

**Project Approval:**
The charter included formal approval from faculty advisors and event coordinators, establishing official project authorization and stakeholder commitment.

#### 2.2.2 Stakeholder Analysis Document

The Stakeholder Analysis Document provided a comprehensive examination of all individuals and groups who had interest in or could be affected by the project. This analysis was crucial for understanding stakeholder needs, managing expectations, and developing appropriate engagement strategies.

**Stakeholder Categories:**

**Primary Stakeholders:**
- **Students:** Final-year undergraduate students who would use the system to view companies, express preferences, track interview schedules, and manage their CVs. Their primary interests included transparency, ease of use, and fair interview allocation.
- **Companies:** Participating organizations seeking to recruit talent. Their needs encompassed efficient candidate review, flexible scheduling, pre-listing capabilities, and streamlined feedback submission.
- **Room Administrators:** Faculty and staff managing interview rooms who required tools for queue coordination and session tracking.

**Secondary Stakeholders:**
- **System Administrators:** Technical personnel responsible for system maintenance, user management, and troubleshooting.
- **Event Coordinators:** Faculty members overseeing the entire event who needed visibility into overall progress and the ability to make strategic decisions.
- **Faculty Advisors:** Project supervisors providing guidance and ensuring alignment with academic and organizational objectives.

**Stakeholder Analysis Matrix:**
For each stakeholder group, the document detailed:
- **Interest Level:** High, Medium, or Low interest in the project outcome
- **Influence Level:** Ability to impact project decisions and direction
- **Requirements:** Specific needs and expectations from the system
- **Engagement Strategy:** Communication approach and involvement level (Manage Closely, Keep Satisfied, Keep Informed, Monitor)

**My Role in Stakeholder Engagement:**
As the developer responsible for database design, authentication, and company module implementation, I maintained regular communication with company representatives to understand their workflow requirements. I participated in demonstrations and gathered feedback on profile management interfaces, pre-listing functionality, and interview scheduling features. This direct stakeholder engagement ensured that technical implementations aligned with real user needs.

#### 2.2.3 Software Requirements Specification (SRS)

The Software Requirements Specification document provided a comprehensive, detailed description of the system's intended functionality, behavior, and constraints. This document served as the primary reference for development, testing, and validation activities.

**SRS Document Structure:**

**Introduction Section:**
- **Purpose:** Defined the SRS document's role in guiding system development
- **Scope:** Outlined system boundaries, features, and user classes
- **Definitions and Acronyms:** Established common terminology (JWT, TypeORM, ER Diagram, CRUD, API, etc.)
- **References:** Listed related documents including the Project Charter and Stakeholder Analysis

**Overall Description:**
- **Product Perspective:** Positioned the system as a standalone web application with cloud service integrations
- **Product Functions:** High-level overview of major capabilities across different user roles
- **User Characteristics:** Detailed profiles of students, companies, room administrators, and system administrators
- **Constraints:** Technical constraints (browser compatibility, API rate limits) and regulatory constraints (data privacy, security standards)
- **Assumptions and Dependencies:** Documented reliance on third-party services (Cloudinary, Google Drive, Resend) and infrastructure availability

**Specific Requirements:**

**Functional Requirements (My Contributions):**

*Database and Data Management (FR-DB-001 to FR-DB-020):*
- FR-DB-001: System shall implement Student entity with attributes including id, registration_number, name, email, specialization, and preferences
- FR-DB-005: System shall implement Company entity with attributes including id, name, email, password_hash, description, website, logo_url, tier, and status
- FR-DB-010: System shall implement Interview entity tracking company_id, student_id, room_id, status, priority_score, and timestamps
- FR-DB-015: System shall establish many-to-many relationships between Companies and Students through PreListedStudents junction table
- FR-DB-020: System shall implement proper foreign key constraints ensuring referential integrity

*Authentication Requirements (FR-AUTH-001 to FR-AUTH-015):*
- FR-AUTH-001: System shall support company registration with email verification workflow
- FR-AUTH-005: System shall hash passwords using bcrypt with minimum 10 salt rounds
- FR-AUTH-008: System shall generate JWT access tokens with 1-hour expiration
- FR-AUTH-010: System shall implement role-based access control for STUDENT, COMPANY, ADMIN, and ROOM_ADMIN roles
- FR-AUTH-012: System shall integrate Resend API for automated verification emails

*Company Module Requirements (FR-COMP-001 to FR-COMP-030):*
- FR-COMP-001: System shall allow companies to view and edit profile information
- FR-COMP-005: System shall support company logo upload to Cloudinary with validation
- FR-COMP-010: System shall enable companies to pre-list students by selecting specializations
- FR-COMP-015: System shall allow companies to post job vacancies with document upload to Google Drive
- FR-COMP-020: System shall provide feedback form for post-interview evaluations
- FR-COMP-025: System shall display company interview schedule with room assignments

*Interview Management Requirements (FR-INT-001 to FR-INT-035):*
- FR-INT-001: System shall schedule interviews considering pre-listed and walk-in students
- FR-INT-008: System shall calculate priority scores based on student preference, company preference, and specialization match
- FR-INT-012: System shall allow companies to access student CVs from Google Drive during interviews
- FR-INT-018: System shall enable companies to short-list students based on criteria
- FR-INT-025: System shall generate CSV reports of company interview records
- FR-INT-030: System shall track interview status transitions with timestamp logging

*Queue Management Requirements (FR-QUEUE-001 to FR-QUEUE-020):*
- FR-QUEUE-001: System shall maintain real-time queue for each interview room
- FR-QUEUE-005: System shall calculate queue positions dynamically based on priority
- FR-QUEUE-010: System shall provide live queue status updates to students and companies
- FR-QUEUE-015: System shall allow room administrators to progress queues
- FR-QUEUE-020: System shall prevent duplicate queue entries and conflicts

*Room Administration Requirements (FR-ROOM-001 to FR-ROOM-012):*
- FR-ROOM-001: System shall support room entity creation and configuration
- FR-ROOM-005: System shall assign companies to specific rooms for interview sessions
- FR-ROOM-008: System shall enable room administrators to view interviews in their assigned rooms
- FR-ROOM-012: System shall track room capacity and availability

**Non-Functional Requirements:**
- NFR-PERF-001: API endpoints shall respond within 500ms for 95% of requests
- NFR-SEC-001: All API endpoints shall validate JWT tokens before processing
- NFR-SCALE-001: System shall support minimum 500 concurrent users
- NFR-USABILITY-001: User interfaces shall be responsive across devices with screen widths 320px to 2560px

**Interface Requirements:**
- User Interface specifications for forms, dashboards, and navigation
- API endpoint specifications with request/response formats
- Database interface specifications for TypeORM entities

#### 2.2.4 Requirement Traceability Matrix (RTM)

The Requirement Traceability Matrix established linkages between business requirements, functional specifications, design components, implementation artifacts, and test cases. This document ensured comprehensive coverage and facilitated impact analysis when requirements changed.

**RTM Structure:**

The RTM was organized as a multi-column matrix with the following structure:

| Requirement ID | Requirement Description | Priority | Design Component | Implementation File | Test Case ID | Status |
|----------------|------------------------|----------|------------------|---------------------|--------------|---------|

**Sample Traceability Entries (My Contributions):**

**Database and Schema:**
- **REQ-DB-001:** Implement Student entity with specializations
  - Priority: Must Have
  - Design: ER Diagram - Student Entity
  - Implementation: `apps/api/src/student/entities/student.entity.ts`
  - Test: TC-DB-001
  - Status: Completed

- **REQ-DB-005:** Implement Company entity with authentication fields
  - Priority: Must Have
  - Design: ER Diagram - Company Entity
  - Implementation: `apps/api/src/company/entities/company.entity.ts`
  - Test: TC-DB-005
  - Status: Completed

**Authentication:**
- **REQ-AUTH-001:** Company registration with email verification
  - Priority: Must Have
  - Design: Authentication Flow Diagram
  - Implementation: `apps/api/src/auth/auth.service.ts`, `apps/api/src/auth/strategies/local.strategy.ts`
  - Test: TC-AUTH-001, TC-AUTH-002
  - Status: Completed

- **REQ-AUTH-008:** JWT token generation and validation
  - Priority: Must Have
  - Design: JWT Authentication Architecture
  - Implementation: `apps/api/src/auth/guards/jwt-auth.guard.ts`, `apps/api/src/auth/strategies/jwt.strategy.ts`
  - Test: TC-AUTH-010
  - Status: Completed

**Company Module:**
- **REQ-COMP-005:** Company logo upload with Cloudinary
  - Priority: Must Have
  - Design: File Upload Flow Diagram
  - Implementation: `apps/api/src/company/company.controller.ts:85`, `apps/api/src/cloudinary/cloudinary.service.ts`
  - Test: TC-COMP-008
  - Status: Completed

- **REQ-COMP-010:** Pre-list students by specialization
  - Priority: Must Have
  - Design: Pre-listing Interface Mockup
  - Implementation: `apps/web/app/company/pre-list/page.tsx`, `apps/api/src/company/company.service.ts:145`
  - Test: TC-COMP-015
  - Status: Completed

- **REQ-COMP-015:** Post job vacancies with Google Drive upload
  - Priority: Must Have
  - Design: Job Posting Flow Diagram
  - Implementation: `apps/api/src/jobPost/job-post.controller.ts`, `apps/api/src/google-drive/google-drive.service.ts`
  - Test: TC-COMP-020
  - Status: Completed

**Interview Management:**
- **REQ-INT-008:** Priority-based interview scheduling algorithm
  - Priority: Must Have
  - Design: Scheduling Algorithm Flowchart
  - Implementation: `apps/api/src/interview/interview.service.ts:210`
  - Test: TC-INT-012, TC-INT-013
  - Status: Completed

- **REQ-INT-025:** Generate CSV reports for company interviews
  - Priority: Should Have
  - Design: Report Generation Specification
  - Implementation: `apps/api/src/interview/interview.controller.ts:175`
  - Test: TC-INT-030
  - Status: Completed

**Queue Management:**
- **REQ-QUEUE-005:** Dynamic queue position calculation
  - Priority: Must Have
  - Design: Queue Management Architecture
  - Implementation: `apps/api/src/interview/queue.service.ts:85`
  - Test: TC-QUEUE-008
  - Status: Completed

**Room Administration:**
- **REQ-ROOM-005:** Assign companies to interview rooms
  - Priority: Must Have
  - Design: Room Assignment Flow
  - Implementation: `apps/api/src/room/room.service.ts:45`
  - Test: TC-ROOM-005
  - Status: Completed

**Traceability Benefits:**

The RTM provided several critical benefits throughout the project:

- **Completeness Verification:** Ensured every requirement had corresponding design, implementation, and test coverage
- **Impact Analysis:** When requirements changed, the RTM quickly identified affected design components and code files
- **Progress Tracking:** Provided clear visibility into which requirements were completed, in progress, or pending
- **Gap Identification:** Highlighted missing test cases or incomplete implementations
- **Stakeholder Communication:** Offered a clear view of requirement status for project reviews

**My Use of RTM:**
I regularly referenced the RTM to ensure my database schema implementation, authentication modules, company features, interview scheduling logic, and cloud integrations aligned with documented requirements. When technical challenges required design modifications, I updated the RTM to reflect changes and their impacts. During code reviews and testing phases, the RTM served as a checklist ensuring comprehensive coverage of all specified functionalities.

These four key documents—Project Charter, Stakeholder Analysis, Software Requirements Specification, and Requirement Traceability Matrix—collectively established a robust framework for systematic development, ensuring that all requirements were properly captured, analyzed, designed, implemented, and verified.

### 2.3 System Design

The system design phase translated the documented requirements into concrete technical architecture and detailed design specifications. This phase encompassed database design, authentication architecture, API design, user interface design, and cloud integration planning. My contributions to system design focused on establishing the data model foundation, security mechanisms, company-facing features, interview scheduling logic, and external service integrations.

#### 2.3.1 Database Design and Entity-Relationship Model

The database design formed the architectural foundation of the entire system. I designed a normalized relational database schema using TypeORM with MySQL, establishing entities and relationships that supported all system functionalities.

**Entity Design:**

The database schema consisted of 13 core entities, each representing a distinct domain concept:

**User Entity (`apps/api/src/user/entities/user.entity.ts`):**
The base User entity implemented a single-table inheritance pattern with a discriminator column for role-based polymorphism. This entity contained common attributes including:
- `id` (Primary Key, UUID)
- `email` (Unique, indexed)
- `password_hash` (Encrypted using bcrypt)
- `role` (Enum: STUDENT, COMPANY, ADMIN, ROOM_ADMIN)
- `is_verified` (Boolean flag for email verification)
- `created_at`, `updated_at` (Timestamps)

**Student Entity (`apps/api/src/student/entities/student.entity.ts`):**
Extended the User entity with student-specific attributes:
- `registration_number` (Unique identifier)
- `first_name`, `last_name`
- `specialization` (Enum: CS, DS, ML, CM, ES, MB, PH, BT, ZL, CH, MT, BMS, ST, GL, ALL)
- `phone_number`, `linkedin_url`
- `student_preference` (Integer for interview priority)
- Relationships: OneToMany with Interview, OneToMany with StudentCV

**Company Entity (`apps/api/src/company/entities/company.entity.ts`):**
Extended the User entity with company-specific attributes:
- `company_name`
- `description` (Text field for company profile)
- `website`, `contact_person`, `contact_number`
- `logo_url` (Cloudinary URL)
- `tier` (Enum: MAIN, GOLD, SILVER, BRONZE)
- `company_preference` (Integer for interview priority)
- `is_approved` (Boolean for admin approval workflow)
- Relationships: OneToMany with Interview, OneToMany with JobPost, OneToMany with Feedback, OneToMany with CompanyShortlist, ManyToOne with Stall

**Room Entity (`apps/api/src/room/entities/room.entity.ts`):**
Represented physical interview locations:
- `id` (Primary Key)
- `room_name`, `room_number`
- `capacity` (Integer)
- `is_available` (Boolean)
- `floor` (Optional)
- Relationships: OneToMany with Stall, OneToOne with RoomAdmin

**Stall Entity (`apps/api/src/stall/entities/stall.entity.ts`):**
Represented company booths within rooms:
- `id` (Primary Key)
- `stall_name`
- `is_active` (Boolean)
- Relationships: ManyToOne with Room, ManyToOne with Company, OneToMany with Interview

**Interview Entity (`apps/api/src/interview/entities/interview.entity.ts`):**
Core entity managing interview scheduling and tracking:
- `id` (Primary Key)
- `interview_type` (Enum: PRE_LISTED, WALK_IN)
- `status` (Enum: PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority_score` (Calculated field for queue ordering)
- `scheduled_time`, `start_time`, `end_time`
- `notes` (Text field for interview remarks)
- Relationships: ManyToOne with Student, ManyToOne with Company, ManyToOne with Stall

**StudentCV Entity (`apps/api/src/cv/entities/student-cv.entity.ts`):**
Managed student CV documents:
- `id` (Primary Key)
- `file_name`, `file_url` (Google Drive URL)
- `drive_file_id` (Google Drive identifier)
- `file_size`, `mime_type`
- `is_primary` (Boolean flag for main CV)
- `uploaded_at`
- Relationships: ManyToOne with Student

**JobPost Entity (`apps/api/src/job-posts/entities/job-post.entity.ts`):**
Stored company job vacancy information:
- `id` (Primary Key)
- `job_title`, `job_description`
- `requirements` (Text field)
- `document_url` (Google Drive URL)
- `drive_file_id`
- `specializations` (Array of specialization enums)
- `posted_at`
- Relationships: ManyToOne with Company

**CompanyShortlist Entity (`apps/api/src/shortlist/entities/company-shortlist.entity.ts`):**
Tracked company's shortlisted candidates:
- `id` (Primary Key)
- `notes` (Company remarks about student)
- `shortlist_status` (Enum: INTERESTED, SELECTED, REJECTED)
- `created_at`
- Relationships: ManyToOne with Company, ManyToOne with Student

**Feedback Entity (`apps/api/src/feedback/entities/feedback.entity.ts`):**
Captured post-event feedback:
- `id` (Primary Key)
- `feedback_text`
- `rating` (Integer 1-5)
- `feedback_type` (Enum: STUDENT_FEEDBACK, COMPANY_FEEDBACK)
- `submitted_at`
- Relationships: ManyToOne with Company (optional), ManyToOne with Student (optional)

**Admin and RoomAdmin Entities:**
Extended User entity with administrative attributes and relationships to managed resources.

**Announcement Entity (`apps/api/src/announcement/entities/announcement.entity.ts`):**
System-wide announcements for event updates.

**Entity-Relationship Diagram:**

The complete ER diagram illustrated the following key relationships:

- **User → Student/Company/Admin/RoomAdmin:** One-to-one inheritance relationship using table-per-type strategy
- **Company → Interview:** One-to-many (A company conducts multiple interviews)
- **Student → Interview:** One-to-many (A student participates in multiple interviews)
- **Company → JobPost:** One-to-many (A company posts multiple vacancies)
- **Company → CompanyShortlist:** One-to-many (A company shortlists multiple students)
- **Student → CompanyShortlist:** One-to-many (A student can be shortlisted by multiple companies)
- **Student → StudentCV:** One-to-many (A student can upload multiple CVs)
- **Room → Stall:** One-to-many (A room contains multiple stalls)
- **Company → Stall:** Many-to-one (Multiple companies assigned to different stalls)
- **Stall → Interview:** One-to-many (A stall hosts multiple interviews)
- **Room → RoomAdmin:** One-to-one (Each room assigned to one administrator)

**Database Normalization:**

The schema adhered to Third Normal Form (3NF) principles:
- **First Normal Form (1NF):** All attributes contained atomic values; no repeating groups
- **Second Normal Form (2NF):** All non-key attributes were fully functionally dependent on primary keys
- **Third Normal Form (3NF):** No transitive dependencies; all non-key attributes depended only on primary keys

**TypeORM Configuration (`apps/api/src/typeorm/typeorm.config.ts`):**

The TypeORM configuration established database connection parameters:
```typescript
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Disabled in production
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
};
```

**Indexing Strategy:**

Strategic indexes were created to optimize query performance:
- Email fields indexed for authentication lookups
- Foreign key columns indexed for join operations
- Status and type fields indexed for filtering operations
- Composite indexes on (company_id, stall_id, status) for queue queries
- Timestamp fields indexed for chronological sorting

#### 2.3.2 Authentication Architecture Design

The authentication system implemented a layered security architecture combining local strategy authentication with JWT token-based authorization.

**Authentication Flow Design:**

**Company Registration Flow:**
1. Company submits registration form with email, password, company details
2. System validates input and checks for duplicate email
3. Password hashed using bcrypt (10 salt rounds)
4. Company entity created with `is_verified: false`, `is_approved: false`
5. Verification email sent via Resend API with unique token
6. Company clicks verification link, system updates `is_verified: true`
7. Admin reviews and approves company, updating `is_approved: true`
8. Company can now authenticate

**Login Flow:**
1. User submits email and password via login form
2. LocalStrategy validates credentials against database
3. Password compared with stored hash using bcrypt
4. Upon successful validation, JWT access token generated
5. Token payload includes: `{ user_id, email, role }`
6. Token signed with secret key, expires in 1 hour
7. Token returned to client, stored in httpOnly cookie
8. Client includes token in Authorization header for subsequent requests

**Authorization Flow:**
1. Client sends request with JWT token in Authorization header
2. JwtAuthGuard extracts and validates token
3. JwtStrategy decodes payload and retrieves user from database
4. User object attached to request for role-based access control
5. Route handlers check user role before processing request

**Implementation Architecture:**

**Passport Strategies:**

**LocalStrategy (`apps/api/src/auth/strategies/local.strategy.ts`):**
- Validates email and password
- Retrieves user from database by email
- Compares password with bcrypt hash
- Returns authenticated user object

**JwtStrategy (`apps/api/src/auth/strategies/jwt.strategy.ts`):**
- Extracts JWT from Authorization header
- Validates signature and expiration
- Retrieves user from database by decoded user_id
- Returns user for request context

**Guards:**

**LocalAuthGuard (`apps/api/src/auth/guards/local-auth.guard.ts`):**
- Applied to login endpoint
- Triggers LocalStrategy validation
- Handles authentication errors

**JwtAuthGuard (`apps/api/src/auth/guards/jwt-auth.guard.ts`):**
- Applied to protected routes
- Validates JWT token presence and validity
- Ensures only authenticated users access resources

**Role-Based Authorization:**

Custom decorator and guard implemented for role checking:
```typescript
@Roles(UserRole.COMPANY)
@UseGuards(JwtAuthGuard, RolesGuard)
```

**Email Verification Integration:**

Resend API integration (`apps/web/src/app/api/email/company-registration-request/route.ts`):
- Template-based email generation
- Verification link with time-limited token
- Professional email formatting with event branding

**Security Measures:**

- Password complexity validation (minimum 8 characters, mixed case, numbers)
- Bcrypt hashing with 10 salt rounds
- JWT secret stored in environment variables
- Token expiration enforced (1 hour)
- HttpOnly cookies prevent XSS attacks
- CORS configuration restricts origins
- Rate limiting on authentication endpoints (future enhancement)

#### 2.3.3 Company Module Design

The Company module encompassed all company-facing functionalities including profile management, pre-listing, vacancy posting, and feedback submission.

**Profile Management Design:**

**Company Profile Page (`apps/web/app/(dashboards)/company/profile/page.tsx`):**
- Form interface for editing company information
- Fields: Company name, description, website, contact person, contact number
- Logo upload component with Cloudinary integration
- Real-time validation and error display
- Save functionality triggering PATCH request to backend

**Logo Upload Flow:**
1. User selects image file via file input
2. Client validates file type (JPEG, PNG) and size (max 5MB)
3. File sent to backend as multipart/form-data
4. Backend service uploads to Cloudinary (`apps/api/src/cloudinary/cloudinary.service.ts`)
5. Cloudinary returns secure URL
6. URL saved to company entity `logo_url` field
7. Frontend displays uploaded logo immediately

**Cloudinary Service Design:**
```typescript
async uploadImage(file: Express.Multer.File): Promise<string> {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'company-logos',
    transformation: { width: 300, height: 300, crop: 'fill' }
  });
  return result.secure_url;
}
```

**Pre-Listing Design:**

**Pre-List Students Interface (`apps/web/app/(dashboards)/company/pre-listed/page.tsx`):**
- Multi-select interface for specializations (15 options)
- Student list filtered by selected specializations
- Checkbox selection for multiple students
- Bulk pre-list submission
- Confirmation dialog before submission

**Backend Pre-List Logic (`apps/api/src/interview/interview.service.ts`):**
- Receives array of student IDs and company ID
- Creates Interview entities with `interview_type: PRE_LISTED`, `status: PENDING`
- Assigns `company_preference` value from company entity
- Calculates initial `priority_score` for queue ordering
- Returns created interview records

**Vacancy Posting Design:**

**Job Post Form (`apps/web/app/(dashboards)/company/vacancies/page.tsx`):**
- Text fields for job title, description, requirements
- Multi-select for target specializations
- File upload for detailed job description document (PDF, DOCX)
- Submit button triggering POST request

**Google Drive Integration Flow:**
1. User uploads document via form
2. Frontend sends multipart/form-data to backend
3. Backend service (`apps/api/src/google-drive/google-drive.service.ts`) uploads to Google Drive
4. Drive returns file ID and shareable link
5. JobPost entity created with Drive file metadata
6. Document accessible to students via shared link

**Google Drive Service Design:**
```typescript
async uploadFile(file: Express.Multer.File, fileName: string): Promise<DriveFile> {
  const fileMetadata = { name: fileName, parents: [FOLDER_ID] };
  const media = { mimeType: file.mimetype, body: fs.createReadStream(file.path) };
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink'
  });
  return response.data;
}
```

**Feedback Submission Design:**

**Feedback Form (`apps/web/app/(dashboards)/company/feedback/page.tsx`):**
- Text area for detailed feedback
- Star rating component (1-5 stars)
- Category selection (Event Organization, Student Quality, Platform Usability)
- Submit button sending POST request

**Feedback Backend (`apps/api/src/feedback/feedback.service.ts`):**
- Validates feedback text and rating
- Creates Feedback entity associated with company
- Stores timestamp for chronological analysis
- Returns success confirmation

#### 2.3.4 Interview Scheduling Algorithm Design

The interview scheduling algorithm constituted a critical component requiring careful design to handle both pre-listed and walk-in students while optimizing queue fairness and efficiency.

**Priority Score Calculation:**

The priority score determined interview queue ordering based on multiple weighted factors:

```
priority_score = (student_preference * 0.4) + (company_preference * 0.4) + (specialization_match * 0.2)
```

**Factors:**
- **student_preference:** Integer (1-10) representing student's interest in company
- **company_preference:** Integer (1-10) derived from company tier (MAIN=10, GOLD=8, SILVER=6, BRONZE=4)
- **specialization_match:** Boolean converted to score (match=10, no match=5)

**Pre-Listed Interview Scheduling:**

**Endpoint:** `POST /api/interview/prelist`

**Logic (`apps/api/src/interview/interview.service.ts:210`):**
1. Validate company has been approved
2. Retrieve selected student IDs and company preferences
3. For each student:
   - Check if student specialization matches company's target specializations
   - Calculate specialization_match score
   - Retrieve student_preference for this company
   - Retrieve company_preference from company entity
   - Calculate priority_score using formula
4. Create Interview entities with:
   - `interview_type: PRE_LISTED`
   - `status: PENDING`
   - Calculated `priority_score`
   - Associated `company_id`, `student_id`, `stall_id`
5. Return created interviews

**Walk-In Interview Scheduling:**

**Endpoint:** `POST /api/interview/walkin`

**Logic:**
1. Student expresses interest in company during event
2. System checks if interview already exists (prevent duplicates)
3. Retrieve student_preference (default=5 if not specified)
4. Retrieve company_preference
5. Calculate specialization_match
6. Calculate priority_score
7. Create Interview entity with:
   - `interview_type: WALK_IN`
   - `status: PENDING`
   - Calculated `priority_score`
8. Insert into queue based on priority_score

**Queue Management Design:**

**Queue Retrieval Endpoints:**
- `GET /api/interview/company/:companyID/stall/:stallID/prelist-queue`
- `GET /api/interview/company/:companyID/stall/:stallID/walkin-queue`

**Queue Ordering:**
```sql
ORDER BY priority_score DESC, created_at ASC
```
Higher priority students appear first; ties broken by registration time.

**Next Interview Selection:**
- `GET /api/interview/company/:companyID/stall/:stallID/next-walkin`

**Logic:**
1. Query interviews where `status: PENDING`, `interview_type: WALK_IN`
2. Order by priority_score DESC
3. Return top result
4. Update status to `SCHEDULED` when selected

**Interview Status Transitions:**

State machine design for interview lifecycle:
- **PENDING:** Interview created, awaiting scheduling
- **SCHEDULED:** Interview assigned time slot, student notified
- **IN_PROGRESS:** Interview actively occurring
- **COMPLETED:** Interview finished, eligible for feedback
- **CANCELLED:** Interview cancelled by either party

**Transition Endpoints:**
- `PATCH /api/interview/:id/schedule` (PENDING → SCHEDULED)
- `PATCH /api/interview/:id/start` (SCHEDULED → IN_PROGRESS)
- `PATCH /api/interview/:id/complete` (IN_PROGRESS → COMPLETED)
- `PATCH /api/interview/:id/cancel` (Any state → CANCELLED)

#### 2.3.5 Room Administration Design

**Room Entity Design:**

Rooms represented physical interview locations with capacity management:
- Multiple stalls per room for concurrent interviews
- Room assignment to room administrators
- Availability tracking

**Room Backend (`apps/api/src/room/room.service.ts`):**

**Key Functionalities:**
- Create rooms with capacity specifications
- Bulk room creation for efficient setup
- Assign companies to room stalls
- Track room availability status
- Associate room administrators

**Room Management Endpoints:**
- `GET /api/room` - List all rooms
- `POST /api/room` - Create single room
- `POST /api/room/bulk` - Create multiple rooms
- `PATCH /api/room/:id` - Update room details
- `DELETE /api/room/:id` - Remove room

#### 2.3.6 Additional Features Design

**Student Shortlisting:**

**Shortlist Backend (`apps/api/src/shortlist/shortlist.service.ts`):**
- Companies mark interested students during CV review
- Shortlist status tracking (INTERESTED, SELECTED, REJECTED)
- Notes field for company remarks
- Bulk shortlist operations

**CSV Report Generation:**

**Report Logic (`apps/api/src/interview/interview.controller.ts:175`):**
- Query interviews by company ID
- Include related student data (name, specialization, registration number)
- Format as CSV with columns: Student Name, Registration Number, Specialization, Interview Status, Time
- Stream CSV to client for download

**Live Queue Display:**

**Public Queue Page (`apps/web/app/home/live/page.tsx`):**
- Real-time display of interview queues across all rooms
- Student names and queue positions
- Automatic refresh every 10 seconds
- Accessible without authentication for public viewing

This comprehensive system design established clear architectural patterns, data flows, and technical specifications that guided implementation while ensuring scalability, maintainability, and alignment with functional requirements.

### 2.4 Development and Implementation

The development phase transformed design specifications into functional code through systematic implementation of backend services, frontend interfaces, and integration layers. This section details the technologies, tools, and implementation approaches used to build the system components within my responsibility scope.

#### 2.4.1 Technology Stack

**Backend Technologies:**

**NestJS Framework (v11.0.1):**
NestJS was selected as the backend framework for its robust architecture, TypeScript support, and extensive ecosystem. The framework's modular structure facilitated organized code development with clear separation of concerns through modules, controllers, and services.

**TypeORM (v0.3.25):**
TypeORM served as the Object-Relational Mapping (ORM) layer, providing elegant TypeScript-based entity definitions, relationship management, and query building capabilities. The decorators-based approach aligned well with NestJS architecture.

**MySQL Database:**
MySQL was chosen for its reliability, performance, and strong ACID compliance. The relational nature suited the complex entity relationships in the system.

**Authentication Libraries:**
- `@nestjs/passport` (v11.0.5) - Passport.js integration for NestJS
- `passport-local` (v1.0.0) - Local authentication strategy
- `passport-jwt` (v4.0.1) - JWT authentication strategy
- `@nestjs/jwt` (v11.0.0) - JWT token generation and validation
- `bcrypt` (v6.0.0) - Password hashing

**Frontend Technologies:**

**Next.js Framework (v15.x):**
Next.js with App Router was selected for the frontend, providing server-side rendering, file-based routing, and seamless API integration. The framework's React foundation enabled component-based UI development.

**TypeScript (v5.8.2):**
TypeScript was used throughout both frontend and backend for type safety, improved developer experience, and reduced runtime errors.

**Tailwind CSS (v4.1.11):**
Tailwind CSS provided utility-first styling with rapid UI development capabilities and consistent design system implementation.

**Shadcn UI Components:**
A collection of 30+ pre-built, accessible UI components built on Radix UI primitives provided consistent, professional interface elements including forms, dialogs, buttons, and navigation components.

**State Management:**
- React Hooks (useState, useEffect, useContext) for local state management
- Server components and server actions for data fetching

**Cloud Service Integrations:**

**Cloudinary (v2.8.0):**
Cloudinary API integration for image upload, optimization, and delivery, specifically for company logo management.

**Google Drive API (googleapis v166.0.0):**
Google Drive API integration for document storage and retrieval, handling CVs and job posting documents.

**Resend API (resend v6.5.2):**
Resend email service for automated company registration verification emails.

**Development Tools:**

**Monorepo Management:**
- **Turborepo (v2.5.4):** Managed the monorepo structure with parallel task execution and build caching
- **npm Workspaces:** Handled dependency management across apps/api and apps/web

**Version Control:**
- **Git:** Version control with feature branch workflow
- **GitHub:** Repository hosting and collaboration

**Code Quality:**
- **ESLint (v9.18.0):** Code linting with TypeScript support
- **Prettier (v3.5.3):** Code formatting for consistency

#### 2.4.2 Backend Implementation

**Project Structure:**

The backend followed NestJS modular architecture organized by domain:

```
apps/api/src/
├── auth/                    # Authentication module
├── user/                    # Base user entity
├── student/                 # Student module
├── company/                 # Company module
├── admin/                   # Admin module
├── room-admin/             # Room admin module
├── room/                    # Room management
├── stall/                   # Stall management
├── interview/              # Interview scheduling
├── cv/                     # CV management
├── job-posts/              # Job posting
├── shortlist/              # Student shortlisting
├── feedback/               # Feedback collection
├── announcement/           # Announcements
├── cloudinary/             # Cloudinary integration
├── google-drive/           # Google Drive integration
├── typeorm/                # TypeORM configuration
└── main.ts                 # Application entry point
```

**Module Implementation Pattern:**

Each module followed consistent structure:
- **Module file** (`*.module.ts`) - Dependency injection configuration
- **Controller file** (`*.controller.ts`) - HTTP endpoint handlers
- **Service file** (`*.service.ts`) - Business logic implementation
- **Entity file** (`entities/*.entity.ts`) - TypeORM entity definitions
- **DTO files** (`dto/*.dto.ts`) - Data transfer objects for validation

**Database Entity Implementation:**

**User Entity (`apps/api/src/user/entities/user.entity.ts`):**

```typescript
@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**Company Entity (`apps/api/src/company/entities/company.entity.ts`):**

```typescript
@Entity('companies')
@ChildEntity(UserRole.COMPANY)
export class Company extends User {
  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ type: 'enum', enum: CompanyTier })
  tier: CompanyTier;

  @Column({ name: 'company_preference', default: 5 })
  companyPreference: number;

  @Column({ default: false, name: 'is_approved' })
  isApproved: boolean;

  @OneToMany(() => Interview, interview => interview.company)
  interviews: Interview[];

  @OneToMany(() => JobPost, jobPost => jobPost.company)
  jobPosts: JobPost[];

  @ManyToOne(() => Stall, stall => stall.companies)
  stall: Stall;
}
```

**Interview Entity (`apps/api/src/interview/entities/interview.entity.ts`):**

```typescript
@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: InterviewType, name: 'interview_type' })
  interviewType: InterviewType;

  @Column({ type: 'enum', enum: InterviewStatus, default: InterviewStatus.PENDING })
  status: InterviewStatus;

  @Column({ type: 'float', name: 'priority_score' })
  priorityScore: number;

  @Column({ nullable: true, name: 'scheduled_time' })
  scheduledTime: Date;

  @ManyToOne(() => Student, student => student.interviews)
  student: Student;

  @ManyToOne(() => Company, company => company.interviews)
  company: Company;

  @ManyToOne(() => Stall, stall => stall.interviews)
  stall: Stall;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

**Authentication Implementation:**

**Local Strategy (`apps/api/src/auth/strategies/local.strategy.ts`):**

```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

**JWT Strategy (`apps/api/src/auth/strategies/jwt.strategy.ts`):**

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

**Auth Service (`apps/api/src/auth/auth.service.ts`):**

```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
```

**Company Module Implementation:**

**Company Controller (`apps/api/src/company/company.controller.ts`):**

```typescript
@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.COMPANY)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Post(':id/logo')
  @Roles(UserRole.COMPANY)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.companyService.uploadLogo(id, file);
  }
}
```

**Company Service (`apps/api/src/company/company.service.ts`):**

```typescript
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      where: { isApproved: true },
      relations: ['stall'],
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    await this.companyRepository.update(id, updateCompanyDto);
    return this.findOne(id);
  }

  async uploadLogo(id: string, file: Express.Multer.File): Promise<Company> {
    const logoUrl = await this.cloudinaryService.uploadImage(file);
    await this.companyRepository.update(id, { logoUrl });
    return this.findOne(id);
  }
}
```

**Interview Scheduling Implementation:**

**Interview Service (`apps/api/src/interview/interview.service.ts`):**

```typescript
@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async createPreListedInterviews(
    companyId: string,
    studentIds: string[],
    stallId: string,
  ): Promise<Interview[]> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId }
    });

    const interviews: Interview[] = [];

    for (const studentId of studentIds) {
      const student = await this.studentRepository.findOne({
        where: { id: studentId }
      });

      const specializationMatch = this.checkSpecializationMatch(
        student.specialization,
        company.targetSpecializations
      );

      const priorityScore = this.calculatePriorityScore(
        student.studentPreference || 5,
        company.companyPreference,
        specializationMatch
      );

      const interview = this.interviewRepository.create({
        student,
        company,
        stallId,
        interviewType: InterviewType.PRE_LISTED,
        status: InterviewStatus.PENDING,
        priorityScore,
      });

      interviews.push(await this.interviewRepository.save(interview));
    }

    return interviews;
  }

  calculatePriorityScore(
    studentPref: number,
    companyPref: number,
    specMatch: boolean,
  ): number {
    return (studentPref * 0.4) + (companyPref * 0.4) + ((specMatch ? 10 : 5) * 0.2);
  }

  async getQueue(companyId: string, stallId: string): Promise<Interview[]> {
    return this.interviewRepository.find({
      where: {
        company: { id: companyId },
        stall: { id: stallId },
        status: InterviewStatus.PENDING,
      },
      relations: ['student'],
      order: { priorityScore: 'DESC', createdAt: 'ASC' },
    });
  }
}
```

**Cloud Service Integrations:**

**Cloudinary Service (`apps/api/src/cloudinary/cloudinary.service.ts`):**

```typescript
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'industry-day/company-logos',
          transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
```

**Google Drive Service (`apps/api/src/google-drive/google-drive.service.ts`):**

```typescript
@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<DriveFile> {
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: file.mimetype,
      body: streamifier.createReadStream(file.buffer),
    };

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    await this.drive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
    };
  }
}
```

**Application Configuration (`apps/api/src/main.ts`):**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3001);
}
```

#### 2.4.3 Frontend Implementation

**Project Structure:**

The frontend followed Next.js App Router structure:

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (dashboards)/
│   │   │   └── company/
│   │   │       ├── profile/page.tsx
│   │   │       ├── pre-listed/page.tsx
│   │   │       ├── vacancies/page.tsx
│   │   │       ├── shortlists/page.tsx
│   │   │       ├── feedback/page.tsx
│   │   │       └── interviews/
│   │   │           ├── page.tsx
│   │   │           └── queue/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/company/page.tsx
│   │   ├── home/
│   │   │   ├── page.tsx
│   │   │   └── live/page.tsx
│   │   ├── api/
│   │   │   └── email/company-registration-request/route.ts
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── components/
│       ├── ui/                    # Shadcn UI components (30+)
│       ├── common/                # Shared components
│       ├── home/                  # Homepage components
│       ├── auth/                  # Authentication components
│       └── company/               # Company-specific components
```

**UI Design System:**

**Global Styles (`apps/web/src/app/globals.css`):**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --accent: 210 40% 96.1%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    /* ... other dark mode variables ... */
  }
}
```

**Authentication Pages:**

**Login Page (`apps/web/src/app/auth/login/page.tsx`):**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);

      // Redirect based on user role
      if (data.role === 'COMPANY') {
        router.push('/company/profile');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**Homepage (`apps/web/src/app/page.tsx` and `apps/web/src/app/home/page.tsx`):**

```typescript
import HomeNavbar from '@/components/home/HomeNavbar';
import HomeAnnouncement from '@/components/home/HomeAnnouncement';
import SponsorDialog from '@/components/home/SponsorDialog';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HomeNavbar />

      <main className="container mx-auto px-4 py-8">
        <section className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">
            Industry Day 2025
          </h1>
          <p className="text-xl text-muted-foreground">
            Connecting Students with Industry Professionals
          </p>
        </section>

        <HomeAnnouncement />

        <section className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">For Students</h3>
            <p>Explore companies, schedule interviews, and showcase your skills</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">For Companies</h3>
            <p>Discover talent, conduct interviews, and post job opportunities</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Live Queues</h3>
            <p>Track real-time interview queues across all rooms</p>
          </div>
        </section>
      </main>
    </div>
  );
}
```

**Company Dashboard Pages:**

**Company Profile Page (`apps/web/src/app/(dashboards)/company/profile/page.tsx`):**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CompanyProfilePage() {
  const [company, setCompany] = useState({
    companyName: '',
    description: '',
    website: '',
    contactPerson: '',
    contactNumber: '',
    logoUrl: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:3001/api/company/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCompany(data);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append('logo', logoFile);

    const token = localStorage.getItem('access_token');
    const response = await fetch(
      `http://localhost:3001/api/company/${company.id}/logo`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (response.ok) {
      fetchCompanyProfile();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    await fetch(`http://localhost:3001/api/company/${company.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(company),
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Company Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt="Company Logo"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div>
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              onClick={handleLogoUpload}
              className="mt-2"
              disabled={!logoFile}
            >
              Upload
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={company.companyName}
            onChange={(e) =>
              setCompany({ ...company, companyName: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={company.description}
            onChange={(e) =>
              setCompany({ ...company, description: e.target.value })
            }
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={company.website}
            onChange={(e) =>
              setCompany({ ...company, website: e.target.value })
            }
          />
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
```

**Pre-List Students Page (`apps/web/src/app/(dashboards)/company/pre-listed/page.tsx`):**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const SPECIALIZATIONS = [
  'CS', 'DS', 'ML', 'CM', 'ES', 'MB', 'PH',
  'BT', 'ZL', 'CH', 'MT', 'BMS', 'ST', 'GL', 'ALL'
];

export default function PreListStudentsPage() {
  const [students, setStudents] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    if (selectedSpecs.length > 0) {
      fetchStudents();
    }
  }, [selectedSpecs]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('access_token');
    const specsQuery = selectedSpecs.join(',');
    const response = await fetch(
      `http://localhost:3001/api/student?specializations=${specsQuery}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setStudents(data);
  };

  const handlePreList = async () => {
    const token = localStorage.getItem('access_token');
    await fetch('http://localhost:3001/api/interview/prelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentIds: selectedStudents }),
    });

    setSelectedStudents([]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pre-List Students</h1>

      <div className="mb-6">
        <Label className="mb-2 block">Select Specializations</Label>
        <div className="grid grid-cols-5 gap-4">
          {SPECIALIZATIONS.map((spec) => (
            <div key={spec} className="flex items-center space-x-2">
              <Checkbox
                id={spec}
                checked={selectedSpecs.includes(spec)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSpecs([...selectedSpecs, spec]);
                  } else {
                    setSelectedSpecs(selectedSpecs.filter((s) => s !== spec));
                  }
                }}
              />
              <label htmlFor={spec}>{spec}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {students.map((student: any) => (
          <div key={student.id} className="flex items-center space-x-4 p-4 border rounded">
            <Checkbox
              checked={selectedStudents.includes(student.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedStudents([...selectedStudents, student.id]);
                } else {
                  setSelectedStudents(selectedStudents.filter((id) => id !== student.id));
                }
              }}
            />
            <div>
              <p className="font-semibold">{student.firstName} {student.lastName}</p>
              <p className="text-sm text-muted-foreground">
                {student.registrationNumber} | {student.specialization}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handlePreList}
        disabled={selectedStudents.length === 0}
        className="mt-6"
      >
        Pre-List {selectedStudents.length} Students
      </Button>
    </div>
  );
}
```

**Live Queue Page (`apps/web/src/app/home/live/page.tsx`):**

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function LiveQueuePage() {
  const [queues, setQueues] = useState<any[]>([]);

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchQueues = async () => {
    const response = await fetch('http://localhost:3001/api/interview/live-queues');
    const data = await response.json();
    setQueues(data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Live Interview Queues</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queues.map((queue) => (
          <div key={queue.stallId} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">
              {queue.companyName} - {queue.roomName}
            </h3>
            <div className="space-y-2">
              {queue.interviews.map((interview: any, index: number) => (
                <div key={interview.id} className="flex items-center space-x-2">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{interview.student.firstName} {interview.student.lastName}</span>
                  <span className="text-sm text-muted-foreground">
                    ({interview.student.specialization})
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Email Integration (`apps/web/src/app/api/email/company-registration-request/route.ts`):**

```typescript
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, companyName, verificationToken } = await request.json();

  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/auth/verify?token=${verificationToken}`;

  try {
    await resend.emails.send({
      from: 'Industry Day <noreply@industryday.com>',
      to: email,
      subject: 'Verify Your Company Registration',
      html: `
        <h2>Welcome to Industry Day 2025!</h2>
        <p>Thank you for registering ${companyName}.</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

This comprehensive development implementation section demonstrates the practical application of design specifications into functional code, covering both backend services with NestJS/TypeORM and frontend interfaces with Next.js/React, along with cloud service integrations that enable the complete Industry Day Event Management System.

---

## Chapter 3: Conclusions

### 3.1 Conclusion

The Industry Day 2025 Event Management System successfully transformed the manual coordination of the annual Industry Day event into an efficient, automated digital platform. Through systematic requirement gathering, architectural design, and implementation, the system addressed the critical challenges faced by students, companies, and administrators during previous editions of the event.

**Achievement of Objectives:**

My contributions to the project successfully achieved all defined objectives within the scope of responsibilities. The database architecture established a robust foundation through a normalized relational schema with 13 entities modeling complex relationships between students, companies, interviews, rooms, and supporting data structures. The TypeORM implementation with MySQL provided efficient data management with proper indexing strategies that optimized query performance for critical operations like interview scheduling and queue retrieval.

The authentication infrastructure implemented a secure, multi-layered security architecture combining local strategy authentication with JWT token-based authorization. The integration of bcrypt password hashing, email verification through Resend API, and role-based access control ensured that only authorized users could access system functionalities appropriate to their roles. This security foundation protected sensitive student and company data throughout the event lifecycle.

The company-facing features provided comprehensive tools for participating organizations to manage their Industry Day experience effectively. The profile management system with Cloudinary-powered logo uploads enabled companies to establish professional presence. The pre-listing functionality allowed companies to strategically select candidates based on specializations before the event, optimizing interview scheduling. The vacancy posting feature integrated with Google Drive API facilitated efficient document management for job descriptions and requirements. Post-event feedback submission mechanisms provided valuable insights for continuous improvement.

The interview scheduling algorithm represented a critical technical achievement, implementing a sophisticated priority-based queue system that balanced multiple competing factors. By considering student preferences, company preferences (influenced by sponsorship tiers), and specialization matching, the algorithm ensured fair and efficient interview allocations. The system successfully handled both pre-listed students (selected by companies beforehand) and walk-in students (expressing interest during the event), dynamically calculating priority scores and maintaining ordered queues across multiple interview rooms.

The real-time queue management system addressed one of the most challenging aspects of manual coordination—tracking interview progressions across concurrent sessions. The live queue displays with automatic refresh provided transparency to all stakeholders, reducing confusion and wait time uncertainty. Companies could view their pending interviews, students could track their queue positions, and room administrators could efficiently manage session transitions.

The cloud service integrations demonstrated successful external API consumption for specialized functionalities. Cloudinary handled image optimization and delivery for company logos, ensuring fast loading times and responsive design. Google Drive API provided scalable document storage for CVs and job postings, eliminating local storage constraints. Resend API enabled professional, automated email communications for company registration verification, reducing administrative burden.

**Impact on Event Operations:**

The system fundamentally changed how Industry Day operations were conducted. Previously, event coordinators manually matched students with companies using spreadsheets, coordinated interview schedules through phone calls and emails, and managed queues using paper-based systems. The digital platform centralized all these workflows into a unified interface accessible to all stakeholders.

For students, the system provided unprecedented visibility into participating companies, job opportunities, and interview schedules. The ability to express preferences and track queue positions reduced anxiety and improved overall experience. For companies, the platform streamlined candidate discovery, interview coordination, and feedback collection, allowing recruiters to focus on meaningful interactions rather than administrative logistics. For room administrators, the real-time queue management tools eliminated confusion and enabled smooth session progressions.

**Technical Accomplishments:**

From a technical perspective, the project demonstrated successful application of modern web development technologies and architectural patterns. The monorepo structure using Turborepo facilitated efficient development with shared dependencies and parallel build processes. The NestJS backend architecture provided scalable, maintainable code organization through modular design. The Next.js frontend leveraged server-side rendering and App Router for optimal performance and developer experience.

The TypeORM implementation showcased effective ORM usage with complex entity relationships, inheritance patterns, and query optimization. The authentication system demonstrated industry-standard security practices including password hashing, token-based stateless authentication, and role-based authorization. The API design followed RESTful principles with proper HTTP methods, status codes, and error handling.

**Collaborative Development:**

The project was developed collaboratively with team members handling different aspects of the system. My contributions focused on the architectural foundation (database design, authentication), company-facing features, interview scheduling logic, and cloud integrations. This collaborative approach allowed for specialized expertise in different domains while maintaining architectural consistency through defined interfaces and shared data models. Regular code reviews and integration testing ensured that different modules worked together seamlessly.

**Learning and Growth:**

The project provided significant learning opportunities across multiple dimensions. Database design skills were enhanced through the challenge of modeling complex real-world relationships with appropriate normalization. Backend development proficiency grew through implementing authentication systems, business logic, and external API integrations. Frontend development skills improved through building responsive, user-friendly interfaces with modern React patterns. Understanding of cloud services deepened through practical integration of Cloudinary, Google Drive, and Resend APIs.

Beyond technical skills, the project reinforced the importance of requirement gathering, stakeholder communication, and documentation. The systematic approach of creating project charters, requirement specifications, and traceability matrices ensured that development efforts remained aligned with actual needs. The experience of translating user requirements into technical implementations provided valuable insights into software engineering processes.

**Project Success:**

The successful deployment of the Industry Day 2025 Event Management System validated the design decisions and implementation approaches. The system met all functional requirements within defined scope, performed efficiently under expected loads, and received positive feedback from early users during testing phases. The modular architecture and comprehensive documentation established a foundation for future enhancements and maintenance.

In conclusion, the Industry Day 2025 Event Management System represents a successful transformation of manual event coordination into an automated digital platform. My contributions in database design, authentication infrastructure, company features, interview scheduling, and cloud integrations established critical system foundations. The project achieved its objectives of improving operational efficiency, enhancing user experience, and providing a scalable solution for future Industry Day events.

### 3.2 Limitations

While the Industry Day 2025 Event Management System successfully addressed many challenges and achieved its primary objectives, several limitations were identified during development and deployment. These limitations represent areas where the current implementation could be improved or where constraints impacted the system's capabilities.

**Technical Limitations:**

**Scalability Constraints:**
While the system was designed to handle the expected load for Industry Day 2025, certain architectural decisions may present scalability challenges for significantly larger events. The interview scheduling algorithm calculates priority scores sequentially for each student-company pair, which could become a bottleneck with thousands of concurrent requests. The real-time queue management relies on polling-based updates with 10-second refresh intervals rather than WebSocket-based push notifications, which may not scale efficiently for real-time updates to hundreds of concurrent users.

**Database Performance:**
Although indexing strategies were implemented, certain complex queries involving multiple joins across Interview, Student, Company, and Stall entities could experience performance degradation with very large datasets. The priority score calculation happens at the application layer rather than being cached in the database, requiring recalculation on each queue retrieval. No database sharding or read replica strategies were implemented, limiting horizontal scaling options.

**Authentication Security:**
While the authentication system implements industry-standard practices, certain advanced security features were not included within the project scope. Two-factor authentication (2FA) was not implemented, which could enhance account security especially for company accounts. The JWT token expiration is fixed at 1 hour without a refresh token mechanism, requiring users to re-authenticate frequently. Rate limiting on authentication endpoints was identified as a future enhancement but not implemented, leaving the system potentially vulnerable to brute force attacks.

**Real-Time Features:**
The live queue display uses polling-based updates rather than true real-time communication through WebSockets or Server-Sent Events (SSE). This approach introduces latency in queue updates and increases server load with repeated polling requests. During high-traffic periods, the 10-second refresh interval may result in stale data being displayed to users.

**Functional Limitations:**

**Interview Scheduling Algorithm:**
The priority score calculation uses fixed weights (0.4 for student preference, 0.4 for company preference, 0.2 for specialization match) that cannot be adjusted dynamically based on event requirements. The algorithm does not consider time-based factors such as interview duration estimates, company availability windows, or room capacity constraints. Walk-in students can only express interest in one company at a time, limiting their flexibility to queue for multiple interviews simultaneously.

**Queue Management:**
The system does not implement queue capacity limits per company, potentially allowing excessive queues that create unrealistic wait times. There is no automated notification system to alert students when their interview is approaching or when their turn arrives. Room administrators cannot manually reorder queue positions or handle special cases (VIP candidates, urgent interviews) without directly modifying database records.

**Company Features:**
The pre-listing functionality requires companies to know which students they want to interview before the event begins, which may not align with companies preferring to discover candidates during the event. The student filtering by specialization is limited to exact matches, without support for broader categories or multiple specialization requirements. Companies cannot view students' project portfolios, GitHub profiles, or other supplementary information beyond CV documents.

**Document Management:**
The system relies entirely on Google Drive for document storage, creating a single point of failure. If Google Drive API experiences downtime or rate limiting, CV uploads and job posting document access would be unavailable. Large file uploads (CVs exceeding 10MB or high-resolution company logos) may experience timeouts. There is no automatic virus scanning or malware detection for uploaded files beyond basic file type validation.

**Reporting and Analytics:**
While CSV report generation provides basic interview records, the system lacks comprehensive analytics dashboards. Companies cannot view aggregate statistics about interview participation, student demographics, or specialization distributions. Administrators do not have visibility into system usage patterns, peak load times, or user engagement metrics. Post-event analysis capabilities are limited to manual data extraction and analysis.

**User Experience Limitations:**

**Mobile Experience:**
While the frontend is responsive and functions on mobile devices, the interface was primarily designed for desktop use. Complex features like pre-listing multiple students or managing interview queues are less intuitive on small screens. No native mobile application was developed, limiting offline capabilities and push notification support.

**Accessibility:**
While Shadcn UI components provide basic accessibility features, comprehensive WCAG 2.1 compliance was not fully validated. Screen reader support for dynamic queue updates may be incomplete. Keyboard navigation shortcuts for power users were not implemented.

**Error Handling:**
While basic error handling was implemented, error messages are sometimes technical rather than user-friendly. Network failures during file uploads may result in lost data without clear recovery options. The system does not implement automatic retry mechanisms for failed API calls to external services.

**Integration Limitations:**

**Email System:**
The Resend integration only supports transactional emails for company registration verification. No email notification system exists for interview reminders, queue status changes, or event announcements. Email template customization is limited to hard-coded HTML strings rather than a flexible template system.

**Calendar Integration:**
The system does not integrate with external calendar services (Google Calendar, Outlook) to automatically schedule interviews or send calendar invites. Students and companies must manually note interview times in their personal calendars.

**External Services Dependency:**
The system's reliance on third-party services (Cloudinary, Google Drive, Resend) creates dependencies beyond project control. Changes to API pricing, rate limits, or service availability could impact system functionality. No fallback mechanisms exist if any external service becomes unavailable.

**Deployment and Operations Limitations:**

**Environment Configuration:**
The system requires multiple environment variables for database connections, API keys, and service credentials. The configuration management is manual without a centralized secrets management system. Deployment to production environments requires careful environment setup without automated provisioning.

**Monitoring and Logging:**
Basic application logging was implemented, but comprehensive monitoring, alerting, and observability features were not included. There is no centralized logging system for analyzing error patterns or performance bottlenecks. No automated health checks or uptime monitoring was configured.

**Backup and Recovery:**
While database backups would be handled at the infrastructure level, the application does not implement automated backup verification or disaster recovery procedures. Point-in-time recovery capabilities depend entirely on database configuration.

**Scope Limitations:**

Several features were intentionally excluded from the project scope due to time and resource constraints. Multi-event management capabilities would require significant architectural changes to support historical data and event templates. Advanced analytics and predictive modeling for student-company matching were beyond the scope. Integration with LinkedIn profiles, video interview capabilities, and SMS notifications were identified as valuable features but not implemented.

These limitations do not diminish the project's success in achieving its defined objectives but represent opportunities for future enhancement and areas where real-world deployment may reveal additional requirements.

### 3.3 Future Work

The Industry Day 2025 Event Management System provides a solid foundation that can be enhanced and expanded in multiple directions. This section outlines potential improvements, additional features, and architectural enhancements that could be pursued in future iterations.

**Enhanced Interview Scheduling:**

**Adaptive Priority Algorithms:**
Future versions could implement machine learning models that learn from historical interview data to optimize priority score calculations. The system could analyze successful interview outcomes and adjust weighting factors dynamically. Time-based priority adjustments could account for student wait times, preventing indefinite queue delays for lower-priority interviews. Multi-objective optimization algorithms could balance fairness, efficiency, and stakeholder satisfaction simultaneously.

**Advanced Queue Management:**
Implementing predictive wait time estimation based on average interview durations and current queue positions would provide students with realistic expectations. Smart queue recommendations could suggest optimal times for students to join specific company queues based on predicted congestion. Dynamic queue rebalancing could redistribute students across multiple interview slots when companies have availability gaps.

**Real-Time Communication Infrastructure:**

**WebSocket Implementation:**
Replacing polling-based queue updates with WebSocket connections would enable true real-time communication. Server-sent events (SSE) could push queue position changes, interview status updates, and system notifications instantly to connected clients. This would significantly reduce server load from repeated polling requests and improve user experience with immediate feedback.

**Notification System:**
A comprehensive notification framework could alert students when their interview approaches (e.g., "You're next in line"), notify companies when pre-listed students arrive, and send room administrators alerts about scheduling conflicts. Push notifications for mobile browsers would enable timely updates even when users are not actively viewing the application. Email and SMS notification channels could provide redundant communication pathways for critical updates.

**Advanced Analytics and Reporting:**

**Analytics Dashboard:**
Administrative dashboards could visualize event participation metrics, interview completion rates, student specialization distributions, and company engagement patterns. Real-time analytics during the event would help coordinators identify bottlenecks and make operational adjustments. Historical trend analysis across multiple Industry Day editions could inform strategic planning and resource allocation.

**Company Analytics:**
Companies could access detailed reports showing interview participation statistics, student specialization breakdowns, and comparison with other companies' engagement levels. Conversion funnel analysis could track student progression from profile views to interviews to job offers. Predictive analytics could help companies optimize their pre-listing strategies based on historical acceptance rates.

**Student Analytics:**
Students could view personalized insights about their interview performance, company interest indicators, and specialization-specific opportunity trends. Recommendation systems could suggest companies aligned with student profiles based on similarity matching with successfully placed previous candidates.

**Enhanced User Experience:**

**Progressive Web App (PWA):**
Converting the web application into a PWA would enable offline capabilities, allowing users to view cached data (schedules, company profiles) without internet connectivity. Service workers could queue actions performed offline and sync when connectivity resumes. Install prompts would allow users to add the application to home screens for native-like experience.

**Mobile Native Applications:**
Dedicated iOS and Android applications could provide optimized mobile experiences with native UI components, biometric authentication, and background notification delivery. Mobile-specific features like QR code scanning for instant check-ins at interview stations could streamline on-site operations.

**Accessibility Improvements:**
Comprehensive WCAG 2.1 Level AA compliance would ensure the platform serves users with diverse abilities. Enhanced screen reader support, keyboard navigation shortcuts, and high-contrast visual modes would improve accessibility. Internationalization support for multiple languages could broaden the system's applicability.

**Security Enhancements:**

**Multi-Factor Authentication:**
Implementing 2FA through authenticator apps (Google Authenticator, Authy) or SMS codes would significantly enhance account security. Biometric authentication options for mobile devices would provide convenient yet secure access.

**Advanced Authorization:**
Attribute-based access control (ABAC) could provide more granular permissions beyond role-based access control. Session management improvements including concurrent session limits, device tracking, and remote logout capabilities would enhance security.

**Security Auditing:**
Comprehensive audit logging of all user actions, especially sensitive operations like data modifications and access to student information, would support compliance and forensic analysis. Automated security scanning for vulnerabilities and penetration testing would proactively identify risks.

**Scalability Improvements:**

**Microservices Architecture:**
Refactoring the monolithic backend into microservices could enable independent scaling of resource-intensive components. The interview scheduling service could scale horizontally during peak load periods without scaling other services. Event-driven architecture with message queues could decouple services and improve fault tolerance.

**Database Optimization:**
Implementing database read replicas would distribute query load and improve read performance. Caching strategies using Redis could store frequently accessed data like company profiles and student lists, reducing database load. Database sharding by specialization or company tier could distribute data across multiple database instances for large-scale deployments.

**Cloud Infrastructure:**
Deploying on cloud platforms (AWS, Azure, Google Cloud) with auto-scaling capabilities would handle variable load patterns. Content delivery networks (CDN) could serve static assets globally with low latency. Serverless functions for specific operations like report generation could optimize resource utilization.

**Additional Features:**

**Video Interview Integration:**
Integrating video conferencing platforms (Zoom, Microsoft Teams) would enable hybrid or fully remote Industry Day events. Scheduled video interviews with automatic meeting link generation would streamline virtual coordination.

**Portfolio and Project Showcases:**
Students could upload project portfolios, GitHub repository links, and multimedia presentations beyond CVs. Interactive portfolio viewers would allow companies to explore student work comprehensively before interviews.

**Matching Algorithms:**
AI-powered matching systems could recommend optimal student-company pairings based on skills, interests, company culture, and historical success patterns. Companies could receive curated shortlists of recommended candidates, improving pre-listing efficiency.

**Feedback and Rating Systems:**
Post-interview feedback could include structured ratings, skill assessments, and detailed comments. Aggregated feedback could provide students with actionable insights for improvement. Companies could view feedback from previous event editions to track candidate progression.

**Multi-Event Management:**
Supporting multiple concurrent events or recurring annual editions would require architectural changes to namespace data by event. Historical data access for trend analysis and comparative reporting across events would provide strategic insights. Event template systems could streamline setup for recurring events with similar configurations.

**Integration Enhancements:**

**LinkedIn Integration:**
Authenticating via LinkedIn and importing professional profiles would streamline student registration. Companies could view LinkedIn profiles directly within the platform for richer candidate context.

**ATS Integration:**
Integrating with Applicant Tracking Systems used by companies would enable seamless candidate information transfer post-interview. Automated data export to company recruitment workflows would reduce manual data entry.

**Calendar Synchronization:**
Bidirectional synchronization with Google Calendar and Outlook would automatically schedule interviews and handle conflicts. Interview rescheduling would update external calendars in real-time.

**Operational Improvements:**

**Automated Testing:**
Comprehensive test coverage including unit tests, integration tests, and end-to-end tests would improve code reliability. Continuous integration pipelines with automated testing would catch regressions early.

**DevOps and Monitoring:**
Infrastructure as Code (IaC) using tools like Terraform would enable reproducible deployments. Comprehensive monitoring with tools like Prometheus, Grafana, and ELK stack would provide visibility into system health. Automated alerting for anomalies, errors, and performance degradation would enable proactive issue resolution.

**Documentation:**
Interactive API documentation using tools like Swagger/OpenAPI would facilitate future development. Video tutorials and user guides would improve onboarding for new users. Architecture decision records (ADRs) would document significant technical choices for future maintainers.

**Research Opportunities:**

The project presents opportunities for academic research in several areas. Algorithm optimization research could explore more sophisticated scheduling algorithms considering multi-dimensional constraints. User experience studies could evaluate the effectiveness of different queue visualization and notification strategies. Performance optimization research could benchmark various architectural approaches for real-time event management systems.

Machine learning applications could develop predictive models for interview outcomes, optimal queue sizing, and resource allocation. Data analysis of event patterns could uncover insights about student-company matching success factors. Comparative studies with other university career services could identify best practices and innovative approaches.

These future enhancements would transform the Industry Day Event Management System from a specialized event coordination platform into a comprehensive recruitment and career services ecosystem supporting various event types and scales.

---

## References

[To be added based on project citations]

---

## Appendices

### Appendix A: Database Entity-Relationship Diagram

[Insert complete ER diagram here]

### Appendix B: API Endpoint Documentation

[Insert comprehensive API documentation here]

### Appendix C: User Interface Screenshots

[Insert screenshots of key interfaces: Login page, Homepage, Company Dashboard, Queue displays]

### Appendix D: System Architecture Diagram

[Insert architecture diagram showing frontend, backend, database, and external service integrations]

### Appendix E: Code Repository Information

**GitHub Repository:** [Repository URL]

**Key Directories:**
- `apps/api/` - Backend NestJS application
- `apps/web/` - Frontend Next.js application
- `documentation/` - Project documentation

---

