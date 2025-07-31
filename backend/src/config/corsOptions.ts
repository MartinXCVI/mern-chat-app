import { allowedOrigins } from "./allowedOrigins.js"
import { CorsOptions } from "cors"

/*
* CORS (Cross-Origin Resource Sharing) Configuration
* 
* CORS is a security feature that restricts web pages from making requests
* to a different domain than the one serving the web page. This configuration
* defines which origins are allowed to access the API.
*/
const corsOptions: CorsOptions = {
  // Allowed origins for cross-origin requests
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
     if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allwed by CORS'))
    }
  },
  // Allow cookies and authentication headers
  credentials: true,
  // Status code for successful OPTIONS requests
  optionsSuccessStatus: 200,
  // HTTP methods allowed for cross-origin requests 
  // Explicitly listing methods follows the principle of least privilege.
  methods: ['GET', 'POST'],
  // Pass control to next handler after preflight
  // Set to false so CORS handles preflight requests completely
  preflightContinue: false,
}

export default corsOptions