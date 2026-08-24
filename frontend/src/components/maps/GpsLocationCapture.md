This file defines a component for capturing the user's precise, live GPS location.

-   **Functionality**: It provides a secure way to get a user's current coordinates, enforcing that the location comes directly from the device's GPS. Manual address entry or map picking is explicitly disallowed.
-   **Props**: It acts as a controlled component, receiving `value` (the current location object) and an `onChange` callback to pass the new location data to its parent.
-   **Geolocation API**:
    -   It uses `navigator.geolocation.getCurrentPosition` with `enableHighAccuracy` to request the most precise coordinates possible.
    -   It handles various success and error states, providing clear feedback to the user (e.g., permission denied, timeout, GPS unavailable).
-   **Reverse Geocoding**:
    -   Upon successfully capturing coordinates, it calls the OpenStreetMap (Nominatim) API to perform reverse geocoding, converting the latitude and longitude into a human-readable address.
-   **User Interface**:
    -   It displays a "Get Current Location" button.
    -   While fetching, it shows loading and status messages like "Locating..." or "Resolving address...".
    -   Once captured, it displays the coordinates, the formatted address, a link to open the location in Google Maps, and an embedded Google Maps `iframe` for a visual preview.