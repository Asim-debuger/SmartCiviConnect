# Payment

Mongoose model for payment records tied to complaints and workers, with Razorpay integration fields and status history.

## Subdocuments

- `historySchema` — status history entry with `status`, `note`, `changedBy`, timestamps

## Fields

- `transactionId` — `String`, unique sparse, indexed
- `payeeId` — `String`, required, indexed
- `payerId` — `String`, indexed
- `worker` — `ObjectId` ref `User`
- `complaint` — `ObjectId` ref `Complaint`
- `complaintId` — `String`, indexed
- `createdBy` — `String`
- `approvedBy` — `String`
- `amount` — `Number`, required, min 1 max 500000
- `currency` — `String`, default `INR`
- `purpose` — `String`, default `Workforce payment record`
- `status` — `String` enum payment statuses incl. `Processing | Success`, default `Pending`, indexed
- `paidAt`, `approvedAt`, `orderCreatedAt`, `initiatedAt`, `failedAt`, `cancelledAt`, `refundedAt` — `Date`
- `failureReason` — `String`
- `razorpayOrderId`, `razorpayPaymentId` — `String`, indexed sparse
- `razorpaySignature`, `razorpayRefundId`, `receipt` — `String`
- `history` — `[historySchema]`, default `[]`

## Indexes

- `transactionId`, `payeeId`, `payerId`, `status`, `complaintId`, `razorpayOrderId`, `razorpayPaymentId`
- Compound unique: `{ complaintId: 1, payeeId: 1 }` with partial filter on `complaintId` string type

## Relationships

- References `User` via `worker`.
- References `Complaint` via `complaint`.
