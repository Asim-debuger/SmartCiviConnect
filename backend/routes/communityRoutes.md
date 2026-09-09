# communityRoutes

Community features including job postings, professional networking, social feed, and direct messaging.

## Jobs

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /jobs | listJobs | authenticateUser |
| POST | /jobs | createJob | authenticateUser + Admin, Super Admin, Head Officer |
| GET | /jobs/applications/mine | myApplications | authenticateUser |
| GET | /jobs/applications/:applicationId/resume | accessApplicationResume | authenticateUser |
| GET | /jobs/applications/:applicationId/documents/:index | accessApplicationDocument | authenticateUser |
| GET | /jobs/applications/:applicationId | getApplication | authenticateUser |
| PATCH | /jobs/applications/:applicationId/materials | updateApplicationMaterials | authenticateUser |
| PATCH | /jobs/applications/:applicationId | updateApplication | authenticateUser + Admin, Super Admin, Head Officer |
| GET | /jobs/:id | getJob | authenticateUser |
| PATCH | /jobs/:id | updateJob | authenticateUser + Admin, Super Admin, Head Officer |
| POST | /jobs/:id/apply | apply | authenticateUser |
| GET | /jobs/:id/applications | listApplications | authenticateUser + Admin, Super Admin, Head Officer |

## Network

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /network/people | listDirectory | authenticateUser |
| GET | /network/recommendations | recommendPeople | authenticateUser |
| GET | /network/connections | listConnections | authenticateUser |
| POST | /network/connections | requestConnection | authenticateUser |
| PATCH | /network/connections/:id | respondConnection | authenticateUser |
| GET | /network/follows | listFollows | authenticateUser |
| POST | /network/follow | toggleFollow | authenticateUser |
| GET | /network/profile/:id | getPublicProfile | authenticateUser |
| DELETE | /network/connections/:id | removeConnection | authenticateUser |

## Feed

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /feed/trending | trendingPosts | authenticateUser |
| GET | /feed/saved | savedPosts | authenticateUser |
| GET | /feed | listFeed | authenticateUser |
| POST | /feed | createPost | authenticateUser |
| POST | /feed/:id/like | likePost | authenticateUser |
| POST | /feed/:id/comment | commentPost | authenticateUser |
| POST | /feed/:id/comments/like | likeComment | authenticateUser |
| POST | /feed/:id/share | sharePost | authenticateUser |
| POST | /feed/:id/save | savePost | authenticateUser |
| DELETE | /feed/:id | deletePost | authenticateUser |

## Inbox

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /inbox | listConversations | authenticateUser |
| POST | /inbox | openConversation | authenticateUser |
| GET | /inbox/:id/messages | listMessages | authenticateUser |
| POST | /inbox/:id/messages | sendMessage | authenticateUser |
