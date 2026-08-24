# Smart CiviConnect — `qa-browser.mjs` Documentation

## File Path

```text
E:\5th_sem_project\SmartciviConnect\frontend\scripts\qa-browser.mjs
```

## 1. Purpose

`qa-browser.mjs` is an **automated browser QA (Quality Assurance) script** for the Smart CiviConnect frontend.

It opens the application in a browser and checks important user flows automatically. It does not build the UI or implement application features. Instead, it checks whether existing frontend features are working as expected.

The script returns a structured QA report at the end.

---

## 2. Main Things Tested

This file checks:

- Public pages
- User login
- Citizen dashboard
- Complaint details
- Complaint refresh
- Feedback and rating UI
- Work proof/evidence UI
- Complaint creation
- GPS location capture
- Citizen community feed
- Citizen jobs
- Saved page
- Forgot-password UI
- Admin dashboard
- Admin complaints
- Admin jobs
- Officer complaint queue
- Staff tasks
- Staff earnings
- Staff live tracking
- Role-based access protection
- Browser console errors
- Failed API requests
- React/page crash indicators

---

## 3. Main Function

The file exports one main function:

```js
export default async function run(page, ui)
```

### Parameters

- `page` — Browser page object used for navigation and interaction.
- `ui` — UI helper/context passed to the function. It is not directly used in this file.

The function is asynchronous because browser actions such as page loading, clicking, typing, and waiting are asynchronous.

---

## 4. QA Report Object

At the beginning, the script creates:

```js
const report = {
  pages: [],
  consoleErrors: [],
  failedRequests: []
};
```

The report stores the test results.

### `pages`

Stores information about visited pages.

For each page it records:

- Route/path
- Page title
- Whether a crash was detected
- A short text snippet from the page

### `consoleErrors`

Stores browser console errors.

### `failedRequests`

Stores failed frontend API requests.

---

## 5. Console Error Monitoring

The script listens for browser console messages:

```js
page.on("console", (msg) => {
  if (msg.type() === "error") {
    report.consoleErrors.push({
      url: page.url(),
      text: msg.text()
    });
  }
});
```

If a browser console message has type `error`, it is added to the QA report.

This helps detect frontend JavaScript errors.

---

## 6. API Failure Monitoring

The script also listens to network responses:

```js
page.on("response", (res) => {
  if (res.status() >= 400 && res.url().includes("/api/")) {
    report.failedRequests.push({
      status: res.status(),
      url: res.url()
    });
  }
});
```

If an API response has a status code of `400` or higher and the URL contains `/api/`, it is recorded as a failed API request.

This can detect errors such as:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Server Error

---

## 7. Reusable `visit()` Function

The file contains a helper function:

```js
async function visit(path, waitText)
```

Its job is to open a frontend route and collect basic QA information.

### What it does

1. Opens the route.
2. Waits for the network to become idle.
3. Optionally waits for expected text.
4. Gets the page title.
5. Reads the page body text.
6. Checks for common crash messages.
7. Saves the result in `report.pages`.
8. Returns the page body text.

The application URL used by this function is:

```text
http://localhost:5173
```

So the script is designed to test the local Vite frontend.

---

## 8. Page Crash Detection

The script checks for these text patterns:

```text
Minified React error
Something went wrong
Unable to load
```

If one of these messages is found, the page is marked as crashed.

This is a simple frontend health check.

---

# 9. Public Page Tests

The script first checks public pages.

### Home

```text
/
```

Expected text:

```text
SmartCiviConnect
```

### Jobs

```text
/jobs
```

Expected text:

```text
jobs
```

### Job Details

```text
/job/6a8ae1547f6070ba9f2dec73
```

Expected job:

```text
QA Field Electrician
```

The script also checks whether a guest user is asked to log in or register before applying for a job.

Expected messages include:

```text
Login to apply
```

or:

```text
Register to apply
```

Result:

```js
report.guestApplyRedirect
```

---

## 10. Other Public Pages

The following pages are also visited:

```text
/professionals
/feed
/contact
/login
```

The script checks that the expected page content is available.

---

# 11. Citizen Login Test

The script logs in using a QA citizen account.

The login flow is:

```text
/login
   ↓
Enter Email
   ↓
Enter Password
   ↓
Click Login
   ↓
Open Citizen Dashboard
```

After login, the script waits for a URL containing:

```text
citizen
```

It stores the final URL in:

```js
report.citizenLoginUrl
```

It also stores a short part of the citizen dashboard text:

```js
report.citizenDashboard
```

---

# 12. Citizen Complaint Details Test

The script opens:

```text
/citizen/complaint/SCC-2026-00005
```

It expects the complaint ID:

```text
SCC-2026-00005
```

