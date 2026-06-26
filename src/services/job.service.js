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