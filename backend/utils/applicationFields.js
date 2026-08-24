function toSkillList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") return String(item.name || item.skill || "").trim();
      return String(item).trim();
    }).filter(Boolean);
  }
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function asStoredProfileField(bodyValue, profileValue) {
  if (bodyValue == null || bodyValue === "") return profileValue || [];
  if (typeof bodyValue === "string") return bodyValue.trim() || profileValue || [];
  return bodyValue;
}

function asExperienceYears(bodyValue, profileValue) {
  if (bodyValue === "" || bodyValue == null) {
    const fallback = Number(profileValue ?? 0);
    return Number.isFinite(fallback) && fallback >= 0 ? fallback : 0;
  }
  const value = Number(bodyValue);
  if (Number.isFinite(value) && value >= 0) return value;
  const fallback = Number(profileValue ?? 0);
  return Number.isFinite(fallback) && fallback >= 0 ? fallback : 0;
}

module.exports = { toSkillList, asStoredProfileField, asExperienceYears };
