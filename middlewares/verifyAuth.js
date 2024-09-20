const jwt = require("jsonwebtoken");

const verifyAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: " Unauthorized or No Token Required"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized or Invalid Token"
            });
        }
        req.userID = decoded.userID;
        next();
    } catch (error) {
        console.log("Server Error Verify Token", error);
        return res.status(500).json({
            success: false,
            message: "Server Error Verify Token",
            error
        });
    }
}

module.exports = verifyAuth;