const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  department: { type: String, required: true, index: true },
  description: { type: String, required: true, maxlength: 8000 },
  location: String,
  skillsRequired: { type: [String], default: [] },
  salaryMin: Number,
  salaryMax: Number,
  experience: String,
  education: { type: String, default: "" },
  certifications: { type: String, default: "" },
  deadline: Date,
  organization: { type: String, default: "" },
  workplace: { type: String, enum: ["On-site", "Remote", "Hybrid", "On-site"], default: "On-site" },
  type: { type: String, enum: ["Full time", "Part time", "Contract", "Emergency work", "Full-time", "Field", "Full time"], default: "Full time", index: true },
  requiredDocuments: { type: [String], default: [] },
  status: { type: String, enum: ["Open", "Closed", "Expired", "Draft", "Open", "Closed"], default: "Open", index: true },
  createdBy: String,
}, { timestamps: true });

jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ department: 1, status: 1, createdAt: -1 });
jobSchema.index({ workplace: 1, status: 1 });

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  applicantId: { type: String, required: true, index: true },
  name: String,
  email: String,
  resumeUrl: { type: String, select: false },
  resumePublicId: { type: String, select: false },
  resumeFileName: String,
  resumeFileType: String,
  resumeUploadedAt: Date,
  coverLetter: { type: String, maxlength: 4000 },
  skills: { type: [String], default: [] },
  experience: { type: mongoose.Schema.Types.Mixed },
  experienceYears: Number,
  education: { type: mongoose.Schema.Types.Mixed },
  certifications: { type: mongoose.Schema.Types.Mixed },
  documents: [{
    name: String,
    fileName: String,
    fileType: String,
    publicId: String,
    uploadedAt: Date,
  }],
  snapshot: { type: mongoose.Schema.Types.Mixed },
  completedWorks: { type: Number, default: 0 },
  interviewAt: Date,
  recruiterNote: { type: String, maxlength: 2000 },
  lockedAt: Date,
  reviewedAt: Date,
  reviewedBy: String,
  status: {
    type: String,
    enum: ["Applied", "Viewed", "Shortlisted", "Interview Scheduled", "Selected", "Rejected", "Joined", "Applied", "Viewed", "Shortlisted", "Interview", "Hired"],
    default: "Applied",
    index: true,
  },
}, { timestamps: true });

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = {
  Job: mongoose.models.Job || mongoose.model("Job", jobSchema),
  Application: mongoose.models.Application || mongoose.model("Application", applicationSchema),
};
