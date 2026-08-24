// import { useState } from "react";

// import {
//   X,
//   MapPin,
//   User,
//   ClipboardList,
//   AlertTriangle,
//   CheckCircle2,
// } from "lucide-react";

// function StaffTaskDetailsModal({
//   task,
//   onClose,
//   onAcceptTask,
//   onUpdateProgress,
// }) {
//   const [progress, setProgress] = useState(task.progress || 0);

//   if (!task) {
//     return null;
//   }

//   const handleProgressChange = (event) => {
//     const value = Number(event.target.value);

//     setProgress(value);
//   };

//   const handleUpdateProgress = () => {
//     onUpdateProgress(task.id, progress);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
//         {/* Header */}

//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <p className="text-sm font-medium text-blue-600">
//               {task.id}
//             </p>

//             <h2 className="mt-1 text-2xl font-bold text-slate-900">
//               {task.title}
//             </h2>

//             <p className="mt-2 text-sm text-slate-500">
//               View task details and update work progress.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Task Information */}

//         <div className="mt-8 grid gap-4 md:grid-cols-2">
//           <InfoCard
//             icon={ClipboardList}
//             title="Category"
//             value={task.category}
//           />

//           <InfoCard
//             icon={AlertTriangle}
//             title="Priority"
//             value={task.priority}
//           />

//           <InfoCard
//             icon={MapPin}
//             title="Location"
//             value={task.location}
//           />

//           <InfoCard
//             icon={User}
//             title="Assigned By"
//             value={task.assignedBy}
//           />
//         </div>

//         {/* Description */}

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-slate-900">
//             Task Description
//           </h3>

//           <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
//             {task.description ||
//               "Please inspect the reported issue and complete the required work."}
//           </div>
//         </div>

//         {/* Status */}

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-slate-900">
//             Current Status
//           </h3>

//           <span
//             className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-medium ${
//               task.status === "Assigned"
//                 ? "bg-blue-100 text-blue-700"
//                 : task.status === "In Progress"
//                   ? "bg-orange-100 text-orange-700"
//                   : "bg-green-100 text-green-700"
//             }`}
//           >
//             {task.status}
//           </span>
//         </div>

//         {/* Accept Task */}

//         {task.status === "Assigned" && (
//           <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
//             <h3 className="font-semibold text-slate-900">
//               Ready to start this task?
//             </h3>

//             <p className="mt-1 text-sm text-slate-600">
//               Accepting this task will change its status to In Progress.
//             </p>

//             <button
//               type="button"
//               onClick={() => onAcceptTask(task.id)}
//               className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
//             >
//               <CheckCircle2 size={18} />
//               Accept Task
//             </button>
//           </div>
//         )}

//         {/* Progress */}

//         {task.status === "In Progress" && (
//           <div className="mt-8 rounded-xl border border-slate-200 p-5">
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <h3 className="font-semibold text-slate-900">
//                   Work Progress
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Update the current completion percentage.
//                 </p>
//               </div>

//               <span className="text-lg font-bold text-blue-600">
//                 {progress}%
//               </span>
//             </div>

//             <input
//               type="range"
//               min="0"
//               max="100"
//               step="10"
//               value={progress}
//               onChange={handleProgressChange}
//               className="mt-6 w-full accent-blue-600"
//             />

//             <div className="mt-2 flex justify-between text-xs text-slate-400">
//               <span>0%</span>
//               <span>50%</span>
//               <span>100%</span>
//             </div>

//             <button
//               type="button"
//               onClick={handleUpdateProgress}
//               className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
//             >
//               Update Progress
//             </button>
//           </div>
//         )}

//         {/* Footer */}

//         <div className="mt-8 flex justify-end border-t pt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoCard({
//   icon: Icon,
//   title,
//   value,
// }) {
//   return (
//     <div className="rounded-lg bg-slate-50 p-4">
//       <div className="flex items-center gap-2 text-slate-500">
//         <Icon size={18} />

//         <span className="text-sm">
//           {title}
//         </span>
//       </div>

//       <p className="mt-2 font-medium text-slate-800">
//         {value}
//       </p>
//     </div>
//   );
// }

// export default StaffTaskDetailsModal;












import { useState } from "react";

import {
  X,
  MapPin,
  User,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Save,
} from "lucide-react";

import FieldEvidenceCapture from "./FieldEvidenceCapture";
import { LocationBlock, displayValue, safeChild } from "../../utils/formatValue";

