import { createJobService, getAllJobsService, getJobByIdService, evaluateApplicants, updateJobService, cancelJobService } from '../services/job.service.js';
import { errorResponse, successResponse } from '../utils/api.response.js';

export const createJob = async (req, res) => {
    try{
        const { title, description, deadline } = req.body;
        const {hrId} = req.user; 
        
        const serviceResponse = await createJobService({ title, description, deadline, hrId });

        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
                return res.status(201).json(successResponse('Job created successfully', serviceResponse.data));
            }
        } catch (error) {
        res.status(500).json(errorResponse('An error occurred while creating the job'));
    }
};

export const updateJob = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const { hrId } = req.user; 
        const { jobId } = req.params;
        
        const serviceResponse = await updateJobService({ title, description, deadline, hrId, jobId });

        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
            return res.status(201).json(successResponse('Job updated successfully', serviceResponse.data));
        }
    } catch (error) {
        res.status(500).json(errorResponse('An error occured while updating the job'));
    }
};

export const cancelJob = async (req, res) => {
    try {
        const { hrId } = req.user;
        const { jobId } = req.params;

        const serviceResponse = await cancelJobService({ hrId, jobId });
        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
            return res.status(200).json(successResponse('Job marked cancelled successfully', serviceResponse.data));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('An error occured while marking \'cancelled\' this job'));
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const {hrId} = req.user;
        const serviceResponse = await getAllJobsService({ hrId });

        if((!serviceResponse.status)) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
            return res.status(200).json(successResponse('Jobs fetched successfully', serviceResponse.data));
        }
    } catch (error) {
        res.status(500).json(errorResponse('An error occurred while fetching jobs'));
    }
};

export const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { hrId } = req.user;
        const serviceResponse = await getJobByIdService({ jobId, hrId });

        if (!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
            return res.status(200).json(successResponse('Job fetched successfully', serviceResponse.data));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('An error occurred while fetching the job'));
    }
}

export const evaluateApplicantByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { hrId } = req.user;
        const serviceResponse = await evaluateApplicants({ jobId, hrId });
        
        if(!serviceResponse.status) {
            return res.status(400).json(errorResponse(serviceResponse.message));
        } else {
            return res.status(200).json(successResponse('Evaluation completed successfully', serviceResponse.data));
        }

    } catch (error) {
        res.status(500).json(errorResponse('An error occurred while evaluating applicants for this job'));
    }
}