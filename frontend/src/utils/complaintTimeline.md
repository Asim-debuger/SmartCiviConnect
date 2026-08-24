# complaintTimeline.js

Utilities for representing a complaint's progress through a fixed operational timeline.

- **Constants**
  - `COMPLAINT_TIMELINE_STEPS` — ordered list of ten lifecycle stages from `Created` through `Completed`.
- **complaintTimelineIndex(complaint)**
  - Returns the index of the current timeline step based on `status`, `operationalStatus`, `workEvidence`, and assigned officer/staff fields.
  - Special cases: `Rejected` maps to `0`; `Completed` maps to `9`; `Under Verification` maps to `8`; presence of `workEvidence` maps to `7`, etc.
- **payloadMatchesComplaint(payload, complaint, routeId)**
  - Returns `true` if the payload references the complaint by `_id`, `complaintId`, `id`, nested `complaint._id`, or matching `staffId` to `assignedStaffId`.
