import express from 'express';
import { createJob } from '../controllers/job.controller.js';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticationMiddleware, createJob);

export default router;