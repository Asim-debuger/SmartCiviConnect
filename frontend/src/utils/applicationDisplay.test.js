import assert from "node:assert/strict";
import test from "node:test";
import { applicationDocuments, formatMixed } from "./applicationDisplay.js";

test("application documents ignore empty snapshot arrays", () => {
  const docs = [{ index: 0, name: "ID.pdf", fileName: "ID.pdf" }];
  assert.equal(applicationDocuments({ snapshot: { documents: [] }, documents: docs }).length, 1);
  assert.equal(applicationDocuments({ snapshot: { documents: docs } }).length, 1);
});

test("formatMixed renders education and experience objects", () => {
  assert.match(formatMixed([{ degree: "BE", school: "COEP", year: "2024" }]), /COEP/);
  assert.match(formatMixed([{ title: "Intern", organization: "PMC", years: "1" }]), /PMC/);
});
