import rateLimit, { RateLimitRequestHandler, ipKeyGenerator } from "express-rate-limit";

/* General API rate limiter */
const generalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // Remembering the request for 15 minutes
  max: 100, // Limiting each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 / 60) // in minutes
  },
  standardHeaders: true, // Returning rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disabling the `X-RateLimit-*` headers
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime
    const retryAfter = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 1000) : 900 // 15 minutes fallback

    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: retryAfter
    })
  }
})

/* Stricter rate limiter for authentication routes */
const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // Remembering the request for 15 minutes
  max: 5, // Limiting each IP to 5 requests per windowMs for auth routes
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 / 60)
  },
  standardHeaders: true, // Returning rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disabling the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime
    const retryAfter = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 1000) : 900 // 15 minutes fallback

    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please wait before attempting to login or register again.',
      retryAfter: retryAfter
    })
  }
})

/* File upload rate limiter */
const uploadLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000, // Remembering the request for 10 minutes
  max: 10, // Limiting each IP to 10 uploads per 10 minutes
  message: {
    error: 'Too many file uploads, please try again later.',
    retryAfter: Math.ceil(10 * 60 / 60)
  },
  standardHeaders: true, // Returning rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disabling the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // For identifying user
    return req.user?._id.toString() || ipKeyGenerator(req.ip || 'unknown')
  },
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime
    const retryAfter = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 1000) : 600 // 10 minutes fallback

    res.status(429).json({
      error: 'Upload rate limit exceeded',
      message: 'You have uploaded too many files recently. Please wait before uploading again.',
      retryAfter: retryAfter
    })
  }
})

export {
  generalLimiter,
  authLimiter,
  uploadLimiter,
}