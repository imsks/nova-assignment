// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken")
require("dotenv").config()

const authMiddleware = (rolesAllowed = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ message: "Failed to authenticate token" })
            }

            // Check for role-based access
            if (rolesAllowed.length && !rolesAllowed.includes(decoded.role)) {
                return res.status(403).json({
                    message: "Access forbidden: insufficient privileges"
                })
            }

            req.user = decoded // { id, email, role }
            next()
        })
    }
}

module.exports = authMiddleware