The page is then refreshed.

The purpose is to check that the complaint still loads correctly after a browser refresh.

Result:

```js
report.complaintRefreshOk
```

This is useful for checking whether the complaint page depends only on temporary frontend state.

---

# 13. Complaint Feedback Test

After the complaint page is loaded again, the script looks for:

```text
feedback
rating
Completed
```

Result:

```js
report.feedbackVisible
```

This checks whether the feedback/rating or completion-related UI is visible.

---

# 14. Complaint Proof/Evidence Test

The script checks for words or content related to work proof:

```text
sample.jpg
evidence
proof
work
```

Result:

```js
report.proofVisible
```

This checks whether complaint evidence or work proof is visible in the complaint details page.

---

# 15. Create Complaint Test

The script opens:

```text
/citizen/create
```

Expected text:

```text
Report a civic issue
```

It then selects:

```text
Electricity
```

and clicks:

```text
Continue
```

Then it clicks:

```text
Get Current Location
```

This tests an important part of the citizen complaint creation flow.

---

# 16. GPS Location Test

The browser is given geolocation permission:

```js
context.grantPermissions(["geolocation"])
```

A test location is then set:

```text
Latitude: 18.5204
Longitude: 73.8567
```

This is a simulated browser location for QA testing.

The script clicks:

```text
Get Current Location
```

and waits for the application to process the location.

It then checks for:

```text
Live coordinates
```

or matching coordinate text.

Result:

```js
report.gpsCaptured
```

If the browser geolocation setup fails, the error is saved as:

```js
report.geoError
```

---

# 17. Citizen Community Feed Test

The script opens:

```text
/citizen/feed
```

It checks for content such as:

```text
Community
post
Share
```

Result:

```js
report.feedLoaded
```

This confirms that the citizen community feed is loading.

---

# 18. Citizen Jobs Test

The script opens:

```text
/citizen/jobs
```

It checks for:

```text
QA Field Electrician
Applied
applications
```

Result:

```js
report.appliedJobsVisible
```

This checks whether citizen job/application information is visible.

---

# 19. Saved Page Test

The script visits:

```text
/citizen/saved
```

This is mainly a page-load/navigation check.

---

# 20. Forgot Password Test

The script opens:

```text
/forgot-password
```

It enters the QA citizen email and clicks the reset button.

Expected UI includes:

```text
reset link has been sent
```

or:

```text
If that email...
```

Result:

```js
report.forgotUi
```

This checks the frontend password-reset request flow.

---

# 21. Admin Login Test

Before logging in as another role, the script checks whether the current user is already logged in.

If necessary, it clicks:

```text
Logout
```

Then it logs in using the QA admin account.

The expected URL contains:

```text
admin
```

The final URL is stored in:

```js
report.adminUrl
```

---

# 22. Admin Dashboard Test

The script checks the admin dashboard for:

```text
Total complaints
```

or:

```text
City operations
```

It also checks for numeric content.

Result:

```js
report.adminStatsNumeric
```

This provides a basic check that dashboard statistics are being displayed.

---

# 23. Admin Complaint Management Test

The script opens:

```text
/admin/complaints
```

It checks whether the QA complaint is visible:

```text
SCC-2026-00005
```

or:

```text
QA street light
```

Result:

```js
report.adminSeesQaComplaint
```

This checks the admin complaint list/management page.

---

# 24. Admin Jobs Test

The script opens:

```text
/admin/jobs
```

It checks for:

```text
QA Field Electrician
```

or:

```text
Candidate management
```

Result:

```js
report.adminJobs
```

This checks the admin job and candidate management UI.

---

# 25. Officer Login and Complaint Queue Test

The script logs in using the QA officer account.

It then opens:

```text
/officer/complaints
```

The script checks for:

```text
Assigned
```

and the QA complaint:

```text
QA street light
```

or:

```text
SCC-2026-00005
```

Result:

```js
report.officerQueue
```

This checks whether an officer can see assigned complaints.

---

# 26. Staff Login and Task Test

The script logs in using the QA staff account.

It opens:

```text
/staff/tasks
```

Two checks are performed.

### Page health

The script makes sure the page does not contain:

```text
Minified React error
Unexpected token
```

Result:

```js
report.staffTasksPage
```

### Task visibility

It checks for:

```text
SCC-2026-00005
QA street light
No tasks
```

Result:

```js
report.staffSeesTask
```

This verifies the staff task page.

---

# 27. Staff Earnings Test

The script opens:

```text
/staff/earnings
```

It checks for:

```text
₹1800
Pending
Earnings
```

Result:

```js
report.staffEarnings
```

This checks whether staff earnings/payment information is visible.

---

# 28. Staff Live Tracking Test

The script opens:

