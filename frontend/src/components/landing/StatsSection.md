This file defines a section to display high-level platform statistics.

-   **Functionality**: It provides social proof and demonstrates the platform's activity and scale by showing key metrics.
-   **Data Fetching**: It calls the `getPlatformStats` API to get the latest numbers for complaints, users, completed works, and open jobs.
-   **Content**:
    -   It displays four main statistics in a row.
    -   Each statistic includes an icon, the numerical value, and a descriptive label (e.g., "Complaints managed").
    -   It shows a "—" placeholder while the data is being fetched.