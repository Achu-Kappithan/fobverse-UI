# fobVerse - Modern Applicant Tracking System (ATS)

## 📌 Overview
fobVerse is a comprehensive, feature-rich Applicant Tracking System (ATS) built with **Angular 20** and **Tailwind CSS**. It serves as an all-in-one platform bridging the gap between candidates seeking opportunities and companies executing their hiring processes. The platform features an advanced multi-role architecture supporting Candidates, Companies, and Platform Administrators, complete with real-time video interviewing and application management.

## 🚀 Key Features

### 👨‍💼 Candidate Experience
- **Profile Management:** Build and maintain a professional profile and upload resumes.
- **Job Discovery & Applications:** Browse job listings, view company public profiles, and apply seamlessly.
- **Application Tracking:** Real-time tracking of job application statuses.
- **Video Interviews:** In-app P2P video interview capabilities using WebRTC (PeerJS).

### 🏢 Company / HR Portal
- **Job Management:** Create, edit, publish, and manage job postings.
- **Applicant Tracking:** View and manage all applicants across different hiring stages (e.g., Applied, Shortlisted, Interviewed, Hired).
- **Team Collaboration:** Add and manage internal users (HR, Interviewers, Admins) with Role-Based Access Control (RBAC).
- **Interview Scheduling:** Schedule and conduct live video interviews directly on the platform.
- **Company Branding:** Manage a public-facing company profile to attract talent.

### 🛡️ Platform Administration
- **Centralized Dashboard:** Comprehensive analytics and overview of platform activity.
- **Entity Management:** Monitor, verify, and manage registered companies and candidates.
- **Job Moderation:** Oversee and moderate public job listings.

## 🛠️ Technology Stack
- **Frontend Framework:** Angular v20 (with Server-Side Rendering support)
- **Styling:** Tailwind CSS v4
- **Real-Time Communication:** Socket.io (for live updates and signaling)
- **Video Conferencing:** PeerJS (WebRTC) for robust peer-to-peer video interviews
- **Document Viewing:** `ng2-pdf-viewer` & `pdfjs-dist` for seamless in-app PDF/resume viewing
- **Authentication:** Advanced JWT-based flow with Angular Guards (Role-based route protection) & Social Login integration
- **Alerts & UI:** SweetAlert2 & FontAwesome

## 🏗️ Project Architecture
The codebase strictly follows a highly scalable modular, feature-oriented Angular architecture:
- `src/app/core/` - Core services, interceptors, and application-wide singletons.
- `src/app/shared/` - Reusable UI components, directives, pipes, and auth guards.
- `src/app/features/` - Lazy-loaded feature modules ensuring optimal performance:
  - `/admin` - Platform administration module.
  - `/auth` - Login, Signup, Password management, and Email verification.
  - `/candidate` - Candidate experience and application tracking.
  - `/company` - Employer portal, applicant management, and HR tools.
  - `/video-interview` - Dedicated WebRTC-powered live interviewing module.

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://github.com/angular/angular-cli) v20

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fobverse
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run `npm run start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running SSR (Server-Side Rendering)
To serve the application with Server-Side Rendering for improved SEO and initial load times:
```bash
npm run build
npm run serve:ssr:fobverse
```

## 🔐 Security & Best Practices
- **Strict Route Enforcement:** Multi-tier route guards prevent unauthorized access across Candidate, HR, Company Admin, and Super Admin roles.
- **Lazy Loading:** Substantial reduction of initial bundle sizes by chunking feature modules.
- **State Management & RxJS:** Extensive use of RxJS observables for reactive data flows.

---
*Note to Recruiters: This project demonstrates proficiency in modern Angular, complex state and role management, real-time socket integrations, WebRTC, and scalable architectural patterns.*
