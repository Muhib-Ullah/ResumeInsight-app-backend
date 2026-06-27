import prisma from '../utils/prisma.js';
import { extractText } from "unpdf";

const isPDF = (buffer) => {
    return [0x25, 0x50, 0x44, 0x46].every((byte, i) => buffer[i] === byte);
};

export const extractResumeTextService = async (fileBuffer) => {
    if (!fileBuffer || fileBuffer.length === 0) {
        return { status: false, message: "File buffer is empty or missing." };
    }
    if (!isPDF(fileBuffer)) {
        return { status: false, message: "Uploaded file is not a valid PDF." };
    }

    const { text } = await extractText(new Uint8Array(fileBuffer));
    const extractedText = Array.isArray(text) ? text.join(' ') : text;

    if (!extractedText || extractedText.trim().length === 0) {
        return { status: false, message: "Could not extract text from PDF. The file may be scanned or image-based." };
    }

    return { status: true, data: extractedText.trim() };
};

export const applyForJobService = async (applicantData) => {
    const job = await prisma.job.findUnique({ where: { token: applicantData.token } });
    const exstingApplicant = await prisma.applicant.findFirst({ where: {email: applicantData.email, jobId: job.jobId}})

    if (!job) return { status: false, message: 'Invalid or expired apply link' };
    if (exstingApplicant) {
        return { status: false, message: 'You have already applied for this job' };
    } else {
        if (job.status !== 'open') {
            return { status: false, message: 'Job is not open for applications' };
        }
        if (new Date() > job.deadline) {
            return { status: false, message: 'Application deadline has passed' };
        }

        const applicant = await prisma.applicant.create({
            data: {
                name: applicantData.name,
                email: applicantData.email,
                phone: applicantData.phone,
                resumeText: applicantData.resume_text,
                jobId: job.jobId
            }
        });

        return { status: true, data: applicant };
    }
}