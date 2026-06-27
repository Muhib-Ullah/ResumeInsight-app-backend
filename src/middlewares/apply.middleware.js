import multer from "multer";
import { errorResponse } from "../utils/api.response.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }
        cb(null, true);
    }
});

export const uploadResume = (req, res, next) => {
    upload.single('resume') (req, res, (err) => {
        if (err) { 
            return res.status(400).json(errorResponse(err.message)) 
        };
        next();
    });
};

export const validateApplication = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, name, phone } = req.body;

    if(!email || !name || !phone) {
        return res.status(400).json(errorResponse('Please fill in all mandatory fields'));
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json(errorResponse('Invalid email address. Please check and try again'));
    }
    next();
}
