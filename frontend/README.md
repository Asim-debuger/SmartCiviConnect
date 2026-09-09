# SmartciviConnect — Frontend

React 19 + Vite single-page application for the SmartciviConnect civic-services
platform (complaints, jobs, community feed, and role-based dashboards for
citizens, officers, staff, and admins).

## How pages are rendered

```
index.html
  └─ src/main.jsx          BrowserRouter + AuthProvider + AppUserProvider
       └─ src/App.jsx      ThemeProvider > SocketProvider > ToastProvider > AppRoutes
            └─ src/routes/AppRoutes.jsx   declares every route (lazy-loaded pages)
                 └─ layouts/*             role-based shell (navbar/sidebar/outlet)
                      └─ pages/*           the screen rendered for that URL
```

Each URL is mapped to a **page component** inside `src/routes/AppRoutes.jsx`.
Pages are grouped under a **layout** and, for private areas, wrapped in route
**guards** (`ProtectedRoute` = must be logged in, `RoleRoute` = must have an
allowed role). The table below lists every entry point.

Legend — Layout: `Public`, `Citizen`, `Admin`, `Officer`, `Staff`, `None` (standalone).
Guard: `Auth` (ProtectedRoute), `CITIZEN` / `ADMIN` / `SUPER_ADMIN` / `OFFICER` /
`HEAD_OFFICER` / `STAFF` (RoleRoute), or `-` (public).

## Public pages (`PublicLayout`, no auth)

| Route path                          | Component                  | Source file                                      |
|-------------------------------------|----------------------------|--------------------------------------------------|
| `/`                                 | Home                       | `src/pages/public/Home.jsx`                      |
| `/about`                            | About                      | `src/pages/public/About.jsx`                     |
| `/services`                         | Services                   | `src/pages/public/Services.jsx`                  |
| `/contact`                          | Contact                    | `src/pages/public/Contact.jsx`                   |
| `/how-it-works`                     | HowItWorks                 | `src/pages/public/HowItWorks.jsx`                |
| `/faq`                              | FAQ                        | `src/pages/public/FAQ.jsx`                       |
| `/jobs`                             | PublicJobs                 | `src/pages/public/PublicJobs.jsx`                |
| `/job/:id`                          | PublicJobDetail            | `src/pages/public/PublicJobDetail.jsx`           |
| `/feed`                             | PublicFeed                 | `src/pages/public/PublicFeed.jsx`                |
| `/post/:id`                         | PublicPost                 | `src/pages/public/PublicPost.jsx`                |
| `/professionals`                    | PublicProfessionals        | `src/pages/public/PublicProfessionals.jsx`       |
| `/professional/:id`                 | PublicProfessionalProfile  | `src/pages/public/PublicProfessionalProfile.jsx` |
| `/u/:username`                      | PublicProfessionalProfile  | `src/pages/public/PublicProfessionalProfile.jsx` |
| `/profile/:username`                | PublicProfessionalProfile  | `src/pages/public/PublicProfessionalProfile.jsx` |
| `/public/professionals`             | PublicProfessionals        | `src/pages/public/PublicProfessionals.jsx`       |
| `/public/professionals/:id`         | PublicProfessionalProfile  | `src/pages/public/PublicProfessionalProfile.jsx` |
| `/privacy-policy`                   | LegalPage (`type="privacy"`) | `src/pages/public/LegalPage.jsx`              |
| `/terms`                            | LegalPage (`type="terms"`)   | `src/pages/public/LegalPage.jsx`              |
| `/public/jobs`                      | → redirect to `/jobs`      | —                                                |
| `*` (catch-all)                     | NotFound                   | `src/pages/public/NotFound.jsx`                  |

## Auth pages (standalone, mostly public)

| Route path                  | Component       | Source file                          | Guard |
|-----------------------------|-----------------|--------------------------------------|-------|
| `/login`                    | Login           | `src/pages/auth/Login.jsx`           | `-`   |
| `/register`                 | Register        | `src/pages/auth/Register.jsx`        | `-`   |
| `/forgot-password`          | ForgotPassword  | `src/pages/auth/ForgotPassword.jsx`  | `-`   |
| `/reset-password/:token`    | ResetPassword   | `src/pages/auth/ResetPassword.jsx`   | `-`   |
| `/profile`                  | Profile         | `src/pages/auth/Profile.jsx`         | Auth  |
| `/auth/redirect`            | AuthRedirect    | `src/pages/auth/AuthRedirect.jsx`    | Auth  |

