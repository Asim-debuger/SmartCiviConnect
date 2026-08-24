This file defines a component for rendering different types of media within a post.

-   **Functionality**: It takes an array of media objects and intelligently renders each one based on its `resourceType`.
-   **Props**:
    -   `media`: An array of media objects, where each object contains a `url` and a `resourceType`.
    -   `documentsLabel`: A fallback label for documents that don't have a specific name.
-   **Rendering Logic**:
    -   If `resourceType` is "video", it renders a `<video>` element.
    -   If `resourceType` is "image", it renders an `<img>` element.
    -   For any other type, it renders an `<a>` tag, treating it as a downloadable document.
-   **Usage**: This component is used to display images, videos, or attached files in a post or comment.