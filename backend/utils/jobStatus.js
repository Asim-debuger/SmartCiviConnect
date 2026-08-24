const OPEN_JOB_STATUS = "Open";
const JOB_STATUSES = ["Open", "Closed", "Expired", "Draft"];
const APPLICATION_STATUSES = ["Applied", "Viewed", "Shortlisted", "Interview Scheduled", "Selected", "Joined", "Rejected"];

const JOB_STATUS_ALIASES = {
  Open: "Open",
  open: "Open",
  OPEN: "Open",
  Closed: "Closed",
  closed: "Closed",
  CLOSED: "Closed",
  Expired: "Expired",
  Draft: "Draft",
};

const APPLICATION_STATUS_ALIASES = {
  Applied: "Applied",
  Viewed: "Viewed",
  Shortlisted: "Shortlisted",
  Interview: "Interview Scheduled",
  "Interview Scheduled": "Interview Scheduled",
  Selected: "Selected",
  Hired: "Joined",
  Joined: "Joined",
  Rejected: "Rejected",
};

function normalizeJobStatus(status) {
  return JOB_STATUS_ALIASES[status] || JOB_STATUSES.find((item) => item === status) || OPEN_JOB_STATUS;
}

function normalizeApplicationStatus(status) {
  return APPLICATION_STATUS_ALIASES[status] || APPLICATION_STATUSES.find((item) => item === status) || "Applied";
}

function isOpenJob(job) {
  if (!job) return false;
  if (normalizeJobStatus(job.status) !== OPEN_JOB_STATUS) return false;
  if (job.deadline && new Date(job.deadline) < new Date()) return false;
  return true;
}

async function expireOverdueJobs(Job) {
  try {
    const now = new Date();
    await Job.updateMany(
      { status: { $in: ["Open", OPEN_JOB_STATUS] }, deadline: { $lt: now } },
      { $set: { status: "Expired" } },
    );
  } catch (error) {
    console.error("expireOverdueJobs failed", error.message);
  }
}

function jobTypeFilter(type) {
  if (!type || type === "All") return undefined;
  if (type === "Full time" || type === "Full-time") return { $in: ["Full time", "Full-time"] };
  return type;
}

async function copyIfMissing(collection, from, to) {
  await collection.updateMany(
    { [from]: { $exists: true, $ne: null }, $or: [{ [to]: { $exists: false } }, { [to]: null }, { [to]: "" }] },
    [{ $set: { [to]: `$${from}` } }],
  );
}

async function migrateJobEnums(Job, Application) {
  await expireOverdueJobs(Job);

  await copyIfMissing(Job.collection, "createdBy", "createdBy");
  await copyIfMissing(Job.collection, "skillsRequired", "skillsRequired");

  const jobPairs = [
    ["Open", "Open"],
    ["Closed", "Closed"],
  ];
  for (const [from, to] of jobPairs) {
    if (from !== to) await Job.updateMany({ status: from }, { $set: { status: to } });
  }

  await copyIfMissing(Application.collection, "jobId", "jobId");
  await copyIfMissing(Application.collection, "applicantId", "applicantId");
  await copyIfMissing(Application.collection, "snapshot", "snapshot");
  await copyIfMissing(Application.collection, "completedWorks", "completedWorks");
  await copyIfMissing(Application.collection, "interviewAt", "interviewAt");
  await copyIfMissing(Application.collection, "coverLetter", "coverLetter");
  await copyIfMissing(Application.collection, "recruiterNote", "recruiterNote");

  const applicationPairs = [
    ["Interview", "Interview Scheduled"],
    ["Hired", "Joined"],
    ["Applied", "Applied"],
    ["Viewed", "Viewed"],
    ["Shortlisted", "Shortlisted"],
  ];
  for (const [from, to] of applicationPairs) {
    if (from !== to) await Application.updateMany({ status: from }, { $set: { status: to } });
  }
}

module.exports = {
  JOB_STATUSES,
  OPEN_JOB_STATUS,
  APPLICATION_STATUSES,
  normalizeJobStatus,
  normalizeApplicationStatus,
  isOpenJob,
  expireOverdueJobs,
  migrateJobEnums,
  jobTypeFilter,
};
