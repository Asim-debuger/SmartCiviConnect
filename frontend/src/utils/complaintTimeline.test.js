import assert from "node:assert/strict";
import test from "node:test";
import { complaintTimelineIndex, payloadMatchesComplaint } from "./complaintTimeline.js";

test("timeline advances through operational statuses", () => {
  assert.equal(complaintTimelineIndex({ status: "Pending" }), 0);
  assert.equal(complaintTimelineIndex({ status: "Verified" }), 1);
  assert.equal(complaintTimelineIndex({ status: "Assigned", assignedOfficerId: "o1" }), 2);
  assert.equal(complaintTimelineIndex({ assignedStaffId: "s1" }), 3);
  assert.equal(complaintTimelineIndex({ operationalStatus: "ACCEPTED" }), 4);
  assert.equal(complaintTimelineIndex({ status: "Under Verification", operationalStatus: "COMPLETED" }), 8);
  assert.equal(complaintTimelineIndex({ status: "Completed" }), 9);
});

test("socket payloads match civic or mongo ids", () => {
  const complaint = { _id: "abc", complaintId: "SCC-1", assignedStaffId: "staff-1" };
  assert.equal(payloadMatchesComplaint({ complaintId: "SCC-1" }, complaint, "abc"), true);
  assert.equal(payloadMatchesComplaint({ staffId: "staff-1", latitude: 1 }, complaint, "abc"), true);
  assert.equal(payloadMatchesComplaint({ complaintId: "other" }, complaint, "abc"), false);
});
