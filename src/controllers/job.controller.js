import { createJobService, getAllJobsService, getJobByIdService } from '../services/job.service.js';
import { errorResponse, successResponse } from '../utils/api.response.js';

export const createJob = async (req, res) => {
    try{
        //Call Service layer after successfully validating the request body using middleware
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

export const getAllJobs = async (req, res) => {
    try {
        //Call Service layer after successfully validating the request body using middleware
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
        console.error('Error in getJobById:', error);
        res.status(500).json(errorResponse('An error occurred while fetching the job'));
    }
}