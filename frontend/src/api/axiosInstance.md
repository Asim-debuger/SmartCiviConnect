This file configures a centralized Axios instance for handling API requests throughout the application.

-   **Base Configuration**: It initializes two `axios` instances, `api` and `refreshClient`. Both are configured with a `baseURL` derived from environment variables (defaulting to `http://localhost:5000/api`), to send credentials with requests (`withCredentials: true`), and to use JSON content type.

-   **Authorization Header**: An `api` request interceptor automatically attaches a JWT `Authorization` header from `localStorage` to outgoing requests, unless the request is to a public authentication path like login or register.

-   **Token Refresh Logic**: A response interceptor on the `api` instance handles API calls that fail with a 401 Unauthorized status due to an expired token.
    -   It detects token expiration by checking the status code and error messages.
    -   To prevent multiple simultaneous refresh attempts, it uses a shared promise (`refreshPromise`).
    -   It calls the `/auth/refresh` endpoint using `refreshClient` to get a new access token.
    -   Upon successful refresh, it updates the `accessToken` in `localStorage`, updates the original request's authorization header, and retries the request.
    -   If the refresh fails, it logs the user out by clearing their data from `localStorage` and redirects them to the login page if they are on a private route.

-   **Error Handling**: It includes logic to parse error responses that are returned as a `Blob`, attempting to convert them into a JSON object for consistent error handling.