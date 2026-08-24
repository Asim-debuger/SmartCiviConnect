import { useState } from "react";
import { FileText, Image, Video, X } from "lucide-react";

const IMAGE_MAX = 8 * 1024 * 1024;
const VIDEO_MAX = 40 * 1024 * 1024;

function MediaUploader({ onMediaChange }) {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  function emit(nextImages, nextVideos, nextDocuments = documents) {
    onMediaChange({ images: nextImages, videos: nextVideos, documents: nextDocuments });
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const valid = files.filter((file) => file.type.startsWith("image/") && file.size <= IMAGE_MAX);
    if (valid.length !== files.length) setError("Images must be under 8 MB.");
    else setError("");
    setImages(valid);
    emit(valid, videos, documents);
  };

  const handleVideoChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const valid = files.filter((file) => file.type.startsWith("video/") && file.size <= VIDEO_MAX);
    if (valid.length !== files.length) setError("Videos must be under 40 MB.");
    else setError("");
    setVideos(valid);
    emit(images, valid, documents);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    emit(updated, videos, documents);
  };

  const removeVideo = (index) => {
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
    emit(images, updated, documents);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Upload evidence</h3>
      {error && <p className="text-sm text-rose-700">{error}</p>}
      <div>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-5 hover:bg-slate-50">
          <Image className="text-blue-600" />
          <span>Upload images</span>
          <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={`${image.name}-${index}`} className="relative">
              <img src={URL.createObjectURL(image)} alt="" className="h-32 w-full rounded-lg object-cover" />
              <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-5 hover:bg-slate-50">
          <Video className="text-purple-600" />
          <span>Upload video</span>
          <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
        </label>
        <div className="mt-4 grid gap-3">
          {videos.map((video, index) => (
            <div key={`${video.name}-${index}`} className="relative">
              <video src={URL.createObjectURL(video)} controls className="h-40 w-full rounded-lg bg-slate-950 object-cover" />
              <p className="mt-1 text-xs text-slate-500">{video.name}</p>
              <button type="button" onClick={() => removeVideo(index)} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-5 hover:bg-slate-50">
          <FileText className="text-slate-700" />
          <span>Upload document (PDF, DOC)</span>
          <input type="file" accept=".pdf,.doc,.docx,application/pdf" multiple hidden onChange={(event) => {
            const files = Array.from(event.target.files || []);
            event.target.value = "";
            const valid = files.filter((file) => file.size <= 10 * 1024 * 1024);
            if (valid.length !== files.length) setError("Documents must be under 10 MB.");
            else setError("");
            setDocuments(valid);
            emit(images, videos, valid);
          }} />
        </label>
        <div className="mt-3 space-y-2">
          {documents.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span>{file.name}</span>
              <button type="button" onClick={() => {
                const updated = documents.filter((_, i) => i !== index);
                setDocuments(updated);
                emit(images, videos, updated);
              }} className="text-xs font-bold text-rose-700">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MediaUploader;
