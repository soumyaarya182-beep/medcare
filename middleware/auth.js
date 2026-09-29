const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    try {

        // Get Authorization header
        const authHeader =
            req.headers.authorization || "";

        // Expected format:
        // Authorization: Bearer YOUR_TOKEN

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "Authentication required."
            });

        }


        // Extract token
        const token =
            authHeader.substring(7);


        if (!token) {

            return res.status(401).json({
                message: "Authentication token missing."
            });

        }


        // Verify JWT
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store user ID in request
        req.userId =
            decoded.userId;


        // Continue to requested route
        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                message: "Your session has expired. Please login again."
            });

        }


        return res.status(401).json({
            message: "Invalid authentication token."
        });

    }
}


module.exports = auth;