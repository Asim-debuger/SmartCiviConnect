Validates, sanitizes, and redacts work evidence items for complaint workflows.

- `sanitizeEvidenceItem(item, { staffId, complaintId })` - Normalizes a raw evidence object into a safe shape with `url`, `publicId`, `resourceType`, `phase`, `name`, timestamps, GPS coordinates, duration, and ownership IDs.
- `sanitizeEvidenceList(list, ctx)` - Maps and filters an array through `sanitizeEvidenceItem`.
- `evidenceIsRecent(item)` - Returns true if the evidence was captured within the last 24 hours.
- `evidenceHasGps(item)` - Returns true if the item has finite latitude and longitude.
- `validateCompletionEvidence(list, { staffId, complaintId })` - Ensures at least one recent camera-captured evidence item exists with matching staff/complaint IDs and valid GPS; returns `{ ok, items }` or `{ ok, message }`.
- `isApprovedCompletion(complaint)` - Returns true if the complaint is `Completed` and has `verifiedAt` or `evidenceStatus === "approved"`.
- `redactEvidenceForViewer(complaint, user)` - Returns the complaint with `workEvidence` cleared if the viewer is not privileged and the complaint is not an approved completion.
