import axiosInstance from "./axiosInstance";

export async function uploadComplaintMedia(files, _unusedToken, onProgress, phase = "general") {
  if (!files.length) return [];

  const { data: signing } = await axiosInstance.get("/uploads/signature");
  const results = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signing.apiKey);
    formData.append("timestamp", signing.timestamp);
    formData.append("folder", signing.folder);
    formData.append("signature", signing.signature);

    const isDocument = file.type.includes("pdf") || file.type.includes("word") || file.type.includes("document") || /\.(pdf|doc|docx)$/i.test(file.name);
    const resourceType = file.type.startsWith("video/") ? "video" : isDocument ? "raw" : "image";
    const endpoint = `https://api.cloudinary.com/v1_1/${signing.cloudName}/auto/upload`;

    let response = await fetch(endpoint, { method: "POST", body: formData });
    if (!response.ok) {
      response = await fetch(endpoint, { method: "POST", body: formData });
    }
    if (!response.ok) throw new Error(`Upload failed for ${file.name}. Check file type and size, then retry.`);
    const uploaded = await response.json();
    onProgress?.(file.name);
    results.push({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type === "video" ? "video" : uploaded.resource_type === "raw" || isDocument ? "raw" : "image",
      phase,
      name: file.name,
    });
  }
  return results;
}

const RESUME_MAX_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

function resumeFileType(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".doc")) return "doc";
  if (name.endsWith(".pdf")) return "pdf";
  return "";
}

export async function uploadResume(file) {
  if (!file) throw new Error("Choose a resume file.");
  const name = file.name.toLowerCase();
  const allowedExt = RESUME_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!allowedExt || (file.type && !RESUME_TYPES.has(file.type) && file.type !== "")) {
    throw new Error("Resume must be a PDF, DOC, or DOCX file.");
  }
  if (file.size > RESUME_MAX_BYTES) throw new Error("Resume must be 5 MB or smaller.");

  const { data: signing } = await axiosInstance.get("/uploads/resume-signature");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signing.apiKey);
  formData.append("timestamp", signing.timestamp);
  formData.append("folder", signing.folder);
  formData.append("signature", signing.signature);
  if (signing.type) formData.append("type", signing.type);
  if (signing.allowedFormats) formData.append("allowed_formats", signing.allowedFormats);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signing.cloudName}/raw/upload`, {
    method: "POST",
    body: formData,
  });
  const uploaded = await response.json().catch(() => ({}));
  if (!response.ok || uploaded.error) {
    const detail = uploaded.error?.message || `Resume upload failed (${response.status}).`;
    if (/untrusted|show_original/i.test(detail)) {
      throw new Error("Cloudinary blocked original document delivery on this account. Upload a PDF, DOC, or DOCX as a raw document. If this continues, ask an administrator to request Cloudinary PDF delivery trust.");
    }
    throw new Error(detail);
  }
  if (!uploaded.public_id) throw new Error("Resume upload did not return a file id. Try a smaller PDF, DOC, or DOCX.");
  return {
    resumePublicId: uploaded.public_id,
    resumeFileName: file.name,
    resumeFileType: resumeFileType(file) || uploaded.format || "",
    resumeUploadedAt: new Date().toISOString(),
  };
}
