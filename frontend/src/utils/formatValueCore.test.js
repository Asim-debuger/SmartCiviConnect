import assert from "node:assert/strict";
import test from "node:test";
import { displayValue, formatLocation, mapCenter } from "./formatValueCore.js";

test("location objects are not rendered as raw objects", () => {
  const location = formatLocation({ address: "Sector 17", latitude: 30.73, longitude: 76.78 });
  assert.equal(typeof location, "object");
  assert.equal(location.address, "Sector 17");
  assert.match(location.mapsUrl, /maps\?q=30\.73/);
  assert.equal(displayValue({ name: "Asha" }), "Asha");
  assert.equal(displayValue({ latitude: 1, longitude: 2 }), "1, 2");
});

test("mapCenter ignores incomplete coordinates", () => {
  assert.equal(mapCenter(null), null);
  assert.deepEqual(mapCenter({ latitude: 30.1, longitude: 76.2 }), { lat: 30.1, lng: 76.2 });
});