## Citizen pages (`CitizenLayout`, guard: `CITIZEN`)

| Route path                                  | Component             | Source file                                        |
|---------------------------------------------|-----------------------|----------------------------------------------------|
| `/citizen` (→ `/citizen/dashboard`)         | redirect               | —                                                  |
| `/citizen/dashboard`                        | CitizenDashboard      | `src/pages/citizen/CitizenDashboard.jsx`           |
| `/citizen/create`                           | CreateComplaint       | `src/pages/citizen/CreateComplaint.jsx`            |
| `/citizen/history`                          | ComplaintHistory      | `src/pages/citizen/ComplaintHistory.jsx`            |
| `/citizen/complaint/:id`                    | ComplaintDetails      | `src/pages/citizen/ComplaintDetails.jsx`            |
| `/citizen/track`                            | TrackComplaint        | `src/pages/citizen/TrackComplaint.jsx`              |
| `/citizen/complaints`                       | MyComplaints          | `src/pages/citizen/MyComplaints.jsx`                |
| `/citizen/notifications`                    | CitizenNotifications  | `src/pages/citizen/CitizenNotifications.jsx`        |
| `/citizen/tracking/:id`                     | ComplaintTracking     | `src/pages/citizen/ComplaintTracking.jsx`           |
| `/citizen/network`                          | NetworkPage           | `src/pages/community/NetworkPage.jsx`               |
| `/citizen/feed`                             | FeedPage              | `src/pages/community/FeedPage.jsx`                 |
| `/citizen/saved`                            | SavedPostsPage        | `src/pages/community/SavedPostsPage.jsx`            |
| `/citizen/jobs`                             | JobsPage              | `src/pages/jobs/JobsPage.jsx`                       |
| `/citizen/jobs/:id`                         | JobDetailPage         | `src/pages/jobs/JobDetailPage.jsx`                  |
| `/citizen/jobs/applications/:applicationId` | ApplicationDetail     | `src/pages/jobs/ApplicationDetail.jsx`              |
| `/citizen/inbox`                            | InboxPage             | `src/pages/community/InboxPage.jsx`                |
| `/citizen/profile/:id`                      | ProfessionalProfile   | `src/pages/community/ProfessionalProfile.jsx`       |

## Admin pages (`AdminLayout`, guard: `ADMIN`, `SUPER_ADMIN`)

| Route path                       | Component             | Source file                                        |
|----------------------------------|-----------------------|----------------------------------------------------|
| `/admin` (→ `/admin/dashboard`)  | redirect               | —                                                  |
| `/admin/dashboard`               | AdminDashboard        | `src/pages/admin/AdminDashboard.jsx`               |
| `/admin/complaints`              | ComplaintManagement   | `src/pages/admin/ComplaintManagement.jsx`          |
| `/admin/users`                   | UserManagement        | `src/pages/admin/UserManagement.jsx`               |
| `/admin/roles`                   | UserManagement        | `src/pages/admin/UserManagement.jsx`               |
| `/admin/departments`             | DepartmentManagement   | `src/pages/admin/DepartmentManagement.jsx`        |
| `/admin/officers`                | OfficerManagement     | `src/pages/admin/OfficerManagement.jsx`            |
| `/admin/staff`                   | StaffManagement       | `src/pages/admin/StaffManagement.jsx`              |
| `/admin/payments`                | PaymentManagement     | `src/pages/admin/PaymentManagement.jsx`            |
| `/admin/jobs`                    | JobManagement         | `src/pages/jobs/JobManagement.jsx`                 |
| `/admin/network`                 | NetworkPage           | `src/pages/community/NetworkPage.jsx`              |
| `/admin/feed`                    | FeedPage              | `src/pages/community/FeedPage.jsx`                 |
| `/admin/saved`                   | SavedPostsPage        | `src/pages/community/SavedPostsPage.jsx`           |
| `/admin/inbox`                   | InboxPage             | `src/pages/community/InboxPage.jsx`                |
| `/admin/profile/:id`             | ProfessionalProfile   | `src/pages/community/ProfessionalProfile.jsx`       |
| `/admin/notifications`           | NotificationInbox (`accent="blue"`) | `src/components/common/NotificationInbox.jsx` |
| `/admin/analytics`               | AnalyticsDashboard    | `src/pages/admin/AnalyticsDashboard.jsx`           |
| `/admin/reports`                 | AnalyticsDashboard    | `src/pages/admin/AnalyticsDashboard.jsx`           |

