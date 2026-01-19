import jwt from "jsonwebtoken";

export function isUser(req, res, next) {
    try {
        const accessToken = req.cookies?.access_token;
        
        if (!accessToken) {
            return res.status(401).json({
                message: "Access token missing",
            });
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
}
