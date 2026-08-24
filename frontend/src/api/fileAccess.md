This file provides a robust client-side solution for securely fetching protected files (like resumes or documents) from the backend.

-   **`fetchProtectedFile(...)`**: This is the main function for accessing protected files.
    -   It constructs the full file URL, including query parameters to indicate a file request (`file=1`) and whether it should be downloaded (`download=1`).
    -   It makes an initial `fetch` request with the user's access token.
    -   If the request fails with a 401 Unauthorized error, it attempts to refresh the access token using the `refreshClient`.
    -   After a successful token refresh, it automatically retries the original file request.
    -   If the response is successful, it reads the response body as a `Blob`.
    -   It extracts the filename from the `content-disposition` header.
    -   It creates a local `Blob URL` (`URL.createObjectURL`) for the file, which can be used as a `src` for images or a link `href` for downloads.
    -   It returns an object containing the `url`, `fileName`, `fileType`, and the `blob` itself.

-   **`revokeFileUrl(url)`**: A utility function to release the memory used by a `Blob URL` once it's no longer needed, preventing memory leaks.

-   **Helper Functions**:
    -   `fileUrl()`: Constructs the complete API URL for a file path.
    -   `rawGet()`: A wrapper around `fetch` that includes credentials and the Authorization header.
    -   `refreshAccessToken()`: Handles the token refresh logic.
    -   `messageFromBlob()`: A utility to parse an error message from a Blob response.