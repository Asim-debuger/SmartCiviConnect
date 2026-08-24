The officer's complaint workbench for accepting assignments, assigning staff, updating progress, chatting, and verifying evidence.

**Page purpose**
- Lists complaints assigned to the officer and provides controls to accept, assign staff, update progress, reject, verify evidence, and chat with assigned staff.

**Data fetched**
- `getAssignedComplaints()` and `listWorkers({ availability: "All" })` on load.
- `getComplaintMessages`, `sendComplaintMessage` for the per-complaint chat thread.

**State**
- `complaints`, `workers`, `staffIds` (selection per complaint), `filter` (All/Pending/Accepted/Completed), `messages`, `drafts`, `progressById`, `busy`, `loading`, `error`.

**API calls (operationsApi)**
- `acceptOfficerComplaint`, `assignStaffToComplaint`, `updateTask` (progress/status), `rejectComplaint`, `verifyTask`, `rejectEvidence`.

**Role-specific behavior**
- Accept button appears when `operationalStatus === "ASSIGNED"`; progress update when ACCEPTED/IN_PROGRESS.
- `EvidenceReview` component handles verification when `status === "Under Verification"` (approve or reject with reason).
- Chat is available once a staff member is assigned; messages are keyed by complaint id.

**Child components**
- `EvidenceReview` (officer), `Avatar` (via messages), lucide icons (Check, MessageCircle, Send, UserPlus).
