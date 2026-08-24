import { useEffect, useState } from "react";
import { getLiveLocations } from "../../api/operationsApi";
import useSocket from "../../hooks/useSocket";

function OfficerTracking() {
  const socket = useSocket();
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLocations((await getLiveLocations()).locations || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load live locations.");
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!socket) return undefined;
    const onUpdate = (payload) => {
      setLocations((current) => {
        const next = current.filter((item) => item._id !== payload.staffId);
        return [{ _id: payload.staffId, name: payload.name, lastLocation: payload }, ...next];
      });
    };
    socket.on("location:update", onUpdate);
    socket.on("location:updated", onUpdate);
    return () => {
      socket.off("location:update", onUpdate);
      socket.off("location:updated", onUpdate);
    };
  }, [socket]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Field visibility</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Live worker locations</h1>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="space-y-3">
        {locations.map((item) => (
          <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-black">{item.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {item.lastLocation?.latitude}, {item.lastLocation?.longitude}
            </p>
            <p className="mt-1 text-xs text-slate-400">{item.lastLocation?.updatedAt ? new Date(item.lastLocation.updatedAt).toLocaleString() : "Just now"}</p>
          </article>
        ))}
        {!locations.length && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">No staff are sharing location yet.</p>}
      </div>
    </div>
  );
}

export default OfficerTracking;
