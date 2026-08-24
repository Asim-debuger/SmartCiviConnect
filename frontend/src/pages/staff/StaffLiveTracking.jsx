import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  Play,
  Square,
  LocateFixed,
  AlertCircle,
} from "lucide-react";
import { updateStaffLocation, getAssignedComplaints } from "../../api/operationsApi";
import useSocket from "../../hooks/useSocket";

function StaffLiveTracking() {
  const socket = useSocket();
  const [location, setLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [assignedIds, setAssignedIds] = useState([]);

  const watchIdRef = useRef(null);
  const assignedIdsRef = useRef([]);

  useEffect(() => {
    getAssignedComplaints()
      .then((data) => {
        const ids = (data.complaints || []).map((item) => item.complaintId || item._id).filter(Boolean);
        assignedIdsRef.current = ids;
        setAssignedIds(ids);
      })
      .catch(() => {});
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }
    };
  }, []);

  const updateLocation = (position) => {
    const {
      latitude,
      longitude,
      accuracy,
    } = position.coords;

    setLocation({
      latitude,
      longitude,
      accuracy: Math.round(accuracy),
      updatedAt: new Date().toLocaleTimeString(),
    });
    const ids = assignedIdsRef.current;
    updateStaffLocation({ latitude, longitude, sharing: true, complaintId: ids[0] }).catch(() => {});
    ids.forEach((complaintId) => {
      socket?.emit("location:update", { latitude, longitude, complaintId });
    });
    if (!ids.length) socket?.emit("location:update", { latitude, longitude });

    setError("");
    setLoadingLocation(false);
  };

  const handleLocationError = (geoError) => {
    setLoadingLocation(false);

    if (geoError.code === 1) {
      setError(
        "Location permission was denied. Please allow location access."
      );
    } else if (geoError.code === 2) {
      setError(
        "Location information is currently unavailable."
      );
    } else if (geoError.code === 3) {
      setError(
        "Location request timed out. Please try again."
      );
    } else {
      setError(
        "Unable to get your current location."
      );
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      updateLocation,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const startSharingLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setError("");
    setIsSharing(true);

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        updateLocation,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
  };

  const stopSharingLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current = null;
    }

    setIsSharing(false);
    updateStaffLocation({ sharing: false }).catch(() => {});
  };

  const openGoogleMaps = () => {
    if (!location) {
      return;
    }

    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div>
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Live Location
        </h1>

        <p className="mt-2 text-slate-600">
          Share your live location while working on assigned tasks.
        </p>
      </div>

      {/* Location Status */}

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Navigation size={28} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Location Sharing
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {isSharing
                      ? "Your live location is currently being tracked."
                      : "Your live location sharing is currently stopped."}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                  isSharing
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isSharing
                  ? "Live"
                  : "Not Sharing"}
              </span>
            </div>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="flex items-center gap-2 rounded-lg border border-blue-600 px-5 py-2.5 font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed size={18} />

                {loadingLocation
                  ? "Getting Location..."
                  : "Get Current Location"}
              </button>

              {!isSharing ? (
                <button
                  type="button"
                  onClick={startSharingLocation}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                  <Play size={18} />
                  Start Sharing
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopSharingLocation}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                >
                  <Square size={18} />
                  Stop Sharing
                </button>
              )}
            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle
                  size={20}
                  className="shrink-0 text-red-600"
                />

                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Coordinates */}

            {location && (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <LocationCard
                  label="Latitude"
                  value={location.latitude.toFixed(6)}
                />

                <LocationCard
                  label="Longitude"
                  value={location.longitude.toFixed(6)}
                />

                <LocationCard
                  label="Accuracy"
                  value={`${location.accuracy} meters`}
                />

                <LocationCard
                  label="Last Updated"
                  value={location.updatedAt}
                />
              </div>
            )}
          </div>
        </div>

        {/* Information Card */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <MapPin size={28} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            Live Tracking
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            When live sharing is enabled, your location will later be visible
            to authorized officers and administrators for task monitoring.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Privacy
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Location sharing should only be active while performing assigned
              work. You can stop sharing at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Map Section */}

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Current Location Map
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View your current GPS coordinates on Google Maps.
            </p>
          </div>

          {location && (
            <button
              type="button"
              onClick={openGoogleMaps}
              className="flex w-fit items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
            >
              <MapPin size={18} />
              Open in Google Maps
            </button>
          )}
        </div>

        <div className="mt-6 min-h-80 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {location ? (
            <iframe
              title="Staff live location"
              className="h-80 w-full"
              src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=16&output=embed`}
            />
          ) : (
            <div className="text-center">
              <MapPin
                size={42}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-700">
                No Location Available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Click "Get Current Location" to detect your GPS position.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default StaffLiveTracking;