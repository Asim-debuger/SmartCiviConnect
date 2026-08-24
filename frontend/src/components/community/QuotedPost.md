This file defines a component to display a "quoted" or embedded post within another post.

-   **Functionality**: It renders a compact, read-only version of a post, typically when it's being shared or reposted.
-   **Props**: It takes an `original` post object as a prop.
-   **Content Display**:
    -   If the original post is deleted or unavailable, it shows a placeholder message.
    -   It displays the original author's `Avatar`, name, and headline.
    -   It shows the body text of the original post.
    -   It uses the `PostMedia` component to render any associated media.
    -   It includes a link to view the full original post.