This file defines a comprehensive component for field staff to capture and submit evidence directly from their device.

-   **Functionality**: It provides an all-in-one interface for capturing time-stamped and geo-tagged photo or video evidence for a complaint.
-   **Device API Integration**:
    -   **Camera**: It uses `navigator.mediaDevices.getUserMedia` to access the device's rear camera for a live feed.
    -   **GPS**: It uses `navigator.geolocation.getCurrentPosition` with high accuracy to fetch and stamp the evidence with precise coordinates.
-   **Capture Modes**:
    -   **Photo**: Captures a high-quality JPEG image from the live video stream using a `<canvas>`.
    -   **Video**: Uses the `MediaRecorder` API to record a video clip.
-   **Workflow**:
    1.  The component starts the camera and acquires a GPS lock.
    2.  The staff member captures a photo or records a video.
    3.  A preview of the captured media is shown.
    4.  The user can choose to "Submit evidence" or "Delete / retake".
    5.  On submission, the file is uploaded via `uploadComplaintMedia`, combined with the GPS data and other metadata (like capture time), and the final evidence object is passed to the `onSubmit` prop.
-   **UI**: It includes controls for switching between photo/video modes, capturing/recording, previewing, and submitting, along with user feedback for progress and errors.