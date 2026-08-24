# applicationDisplay.js

Utility functions for formatting job-application or education/experience data and extracting associated documents.

- **formatMixed(value)**
  - Accepts `string`, `Array`, or empty/null.
  - For arrays, maps items to readable strings using patterns for education (`degree`, `school`, `year`), experience (`title`, `organization`, `years`), and certificates (`name`, `issuer`, `year`), joined by `"; "`.
- **applicationDocuments(item)**
  - Returns the documents array from `item.snapshot.documents` if present, otherwise from `item.documents`, otherwise `[]`.
