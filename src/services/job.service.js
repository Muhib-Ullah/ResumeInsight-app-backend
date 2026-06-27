import prisma from '../utils/prisma.js';

export const createJobService = async (jobData) => {
    const existingJob = await prisma.job.findFirst({ where: { title: jobData.title, hrId: jobData.hrId, status: 'open' } });
    if (existingJob) {
        return {status: false, message: 'Active job listing with the same title already exists for this HR'};
    }

    const newJob = await prisma.job.create({
        data: {
            title: jobData.title,
            description: jobData.description,
            deadline: jobData.deadline,
            hrId: jobData.hrId,
            createdAt: new Date()
        }
    });

    return { status: true, data: newJob };
}

export const getAllJobsService = async (hrData) => {
    const jobs = await prisma.job.findMany({ where: { status: 'open', hrId: hrData.hrId }, orderBy: { createdAt: 'desc' }});
    if(!jobs || jobs.length === 0) {
        return {status: false, message: 'No active job listings found for this HR'};
    }
    return { status: true, data: jobs };   
}

export const getJobByIdService = async (jobData) => {
    const job = await prisma.job.findFirst({ where: { jobId: jobData.jobId, hrId: jobData.hrId }, include: { applicants: true } });
    if(!job) {
        return {status: false, message: 'Job not found or is not active'};
    } 
    return { status: true, data: job };
}