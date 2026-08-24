This file manages all API calls related to the social networking and community features of the platform.

-   **Connections**:
    -   `listPeople(params)`: Fetches a list of users on the network.
    -   `listConnections()`: Gets the current user's connections.
    -   `requestConnection(userId)`: Sends a connection request to another user.
    -   `respondConnection(id, status)`: Accepts or declines a connection request.
    -   `removeConnection(id)`: Removes an existing connection.

-   **Profiles & Following**:
    -   `getPublicProfile(id)`: Fetches a user's public profile.
    -   `toggleFollow(userId)`: Follows or unfollows a user.
    -   `listFollows(params)`: Lists users that the current user is following or is followed by.
    -   `listRecommendations()`: Fetches recommended users to connect with.

-   **Feed & Posts**:
    -   `listFeed(params)`: Fetches the user's content feed.
    -   `listTrending()`: Gets trending posts.
    -   `listSavedPosts()`: Retrieves posts saved by the user.
    -   `createPost(payload)`: Creates a new post.
    -   `likePost(id)`: Likes or unlikes a post.
    -   `commentPost(id, body, commentId)`: Adds a comment or reply to a post.
    -   `sharePost(id, body)`: Shares a post.
    -   `deletePost(id)`: Deletes a post.
    -   `likeComment(id, commentId)`: Likes a comment on a post.
    -   `savePost(id)`: Saves or unsaves a post.