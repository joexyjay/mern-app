import jwt from "jsonwebtoken";
import  errorHandler  from "./error.js";
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) return next(errorHandler("You are not authorized to perform this action", 401))
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Token"
                })
            }
            req.user = user;
            next();
        })

    } catch (error) {
        next(error);
    }
}