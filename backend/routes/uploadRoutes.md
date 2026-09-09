# uploadRoutes

Authenticated endpoints for generating signed upload URLs for general files and resumes.

## Endpoints

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /signature | createUploadSignature | authenticateUser |
| GET | /resume-signature | createResumeSignature | authenticateUser |
