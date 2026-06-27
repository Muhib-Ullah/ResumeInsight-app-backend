import express from 'express';
import { uploadResume, validateApplication } from '../middlewares/apply.middleware.js';
import { applyForJob } from '../controllers/apply.controller.js';

const router = express.Router();

router.post('/:token', uploadResume, validateApplication, applyForJob);

export default router;
