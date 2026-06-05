const rateLimit = require("express-rate-limit");
const { logger } = require("../config/logger");

// General rate limiter — all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  handler: (req, res, next, options) => {
    logger.warn("RATE_LIMIT_EXCEEDED", {
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
    res.status(429).json(options.message);
  },
});

// Strict limiter for login — prevents brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 login attempts per 15 mins
  message: {
    success: false,
    error:
      "Too many login attempts. Account temporarily locked for 15 minutes.",
  },
  handler: (req, res, next, options) => {
    logger.error("BRUTE_FORCE_DETECTED", {
      ip: req.ip,
      email: req.body.email || "unknown",
      timestamp: new Date().toISOString(),
      action: "Login blocked for 15 minutes",
    });
    res.status(429).json(options.message);
  },
});

// API rate limiter — for API key endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 API calls per minute
  message: {
    success: false,
    error: "API rate limit exceeded. Max 30 requests per minute.",
  },
});

module.exports = { generalLimiter, loginLimiter, apiLimiter };
