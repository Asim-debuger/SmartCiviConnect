Configures and exports the Cloudinary SDK for media uploads.

- Imports the `cloudinary` package (v2 SDK) and calls `cloudinary.config()` with credentials from environment variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Enables `secure: true` to serve assets over HTTPS.
- Exports the configured `cloudinary` instance for use in upload routes/services.
