Generates sequential complaint IDs.

- `nextComplaintId()` - Returns the next complaint ID string in the format `SCC-<year>-<00001>` by atomically incrementing a per-year `Counter` document in MongoDB.
