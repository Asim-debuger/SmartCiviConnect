function isClerkAsset(url) {
  if (!url || typeof url !== "string") return false;
  return /clerk\.com|img\.clerk|clerk\.accounts/i.test(url);
}

function sanitizeProfileImage(url) {
  if (!url || isClerkAsset(url)) return "";
  return url;
}

module.exports = {
  isClerkAsset,
  isClerkAsset: isClerkAsset,
  sanitizeProfileImage,
  sanitizeProfileImage: sanitizeProfileImage,
};
