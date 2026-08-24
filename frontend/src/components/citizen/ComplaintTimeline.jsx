import {
  Clock3,
  ShieldCheck,
  UserCheck,
  Users,
  Handshake,
  PlayCircle,
  Wrench,
  Image,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { COMPLAINT_TIMELINE_STEPS, complaintTimelineIndex } from "../../utils/complaintTimeline";

const icons = [Clock3, ShieldCheck, UserCheck, Users, Handshake, PlayCircle, Wrench, Image, Search, CheckCircle2];

function ComplaintTimeline({
  currentStatus,
  currentIndex,
  rejected,
  complaint,
}) {
  if (rejected) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <XCircle size={28} className="text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Complaint rejected</h3>
            <p className="mt-1 text-sm text-red-700">This complaint was rejected after verification.</p>
          </div>
        </div>
      </div>
    );
  }

  const index = Number.isInteger(currentIndex) ? currentIndex : complaintTimelineIndex(complaint || { status: currentStatus });

  return (
    <div className="space-y-6">
      {COMPLAINT_TIMELINE_STEPS.map((status, stepIndex) => {
        const Icon = icons[stepIndex] || Clock3;
        const isCompleted = stepIndex <= index;
        const isCurrent = stepIndex === index;
        return (
          <div key={status} className="relative flex gap-4">
            {stepIndex !== COMPLAINT_TIMELINE_STEPS.length - 1 && (
              <div className={`absolute left-5 top-10 h-full w-0.5 ${stepIndex < index ? "bg-green-500" : "bg-slate-200"}`} />
            )}
            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isCurrent ? "bg-blue-600 text-white" : isCompleted ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              <Icon size={18} />
            </div>
            <div className="pb-6">
              <h4 className={`font-semibold ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>{status}</h4>
              {isCurrent && (
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Current status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ComplaintTimeline;
