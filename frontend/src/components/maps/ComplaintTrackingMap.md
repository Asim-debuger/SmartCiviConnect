This file defines a React component that renders a Google Map to visualize the live tracking of a complaint.

-   **Functionality**: It displays the location of a complaint, the current location of the assigned staff member, and the route between them.
-   **API Integration**: It uses the `@react-google-maps/api` library to interact with the Google Maps API. The API key is loaded securely from environment variables.
-   **Props**:
    -   `complaintLocation`: An object with `lat` and `lng` for the complaint's location. This is the center of the map.
    -   `staffLocation`: An optional object with `lat` and `lng` for the staff member's current location.
    -   `directions`: An optional Google Maps Directions result object to render the route on the map.
-   **Components**:
    -   **`GoogleMap`**: The main map container.
    -   **`Marker`**: It renders two markers: one labeled "C" for the complaint and another labeled "S" for the staff member (if their location is provided).
    -   **`DirectionsRenderer`**: If `directions` data is passed, this component draws the polyline route on the map.
-   **Loading State**: It displays a "Loading Map..." message while the Google Maps script is being loaded.