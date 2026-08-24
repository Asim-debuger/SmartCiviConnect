const cloudinary = require("../config/cloudinary");

const RESUME_TTL_SECONDS = 90;
const RESUME_TYPES = new Set(["pdf", "doc", "docx"]);

const MIME = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function resumeFolder(userId) {
  return `smartciviconnect/resumes/${String(userId)}`;
}

function resumeTypeFromFile(fileName, mimeType) {
  const name = String(fileName || "").toLowerCase();
  if (name.endsWith(".docx") || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (name.endsWith(".doc") || mimeType === "application/msword") return "doc";
  if (name.endsWith(".pdf") || mimeType === "application/pdf") return "pdf";
  return "";
}

function isAllowedResumeType(fileType) {
  return RESUME_TYPES.has(String(fileType || "").toLowerCase());
}

function ownsResumePublicId(publicId, userId) {
  if (!publicId || !userId) return false;
  return String(publicId).startsWith(`${resumeFolder(userId)}/`);
}

function mimeForResume(fileName, fileType) {
  const format = resumeTypeFromFile(fileName, fileType) || String(fileType || "").toLowerCase();
  return MIME[format] || "application/octet-stream";
}

function safeFileName(fileName) {
  return String(fileName || "resume.pdf").replace(/[^\w.\-]+/g, "_");
}

function publicIdWithoutFormat(publicId, format) {
  let id = String(publicId || "");
  if (format && id.toLowerCase().endsWith(`.${format}`)) {
    id = id.slice(0, -(format.length + 1));
  }
  return id;
}

function cloudinaryMessage(error) {
  const raw = error?.error?.message || error?.message || String(error || "");
  if (/untrusted|show_original/i.test(raw)) {
    return "Cloudinary cannot show original PDFs on this account. SmartciviConnect streams the file through the server instead. Re-upload the resume as PDF, DOC, or DOCX if the file still fails.";
  }
  return raw || "Unable to access the stored document.";
}

function stripResumeSecrets(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const copy = { ...payload };
  delete copy.resumeUrl;
  delete copy.resumePublicId;
  if (copy.snapshot && typeof copy.snapshot === "object") {
    copy.snapshot = { ...copy.snapshot };
    delete copy.snapshot.resumeUrl;
    delete copy.snapshot.resumePublicId;
  }
  copy.hasResume = Boolean(
    payload.resumePublicId
    || payload.hasResume
    || payload.resumeFileName
    || copy.snapshot?.resumeFileName,
  );
  copy.resumeFileName = payload.resumeFileName || copy.snapshot?.resumeFileName || "";
  copy.resumeFileType = payload.resumeFileType || copy.snapshot?.resumeFileType || "";
  copy.resumeUploadedAt = payload.resumeUploadedAt || copy.snapshot?.resumeUploadedAt || null;
  return copy;
}

async function inspectResumeAsset(publicId) {
  const ids = [...new Set([
    publicId,
    publicIdWithoutFormat(publicId, "pdf"),
    publicIdWithoutFormat(publicId, "doc"),
    publicIdWithoutFormat(publicId, "docx"),
  ])].filter(Boolean);
  const attempts = [
    { resource_type: "raw", type: "authenticated" },
    { resource_type: "raw", type: "private" },
    { resource_type: "raw", type: "upload" },
    { resource_type: "image", type: "upload" },
    { resource_type: "image", type: "authenticated" },
  ];
  for (const id of ids) {
    for (const options of attempts) {
      try {
        const resource = await cloudinary.api.resource(id, options);
        return { resource, publicId: resource.public_id || id, ...options };
      } catch {
        // try next delivery type / resource type
      }
    }
  }
  return null;
}

async function downloadViaApi(publicId, format, resourceType, type) {
  const expiresAt = Math.floor(Date.now() / 1000) + RESUME_TTL_SECONDS;
  const ids = [...new Set([publicId, publicIdWithoutFormat(publicId, format)])].filter(Boolean);
  const formats = [...new Set([format, "pdf", "docx", "doc"])].filter(Boolean);
  let lastBody = "";
  for (const id of ids) {
    for (const fmt of formats) {
      for (const attachment of [true, false]) {
        const url = cloudinary.utils.private_download_url(id, fmt, {
          resource_type: resourceType || "raw",
          type: type || "authenticated",
          expires_at: expiresAt,
          attachment,
        });
        const response = await fetch(url);
        if (response.ok) return Buffer.from(await response.arrayBuffer());
        lastBody = await response.text();
      }
    }
  }
  const error = new Error(cloudinaryMessage({ message: lastBody }));
  error.status = 502;
  error.cloudinaryBody = lastBody.slice(0, 400);
  throw error;
}

async function fetchResumeBuffer({ publicId, fileName, fileType }) {
  if (!publicId) {
    const error = new Error("No document is stored for this record.");
    error.status = 404;
    throw error;
  }
  const format = resumeTypeFromFile(fileName, fileType) || "pdf";

  try {
    const buffer = await downloadViaApi(publicId, format, "raw", "authenticated");
    return {
      buffer,
      contentType: mimeForResume(fileName, format),
      fileName: safeFileName(fileName || `resume.${format}`),
      needsReupload: false,
      resourceType: "raw",
      type: "authenticated",
    };
  } catch (directError) {
    const inspected = await inspectResumeAsset(publicId);
    const resourceType = inspected?.resource_type || "raw";
    const type = inspected?.type || "authenticated";
    const resolvedFormat = inspected?.resource?.format || format;
    const resolvedId = inspected?.publicId || inspected?.resource?.public_id || publicId;
    const needsReupload = resourceType === "image" || (type === "upload" && resourceType !== "raw");
    try {
      const buffer = await downloadViaApi(resolvedId, resolvedFormat, resourceType, type);
      return {
        buffer,
        contentType: mimeForResume(fileName, resolvedFormat),
        fileName: safeFileName(fileName || `resume.${resolvedFormat}`),
        needsReupload,
        resourceType,
        type,
      };
    } catch (error) {
      if (needsReupload) {
        error.message = "This file was uploaded as a public image instead of a private document. Please re-upload a PDF, DOC, or DOCX resume.";
        error.status = 409;
      } else if (!error.message || error.message === directError.message) {
        error.message = cloudinaryMessage(error);
      }
      throw error;
    }
  }
}

function sendResumeBuffer(res, file, { download = false } = {}) {
  res.setHeader("Content-Type", file.contentType);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader(
    "Content-Disposition",
    `${download ? "attachment" : "inline"}; filename="${file.fileName}"`,
  );
  if (file.needsReupload) res.setHeader("X-Resume-Reupload", "1");
  return res.status(200).send(file.buffer);
}

function resumeMeta(fileName, fileType, extra = {}) {
  return {
    success: true,
    delivery: "proxy",
    fileName: fileName || "",
    fileType: fileType || resumeTypeFromFile(fileName, fileType),
    expiresIn: RESUME_TTL_SECONDS,
    ...extra,
  };
}

function canReviewJobApplications(user, job) {
  const { canReviewJobApplications: review } = require("./applicationAccess");
  return review(user, job);
}

module.exports = {
  RESUME_TTL_SECONDS,
  resumeFolder,
  resumeTypeFromFile,
  isAllowedResumeType,
  ownsResumePublicId,
  stripResumeSecrets,
  mimeForResume,
  cloudinaryMessage,
  inspectResumeAsset,
  fetchResumeBuffer,
  sendResumeBuffer,
  resumeMeta,
  canReviewJobApplications,
};
