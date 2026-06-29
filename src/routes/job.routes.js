import express from 'express';
import { createJob, getAllJobs, getJobById, evaluateApplicantByJob, updateJob, cancelJob } from '../controllers/job.controller.js';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { validateJobPosting } from '../middlewares/job.middleware.js';

const router = express.Router();

router.post('/create', authenticationMiddleware, validateJobPosting, createJob);
router.put('/:jobId/update', authenticationMiddleware, validateJobPosting, updateJob);
router.put('/:jobId/cancel', authenticationMiddleware, cancelJob);
router.get('/all', authenticationMiddleware, getAllJobs);
router.get('/:jobId', authenticationMiddleware, getJobById);
router.post('/:jobId/evaluate', authenticationMiddleware, evaluateApplicantByJob);

export default router;