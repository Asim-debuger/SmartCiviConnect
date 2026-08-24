This file defines functions for accessing public-facing data that does not require user authentication. This is useful for landing pages, public job boards, and general platform statistics.

-   **Public Content**:
    -   `listPublicJobs(params)`: Fetches a list of publicly visible jobs.
    -   `listPublicProfessionals(params)`: Fetches a list of public professional profiles.
    -   `getPublicProfessional(id)`: Retrieves a single public professional profile.
    -   `getPublicJob(id)`: Retrieves a single public job posting.
    -   `listPublicPosts(params)`: Fetches a list of public posts.
    -   `getPublicPost(id)`: Retrieves a single public post.

-   **Platform Data**:
    -   `getPlatformStats()`: Fetches general statistics about the platform (e.g., user count, number of jobs).
    -   `getFeatured()`: Retrieves featured content, such as featured jobs or professionals.