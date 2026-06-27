import { errorResponse } from "../utils/api.response.js";

export const validateJobPosting = (req, res, next) => {
    const { title, description, deadline } = req.body;

    if(!title || !description || !deadline) {
        return res.status(400).json(errorResponse('Please fill in all mandatory fields'));
    }

    if (isNaN(new Date(deadline).getTime())) {
        return res.status(400).json(errorResponse('Invalid deadline date'));
    }

    if (new Date(deadline) <= new Date()) {
        return res.status(400).json(errorResponse('Deadline must be a future date'));
    }
    next();
}

