Declares the backend package metadata, scripts, and dependencies.

- Name `backend`, version `1.0.0`, main entry `server.js`.
- Scripts: `start` (`node server.js`), `dev` (`nodemon server.js`), `test` (`node --test tests/`).
- Runtime dependencies by purpose:
  - Web framework: `express` v5, `cookie-parser`, `cors`.
  - Security: `helmet`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`.
  - Database: `mongoose`.
  - Media: `cloudinary`.
  - Email: `@getbrevo/brevo`, `nodemailer`.
  - Real-time: `socket.io`.
  - Config: `dotenv`.
- Dev dependency: `nodemon`.
