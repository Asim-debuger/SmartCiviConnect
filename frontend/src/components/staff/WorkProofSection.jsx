import { useState } from "react";

import {
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react";

function WorkProofSection({
  title,
  description,
  images,
  onImagesChange,
}) {
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== selectedFiles.length) {
      setError("Only image files are allowed.");
    } else {
      setError("");
    }

    const newImages = imageFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    onImagesChange([
      ...images,
      ...newImages,
    ]);

    event.target.value = "";
  };

  const removeImage = (imageId) => {
    const imageToRemove = images.find(
      (image) => image.id === imageId
    );

    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    onImagesChange(
      images.filter(
        (image) => image.id !== imageId
      )
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`upload-${title}`}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-blue-500 hover:bg-blue-50"
        >
          <ImagePlus
            size={32}
            className="text-blue-600"
          />

          <p className="mt-3 font-medium text-slate-700">
            Upload Work Images
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Select one or multiple images
          </p>

          <span className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600">
            <Camera size={16} />
            Choose Images
          </span>

          <input
            id={`upload-${title}`}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border border-slate-200"
            >
              <img
                src={image.preview}
                alt="Work proof"
                className="h-32 w-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  removeImage(image.id)
                }
                className="absolute right-2 top-2 rounded-lg bg-white p-2 text-red-600 shadow opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkProofSection;