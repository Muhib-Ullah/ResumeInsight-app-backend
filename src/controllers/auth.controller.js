import { registerUserService, loginUserService } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/api.response.js';
    
export const registerUser = async (req, res) => {
    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { email, name, password } = req.body;

        // Validation checks before proceeding with user registration
        if(!email || !name || !password) {
            return res.status(400).json(errorResponse('Please fill in all mandatory fields'));
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json(errorResponse('Please enter a valid email address'));
        }
        if (password.length < 6) {
            return res.status(400).json(errorResponse('Password must be at least 6 characters long'));
        }
        
        //proceed to call service function to register user
        const serviceResponse = await registerUserService({ email, name, password });
        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        }
        else {
            return res.status(201).json(successResponse('User registered successfully', serviceResponse.data));
        }
    }
    
    catch (error) {
        res.status(500).json(errorResponse('An error occurred while registering the user'));
    }
}

export const loginUser = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { email, password } = req.body; 

        //Validation checks before proceeding with user login
        if(!email || !password) {
            return res.status(400).json(errorResponse('Please fill in all mandatory fields'));
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json(errorResponse('Please enter a valid email address'));
        }
        
        //proceed to call service function to login user
        const serviceResponse = await loginUserService(email, password);
        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        }
        else {
            return res.status(200).json(successResponse('User logged in successfully', serviceResponse.data));
        }

    }
    catch (error) {
        res.status(500).json(errorResponse('An error occurred while logging in the user'));
    }
}