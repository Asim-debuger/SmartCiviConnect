Builds a Mongoose/Mongo query filter for complaints.

- `complaintQuery(id)` - Returns `{ _id: id }` if `id` is falsy; if `id` is a valid ObjectId it returns an `$or` matching `_id` or `complaintId`; otherwise it matches only by `complaintId` string.
