Documents work completion evidence validation and redaction rules for staff-uploaded job proof.

- `validateCompletionEvidence` requires recent camera-sourced evidence with GPS coordinates bound to both the assigned staff and complaint; rejects uploads, missing GPS, or mismatched staff.
- `redactEvidenceForViewer` hides work evidence from citizens until the complaint is officer-approved ("Completed" with approved evidence status).
- `isApprovedCompletion` returns true only for officer-approved completed complaints.
