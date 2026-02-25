const rateLimit = require("express-rate-limit");

const MAX_REGISTRATIONS = 40;

const regLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: MAX_REGISTRATIONS,
  message: {
    error: `Too many accounts created from this IP, please try again later.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = regLimiter;
