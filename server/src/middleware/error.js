export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (res.headersSent) return;

  let status = err.status || 500;
  let message = err.message || 'Something went wrong on our side.';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'That identifier is not valid.';
  }

  if (err.code === 11000) {
    status = 409;
    message = 'That email is already registered.';
  }

  if (status >= 500) {
    console.error('[api]', err);
  }

  res.status(status).json({ message });
}