## Super Admin pages (`AdminLayout`, guard: `SUPER_ADMIN`)

| Route path                                | Component            | Source file                              |
|-------------------------------------------|----------------------|------------------------------------------|
| `/super-admin` (→ `/super-admin/dashboard`) | redirect           | —                                        |
| `/super-admin/dashboard`                  | SuperAdminDashboard  | `src/pages/admin/SuperAdminDashboard.jsx`|

## Officer / Head Officer pages (`OfficerLayout`, guard: `OFFICER`, `HEAD_OFFICER`)

| Route path                                        | Component             | Source file                                        |
|---------------------------------------------------|-----------------------|----------------------------------------------------|
| `/officer` (→ `/officer/dashboard`)               | redirect               | —                                                  |
| `/officer/dashboard`                              | OfficerDashboard      | `src/pages/officer/OfficerDashboard.jsx`           |
| `/officer/complaints`                             | AssignedComplaints    | `src/pages/officer/AssignedComplaints.jsx`         |
| `/officer/staff`                                  | OfficerStaff          | `src/pages/officer/OfficerStaff.jsx`               |
| `/officer/tracking`                               | OfficerTracking       | `src/pages/officer/OfficerTracking.jsx`            |
| `/officer/notifications`                          | OfficerNotifications  | `src/pages/officer/OfficerNotifications.jsx`       |
| `/officer/network`                                | NetworkPage           | `src/pages/community/NetworkPage.jsx`              |
| `/officer/feed`                                   | FeedPage              | `src/pages/community/FeedPage.jsx`                 |
| `/officer/saved`                                  | SavedPostsPage        | `src/pages/community/SavedPostsPage.jsx`           |
| `/officer/jobs`                                   | JobsPage              | `src/pages/jobs/JobsPage.jsx`                      |
| `/officer/jobs/:id`                               | JobDetailPage         | `src/pages/jobs/JobDetailPage.jsx`                 |
| `/officer/jobs/applications/:applicationId`       | ApplicationDetail     | `src/pages/jobs/ApplicationDetail.jsx`             |
| `/officer/inbox`                                  | InboxPage             | `src/pages/community/InboxPage.jsx`                |
| `/officer/profile/:id`                            | ProfessionalProfile   | `src/pages/community/ProfessionalProfile.jsx`      |
| `/head-officer` (→ `/head-officer/dashboard`)     | redirect               | —                                                  |
| `/head-officer/dashboard`                         | HeadOfficerDashboard  | `src/pages/head/HeadOfficerDashboard.jsx`          |
| `/head-officer/jobs`                              | JobManagement         | `src/pages/jobs/JobManagement.jsx`                 |
| `/head-officer/jobs/applications/:applicationId`  | ApplicationDetail     | `src/pages/jobs/ApplicationDetail.jsx`             |
| `/head-officer/feed`                              | FeedPage              | `src/pages/community/FeedPage.jsx`                 |
| `/head-officer/profile/:id`                       | ProfessionalProfile   | `src/pages/community/ProfessionalProfile.jsx`      |
| `/head-officer/network`                           | NetworkPage           | `src/pages/community/NetworkPage.jsx`              |
| `/head-officer/inbox`                             | InboxPage             | `src/pages/community/InboxPage.jsx`                |

## Staff pages (`StaffLayout`, guard: `STAFF`)

