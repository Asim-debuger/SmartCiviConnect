import { isValidElement } from "react";
import { displayValue, formatLocation } from "./formatValueCore";

export { displayValue, formatLocation };
export { mapCenter } from "./formatValueCore";

export function LocationBlock({ value }) {
  const location = formatLocation(value);
  if (typeof location === "string") return location;
  return (
    <div className="space-y-1 text-sm">
      <p>{location.address || "Address not recorded"}</p>
      {(location.latitude || location.longitude) && (
        <p className="text-xs text-slate-500">
          {location.latitude}, {location.longitude}
        </p>
      )}
      {location.mapsUrl && (
        <a href={location.mapsUrl} target="_blank" rel="noreferrer" className="inline-block text-xs font-bold text-blue-700">
          Open map
        </a>
      )}
    </div>
  );
}

export function safeChild(value) {
  if (value == null || value === "") return "—";
  if (isValidElement(value)) return value;
  if (typeof value === "object") return displayValue(value);
  return value;
}
