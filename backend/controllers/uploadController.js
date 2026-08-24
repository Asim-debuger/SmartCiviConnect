const cloudinary = require("../config/cloudinary");
const { resumeFolder } = require("../utils/resumeAccess");

exports.createUploadSignature = (req, res, next) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `smartciviconnect/complaints/${req.auth.userId}`;
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET);
    return res.json({
      success: true,
      timestamp,
      folder,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    return next(error);
  }
};

exports.createResumeSignature = (req, res, next) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = resumeFolder(req.auth.userId);
    const type = "authenticated";
    const allowedFormats = "pdf,doc,docx";
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder, type, allowed_formats: allowedFormats },
      process.env.CLOUDINARY_API_SECRET,
    );
    return res.json({
      success: true,
      timestamp,
      folder,
      type,
      allowedFormats,
      signature,
      resourceType: "raw",
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    return next(error);
  }
};
