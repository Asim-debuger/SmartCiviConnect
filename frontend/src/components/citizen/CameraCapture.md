This file defines a component for capturing photos directly from the user's device camera.

-   **Functionality**: It provides a user interface to open the device camera, capture a photo, and preview it.
-   **State Management**: It uses `useState` to manage the camera's open state (`cameraOpen`) and the URI of the captured image (`capturedImage`).
-   **Camera Access**:
    -   The `startCamera` function uses `navigator.mediaDevices.getUserMedia` to request access to the device's rear camera (`facingMode: "environment"`).
    -   The camera stream is attached to a `<video>` element for live preview.
-   **Capture Logic**:
    -   The `capturePhoto` function draws the current frame from the video onto a hidden `<canvas>` element.
    -   It then converts the canvas content to a JPEG `Blob` and creates a `File` object from it.
    -   The captured file is passed to the parent component via the `onCapture` prop.
-   **Lifecycle**: It uses the `useEffect` hook to ensure the camera stream is stopped (`stopCamera`) when the component is unmounted, releasing the camera resource.