export default async function run(page, ui) {
  const report = { pages: [], consoleErrors: [], failedRequests: [] };
  page.on("console", (msg) => {
    if (msg.type() === "error") report.consoleErrors.push({ url: page.url(), text: msg.text() });
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && res.url().includes("/api/")) {
      report.failedRequests.push({ status: res.status(), url: res.url() });
    }
  });

  async function visit(path, waitText) {
    await page.goto(`http://localhost:5173${path}`, { waitUntil: "networkidle" });
    if (waitText) {
      await page.getByText(waitText, { exact: false }).first().waitFor({ timeout: 15000 }).catch(() => {});
    }
    const title = await page.title();
    const body = (await page.locator("body").innerText()).slice(0, 400);
    const crashed = /Minified React error|Something went wrong|Unable to load/i.test(body);
    report.pages.push({ path, title, crashed, snippet: body.replace(/\s+/g, " ").slice(0, 220) });
    return body;
  }

  await visit("/", "SmartCiviConnect");
  await visit("/jobs", "jobs");
  const jobsBody = await visit("/job/6a8ae1547f6070ba9f2dec73", "QA Field Electrician");
  const guestApply = /Login to apply|Register to apply/i.test(jobsBody);
  report.guestApplyRedirect = guestApply;
  await visit("/professionals", "professional");
  await visit("/feed", "feed");
  await visit("/contact", "Reach");
  await visit("/login", "Login");

  await page.getByPlaceholder("Email").fill("qa.citizen.scc@example.com");
  await page.getByPlaceholder(/Password/).fill("QaScc2026!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/citizen/, { timeout: 15000 }).catch(() => {});
  report.citizenLoginUrl = page.url();
  const dash = await page.locator("body").innerText();
  report.citizenDashboard = dash.slice(0, 250);

  await visit("/citizen/complaint/SCC-2026-00005", "SCC-2026-00005");
  await page.reload({ waitUntil: "networkidle" });
  const afterRefresh = await page.locator("body").innerText();
  report.complaintRefreshOk = /SCC-2026-00005/.test(afterRefresh) && !/Unable to load this complaint/i.test(afterRefresh);
  report.feedbackVisible = /feedback|rating|Completed/i.test(afterRefresh);
  report.proofVisible = /sample\.jpg|evidence|proof|work/i.test(afterRefresh);

  await visit("/citizen/create", "Report a civic issue");
  try {
    const context = page.context();
    await context.grantPermissions(["geolocation"], { origin: "http://localhost:5173" });
    await context.setGeolocation({ latitude: 18.5204, longitude: 73.8567 });
  } catch (error) {
    report.geoError = error.message;
  }
  await page.getByRole("button", { name: "Electricity" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Get Current Location" }).click();
  await page.waitForTimeout(2500);
  const gpsBody = await page.locator("body").innerText();
  report.gpsCaptured = /Live coordinates|18\.52/i.test(gpsBody);

  await visit("/citizen/feed", "Share");
  const shareBtn = page.locator("button").filter({ hasText: /^\s*\d+\s*$/ }).first();
  report.feedLoaded = /Community|post|Share/i.test(await page.locator("body").innerText());

  await visit("/citizen/jobs", "job");
  report.appliedJobsVisible = /QA Field Electrician|Applied|applications/i.test(await page.locator("body").innerText());

  await visit("/citizen/saved", "saved");
  await visit("/forgot-password", "Forgot password");
  await page.getByPlaceholder("Email").fill("qa.citizen.scc@example.com");
  await page.getByRole("button", { name: /Send reset/i }).click();
  await page.waitForTimeout(1500);
  report.forgotUi = /reset link has been sent|If that email/i.test(await page.locator("body").innerText());

  await page.goto("http://localhost:5173/login");
  await page.waitForTimeout(500);
  const already = await page.locator("body").innerText();
  if (/already logged in/i.test(already)) {
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForTimeout(800);
  }
  await page.goto("http://localhost:5173/login");
  await page.getByPlaceholder("Email").fill("qa.admin.scc@example.com");
  await page.getByPlaceholder(/Password/).fill("QaScc2026!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/admin/, { timeout: 15000 }).catch(() => {});
  report.adminUrl = page.url();
  const adminBody = await page.locator("body").innerText();
  report.adminStatsNumeric = /\d+/.test(adminBody) && /Total complaints|City operations/i.test(adminBody);

  await visit("/admin/complaints", "Complaint");
  report.adminSeesQaComplaint = /SCC-2026-00005|QA street light/i.test(await page.locator("body").innerText());
  await visit("/admin/jobs", "Candidate");
  report.adminJobs = /QA Field Electrician|Candidate management/i.test(await page.locator("body").innerText());

  await page.goto("http://localhost:5173/login");
  await page.waitForTimeout(400);
  if (/already logged in/i.test(await page.locator("body").innerText())) {
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForTimeout(700);
  }
  await page.goto("http://localhost:5173/login");
  await page.getByPlaceholder("Email").fill("qa.officer.scc@example.com");
  await page.getByPlaceholder(/Password/).fill("QaScc2026!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/officer/, { timeout: 15000 }).catch(() => {});
  await visit("/officer/complaints", "Assigned");
  report.officerQueue = /QA street light|SCC-2026-00005/i.test(await page.locator("body").innerText());

  await page.goto("http://localhost:5173/login");
  await page.waitForTimeout(400);
  if (/already logged in/i.test(await page.locator("body").innerText())) {
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForTimeout(700);
  }
  await page.goto("http://localhost:5173/login");
  await page.getByPlaceholder("Email").fill("qa.staff.scc@example.com");
  await page.getByPlaceholder(/Password/).fill("QaScc2026!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/staff/, { timeout: 15000 }).catch(() => {});
  await visit("/staff/tasks", "Assigned tasks");
  const staffTasks = await page.locator("body").innerText();
  report.staffTasksPage = !/Minified React error|Unexpected token/i.test(staffTasks);
  report.staffSeesTask = /SCC-2026-00005|QA street light|No tasks/i.test(staffTasks);
  await visit("/staff/earnings", "Earnings");
  report.staffEarnings = /₹1800|Pending|Earnings/i.test(await page.locator("body").innerText());
  await visit("/staff/tracking", "Live Location");
  report.staffTracking = /Start Sharing|Get Current Location/i.test(await page.locator("body").innerText());

  await visit("/admin/dashboard", "Login");
  report.staffBlockedFromAdmin = /login|do not have permission|not needed/i.test((await page.locator("body").innerText()).toLowerCase()) || !page.url().includes("/admin/dashboard");

  report.apiFailures = report.failedRequests.filter((item) => !item.url.includes("nominatim"));
  report.uniqueConsole = [...new Set(report.consoleErrors.map((e) => e.text))].slice(0, 12);
  return report;
}
