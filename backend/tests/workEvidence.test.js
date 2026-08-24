const test = require("node:test");
const assert = require("node:assert/strict");
const { validateCompletionEvidence, redactEvidenceForViewer, isApprovedCompletion } = require("../utils/workEvidence");

function cameraItem(overrides = {}) {
  return {
    url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    source: "camera",
    capturedAt: new Date().toISOString(),
    latitude: 18.52,
    longitude: 73.85,
    staffId: "staff-1",
    complaintId: "SCC-1",
    ...overrides,
  };
}

test("completion evidence requires recent camera GPS bound to staff and complaint", () => {
  assert.equal(validateCompletionEvidence([cameraItem()], { staffId: "staff-1", complaintId: "SCC-1" }).ok, true);
  assert.equal(validateCompletionEvidence([{ url: "https://x", source: "upload" }], { staffId: "staff-1", complaintId: "SCC-1" }).ok, false);
  assert.equal(validateCompletionEvidence([cameraItem({ latitude: undefined, longitude: undefined })], { staffId: "staff-1", complaintId: "SCC-1" }).ok, false);
  assert.equal(validateCompletionEvidence([cameraItem({ staffId: "other" })], { staffId: "staff-1", complaintId: "SCC-1" }).ok, false);
});

test("citizens only receive evidence after officer-approved completion", () => {
  const pending = { status: "Under Verification", workEvidence: [cameraItem()] };
  const approved = { status: "Completed", verifiedAt: new Date(), evidenceStatus: "approved", workEvidence: [cameraItem()] };
  const citizen = { role: "Citizen", _id: "c1" };
  assert.equal(redactEvidenceForViewer(pending, citizen).workEvidence.length, 0);
  assert.equal(redactEvidenceForViewer(approved, citizen).workEvidence.length, 1);
  assert.equal(isApprovedCompletion(approved), true);
});
