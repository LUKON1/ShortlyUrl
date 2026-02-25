const rateLimit = require("express-rate-limit");

const MAX_ATTEMPTS = 240;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: MAX_ATTEMPTS,
  message: {
    error: `Too many login attempts from this IP, please try again after 15 minutes.`,
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
