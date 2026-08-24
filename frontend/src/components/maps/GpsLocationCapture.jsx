import { useState } from "react";
import { MapPin } from "lucide-react";

async function reverseGeocode(latitude, longitude) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return "";
  const payload = await response.json();
  return payload.display_name || "";
}

function GpsLocationCapture({ value, onChange }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function capture() {
    if (!navigator.geolocation) {
      setError("This browser does not support GPS.");
      return;
    }
    setLoading(true);
    setError("");
    setStatus("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setStatus("Resolving address...");
          const formattedAddress = await reverseGeocode(latitude, longitude);
          const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          onChange({
            latitude,
            longitude,
            address: formattedAddress || "Current GPS location",
            formattedAddress,
            mapsUrl,
          });
          setStatus("Live GPS location captured.");
        } catch {
          setError("GPS was captured, but reverse geocoding failed. Coordinates are still saved.");
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          onChange({
            latitude,
            longitude,
            address: "Current GPS location",
            formattedAddress: "",
            mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          });
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        if (geoError?.code === 1) {
          setError("Location permission was denied. Enable GPS permission in your browser to submit a complaint. Manual map selection is not available.");
        } else if (geoError?.code === 2) {
          setError("GPS is unavailable on this device. Complaint submission is blocked until a live location can be captured.");
        } else if (geoError?.code === 3) {
          setError("Location request timed out. Try again with a clearer GPS signal.");
        } else {
          setError("Location permission was denied or GPS is unavailable. Manual map selection is disabled.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black">Capture current GPS location</h2>
      <p className="text-sm text-slate-600">Use your device GPS only. Manual map picking and typed addresses are not allowed.</p>
      <button type="button" onClick={capture} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
        <MapPin size={16} />
        {loading ? "Locating..." : "Get Current Location"}
      </button>
      {status && <p className="text-sm font-semibold text-emerald-800">{status}</p>}
      {error && <p className="text-sm text-rose-700">{error}</p>}
      {value?.latitude && (
        <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
          <p className="font-bold">Live coordinates</p>
          <p className="mt-1">{value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}</p>
          <p className="mt-2 text-slate-600">{value.formattedAddress || value.address}</p>
          {value.mapsUrl && (
            <a href={value.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex font-bold text-teal-700">
              Open in Google Maps
            </a>
          )}
          <iframe
            title="Complaint location preview"
            className="mt-4 h-56 w-full rounded-xl border"
            src={`https://maps.google.com/maps?q=${value.latitude},${value.longitude}&z=16&output=embed`}
          />
        </div>
      )}
    </div>
  );
}

export default GpsLocationCapture;
