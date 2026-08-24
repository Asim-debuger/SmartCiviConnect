This file defines the main hero section for the application's landing page.

-   **Functionality**: It serves as the primary introduction to the platform, featuring a headline, a descriptive paragraph, and key calls-to-action.
-   **Components**:
    -   **`HeroSection`**: The main component that structures the layout into two columns: a text-based section and a visual section.
        -   It displays dynamic calls-to-action. The "Report an Issue" and "Dashboard" links change based on whether the user is authenticated and what their role is.
        -   It shows a "Login" button for guests and a "Dashboard" button for authenticated users.
    -   **`CityVisual`**: A nested component that acts as a visual element.
        -   It fetches and displays live platform statistics (Pending, In-progress, and Resolved complaints) using the `getPlatformStats` API.
        -   It includes decorative elements to simulate a "City Command View" with a live map and status indicators.