import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import {registerMiddleware, loginMiddleware} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerMiddleware, registerUser);
router.post('/login', loginMiddleware, loginUser);

export default router;