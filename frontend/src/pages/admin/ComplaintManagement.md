Provides a full complaint management interface for reviewing, verifying, assigning, and monitoring civic complaints.

- **Data fetched**: Calls `getAdminComplaints` to load all complaints.
- **State**: Tracks `complaints`, `loading`, `error`, filter criteria (`search`, `status`, `category`), selected complaint for detail view, and complaint selected for officer assignment.
- **Filtering**: Uses `useMemo` to filter complaints by search text (complaint ID or title), status, and category.
- **Child components used**: `ComplaintFilter`, `ComplaintTable`, `AssignOfficerModal`, `ComplaintStatus`, `EvidenceReview`.
- **Actions**: Allows verifying pending complaints, rejecting complaints, viewing complaint details in a modal, assigning officers to complaints, and reviewing evidence for complaints under verification.
- **API calls**: `getAdminComplaints`, `assignComplaint`, `changeComplaintStatus`, `verifyTask`, `rejectEvidence`.
