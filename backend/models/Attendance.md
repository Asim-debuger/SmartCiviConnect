# Attendance

Mongoose model tracking daily attendance with check-in/check-out times and locations.

## Fields

- `userId` — `String`, required, indexed
- `date` — `String`, required, indexed
- `checkInAt` — `Date`
- `checkOutAt` — `Date`
- `checkInLocation` — nested `{ latitude: Number, longitude: Number }`
- `checkOutLocation` — nested `{ latitude: Number, longitude: Number }`

## Indexes

- Compound unique: `{ userId: 1, date: 1 }`

## Relationships

- No explicit model references; `userId` is a plain string identifier.
