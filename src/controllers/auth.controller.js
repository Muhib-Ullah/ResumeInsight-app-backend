import { registerUserService, loginUserService } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/api.response.js';
    
export const registerUser = async (req, res) => {
    try{
        const { email, name, password } = req.body;
        const serviceResponse = await registerUserService({ email, name, password });
        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
            return res.status(201).json(successResponse('User registered successfully', serviceResponse.data));
        }
    } catch (error) {
        res.status(500).json(errorResponse('An error occurred while registering the user'));
    }
}

export const loginUser = async (req, res) => {
    try {        
        const { email, password } = req.body;
        const serviceResponse = await loginUserService({ email, password });
        if(!serviceResponse.status) {
            return res.status(401).json(errorResponse(serviceResponse.message));
        }
        else {
            return res.status(200).json(successResponse('User logged in successfully', serviceResponse.data));
        }
    } catch (error) {
        res.status(500).json(errorResponse('An error occurred while logging in the user'));
    }
}