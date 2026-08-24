This file implements a 5-step wizard for citizens to create and submit a new complaint.

-   **Wizard Steps**: Guides users through Category, Location, Evidence, Details, and Submit stages, with conditional "Back" and "Continue" navigation based on `canNext` validation.
-   **Category Selection**: Offers predefined civic issue categories; triggers a smart suggestion API call (`suggestComplaint`) when the description is long enough.
-   **Location Capture**: Integrates `GpsLocationCapture` to record the complaint's GPS coordinates.
-   **Media Handling**: Allows image/video/document uploads via `MediaUploader` and camera capture via `CameraCapture`; compresses large images client-side before upload.
-   **Form Validation**: Uses `react-hook-form` to validate required fields, title minlength (5), description minlength (20), and category selection.
-   **Submission**: Uploads media files via `uploadComplaintMedia`, then creates the complaint via `createComplaint` with location and media URLs.
