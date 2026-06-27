import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const EVALUATION_PROMPT = (resumeText, jobDescription) => `
    You are an expert ATS (Applicant Tracking System) and technical recruiter.
    Evaluate the candidate's resume against the job description provided.
    
    Analyze and return the following:
    1. matchScore (integer 0-100) — based on skills, experience, education, and keywords.
    2. missingSkills — skills, tools, or qualifications in the job description but absent from the resume.
    3. strengths — the candidate's strongest qualifications relevant to this role.
    4. recommendations — exactly 3 actionable steps to improve the resume for this specific job.
    5. summary — a concise 2-3 sentence assessment of the candidate's overall fit.
    
    STRICT OUTPUT RULES:
    - Return ONLY valid JSON. No markdown, no explanation, no code fences.
    - matchScore must be an integer between 0 and 100.
    - missingSkills, strengths, and recommendations must be non-empty arrays of strings.
    - summary must be a non-empty string.
    
    Required JSON structure:
    {
        "matchScore": 0,
        "missingSkills": [],
        "strengths": [],
        "recommendations": [],
        "summary": ""
    }
 
    RESUME: ${resumeText}
    JOB DESCRIPTION: ${jobDescription}`.trim();


export const evaluateWithGroq = async (resumeText, jobDescription) => {;
    const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: "user", content: EVALUATION_PROMPT(resumeText, jobDescription)}],
        temperature: 0.3
    });

    try {
        const parsedContent = JSON.parse(response.choices[0].message.content);
        if(!parsedContent.matchScore || !parsedContent.missingSkills || !parsedContent.strengths || !parsedContent.recommendations || !parsedContent.summary) {
            return { status: false, message: "Incomplete response from Groq API" };
        }
        return { status: true, data: parsedContent };             
    } catch (error) {
        throw new Error("Failed to parse Groq API response as JSON");
    }
}