function StaffTaskDetailsModal({
  task,
  onClose,
  onAcceptTask,
  onUpdateProgress,
  onCompleteTask,
}) {
  const [progress, setProgress] = useState(
    task?.progress || 0
  );

  const [workNotes, setWorkNotes] = useState(
    task?.workNotes || ""
  );
  const [evidence, setEvidence] = useState(task?.workEvidence || []);

  if (!task) {
    return null;
  }

  const handleProgressChange = (event) => {
    setProgress(Number(event.target.value));
  };

  const handleSaveWorkDetails = () => {
    onUpdateProgress(
      task.id,
      progress,
      evidence,
      evidence,
      workNotes
    );
  };

  const handleCompleteTask = () => {
    if (!evidence.some((item) => item.source === "camera")) {
      alert("Capture camera proof with GPS before submitting for verification.");
      return;
    }

    onCompleteTask(
      task.id,
      evidence,
      evidence,
      workNotes
    );
  };

  const getStatusClass = () => {
    if (task.status === "Assigned") {
      return "bg-blue-100 text-blue-700";
    }

    if (task.status === "In Progress") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {task.id}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {task.title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Manage task progress and upload work proof.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task Information */}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard
            icon={ClipboardList}
            title="Category"
            value={task.category}
          />

          <InfoCard
            icon={AlertTriangle}
            title="Priority"
            value={task.priority}
          />

          <InfoCard
            icon={MapPin}
            title="Location"
            value={<LocationBlock value={task.location} />}
          />

          <InfoCard
            icon={User}
            title="Assigned By"
            value={displayValue(task.assignedBy)}
          />
        </div>

        {/* Description */}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Task Description
          </h3>

          <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {task.description}
          </div>
        </div>

        {/* Status */}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Current Status
          </h3>

          <span
            className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-medium ${getStatusClass()}`}
          >
            {task.status}
          </span>
        </div>

        {/* Accept Task */}

        {task.status === "Assigned" && (
          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-semibold text-slate-900">
              Ready to start this task?
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Accepting this task will change its status to In Progress.
            </p>

            <button
              type="button"
              onClick={() =>
                onAcceptTask(task.id)
              }
              className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              <CheckCircle2 size={18} />
              Accept Task
            </button>
          </div>
        )}

        {/* Work Section */}

        {task.status === "In Progress" && (
          <div className="mt-8 space-y-6">
            {/* Progress */}

            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Work Progress
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the current completion percentage.
                  </p>
                </div>

                <span className="text-xl font-bold text-blue-600">
                  {progress}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={progress}
                onChange={handleProgressChange}
                className="mt-6 w-full accent-blue-600"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <FieldEvidenceCapture
              complaint={{ ...task, complaintId: task.complaintId || task.id }}
              phase="before"
              onSubmit={async (item) => setEvidence((current) => [...current, item])}
            />

            {/* Work Notes */}

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Work Notes
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add details about the work performed.
              </p>

              <textarea
                value={workNotes}
                onChange={(event) =>
                  setWorkNotes(
                    event.target.value
                  )
                }
                placeholder="Example: Inspected damaged area, filled pothole, and repaired the road surface..."
                rows="5"
                className="mt-4 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <FieldEvidenceCapture
              complaint={{ ...task, complaintId: task.complaintId || task.id }}
              phase="after"
              onSubmit={async (item) => setEvidence((current) => [...current, item])}
            />

            {/* Save */}

            <button
              type="button"
              onClick={handleSaveWorkDetails}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white hover:bg-slate-900"
            >
              <Save size={18} />
              Save Work Details
            </button>

            {/* Complete */}

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Complete Task
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Upload after-work proof and confirm when the assigned work is finished.
              </p>

              <button
                type="button"
                onClick={handleCompleteTask}
                className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
              >
                <CheckCircle2 size={18} />
                Mark as Completed
              </button>
            </div>
          </div>
        )}

        {/* Completed Task Message */}

        {task.status === "Completed" && (
          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={28}
                className="text-green-600"
              />

              <div>
                <h3 className="font-semibold text-green-800">
                  Task Completed
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  This task has been marked as completed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}

        <div className="mt-8 flex justify-end border-t pt-6">
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
  title,
  value,
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={18} />

        <span className="text-sm">
          {title}
        </span>
      </div>

      <div className="mt-2 font-medium text-slate-800">
        {safeChild(value)}
      </div>
    </div>
  );
}

export default StaffTaskDetailsModal;