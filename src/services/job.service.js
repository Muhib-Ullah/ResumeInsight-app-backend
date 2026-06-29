import prisma from '../utils/prisma.js';
import { evaluateWithGroq } from './evaluate.service.js';

export const createJobService = async (jobData) => {
    const existingJob = await prisma.job.findFirst({ where: { title: jobData.title, hrId: jobData.hrId, status: 'open' } });
    if (existingJob) {
        return {status: false, message: 'Active job listing with the same title already exists for this HR'};
    }
    const formatted_deadline = new Date(jobData.deadline + 'T00:00:00.000Z');
    const newJob = await prisma.job.create({
        data: {
            title: jobData.title,
            description: jobData.description,
            deadline: formatted_deadline,
            hrId: jobData.hrId
        },
        select: {
            jobId: true,
            title: true,
            description: true,
            deadline: true,
            status: true,
            token: true
        }
    });

    const { token, ...jobWithoutToken } = newJob;
    const applicant_link = `${process.env.APPLY_BASE_URL}/api/apply/${token}`;
    return { status: true, data: { ...jobWithoutToken, applicant_link } };
}

export const updateJobService = async (jobData) => {
    const job = await prisma.job.findFirst({ where : {jobId: jobData.jobId, hrId: jobData.hrId }});
    if(!job) {
        return {status: false, message: 'Invalid Job ID'};
    }
    const formatted_deadline = new Date(jobData.deadline + 'T00:00:00.000Z');
    const updatedJob = await prisma.job.update({
        where: {jobId: jobData.jobId},
        data: {
            title: jobData.title,
            description: jobData.description,
            deadline: formatted_deadline
        },
        select: {
            jobId: true,
            title: true,
            description: true,
            deadline: true,
            status: true
        }
    });
    
    return {status: true, data: updatedJob}; 
}

export const cancelJobService = async (dbData) => {
    const job = await prisma.job.findFirst({where : {jobId: dbData.jobId, hrId: dbData.hrId}});
    if(!job) {
        return { status: false, message: 'Invalid Job ID'};
    }
    const updatedJob = await prisma.job.update({
        where: {jobId: dbData.jobId},
        data: {
            status: 'cancelled'
        },
        select: {
            jobId: true,
            title: true,
            description: true,
            deadline: true,
            status: true
        }
    });

    return { status: true, data: updatedJob };
};

export const getAllJobsService = async (hrData) => {
    const jobs = await prisma.job.findMany({ where: { status: 'open', hrId: hrData.hrId }, 
        orderBy: { createdAt: 'desc' },
        select: {
            jobId: true,
            title: true,
            description: true,
            deadline: true,
            status: true
        }
    });

    if(!jobs || jobs.length === 0) {
        return {status: false, message: 'No active job listings found for this HR'};
    }
    return { status: true, data: jobs };   
}

export const getJobByIdService = async (jobData) => {
    const job = await prisma.job.findFirst({ where: { jobId: jobData.jobId, hrId: jobData.hrId }, 
        select: { title: true, description: true, deadline: true, status: true, token: true,
        applicants: {
            orderBy: { matchScore: 'desc' },
            select: { applicantId: true, name: true, email: true, phone: true, matchScore: true, evaluation: true }
        }}
    });

    if(!job) {
        return {status: false, message: 'Job not found or is not active'};
    }

    const { token, ...jobWithoutToken } = job;
    const applicant_link = `${process.env.APPLY_BASE_URL}/api/apply/${token}`;
    return { status: true, data: { ...jobWithoutToken, applicant_link } };
}

export const evaluateApplicants = async (dbData) => {
    const job = await prisma.job.findFirst({ where : { jobId: dbData.jobId, hrId: dbData.hrId }});
    if(!job) { return {status: false, message: "Job not found"} }

    const applicants = await prisma.applicant.findMany({ where : { jobId : dbData.jobId, matchScore: null }});
    if(applicants.length == 0) { return {status: false, message: "No applicants to evaluate for this job"} }

    const evaluatedApplicants = await Promise.all(
        applicants.map(async (applicant) => {
            const evaluateServiceResponse = await evaluateWithGroq(applicant.resumeText, job.description);
            if(!evaluateServiceResponse.status) { return applicant }

            return await prisma.applicant.update({ where: {applicantId: applicant.applicantId },
                data: {
                    matchScore: evaluateServiceResponse.data.matchScore,
                    evaluation: evaluateServiceResponse.data
                },
                select: {
                    applicantId: true,
                    name: true,
                    email: true,
                    phone: true,
                    matchScore: true,
                    evaluation: true
                }
            });
        })
    );

    const rankedApplicants = evaluatedApplicants.sort((a, b) => b.matchScore - a.matchScore);
    return { status: true, data: rankedApplicants };
}