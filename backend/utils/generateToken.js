import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res)=> {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "15d",
    })
    res.cookie('jwt', token, {
      maxAge: parseInt(process.env.JWT_EXPIRATION_MS) || 15 * 24 * 60 * 60 * 1000, // Miliseconds
      httpOnly: true, // Preventing XSS attacks / Cross-site scripting attacks
      saneSite: "strict",
      secure: process.env.NODE_ENV !== "development"
    })
  } catch(error) {
    console.error(`Error generating token: ${error.message}`);
    throw new Error('Token generation failed');
  }
}

export default generateTokenAndSetCookie