export function formatLocation(value) {
  if (value == null || value === "") return "—";
  if (typeof value !== "object") return String(value);
  const address = value.address || value.formattedAddress || "";
  const latitude = value.latitude ?? value.lat;
  const longitude = value.longitude ?? value.lng ?? value.lon;
  const mapsUrl = value.mapsUrl || (Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : "");
  return { address, latitude, longitude, mapsUrl };
}

export function displayValue(value) {
  if (value == null || value === "") return "—";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => displayValue(item)).filter((item) => item !== "—").join(", ") || "—";
  }
  if (value.name) return value.name;
  if (value.degree || value.school) {
    return [value.degree, value.school, value.year].filter(Boolean).join(", ") || "—";
  }
  if (value.issuer) {
    return [value.name, value.issuer, value.year].filter(Boolean).join(" · ") || "—";
  }
  if (value.address || value.latitude || value.lat) {
    const location = formatLocation(value);
    return typeof location === "string" ? location : (location.address || `${location.latitude}, ${location.longitude}`);
  }
  return "—";
}

export function mapCenter(location) {
  if (!location || typeof location !== "object") return null;
  const lat = Number(location.latitude ?? location.lat);
  const lng = Number(location.longitude ?? location.lng ?? location.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
