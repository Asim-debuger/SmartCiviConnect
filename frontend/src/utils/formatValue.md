# formatValue.jsx

React-aware formatting utilities and components for displaying arbitrary values, locations, and map links.

- **Re-exports**
  - `displayValue`, `formatLocation`, `mapCenter` from `formatValueCore`.
- **LocationBlock({ value })**
  - React component that renders a formatted location: address, latitude/longitude, and an `"Open map"` link if a maps URL is available.
- **safeChild(value)**
  - Normalizes a value for safe rendering inside React children: returns `"—"` for null/empty, passes through valid React elements, formats objects via `displayValue`, or returns the raw primitive.
