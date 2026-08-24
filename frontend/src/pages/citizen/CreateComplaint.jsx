import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import MediaUploader from "../../components/citizen/MediaUploader";
import CameraCapture from "../../components/citizen/CameraCapture";
import GpsLocationCapture from "../../components/maps/GpsLocationCapture";
import { createComplaint, suggestComplaint } from "../../api/complaintApi";
import { uploadComplaintMedia } from "../../api/uploadApi";

const wizardCategories = [
  { label: "Road Damage", value: "Road Damage" },
  { label: "Garbage", value: "Garbage" },
  { label: "Water Leakage", value: "Water Leakage" },
  { label: "Electricity", value: "Electricity Problems" },
  { label: "Drainage", value: "Drainage Problems" },
  { label: "Public Safety", value: "Public Safety" },
  { label: "Other", value: "Other" },
];

const steps = ["Category", "Location", "Evidence", "Details", "Submit"];

async function compressImage(file) {
  if (!file?.type?.startsWith("image/") || file.size < 700_000) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.78));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }) : file;
}

function CreateComplaint() {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: { category: "", priority: "Medium", title: "", description: "" },
  });
  const [step, setStep] = useState(0);
  const [media, setMedia] = useState({ images: [], videos: [], cameraImage: null, documents: [] });
  const [location, setLocation] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [state, setState] = useState({ loading: false, success: "", error: "" });
  const category = watch("category");
  const description = watch("description");

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(category);
    if (step === 1) return Boolean(location?.latitude);
    if (step === 3) return (watch("title") || "").length >= 5 && (description || "").length >= 20;
    return true;
  }, [step, category, location, description, watch]);

  async function runSuggest(text) {
    if (!text || text.length < 8) return;
    try {
      const data = await suggestComplaint(text);
      setSuggestion(data.suggestion);
      if (data.suggestion?.priority) setValue("priority", data.suggestion.priority);
      const match = wizardCategories.find((item) => item.value === data.suggestion?.category || item.label === data.suggestion?.category);
      if (match) setValue("category", match.value);
    } catch {
      setSuggestion(null);
    }
  }

  const submitComplaint = async (data) => {
    if (!location) {
      setState({ loading: false, success: "", error: "Current GPS location is required." });
      return;
    }
    setState({ loading: true, success: "", error: "" });
    try {
      const raw = [...(media.images || []), ...(media.videos || []), ...(media.documents || []), ...(media.cameraImage ? [media.cameraImage] : [])];
      const files = await Promise.all(raw.map((file) => (file.type?.startsWith("image/") ? compressImage(file) : file)));
      const mediaFiles = await uploadComplaintMedia(files);
      const result = await createComplaint({ ...data, location, media: mediaFiles });
      setState({ loading: false, success: `Complaint ${result.complaint?.complaintId || ""} submitted successfully.`, error: "" });
      setMedia({ images: [], videos: [], cameraImage: null, documents: [] });
      setLocation(null);
      setSuggestion(null);
      setStep(0);
      reset();
    } catch (error) {
      setState({ loading: false, success: "", error: error.response?.data?.message || "Complaint submission failed." });
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-black tracking-tight">Report a civic issue</h1>
      <p className="mt-2 text-slate-600">A guided 5-step flow so the right department can act quickly.</p>
      {state.success && <div className="mt-6 rounded-lg bg-emerald-100 p-4 text-emerald-800">{state.success}</div>}
      {state.error && <div className="mt-6 rounded-lg bg-rose-100 p-4 text-rose-800">{state.error}</div>}

      <ol className="mt-8 grid grid-cols-5 gap-2">
        {steps.map((label, index) => (
          <li key={label} className={`rounded-xl px-2 py-3 text-center text-xs font-bold ${index === step ? "bg-emerald-600 text-white" : index < step ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(submitComplaint)} className="mt-8 space-y-8 rounded-2xl bg-white p-6 shadow-sm">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-black">What kind of issue is this?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {wizardCategories.map((item) => (
                <button key={item.value} type="button" onClick={() => setValue("category", item.value)} className={`rounded-2xl border px-4 py-4 text-left font-bold ${category === item.value ? "border-emerald-600 bg-emerald-50" : "border-slate-200"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("category", { required: "Please select a category" })} />
            {errors.category && <p className="mt-2 text-sm text-rose-600">{errors.category.message}</p>}
          </div>
        )}

        {step === 1 && (
          <GpsLocationCapture value={location} onChange={setLocation} />
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Add photos or video</h2>
            <p className="text-sm text-slate-500">Images are compressed before upload. You can attach several files.</p>
            <MediaUploader onMediaChange={setMedia} />
            <CameraCapture onCapture={(file) => setMedia((current) => ({ ...current, cameraImage: file }))} />
            <div className="grid gap-3 sm:grid-cols-3">
              {[...(media.images || []), media.cameraImage].filter(Boolean).map((file) => (
                <img key={file.name + file.size} src={URL.createObjectURL(file)} alt="" className="aspect-video w-full rounded-xl object-cover" />
              ))}
              {(media.videos || []).map((file) => (
                <video key={file.name} src={URL.createObjectURL(file)} controls className="aspect-video w-full rounded-xl bg-slate-950" />
              ))}
              {(media.documents || []).map((file) => (
                <p key={file.name} className="rounded-xl bg-slate-50 p-3 text-sm font-semibold">{file.name}</p>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Describe the problem</h2>
            <input id="title" {...register("title", { required: "Title is required", minLength: { value: 5, message: "Minimum 5 characters required" } })} className="w-full rounded-lg border p-3" placeholder="Street light not working near park" />
            {errors.title && <p className="text-sm text-rose-600">{errors.title.message}</p>}
            <textarea id="description" rows="5" {...register("description", { required: "Description is required", minLength: { value: 20, message: "Minimum 20 characters required" } })} onBlur={(event) => runSuggest(event.target.value)} className="w-full rounded-lg border p-3" placeholder="Explain what you see, when it started, and who is affected." />
            {errors.description && <p className="text-sm text-rose-600">{errors.description.message}</p>}
            <select {...register("priority")} className="w-full rounded-lg border p-3">
              {["Low", "Medium", "High", "Urgent"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
            {suggestion && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                <p className="font-bold">Smart suggestion</p>
                <p className="mt-1">Category: {suggestion.category}</p>
                <p>Priority: {suggestion.priority}</p>
                <p>Department: {suggestion.department}</p>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-xl font-black">Review and submit</h2>
            <p><span className="font-semibold">Category:</span> {category}</p>
            <p><span className="font-semibold">Priority:</span> {watch("priority")}</p>
            <p><span className="font-semibold">Title:</span> {watch("title")}</p>
            <p className="text-sm text-slate-600">{description}</p>
            <p className="text-sm">{location?.address || `${location?.latitude}, ${location?.longitude}`}</p>
            <button type="submit" disabled={state.loading} className="rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white disabled:opacity-50">
              {state.loading ? "Submitting..." : "Submit complaint"}
            </button>
          </div>
        )}

        <div className="flex justify-between">
          <button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-40">Back</button>
          {step < 4 && <button type="button" disabled={!canNext} onClick={() => setStep((value) => value + 1)} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Continue</button>}
        </div>
      </form>
    </div>
  );
}

export default CreateComplaint;
