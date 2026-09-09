# publicRoutes

Unauthenticated public endpoints for contact submissions, platform stats, featured content, jobs, posts, and professionals.

## Endpoints

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| POST | /contact | submitContact | rateLimiter |
| GET | /stats | platformStats | — |
| GET | /featured | featured | — |
| GET | /jobs | listPublicJobs | — |
| GET | /jobs/:id | getPublicJob | — |
| GET | /posts | listPublicPosts | — |
| GET | /posts/:id | getPublicPost | — |
| GET | /professionals | listPublicProfessionals | — |
| GET | /professionals/:id | getPublicProfessional | — |
