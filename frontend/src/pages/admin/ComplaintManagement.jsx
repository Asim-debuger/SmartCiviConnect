import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import ComplaintFilter from "../../components/admin/ComplaintFilter";
import ComplaintTable from "../../components/admin/ComplaintTable";
import AssignOfficerModal from "../../components/admin/AssignOfficerModal";
import ComplaintStatus from "../../components/complaints/ComplaintStatus";
import { assignComplaint as assignComplaintApi, getAdminComplaints, verifyTask, rejectEvidence } from "../../api/operationsApi";
import { changeComplaintStatus } from "../../api/complaintApi";
import EvidenceReview from "../../components/officer/EvidenceReview";


function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [category, setCategory] =
    useState("All");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [assignComplaint, setAssignComplaint] =
    useState(null);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminComplaints({});
      setComplaints(response?.complaints || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial remote loading intentionally updates management state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadComplaints();
  }, [loadComplaints]);


  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.complaintId
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.title
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "All" ||
        complaint.status === status;

      const matchesCategory =
        category === "All" ||
        complaint.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    complaints,
    search,
    status,
    category,
  ]);


  const handleAssignOfficer = async (
    complaintId,
    officer
  ) => {
    try {
      const response = await assignComplaintApi(complaintId, { officerId: String(officer.id || officer._id) });
      setComplaints((current) => current.map((item) => item._id === complaintId || item.complaintId === complaintId ? response.complaint : item));
      setAssignComplaint(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to assign officer.");
    }
  };


  return (
    <div>
      {/* Page Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Complaint Management
          </h1>

          <p className="mt-2 text-slate-600">
            Review, verify, assign, and monitor civic complaints.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {filteredComplaints.length} complaint(s)
        </div>
      </div>


      {error && <div className="mt-5 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}

      {/* Filters */}

      <div className="mt-8">
        <ComplaintFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
        />
      </div>


      {/* Complaint Table */}

      <div className="mt-6">
        {loading ? <div className="rounded-xl bg-white p-8 text-center text-slate-500">Loading complaints...</div> :
        <ComplaintTable
          complaints={filteredComplaints}
          onView={setSelectedComplaint}
          onAssign={setAssignComplaint}
        />}
      </div>


      {/* Complaint Details Modal */}

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {selectedComplaint.complaintId}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedComplaint.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedComplaint(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">
                  Category
                </p>

                <p className="mt-1 font-medium">
                  {selectedComplaint.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Priority
                </p>

                <p className="mt-1 font-medium">
                  {selectedComplaint.priority}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <div className="mt-2">
                  <ComplaintStatus
                    status={selectedComplaint.status}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Citizen
                </p>

                <p className="mt-1 font-medium">
                  {selectedComplaint.citizen?.name || selectedComplaint.citizenId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-medium">
                  {selectedComplaint.location?.address || `${selectedComplaint.location?.latitude || ""}, ${selectedComplaint.location?.longitude || ""}`}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Submitted On
                </p>

                <p className="mt-1 font-medium">
                  {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-slate-500">
                Description
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {selectedComplaint.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t pt-6">
              {selectedComplaint.status === "Pending" && (
                <button type="button" onClick={async () => { await changeComplaintStatus(selectedComplaint._id, { status: "Verified", note: "Verified by admin" }); setSelectedComplaint(null); await loadComplaints(); }} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white">Verify</button>
              )}
              {selectedComplaint.status === "Under Verification" && (
                <EvidenceReview
                  complaint={selectedComplaint}
                  onApprove={async () => { await verifyTask(selectedComplaint._id); setSelectedComplaint(null); await loadComplaints(); }}
                  onReject={async () => {
                    const reason = window.prompt("Rejection reason (required)");
                    if (!reason) return;
                    await rejectEvidence(selectedComplaint._id, reason);
                    setSelectedComplaint(null);
                    await loadComplaints();
                  }}
                />
              )}
              {selectedComplaint.status !== "Rejected" && selectedComplaint.status !== "Completed" && (
                <button type="button" onClick={async () => { await changeComplaintStatus(selectedComplaint._id, { status: "Rejected", note: "Rejected by admin" }); setSelectedComplaint(null); await loadComplaints(); }} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700">Reject</button>
              )}
            </div>
            {selectedComplaint.assignedOfficer?.name && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-slate-500">Assigned Officer</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedComplaint.assignedOfficer.name}</p>
                <p className="text-sm text-slate-600">{selectedComplaint.assignedOfficer.department}</p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Assign Officer Modal */}

      {assignComplaint && (
        <AssignOfficerModal
          complaint={assignComplaint}
          onClose={() =>
            setAssignComplaint(null)
          }
          onAssign={handleAssignOfficer}
        />
      )}
    </div>
  );
}


export default ComplaintManagement;