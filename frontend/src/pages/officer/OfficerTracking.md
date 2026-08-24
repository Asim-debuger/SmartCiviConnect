The officer's live tracking page showing field staff locations pushed over websockets.

**Page purpose**
- Displays a live list of staff who are currently sharing their GPS location, updated in real time.

**Data fetched**
- `getLiveLocations()` for the initial location snapshot.

**Real-time (socket)**
- Uses `useSocket()` and listens for `location:update` and `location:updated` events.
- On each update, upserts the staff member's latest `lastLocation` (latitude/longitude/updatedAt) by `staffId`.

**State**
- `locations`, `error`.

**Display**
- Each card shows the worker name and latest coordinates with timestamp; empty state when no staff are sharing.

**Role-specific behavior**
- Read-only visibility for officers/admins; location is only present when staff have enabled sharing.
