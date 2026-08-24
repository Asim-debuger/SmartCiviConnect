The staff live-location sharing page with start/stop tracking, coordinate display, and a Google Maps embed.

**Page purpose**
- Lets field staff share their live GPS location during assigned work and view it on a map; broadcasts updates to officers via socket.

**Data fetched / side effects**
- `getAssignedComplaints()` collects assigned complaint ids used to tag location updates.
- `updateStaffLocation({ latitude, longitude, sharing, complaintId })` persists location and sharing state.
- `socket.emit("location:update", { latitude, longitude, complaintId })` broadcasts to the socket server for each assigned complaint.

**State**
- `location` (lat/lng/accuracy/updatedAt), `isSharing`, `error`, `loadingLocation`, `assignedIds`.
- `watchIdRef` holds the geolocation watch handle; cleared on unmount or stop.

**Geolocation behavior**
- `getCurrentLocation` does a one-off high-accuracy fix; `startSharingLocation` starts a continuous `watchPosition`; `stopSharingLocation` clears the watch and sets `sharing: false`.
- `handleLocationError` maps geolocation error codes (permission/availability/timeout) to user messages.

**Display**
- Location Sharing status card (Live/Not Sharing), coordinate cards, error banner, and a Google Maps iframe + "Open in Google Maps" link. `LocationCard` is a small presentational helper.

**Child components**
- `useSocket` hook; lucide icons MapPin, Navigation, Play, Square, LocateFixed, AlertCircle.
