import { useState } from "react";

import {
  X,
  MapPin,
  Tag,
  AlertTriangle,
  CalendarDays,
  User,
  Star,
  Send,
  Image,
  CheckCircle2,
} from "lucide-react";

import ComplaintTimeline from "./ComplaintTimeline";
import { LocationBlock, displayValue, safeChild } from "../../utils/formatValue";
import { complaintTimelineIndex } from "../../utils/complaintTimeline";

function ComplaintDetailsModal({
  complaint,
  onClose,
  onSubmitFeedback,
}) {
  const [rating, setRating] = useState(
    complaint.rating || 0
  );

  const [feedback, setFeedback] = useState(
    complaint.feedback || ""
  );

  if (!complaint) {
    return null;
  }

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      alert(
        "Please select a rating before submitting feedback."
      );

      return;
    }

    onSubmitFeedback?.(
      complaint._id || complaint.complaintId || complaint.id,
      rating,
      feedback
    );
  };

  const priorityClass =
    complaint.priority === "High"
      ? "bg-red-100 text-red-700"
      : complaint.priority === "Medium"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-white p-6">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {complaint.complaintId || complaint.id}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {complaint.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-2">
          {/* Left Side */}

          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Complaint Details
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={Tag}
                label="Category"
                value={complaint.category}
              />

              <InfoCard
                icon={AlertTriangle}
                label="Priority"
                value={
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClass}`}
                  >
                    {complaint.priority}
                  </span>
                }
              />

              <InfoCard
                icon={MapPin}
                label="Location"
                value={<LocationBlock value={complaint.location} />}
              />

              <InfoCard
                icon={CalendarDays}
                label="Created"
                value={complaint.createdAt}
              />
            </div>

            {/* Description */}

            <div className="mt-6">
              <h4 className="font-semibold text-slate-800">
                Description
              </h4>

              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {complaint.description}
              </div>
            </div>

            {/* Officer */}

            {(complaint.officer || complaint.assignedOfficer) && (
              <div className="mt-6 rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <User size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Assigned Officer
                    </p>

                    <p className="font-semibold text-slate-800">
                      {displayValue(complaint.assignedOfficer || complaint.officer)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Media */}

            {(complaint.media?.length > 0 || complaint.images?.length > 0) && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <Image
                    size={20}
                    className="text-slate-600"
                  />

                  <h4 className="font-semibold text-slate-800">
                    Submitted evidence
                  </h4>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {(complaint.media?.length ? complaint.media : complaint.images).map(
                    (image, index) => (
                      <img
                        key={`${image.url || image}-${index}`}
                        src={typeof image === "string" ? image : image.url}
                        alt={`Complaint ${index + 1}`}
                        className="h-36 w-full rounded-lg object-cover"
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Work Proof */}

            {complaint.status ===
              "Completed" && (
              <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={26}
                    className="text-green-600"
                  />

                  <div>
                    <h4 className="font-semibold text-green-800">
                      Work Completed
                    </h4>

                    <p className="mt-1 text-sm text-green-700">
                      The assigned team has marked this complaint as completed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}

            {complaint.status ===
              "Completed" && (
              <div className="mt-8 rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Rate This Service
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Share your experience after the complaint has been resolved.
                </p>

                <div className="mt-5 flex gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(star)
                        }
                      >
                        <Star
                          size={30}
                          className={
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    )
                  )}
                </div>

                <textarea
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(
                      event.target.value
                    )
                  }
                  placeholder="Write your feedback..."
                  rows="4"
                  className="mt-5 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={handleFeedbackSubmit}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  <Send size={18} />
                  Submit Feedback
                </button>
              </div>
            )}
          </div>

          {/* Right Side */}

          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Complaint Progress
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Track the current progress of your complaint.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 p-6">
              <ComplaintTimeline
                currentStatus={
                  complaint.status
                }
                currentIndex={complaintTimelineIndex(complaint)}
                rejected={
                  complaint.status ===
                  "Rejected"
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={17} />

        <span className="text-sm">
          {label}
        </span>
      </div>

      <div className="mt-2 font-medium text-slate-800">
        {safeChild(value)}
      </div>
    </div>
  );
}

export default ComplaintDetailsModal;