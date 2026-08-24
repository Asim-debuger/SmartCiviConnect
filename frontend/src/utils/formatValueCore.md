# formatValueCore.js

Core, framework-agnostic formatting utilities for locations, arbitrary values, and map centers.

- **formatLocation(value)**
  - Accepts an object with `address`/`formattedAddress`, `latitude`/`lat`, `longitude`/`lng`/`lon`, and optional `mapsUrl`.
  - Returns an object `{ address, latitude, longitude, mapsUrl }` or a string fallback `"—"`.
- **displayValue(value)**
  - Accepts null, primitives, arrays, or objects and returns a human-readable string.
  - Handles arrays, name-only objects, education objects (`degree`, `school`, `year`), certificate objects (`issuer`), and location objects.
- **mapCenter(location)**
  - Extracts valid numeric `{ lat, lng }` from a location object or returns `null`.
