import app from '../server/src/app.js';

/**
 * Vercel serverless entry point.
 *
 * `vercel.json` rewrites every `/api/*` request here, and the Express app keeps
 * its full `/api/...` paths. Database connection and seeding are handled by the
 * readiness middleware inside the app, cached across warm invocations.
 */
export default function handler(req, res) {
  return app(req, res);
}
