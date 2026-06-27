import { applyForJobService, extractResumeTextService } from "../services/apply.service.js";
import { errorResponse, successResponse } from "../utils/api.response.js";

export const applyForJob = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { token } = req.params;
        const resume_file  = req.file;

        console.log('File received:', req.file?.originalname);
        const resumeServiceResponse = await extractResumeTextService(resume_file.buffer);
        console.log('Extraction done:', resumeServiceResponse.data);
        if(!resumeServiceResponse.status) {
            return res.status(400).json(errorResponse(resumeServiceResponse.message));
        }
        const resume_text = resumeServiceResponse.data
        const applyServiceResponse = await applyForJobService({ name, email, phone, token, resume_text })
        if(!applyServiceResponse.status) {
            return res.status(400).json(errorResponse(applyServiceResponse.message));
        } else {
            return res.status(200).json(successResponse("Applied to job successfully", applyServiceResponse.data));
        }
    } catch (error) {
        res.status(500).json(errorResponse('An error occurred while applying for this job'));
    }
};