| Route path                                      | Component            | Source file                                        |
|-------------------------------------------------|----------------------|----------------------------------------------------|
| `/staff` (→ `/staff/dashboard`)                 | redirect              | —                                                  |
| `/staff/dashboard`                              | StaffDashboard       | `src/pages/staff/StaffDashboard.jsx`               |
| `/staff/tasks`                                  | AssignedTasks        | `src/pages/staff/AssignedTasks.jsx`                |
| `/staff/tracking`                               | StaffLiveTracking    | `src/pages/staff/StaffLiveTracking.jsx`            |
| `/staff/notifications`                          | StaffNotifications   | `src/pages/staff/StaffNotifications.jsx`           |
| `/staff/earnings`                               | StaffEarnings        | `src/pages/staff/StaffEarnings.jsx`                |
| `/staff/network`                                | NetworkPage          | `src/pages/community/NetworkPage.jsx`              |
| `/staff/feed`                                   | FeedPage             | `src/pages/community/FeedPage.jsx`                 |
| `/staff/saved`                                  | SavedPostsPage       | `src/pages/community/SavedPostsPage.jsx`           |
| `/staff/jobs`                                   | JobsPage             | `src/pages/jobs/JobsPage.jsx`                      |
| `/staff/jobs/:id`                               | JobDetailPage        | `src/pages/jobs/JobDetailPage.jsx`                 |
| `/staff/jobs/applications/:applicationId`       | ApplicationDetail    | `src/pages/jobs/ApplicationDetail.jsx`             |
| `/staff/inbox`                                  | InboxPage            | `src/pages/community/InboxPage.jsx`                |
| `/staff/profile/:id`                            | ProfessionalProfile  | `src/pages/community/ProfessionalProfile.jsx`      |

## Shared (rendered inside multiple role sections)

These components are reused across several role groups and are loaded via their
own lazy imports in `src/routes/AppRoutes.jsx`:

| Component            | Source file                                  | Used by                          |
|----------------------|----------------------------------------------|----------------------------------|
| NetworkPage          | `src/pages/community/NetworkPage.jsx`        | Citizen, Admin, Officer, Staff   |
| FeedPage             | `src/pages/community/FeedPage.jsx`           | Citizen, Admin, Officer, Staff   |
| SavedPostsPage       | `src/pages/community/SavedPostsPage.jsx`     | Citizen, Admin, Officer, Staff   |
| InboxPage            | `src/pages/community/InboxPage.jsx`          | Citizen, Admin, Officer, Staff   |
| ProfessionalProfile  | `src/pages/community/ProfessionalProfile.jsx`| Citizen, Admin, Officer, Staff   |
| JobsPage             | `src/pages/jobs/JobsPage.jsx`                | Citizen, Officer, Staff          |
| JobDetailPage        | `src/pages/jobs/JobDetailPage.jsx`           | Citizen, Officer, Staff          |
| ApplicationDetail    | `src/pages/jobs/ApplicationDetail.jsx`       | Citizen, Officer, Staff, Head    |
| JobManagement        | `src/pages/jobs/JobManagement.jsx`           | Admin, Head Officer              |
| NotificationInbox    | `src/components/common/NotificationInbox.jsx`| Admin (notifications)            |

## Notes

- All page components are **lazy-loaded** (`React.lazy` + `<Suspense>`) and the
  route table lives entirely in `src/routes/AppRoutes.jsx`.
- Routes marked `→ redirect` only redirect to a default sub-route; they render no
  page of their own.
- For the overall design, see [`ARCHITECTURE.md`](./ARCHITECTURE.md). For
  run/setup instructions, see [`SETUP.md`](./SETUP.md). Per-file notes are kept
  next to each source file as `*.md`.

---

# Backend & Server

The backend is a **Node.js + Express 5** REST + real-time API that the frontend
talks to. It lives in the sibling `../backend` folder and is started from
`backend/server.js`.

## How the server is created (`backend/server.js`)

1. **Load env** — `dotenv` loads `backend/.env` (so `PORT`, secrets, DB URI, and
   `FRONTEND_URL` are available).
2. **Create Express app + HTTP server** — `const app = express()` and
   `const server = http.createServer(app)`.
3. **Attach Socket.IO** — `new Server(server, { cors: { origin: frontendOrigin,
   credentials: true } })`. The `io` instance is stored on `app.set("io", io)`
   so controllers can emit real-time events.
4. **Connect database + seed** — `connectDB()` (Mongoose → MongoDB) resolves, then
   `ensureDefaultDepartments()` seeds default departments via
   `services/departmentService.js`.
