import { errorResponse } from "../utils/api.response.js";

export const registerMiddleware = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, name, password } = req.body;

    // Register User Middleware Validation Checks
    if(!email || !name || !password) {
        return res.status(400).json(errorResponse('Please fill in all mandatory fields'));
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json(errorResponse('Invalid email address. Please check and try again'));
    }

    if (password.length < 6 || password.length > 20) {
        return res.status(400).json(errorResponse('Password must be between 6 and 20 characters long'));
    }

    next();
}

export const loginMiddleware = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, password } = req.body; 

    //Login User Middleware Validation Checks
    if(!email || !password) {
        return res.status(400).json(errorResponse('Please fill in all mandatory fields'));
    }
    
    if (!emailRegex.test(email)) {
        return res.status(400).json(errorResponse('Invalid email address. Please check and try again'));
    }

    next();
}

export const authenticationMiddleware = (req, res, next) => {
    //Verify JWT Token for validation and authentication of user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(errorResponse('Authorization header missing or malformed'));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json(errorResponse('Invalid or expired token'));
    }
}
