Generates Cloudinary signed upload parameters so clients can upload complaint media and resumes directly to Cloudinary.

- `createUploadSignature` — Returns a timestamp, folder (`smartciviconnect/complaints/<userId>`), signature, cloud name, and API key for a direct complaint-media upload signed with the Cloudinary API secret.
- `createResumeSignature` — Returns signed parameters (folder per-user resume folder, `authenticated` type, allowed formats `pdf,doc,docx`, `raw` resource type) for a direct resume upload.
