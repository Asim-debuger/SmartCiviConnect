const { sanitizeProfileImage } = require("./profileImage");

function toSafeNetworkProfile(user, { isSelf = false } = {}) {
  if (!user) return null;
  const id = String(user._id || user.id || "");
  const copy = { ...user };
  copy._id = id;
  copy.id = id;
  copy.profileImage = sanitizeProfileImage(copy.profileImage);
  delete copy.resumePublicId;
  delete copy.resumeUrl;
  delete copy.paymentProfile;
  delete copy.password;
  delete copy.refreshTokens;
  delete copy.accountNumberEnc;
  delete copy.accountHolderEnc;
  delete copy.ifscEnc;
  delete copy.bankNameEnc;
  delete copy.phoneEnc;
  if (!isSelf) {
    delete copy.email;
    delete copy.phone;
    delete copy.hasResume;
    delete copy.resumeFileName;
    delete copy.resumeFileType;
    delete copy.resumeUploadedAt;
  } else {
    copy.hasResume = Boolean(user.resumePublicId || user.resumeFileName || user.hasResume);
  }
  return copy;
}

module.exports = { toSafeNetworkProfile };
