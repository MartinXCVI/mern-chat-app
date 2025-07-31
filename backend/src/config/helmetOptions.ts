import { HelmetOptions } from "helmet";
import { CLIENT_URL, SERVER_URL } from "./env.js";

/*
* Helmet.js Security Configuration
*
* A collection of middleware functions that help secure Express apps
* by setting various HTTP security headers and
* protecting them against well-known web vulnerabilities
*/
const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"], // Allow data URIs and HTTPS images
      connectSrc: [
        "'self'",
        CLIENT_URL,
        // Socket.IO connection patterns
        "ws:", 
        "wss:",
        // Allow WebSocket connections to the server
        `ws:${SERVER_URL}`,
        `wss:${SERVER_URL}`
      ], // Allow connections to your client
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disabling COEP for Socket.IO compatibility
  crossOriginOpenerPolicy: false, // Disable COOP for Socket.IO compatibility
  // Configure HSTS (HTTP Strict Transport Security) - only for production HTTPS
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  } : false, // Disabling HSTS in development (HTTP)
  crossOriginResourcePolicy: false // Disable some policies that might interfere with Socket.IO
}
// End of helmetOptions

export default helmetOptions