5. **Security & parsing middleware** —
   - `cors(corsOptions)` — allows the frontend origin (`FRONTEND_URL`, default
     `http://localhost:5173`), with `credentials: true`.
   - `cookieParser()` — reads auth cookies.
   - `helmet()` — security headers.
   - `express-rate-limit` — 300 requests / 15 min.
   - `express.raw(...)` for `POST /api/payments/webhook` (payment provider
     webhook needs the raw body).
   - `express.json({ limit: "1mb" })` — JSON bodies.
6. **Mount API routes** (all under `/api`):

   | Mount point            | Router file                          |
   |------------------------|--------------------------------------|
   | `/api/users`           | `routes/userRoutes.js`               |
   | `/api/complaints`      | `routes/complaintRoutes.js`          |
   | `/api/uploads`         | `routes/uploadRoutes.js`             |
   | `/api/operations`      | `routes/operationsRoutes.js`         |
   | `/api/public`          | `routes/publicRoutes.js`             |
   | `/api/auth`            | `routes/authRoutes.js`               |
   | `/api` (platform)      | `routes/platformRoutes.js`            |
   | `/api` (community)     | `routes/communityRoutes.js`          |

7. **Socket.IO auth + events** —
   - Handshake middleware verifies the JWT (`Authorization`/auth token) and sets
     `socket.userId` / `socket.userRole`, joining `user:*` and `role:*` rooms.
   - On `connection`: presence (`presence:online/offline`), `complaint:join`,
     `chat:join`, `chat:typing`, and `location:update` (staff live tracking fanned
     out to officers/admins and the complaint room).
8. **Error handler** — central `(error, req, res, next)` maps Mongoose/validation
   errors to 400 and others to 500.
9. **Listen** — `server.listen(PORT || 5000)` (the frontend's `VITE_API_URL`
   default `http://localhost:5000`). A `GET /` returns
   `"SmartciviConnect Backend Running"`.

## Backend structure (`../backend`)

```
backend/
├─ server.js              # entry: Express + Socket.IO server (see above)
├─ config/
│  ├─ db.js               # Mongoose connection to MongoDB
│  └─ cloudinary.js       # Cloudinary media config
├─ routes/                # Express routers (URL → controller)
├─ controllers/           # request handlers (auth, user, complaint, job,
│                         #   community, chat, payment, notification, upload, …)
├─ models/                # Mongoose schemas (User, Complaint, Job, Post,
│                         #   Message, Notification, Payment, Department, …)
├─ middleware/
│  └─ auth.js             # JWT verify / role guard for REST routes
├─ services/              # business logic (email, notification, realtime,
│                         #   audit, department seeding, complaint events)
├─ utils/                 # helpers (roles, payment/razorpay, work evidence, …)
├─ scripts/               # seed + QA scripts (setUserRole, seedQaUsers, …)
├─ tests/                 # Node test runner tests
└─ package.json           # deps + scripts
```

## Backend dependencies (`backend/package.json`)

- **Web framework:** `express` (v5)
- **Database:** `mongoose` (MongoDB)
- **Auth/security:** `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`,
  `cookie-parser`, `express-rate-limit`, `dotenv`
- **Real-time:** `socket.io`
- **Media/email:** `cloudinary`, `nodemailer`, `@getbrevo/brevo`
- **Dev:** `nodemon`

## Running the backend

```bash
cd ../backend
npm install
npm run dev      # nodemon server.js (auto-restart)
# or
npm start        # node server.js
```

It listens on `PORT` (default **5000**) and expects a MongoDB instance configured
via `backend/.env` (`MONGODB_URI` / connection string).

## How frontend ↔ backend connect

| Concern            | Frontend                                  | Backend                                |
|--------------------|-------------------------------------------|----------------------------------------|
| REST base URL      | `VITE_API_URL` → `http://localhost:5000`  | `server.listen(5000)`                  |
| API prefix         | `axiosInstance` appends `/api`            | routes mounted under `/api/*`          |
| CORS               | sends cookies (`withCredentials`)         | `cors` allows `FRONTEND_URL` + creds   |
| Auth               | JWT in `localStorage`, auto-refresh       | `middleware/auth.js` + `/api/auth/*`   |
| Real-time          | `SocketContext` + `useSocket`             | Socket.IO on same server, JWT handshake |
| Media uploads      | `uploadApi`                               | `routes/uploadRoutes.js` + Cloudinary  |

No frontend code was modified; this section only documents the existing backend.
