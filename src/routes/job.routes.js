import express from 'express';
import { createJob, getAllJobs, getJobById } from '../controllers/job.controller.js';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticationMiddleware, createJob);
router.get('/all', authenticationMiddleware, getAllJobs);
router.get('/:jobId', authenticationMiddleware, getJobById);
//evaluation route left 
export default router;