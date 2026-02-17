const rateLimit = require("express-rate-limit");

const MAX_REQUESTS = 5;

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: `Daily limit reached. You can create up to ${MAX_REQUESTS} links per day.`,
  },
});

module.exports = apiLimiter;
