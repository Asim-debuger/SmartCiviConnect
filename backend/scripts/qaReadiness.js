const API = "http://localhost:5000/api";
const PASSWORD = "QaScc2026!";
const results = [];

async function req(method, path, { token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 300) }; }
  return { status: res.status, data };
}

function log(name, ok, extra = {}) {
  results.push({ name, ok, ...extra });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra.detail ? ` — ${extra.detail}` : ""}`);
}

async function login(email) {
  const { status, data } = await req("POST", "/auth/login", { body: { email, password: PASSWORD } });
  if (status !== 200 || !data.accessToken) throw new Error(`login failed ${email} ${status} ${data.message}`);
  return { token: data.accessToken, user: data.user };
}

async function main() {
  const citizen = await login("qa.citizen.scc@example.com");
  const admin = await login("qa.admin.scc@example.com");
  const staff = await login("qa.staff.scc@example.com");
  const officer = await login("qa.officer.scc@example.com");

  log("citizen login", Boolean(citizen.token));
  log("forgot password still available", (await req("POST", "/auth/forgot-password", { body: { email: citizen.user.email } })).status === 200);

  const citizenPay = await req("GET", "/payments", { token: citizen.token });
  log("citizen blocked from payments", citizenPay.status === 403);

  const citizenBank = await req("GET", "/users/me/payment-profile", { token: citizen.token });
  log("citizen blocked from own bank profile", citizenBank.status === 403);

  const citizenAdminBank = await req("GET", `/users/${staff.user.id}/payment-profile`, { token: citizen.token });
  log("citizen blocked from staff bank profile", citizenAdminBank.status === 403);

  const staffOther = await req("GET", `/users/${admin.user.id}/payment-profile`, { token: staff.token });
  log("staff cannot read another user's bank profile", staffOther.status === 403);

  const save = await req("PATCH", "/users/me/payment-profile", {
    token: staff.token,
    body: {
      accountHolderName: "QA Staff",
      accountNumber: "123456789012",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank",
      phone: "9876543210",
    },
  });
  log("staff can save encrypted payout profile", save.status === 200 && save.data.profile?.last4 === "9012" && !JSON.stringify(save.data).includes("accountNumberEnc"), {
    detail: `${save.status} ${save.data.profile?.last4 || save.data.message}`,
  });

  const officerSave = await req("PATCH", "/users/me/payment-profile", {
    token: officer.token,
    body: {
      accountHolderName: "QA Officer",
      accountNumber: "998877665544",
      ifsc: "SBIN0004321",
      bankName: "State Bank of India",
      phone: "9123456789",
    },
  });
  log("officer can save payout profile", officerSave.status === 200, { detail: String(officerSave.status) });

  const adminView = await req("GET", `/users/${staff.user.id}/payment-profile`, { token: admin.token });
  log("admin can decrypt staff bank details", adminView.status === 200 && adminView.data.profile?.accountNumber === "123456789012", {
    detail: String(adminView.status),
  });

  const verify = await req("PATCH", `/users/${staff.user.id}/payment-profile`, { token: admin.token, body: { verified: true } });
  log("admin can verify staff bank details", verify.status === 200 && verify.data.profile?.verified === true);

  const staffPays = await req("GET", "/payments", { token: staff.token });
  const leaked = JSON.stringify(staffPays.data).includes("123456789012") || (staffPays.data.payments || []).some((p) => p.payout?.accountNumber);
  log("staff payment list has no full account numbers", staffPays.status === 200 && !leaked);

  const adminPays = await req("GET", "/payments", { token: admin.token });
  const summaryOnly = (adminPays.data.payments || []).every((p) => !p.payout || !p.payout.accountNumber);
  const hasMask = (adminPays.data.payments || []).some((p) => p.payout?.last4 === "9012");
  log("admin payment list uses masked payout summary", adminPays.status === 200 && summaryOnly && hasMask);

  const publicPeople = await req("GET", "/public/professionals");
  const publicPhone = JSON.stringify(publicPeople.data).toLowerCase().includes("phone") && (publicPeople.data.people || []).some((p) => p.phone);
  log("public professionals hide phone", publicPeople.status === 200 && !publicPhone);

  const publicJobs = await req("GET", "/public/jobs");
  log("public jobs list", publicJobs.status === 200 && Array.isArray(publicJobs.data.jobs));

  const guestApply = await req("POST", `/jobs/${(publicJobs.data.jobs || [])[0]?._id || "aaaaaaaaaaaaaaaaaaaaaaaa"}/apply`, { body: { coverLetter: "x" } });
  log("guest job apply requires login", guestApply.status === 401 || guestApply.status === 404);

  const feed = await req("GET", "/public/posts");
  log("public posts", feed.status === 200);

  const contact = await req("POST", "/public/contact", {
    body: { name: "Readiness QA", email: "qa.visitor.scc@example.com", message: "Production readiness contact desk check." },
  });
  log("public contact", contact.status === 200);

  const spoofAmount = await req("POST", "/payments", {
    token: admin.token,
    body: { payeeId: staff.user.id, amount: 9, complaintId: "SCC-2026-00005" },
  });
  log("duplicate/spoof create still blocked", spoofAmount.status === 409 || spoofAmount.status === 400);

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(JSON.stringify({ passed, failed }));
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
