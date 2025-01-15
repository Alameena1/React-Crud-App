import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    
    const token = req.cookies.access_token || req.cookies.admin_access_token;

    if (!token) {
        return next(errorHandler(401, "You are not authenticated"));
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
     

        if (err) {
            return next(errorHandler(403, "Token is not valid"));
            
        }

        
        req.user = user;

        next(); 
    });
    console.log("fdfdsfdsfsdfsd")
    
};


export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(errorHandler(403, "Admin access required"));
    }

    // Proceed to the next middleware or route handler if authorized
    next();
};
