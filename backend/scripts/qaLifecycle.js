const API = "http://localhost:5000/api";
const PASSWORD = "QaScc2026!";
const results = [];

async function req(method, path, { token, body, raw } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 400) }; }
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
  const stamp = Date.now();
  const registerEmail = `qa.reg.${stamp}@example.com`;

  const reg = await req("POST", "/auth/register", {
    body: { name: "QA Register Citizen", email: registerEmail, password: PASSWORD },
  });
  log("citizen register", reg.status === 201 && reg.data.user?.role === "Citizen", { detail: `${reg.status} ${reg.data.message || registerEmail}` });

  const forgot = await req("POST", "/auth/forgot-password", { body: { email: "qa.citizen.scc@example.com" } });
  log("forgot password", forgot.status === 200 && /reset|sent|registered/i.test(String(forgot.data.message || "")), { detail: `${forgot.status} ${forgot.data.message}` });

  const guestApply = await req("POST", "/jobs/aaaaaaaaaaaaaaaaaaaaaaaa/apply", { body: { coverLetter: "x" } });
  log("guest apply requires login", guestApply.status === 401, { detail: String(guestApply.status) });

  const contact = await req("POST", "/public/contact", {
    body: { name: "QA Visitor", email: "qa.visitor.scc@example.com", message: "Please confirm the civic contact desk is connected for QA." },
  });
  log("public contact", contact.status === 200, { detail: `${contact.status} ${contact.data.message}` });

  const citizen = await login("qa.citizen.scc@example.com");
  const admin = await login("qa.admin.scc@example.com");
  const officer = await login("qa.officer.scc@example.com");
  const staff = await login("qa.staff.scc@example.com");
  log("login citizen/admin/officer/staff", true, { detail: [citizen.user.id, admin.user.id, officer.user.id, staff.user.id].join(",") });

  const unauthDash = await req("GET", "/operations/admin/stats");
  log("unauthorized admin stats", unauthDash.status === 401, { detail: String(unauthDash.status) });
  const citizenAsAdmin = await req("GET", "/operations/admin/stats", { token: citizen.token });
  log("citizen blocked from admin stats", citizenAsAdmin.status === 403, { detail: String(citizenAsAdmin.status) });

  const created = await req("POST", "/complaints", {
    token: citizen.token,
    body: {
      title: "QA street light out near park",
      description: "The street light has been dark for several nights and pedestrians cannot see the crossing.",
      category: "Electricity Problems",
      priority: "High",
      location: { latitude: 18.5204, longitude: 73.8567, address: "QA GPS Pune" },
      media: [],
    },
  });
  const complaint = created.data.complaint;
  log("create GPS complaint", created.status === 201 && Boolean(complaint?.complaintId), { detail: `${created.status} ${complaint?.complaintId || created.data.message}` });
  if (!complaint) throw new Error("complaint create failed");

  const adminNotes = await req("GET", "/notifications", { token: admin.token });
  const gotNew = (adminNotes.data.notifications || []).some((n) => String(n.message || "").includes(complaint.complaintId) || String(n.title || "").toLowerCase().includes("complaint"));
  log("admin notification for new complaint", adminNotes.status === 200 && gotNew, { detail: `count=${(adminNotes.data.notifications || []).length}` });

  const stats = await req("GET", "/operations/admin/stats", { token: admin.token });
  log("admin dashboard stats from db", stats.status === 200 && typeof stats.data.stats?.total === "number", { detail: JSON.stringify(stats.data.stats) });

  const adminList = await req("GET", "/operations/admin/complaints", { token: admin.token });
  const listed = (adminList.data.complaints || []).some((c) => c.complaintId === complaint.complaintId);
  log("admin receives new complaint in list", listed, { detail: `total=${(adminList.data.complaints || []).length}` });

  const assigned = await req("PATCH", `/operations/admin/complaints/${complaint.complaintId}/assign`, {
    token: admin.token,
    body: { officerId: officer.user.id, note: "QA assign officer" },
  });
  log("admin assign officer", assigned.status === 200 && assigned.data.complaint?.assignedOfficerId === officer.user.id, { detail: `${assigned.status} ${assigned.data.message || assigned.data.complaint?.status}` });

  const officerNotes = await req("GET", "/notifications", { token: officer.token });
  const officerGot = (officerNotes.data.notifications || []).some((n) => String(n.message || "").includes(complaint.complaintId));
  log("officer assignment notification", officerGot, { detail: `count=${(officerNotes.data.notifications || []).length}` });

  const officerQueue = await req("GET", "/operations/assigned", { token: officer.token });
  log("officer assigned queue", (officerQueue.data.complaints || []).some((c) => c.complaintId === complaint.complaintId));

  const acceptOff = await req("POST", `/operations/officer/complaints/${complaint.complaintId}/accept`, { token: officer.token });
  log("officer accept complaint", acceptOff.status === 200, { detail: String(acceptOff.status) });

  const staffAssign = await req("PATCH", `/operations/officer/complaints/${complaint.complaintId}/staff`, {
    token: officer.token,
    body: { staffId: staff.user.id, note: "QA assign staff" },
  });
  log("officer assign staff", staffAssign.status === 200 && staffAssign.data.complaint?.assignedStaffId === staff.user.id, { detail: `${staffAssign.status} ${staffAssign.data.message || ""}` });

  const staffNotes = await req("GET", "/notifications", { token: staff.token });
  log("staff task notification", (staffNotes.data.notifications || []).some((n) => /task|assigned/i.test(`${n.title} ${n.message}`)), { detail: `count=${(staffNotes.data.notifications || []).length}` });

  const acceptStaff = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: { status: "ACCEPTED" },
  });
  log("staff accept task", acceptStaff.status === 200 && acceptStaff.data.complaint?.operationalStatus === "ACCEPTED", { detail: `${acceptStaff.status} ${acceptStaff.data.complaint?.operationalStatus}` });

  const start = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: { status: "IN_PROGRESS", progress: 20 },
  });
  log("staff start work", start.status === 200 && start.data.complaint?.status === "In Progress", { detail: start.data.complaint?.status });

  const officerStatus = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: officer.token,
    body: { status: "IN_PROGRESS", progress: 55 },
  });
  log("officer update status/progress", officerStatus.status === 200, { detail: `${officerStatus.data.complaint?.progress}` });

  const loc = await req("POST", "/operations/location", {
    token: staff.token,
    body: { latitude: 18.531, longitude: 73.845, sharing: true, complaintId: complaint.complaintId },
  });
  log("staff share GPS", loc.status === 200 && loc.data.locationSharing === true, { detail: `${loc.status} ${JSON.stringify(loc.data.lastLocation || loc.data.message)}` });

  const live = await req("GET", `/operations/locations?complaintId=${complaint.complaintId}`, { token: officer.token });
  log("officer sees live location", live.status === 200 && (live.data.locations || []).length > 0, { detail: `n=${(live.data.locations || []).length}` });

  const proof = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: {
      status: "IN_PROGRESS",
      workEvidence: [{ url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", resourceType: "image", phase: "after", name: "qa-gallery.jpg" }],
    },
  });
  log("staff can store a draft proof item", proof.status === 200 && (proof.data.complaint?.workEvidence || []).length > 0, { detail: `${proof.status}` });

  const galleryComplete = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: { status: "COMPLETED", progress: 100 },
  });
  log("gallery proof cannot complete task", galleryComplete.status === 400, { detail: `${galleryComplete.status} ${galleryComplete.data.message || ""}` });

  function cameraProof(name) {
    return {
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      resourceType: "image",
      phase: "after",
      name,
      source: "camera",
      capturedAt: new Date().toISOString(),
      latitude: 18.5312,
      longitude: 73.8448,
      staffId: staff.user.id,
      complaintId: complaint.complaintId,
    };
  }

  const cameraUpload = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: { status: "IN_PROGRESS", workEvidence: [cameraProof("qa-camera-1.jpg")] },
  });
  log("staff upload camera+GPS proof", cameraUpload.status === 200, { detail: `${cameraUpload.status}` });

  const complete = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: { status: "COMPLETED", progress: 100, workEvidence: [cameraProof("qa-camera-1.jpg")] },
  });
  log("staff submit for verification", complete.status === 200 && complete.data.complaint?.status === "Under Verification", { detail: complete.data.complaint?.status || complete.data.message });

  const hidden = await req("GET", `/complaints/${complaint.complaintId}`, { token: citizen.token });
  log("citizen cannot see unapproved evidence", hidden.status === 200 && (hidden.data.complaint?.workEvidence || []).length === 0, { detail: `n=${(hidden.data.complaint?.workEvidence || []).length}` });

  const earlyRating = await req("PUT", `/complaints/${complaint.complaintId}`, {
    token: citizen.token,
    body: { rating: 5, feedback: "too early" },
  });
  log("rating blocked before verified completion", earlyRating.status === 409, { detail: String(earlyRating.status) });

  const citizenVerify = await req("POST", `/operations/tasks/${complaint.complaintId}/verify`, { token: citizen.token });
  log("citizen cannot verify work", citizenVerify.status === 403, { detail: String(citizenVerify.status) });

  const reject = await req("POST", `/operations/tasks/${complaint.complaintId}/reject-evidence`, {
    token: officer.token,
    body: { reason: "GPS photo does not match the reported site. Recapture." },
  });
  log("officer reject requires resubmit", reject.status === 200 && reject.data.complaint?.status === "In Progress", { detail: reject.data.complaint?.status || reject.data.message });

  const resubmit = await req("PATCH", `/operations/tasks/${complaint.complaintId}`, {
    token: staff.token,
    body: { status: "COMPLETED", progress: 100, workEvidence: [cameraProof("qa-camera-2.jpg")] },
  });
  log("staff resubmit after rejection", resubmit.status === 200 && resubmit.data.complaint?.status === "Under Verification", { detail: resubmit.data.complaint?.status || resubmit.data.message });

  const verify = await req("POST", `/operations/tasks/${complaint.complaintId}/verify`, { token: officer.token });
  log("officer verify proof", verify.status === 200 && verify.data.complaint?.status === "Completed", { detail: `${verify.status} ${verify.data.complaint?.status || verify.data.message}` });

  const details = await req("GET", `/complaints/${complaint.complaintId}`, { token: citizen.token });
  const hist = details.data.complaint?.history || [];
  log("citizen complaint details + timeline", details.status === 200 && hist.length >= 3, { detail: hist.map((h) => h.status).join(">") });
  log("completion proof visible to citizen", (details.data.complaint?.workEvidence || []).length > 0);

  const refresh = await req("GET", `/complaints/${complaint.complaintId}`, { token: citizen.token });
  log("direct complaint refetch persists", refresh.status === 200 && refresh.data.complaint?.status === "Completed");

  const feedback = await req("PUT", `/complaints/${complaint.complaintId}`, {
    token: citizen.token,
    body: { rating: 5, ratingQuality: 5, ratingSatisfaction: 4, ratingBehaviour: 5, feedback: "QA: work completed as expected." },
  });
  log("citizen feedback after verified completion", feedback.status === 200 && feedback.data.complaint?.rating >= 4, { detail: `${feedback.status}` });

  const citizenPay = await req("GET", "/payments", { token: citizen.token });
  log("citizen cannot access payment APIs", citizenPay.status === 403, { detail: String(citizenPay.status) });

  const earnings = await req("GET", "/payments", { token: staff.token });
  const pay = (earnings.data.payments || []).find((p) => p.complaintId === complaint.complaintId);
  log("staff earnings record", earnings.status === 200 && Boolean(pay), { detail: pay ? `${pay.status} ₹${pay.amount}` : earnings.data.message });

  if (pay?._id) {
    const invoice = await req("GET", `/payments/${pay._id}/invoice`, { token: staff.token });
    log("staff invoice available", invoice.status === 200 && Boolean(invoice.data.html || invoice.data.invoice), { detail: String(invoice.status) });
    const approve = await req("POST", `/payments/${pay._id}/approve`, { token: admin.token });
    log("admin approve payment", approve.status === 200 && approve.data.payment?.status === "Approved", { detail: `${approve.status} ${approve.data.payment?.status || approve.data.message}` });
    const order = await req("POST", `/payments/${pay._id}/order`, { token: admin.token });
    const orderId = order.data.order?.id;
    log("admin generate Razorpay TEST order", order.status === 200 && Boolean(orderId), { detail: `${order.status} ${orderId || order.data.message}` });
    if (order.status === 200) {
      const initiated = await req("POST", `/payments/${pay._id}/initiate`, { token: admin.token });
      log("admin initiate checkout", initiated.status === 200 && initiated.data.payment?.status === "Initiated", { detail: initiated.data.payment?.status || initiated.data.message });
    }
  }

  const job = await req("POST", "/jobs", {
    token: admin.token,
    body: {
      title: "QA Field Electrician",
      description: "Maintain civic electrical assets across Pune wards. Night shifts as needed.",
      department: "Electricity",
      organization: "Pune Electricity QA Desk",
      location: "Pune",
      workplace: "On-site",
      type: "Full time",
      salaryMin: 25000,
      salaryMax: 40000,
      skillsRequired: ["Wiring", "Safety"],
      experience: "2+ years",
      education: "ITI / Diploma",
      requiredDocuments: ["Resume", "ID proof"],
      status: "Open",
    },
  });
  log("admin create job", job.status === 201 && job.data.job?._id, { detail: `${job.status} ${job.data.job?.title || job.data.message}` });
  const jobId = job.data.job?._id;

  const pubJob = await req("GET", `/public/jobs/${jobId}`);
  log("public user can view job", pubJob.status === 200 && pubJob.data.job?.title === "QA Field Electrician");

  const sig = await req("GET", "/uploads/resume-signature", { token: citizen.token });
  log("resume signature", sig.status === 200 && Boolean(sig.data.signature), { detail: String(sig.status) });

  if (sig.status === 200 && sig.data.cloudName) {
    const pdf = Buffer.from("%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n", "utf8");
    const form = new FormData();
    form.append("file", new Blob([pdf], { type: "application/pdf" }), "qa-resume.pdf");
    form.append("api_key", sig.data.apiKey);
    form.append("timestamp", String(sig.data.timestamp));
    form.append("folder", sig.data.folder);
    form.append("signature", sig.data.signature);
    form.append("type", sig.data.type);
    form.append("allowed_formats", sig.data.allowedFormats);
    const upload = await fetch(`https://api.cloudinary.com/v1_1/${sig.data.cloudName}/raw/upload`, { method: "POST", body: form });
    const uploaded = await upload.json();
    log("cloudinary resume upload", upload.ok && Boolean(uploaded.public_id), { detail: uploaded.public_id || uploaded.error?.message || upload.status });
    if (uploaded.public_id) {
      const patched = await req("PATCH", "/users/me", {
        token: citizen.token,
        body: {
          resumePublicId: uploaded.public_id,
          resumeFileName: "qa-resume.pdf",
          resumeFileType: "pdf",
          resumeUploadedAt: new Date().toISOString(),
        },
      });
      log("save resume on profile", patched.status === 200 && patched.data.user?.hasResume, { detail: `${patched.status} ${patched.data.message || ""}` });
    }
  }

  const apply = await req("POST", `/jobs/${jobId}/apply`, {
    token: citizen.token,
    body: { coverLetter: "I am applying through the QA lifecycle.", skills: ["Wiring"] },
  });
  log("logged user apply", apply.status === 201 || apply.status === 409, { detail: `${apply.status} ${apply.data.message || apply.data.application?._id}` });

  const mine = await req("GET", "/jobs/applications/mine", { token: citizen.token });
  log("citizen sees applied jobs", (mine.data.applications || []).some((a) => String(a.jobId?._id || a.jobId) === String(jobId)), { detail: `n=${(mine.data.applications || []).length}` });

  const apps = await req("GET", `/jobs/${jobId}/applications`, { token: admin.token });
  const application = (apps.data.applications || [])[0];
  log("admin view applicants", apps.status === 200 && Boolean(application), { detail: application?.status });

  if (application?._id) {
    const materials = await req("PATCH", `/jobs/applications/${application._id}/materials`, {
      token: citizen.token,
      body: { coverLetter: "Updated before review" },
    });
    log("applicant can update before review", materials.status === 200, { detail: String(materials.status) });

    const resumeMeta = await req("GET", `/jobs/applications/${application._id}/resume`, { token: admin.token });
    log("admin resume metadata (no public url)", resumeMeta.status === 200 && resumeMeta.data.delivery === "proxy" && !resumeMeta.data.url, { detail: `${resumeMeta.status} ${resumeMeta.data.delivery || resumeMeta.data.message}` });
    const resumeFile = await fetch(`${API}/jobs/applications/${application._id}/resume?file=1`, { headers: { Authorization: `Bearer ${admin.token}` } });
    const resumeBytes = Buffer.from(await resumeFile.arrayBuffer());
    log("admin resume streamed through API", resumeFile.status === 200 && resumeBytes.length > 20 && /pdf|octet|msword|officedocument/i.test(resumeFile.headers.get("content-type") || ""), { detail: `${resumeFile.status} ${resumeFile.headers.get("content-type")} ${resumeBytes.length}b` });
    const ownResume = await req("GET", `/jobs/applications/${application._id}/resume`, { token: citizen.token });
    log("applicant resume metadata", ownResume.status === 200 && ownResume.data.delivery === "proxy", { detail: String(ownResume.status) });
    const ownFile = await fetch(`${API}/jobs/applications/${application._id}/resume?file=1`, { headers: { Authorization: `Bearer ${citizen.token}` } });
    log("applicant can stream own submitted resume", ownFile.status === 200, { detail: String(ownFile.status) });
    const profileFile = await fetch(`${API}/users/me/resume?file=1`, { headers: { Authorization: `Bearer ${citizen.token}` } });
    log("applicant profile resume stream", profileFile.status === 200 || profileFile.status === 404, { detail: String(profileFile.status) });
    const officerResume = await req("GET", `/jobs/applications/${application._id}/resume`, { token: officer.token });
    log("other user cannot download applicant resume", officerResume.status === 403, { detail: String(officerResume.status) });
    const guestResume = await req("GET", `/jobs/applications/${application._id}/resume`);
    log("public cannot access resume", guestResume.status === 401, { detail: String(guestResume.status) });

    const viewed = await req("GET", `/jobs/applications/${application._id}`, { token: admin.token });
    log("admin open application locks snapshot", viewed.status === 200 && Boolean(viewed.data.application?.locked), { detail: viewed.data.application?.status });
    const lockedUpdate = await req("PATCH", `/jobs/applications/${application._id}/materials`, {
      token: citizen.token,
      body: { coverLetter: "Should fail" },
    });
    log("applicant cannot update after review", lockedUpdate.status === 403, { detail: String(lockedUpdate.status) });

    const pipeline = ["Viewed", "Shortlisted", "Interview Scheduled", "Selected", "Joined", "Rejected"];
    let last = null;
    for (const status of pipeline) {
      last = await req("PATCH", `/jobs/applications/${application._id}`, {
        token: admin.token,
        body: status === "Interview Scheduled" ? { status, interviewAt: new Date(Date.now() + 86400000).toISOString() } : { status },
      });
      if (last.status !== 200) break;
    }
    log("admin pipeline statuses", last?.status === 200 && last.data.application?.status === "Rejected", { detail: `${last?.status} ${last?.data.application?.status || last?.data.message}` });
  }

  const post = await req("POST", "/feed", {
    token: citizen.token,
    body: { body: `QA public post ${stamp} about civic electrical safety.`, kind: "Community Update" },
  });
  log("create post", post.status === 201 && post.data.post?._id, { detail: `${post.status} ${post.data.message || ""}` });
  const postId = post.data.post?._id;

  if (postId) {
    const pubPost = await req("GET", `/public/posts/${postId}`);
    log("public user can view post", pubPost.status === 200);
    const like = await req("POST", `/feed/${postId}/like`, { token: admin.token });
    log("like post", like.status === 200 && like.data.liked === true);
    const comment = await req("POST", `/feed/${postId}/comment`, { token: admin.token, body: { body: "QA comment" } });
    const commentId = comment.data.post?.comments?.[0]?._id;
    log("comment post", comment.status === 200 && Boolean(commentId));
    const reply = await req("POST", `/feed/${postId}/comment`, { token: citizen.token, body: { body: "QA reply", commentId } });
    log("reply to comment", reply.status === 200 && (reply.data.post?.comments?.[0]?.replies || []).length > 0);
    const save = await req("POST", `/feed/${postId}/save`, { token: citizen.token });
    log("save post", save.status === 200 && save.data.saved === true);
    const saved = await req("GET", "/feed/saved", { token: citizen.token });
    log("saved posts page api", (saved.data.posts || []).some((p) => String(p._id) === String(postId)));
    const share = await req("POST", `/feed/${postId}/share`, { token: officer.token, body: { body: "QA repost to officer profile" } });
    log("repost/share to profile", share.status === 200 && Boolean(share.data.post?.sharedFrom), { detail: share.data.post?.sharedFrom ? "sharedFrom set" : share.data.message });
  }

  const people = await req("GET", "/public/professionals");
  const profileId = people.data.people?.[0]?._id || citizen.user.id;
  const pubProf = await req("GET", `/public/professionals/${profileId}`);
  log("public professionals + profile", people.status === 200 && pubProf.status === 200, { detail: `people=${(people.data.people || []).length}` });
  log("public profile has no resume secret", pubProf.status === 200 && !pubProf.data.profile?.resumePublicId && !pubProf.data.profile?.resumeUrl && !pubProf.data.profile?.email);

  const ownProf = await req("GET", `/network/profile/${citizen.user.id}`, { token: citizen.token });
  log("own professional profile loads", ownProf.status === 200 && Boolean(ownProf.data.profile?.name) && !ownProf.data.profile?.resumePublicId, { detail: `${ownProf.status} ${ownProf.data.profile?.name || ownProf.data.message}` });
  const visitorProf = await req("GET", `/network/profile/${citizen.user.id}`, { token: officer.token });
  log("visitor profile hides email and resume id", visitorProf.status === 200 && !visitorProf.data.profile?.email && !visitorProf.data.profile?.resumePublicId, { detail: String(visitorProf.status) });

  const selfFollow = await req("POST", "/network/follow", { token: citizen.token, body: { userId: citizen.user.id } });
  log("cannot self-follow", selfFollow.status === 400, { detail: String(selfFollow.status) });
  const follow = await req("POST", "/network/follow", { token: citizen.token, body: { userId: officer.user.id } });
  log("follow other user", follow.status === 200 && follow.data.following === true, { detail: `${follow.status} ${follow.data.following}` });

  const connect = await req("POST", "/network/connections", { token: citizen.token, body: { userId: officer.user.id } });
  log("connect request", connect.status === 201 || connect.status === 409, { detail: String(connect.status) });
  if (connect.status === 201 && connect.data.connection?._id) {
    const accept = await req("PATCH", `/network/connections/${connect.data.connection._id}`, { token: officer.token, body: { status: "Accepted" } });
    log("accept connection", accept.status === 200, { detail: String(accept.status) });
  }
  const inboxOpen = await req("POST", "/inbox", { token: citizen.token, body: { userId: officer.user.id } });
  log("open inbox after connect", inboxOpen.status === 200 || inboxOpen.status === 403, { detail: String(inboxOpen.status) });

  const directory = await req("GET", "/network/people", { token: citizen.token });
  log("network directory", directory.status === 200 && Array.isArray(directory.data.people), { detail: `n=${(directory.data.people || []).length}` });
  const pubFeed = await req("GET", "/public/posts");
  const pubJobs = await req("GET", "/public/jobs");
  log("public jobs/posts lists", pubFeed.status === 200 && pubJobs.status === 200);

  const failed = results.filter((r) => !r.ok);
  console.log(JSON.stringify({
    complaintId: complaint.complaintId,
    jobId,
    postId,
    registerEmail,
    passed: results.filter((r) => r.ok).length,
    failed: failed.length,
    failures: failed,
  }, null, 2));
  process.exit(failed.length ? 1 : 0);
}

main().catch((error) => {
  console.error("QA script crashed:", error);
  process.exit(1);
});
