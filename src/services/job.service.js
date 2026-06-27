import prisma from '../utils/prisma.js';
import { evaluateWithGroq } from './evaluate.service.js';

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
            hrId: jobData.hrId
        }
    });

    const applicant_link = `${process.env.APPLY_BASE_URL}/apply/${newJob.token}`;
    return { status: true, data: { ...newJob, applicant_link } };
}

export const getAllJobsService = async (hrData) => {
    const jobs = await prisma.job.findMany({ where: { status: 'open', hrId: hrData.hrId }, orderBy: { createdAt: 'desc' }});
    if(!jobs || jobs.length === 0) {
        return {status: false, message: 'No active job listings found for this HR'};
    }
    return { status: true, data: jobs };   
}

export const getJobByIdService = async (jobData) => {
    const job = await prisma.job.findFirst({ where: { jobId: jobData.jobId, hrId: jobData.hrId }, include: { applicants: { orderBy: { matchScore: 'desc' }}}});
    if(!job) {
        return {status: false, message: 'Job not found or is not active'};
    }
    const applicant_link = `${process.env.APPLY_BASE_URL}/apply/${job.token}`; 
    return { status: true, data: { ...job, applicant_link } };
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
                }
            });
        })
    );

    const rankedApplicants = evaluatedApplicants.sort((a, b) => b.matchScore - a.matchScore);
    return { status: true, data: rankedApplicants };
}