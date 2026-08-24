const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true, index: true },
  password: { type: String, select: false },
  passwordReset: {
    tokenHash: String,
    expiresAt: Date,
  },
  role: {
    type: String,
    enum: ["Citizen", "Staff", "Officer", "Head Officer", "Admin", "Super Admin"],
    default: "Citizen",
    index: true,
  },
  profileImage: String,
  phone: String,
  department: { type: String, default: "", index: true },
  skills: { type: [String], default: [] },
  headline: { type: String, trim: true, maxlength: 160, default: "" },
  bio: { type: String, trim: true, maxlength: 2000, default: "" },
  city: { type: String, trim: true, default: "" },
  experienceYears: { type: Number, min: 0, max: 60, default: 0 },
  experience: [{
    title: String,
    organization: String,
    years: String,
    summary: String,
  }],
  education: [{ school: String, degree: String, year: String }],
  certifications: [{ name: String, issuer: String, year: String }],
  achievements: { type: [String], default: [] },
  organization: { type: String, trim: true, default: "" },
  projects: [{ title: String, summary: String, year: String }],
  availability: { type: String, enum: ["Available", "Busy", "Off Duty"], default: "Available", index: true },
  resumeUrl: { type: String, default: "", select: false },
  resumePublicId: { type: String, default: "", select: false },
  resumeFileName: { type: String, default: "" },
  resumeFileType: { type: String, default: "" },
  resumeUploadedAt: Date,
  savedPosts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], default: [] },
  paymentProfile: {
    type: {
      accountNumberEnc: String,
      accountHolderEnc: String,
      ifscEnc: String,
      bankNameEnc: String,
      phoneEnc: String,
      last4: String,
      ifscPrefix: String,
      bankNameDisplay: String,
      holderMasked: String,
      verified: { type: Boolean, default: false },
      verifiedBy: String,
      verifiedAt: Date,
      updatedAt: Date,
    },
    select: false,
  },
  locationSharing: { type: Boolean, default: false },
  lastLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date,
  },
  active: { type: Boolean, default: true },
  refreshTokens: {
    type: [
      {
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
    select: false,
  },
}, { timestamps: true });

userSchema.index({ department: 1, city: 1 });
userSchema.index({ skills: 1 });

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
