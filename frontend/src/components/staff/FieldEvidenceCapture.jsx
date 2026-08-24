import { useEffect, useRef, useState } from "react";
import { uploadComplaintMedia } from "../../api/uploadApi";

async function readGps() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("GPS is not available on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => reject(new Error("Allow location access to stamp this evidence.")),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });
}

function FieldEvidenceCapture({ complaint, onSubmit, disabled, phase = "after" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordStartedRef = useRef(0);
  const [mode, setMode] = useState("photo");
  const [preview, setPreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [gps, setGps] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: mode === "video" });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const pos = await readGps();
        if (!cancelled) setGps(pos);
      } catch (err) {
        if (!cancelled) setError(err.message || "Camera or GPS permission is required.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [mode]);

  function clearPreview() {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `proof-${Date.now()}.jpg`, { type: "image/jpeg" });
      setPreview({ file, url: URL.createObjectURL(blob), type: "image", capturedAt: new Date().toISOString(), duration: 0 });
    }, "image/jpeg", 0.9);
  }

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const file = new File([blob], `proof-${Date.now()}.webm`, { type: "video/webm" });
      const duration = recordStartedRef.current ? Math.max(1, Math.round((Date.now() - recordStartedRef.current) / 1000)) : 0;
      setPreview({ file, url: URL.createObjectURL(blob), type: "video", capturedAt: new Date().toISOString(), duration });
    };
    recordStartedRef.current = Date.now();
    recorder.start();
    setRecording(true);
  }

  async function submit() {
    if (!preview) return;
    setBusy(true);
    setError("");
    try {
      const pos = gps || await readGps();
      setProgress(`Uploading ${phase} evidence…`);
      const uploaded = await uploadComplaintMedia([preview.file], undefined, () => setProgress("Upload complete, saving…"), phase);
      const item = {
        ...uploaded[0],
        capturedAt: preview.capturedAt,
        uploadedAt: new Date().toISOString(),
        latitude: pos.latitude,
        longitude: pos.longitude,
        duration: preview.duration || 0,
        staffId: complaint.assignedStaffId,
        complaintId: complaint.complaintId,
        source: "camera",
        phase,
        name: preview.file.name,
      };
      await onSubmit(item);
      clearPreview();
      setProgress("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to submit evidence.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => { clearPreview(); setMode("photo"); }} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mode === "photo" ? "bg-slate-950 text-white" : "bg-white"}`}>Photo</button>
        <button type="button" onClick={() => { clearPreview(); setMode("video"); }} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mode === "video" ? "bg-slate-950 text-white" : "bg-white"}`}>Video</button>
      </div>
      {!preview && <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full rounded-lg bg-black object-cover" />}
      {preview?.type === "image" && <img src={preview.url} alt="Captured proof" className="aspect-video w-full rounded-lg object-cover" />}
      {preview?.type === "video" && <video src={preview.url} controls className="aspect-video w-full rounded-lg bg-black" />}
      {gps && <p className="text-xs text-slate-500">GPS {gps.latitude.toFixed(5)}, {gps.longitude.toFixed(5)}</p>}
      {error && <p className="text-xs text-rose-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {!preview && mode === "photo" && <button type="button" disabled={disabled} onClick={capturePhoto} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white">Capture photo</button>}
        {!preview && mode === "video" && !recording && <button type="button" disabled={disabled} onClick={startRecording} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white">Start recording</button>}
        {recording && <button type="button" onClick={() => { recorderRef.current?.stop(); setRecording(false); }} className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold text-white">Stop</button>}
        {preview && (
          <>
            <button type="button" onClick={clearPreview} className="rounded-lg border px-3 py-2 text-xs font-bold">Delete / retake</button>
            <button type="button" disabled={busy || disabled} onClick={submit} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">{busy ? (progress || "Uploading…") : "Submit evidence"}</button>
          </>
        )}
      </div>
    </div>
  );
}

export default FieldEvidenceCapture;