```text
/staff/tracking
```

It checks for:

```text
Start Sharing
```

or:

```text
Get Current Location
```

Result:

```js
report.staffTracking
```

This checks whether the staff live-location UI is available.

---

# 29. Role-Based Access Test

The script finally tests whether a staff user can access the admin dashboard.

It tries to open:

```text
/admin/dashboard
```

The expected result is that the staff user should **not** get normal admin access.

The script accepts indicators such as:

```text
login
do not have permission
not needed
```

or checks whether the URL no longer contains:

```text
/admin/dashboard
```

Result:

```js
report.staffBlockedFromAdmin
```

This is a basic role-based access control test.

---

# 30. Final API Failure Filtering

At the end, failed API requests are filtered:

```js
report.apiFailures =
  report.failedRequests.filter(
    (item) => !item.url.includes("nominatim")
  );
```

Nominatim requests are excluded from the final API failure list.

---

# 31. Unique Console Errors

Duplicate console errors are removed:

```js
report.uniqueConsole =
  [...new Set(
    report.consoleErrors.map((e) => e.text)
  )].slice(0, 12);
```

Only the first 12 unique console error messages are kept.

---

# 32. Final Report

After all tests finish, the function returns:

```js
return report;
```

The report can contain information such as:

```text
pages
consoleErrors
failedRequests
guestApplyRedirect
citizenLoginUrl
citizenDashboard
complaintRefreshOk
feedbackVisible
proofVisible
geoError
gpsCaptured
feedLoaded
appliedJobsVisible
forgotUi
adminUrl
adminStatsNumeric
adminSeesQaComplaint
adminJobs
officerQueue
staffTasksPage
staffSeesTask
staffEarnings
staffTracking
staffBlockedFromAdmin
apiFailures
uniqueConsole
```

---

# 33. Complete Test Flow

The complete flow can be understood as:

```text
Start QA
   │
   ├── Monitor Console Errors
   ├── Monitor API Failures
   │
   ├── Test Public Pages
   │
   ├── Citizen Login
   │    ├── Dashboard
   │    ├── Complaint
   │    ├── Complaint Refresh
   │    ├── Feedback
   │    ├── Work Proof
   │    ├── Create Complaint
   │    ├── GPS
   │    ├── Community Feed
   │    ├── Jobs
   │    ├── Saved
   │    └── Forgot Password
   │
   ├── Admin Login
   │    ├── Dashboard
   │    ├── Complaints
   │    └── Jobs
   │
   ├── Officer Login
   │    └── Complaint Queue
   │
   ├── Staff Login
   │    ├── Tasks
   │    ├── Earnings
   │    └── Live Tracking
   │
   ├── Role Protection Test
   │    └── Staff → Admin Dashboard
   │
   └── Return QA Report
```

---

# 34. Important Notes

### This file does NOT implement features

`qa-browser.mjs` does not create:

- Complaints
- Dashboards
- Maps
- Authentication
- Jobs
- Payments
- Staff tracking

Those features should already exist in the Smart CiviConnect frontend/backend.

This file only **tests their visible behavior**.

### Test accounts

The script uses dedicated QA accounts for:

- Citizen
- Admin
- Officer
- Staff

The credentials are hard-coded in this test file. In a production-quality testing setup, credentials should normally be stored in environment variables or a secure test-secret system instead of being committed directly to source control.

### Local frontend

The test expects the frontend to be running at:

```text
http://localhost:5173
```

Therefore, the Vite frontend should be running before this browser QA script is executed.

---

# 35. Short Summary

`qa-browser.mjs` is the **automated end-to-end QA test file of the Smart CiviConnect frontend**.

It simulates real users with different roles and checks whether important frontend flows work correctly.

The main roles tested are:

```text
Citizen
Admin
Officer
Staff
```

The main areas tested are:

```text
Authentication
Navigation
Complaints
GPS
Jobs
Community Feed
Dashboard
Tasks
Earnings
Live Tracking
Role Permissions
API Errors
Console Errors
```

At the end, it returns a structured `report` that can be used to understand the overall frontend QA result.

---

## File Classification

| Property | Value |
|---|---|
| File | `qa-browser.mjs` |
| Location | `frontend/scripts/` |
| Type | JavaScript Module |
| Main Purpose | Automated Browser QA |
| Testing Style | End-to-End / User Flow Testing |
| Frontend | Smart CiviConnect |
| Local URL | `http://localhost:5173` |
| Main Roles | Citizen, Admin, Officer, Staff |
| Main Output | QA Report |
| UI Creation | No |
| API Creation | No |
| Database Work | No |
| Browser Automation | Yes |
| Error Monitoring | Yes |
| GPS Testing | Yes |
| Role Testing | Yes |
