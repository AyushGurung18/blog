// authMiddleware.js
require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
console.log(secret);

const verifyToken = (req, res, next) => {  
     console.log("verifytoken");
     const token = req.cookies.token; // Look for the token in the cookie
     console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }
    else { jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      } else {
        req.userId = decoded.userId;
        console.log('User ID:', req.userId);
        return res.status(200).json({ message: 'You are Verified' });
      }})
      
}};

module.exports = verifyToken;
