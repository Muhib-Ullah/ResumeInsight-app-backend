# ResumeInsight | Backend Repository
 
A RESTful backend API built with Node.js, Express, and PostgreSQL to automate first-round hiring. HR users manage job postings with shareable apply links, candidates submit resumes without creating an account, and the system batch evaluates all resumes using AI to rank applicants automatically.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma v7
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **PDF Extraction:** unpdf
- **AI Model:** Groq API (Llama 3.3 70B)

## How It Works

1. HR registers and logs in via JWT-protected endpoints
2. HR creates a job posting → system generates a unique shareable apply link
3. HR shares the link — candidates open it and submit name, email, phone, and resume PDF with no account required
4. After the deadline, HR triggers batch evaluation
5. API evaluates all resumes against the job description and returns candidates ranked by match score
6. HR contacts top candidates directly using their submitted contact details

## Project Structure

```
src/
├── controllers/
│   ├── apply.controller.js
│   ├── auth.controller.js
│   └── job.controller.js
├── middlewares/
│   ├── apply.middleware.js
│   ├── auth.middleware.js
│   └── job.middleware.js
├── routes/
│   ├── apply.routes.js
│   ├── auth.routes.js
│   └── job.routes.js
├── services/
│   ├── apply.service.js
│   ├── auth.service.js
│   ├── evaluate.service.js
│   └── job.service.js
└── utils/
    ├── api.response.js
    └── prisma.js
app.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- A Groq API key — get one at [console.groq.com](https://console.groq.com)

### Installation

```bash
git clone https://github.com/Muhib-Ullah/ResumeInsight-app-backend.git
cd ResumeInsight-app-backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/resumeinsight"
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
APPLY_BASE_URL=http://localhost:5000
PORT=5000
```

### Database Setup

```bash
npx prisma migrate dev --name init
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | HR registration |
| POST | `/api/auth/login` | None | HR login, returns JWT |

### Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/job/all` | JWT | Get all HR's job postings |
| GET | `/api/job/:jobId` | JWT | Get job with all applicants |
| POST | `/api/job/create` | JWT | Create a job posting |
| POST | `/api/job/:jobId/evaluate` | JWT | Trigger batch AI evaluation |
| PUT | `/api/job/:jobId/update` | JWT | Update job postings |
| PUT | `/api/job/:jobId/cancel` | JWT | Mark job postings as cancelled |

### Apply (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/apply/:token` | None | Candidate applies for a job |

## Request & Response Examples

### Register HR
**POST** `/api/auth/register`
```json
{
    "name": "John HR",
    "email": "john@company.com",
    "password": "password123"
}
```

### Create Job
**POST** `/api/jobs/create` — requires `Authorization: Bearer <token>`
```json
{
    "title": "Frontend Developer",
    "description": "We are looking for a React developer with 2+ years experience...",
    "deadline": "2026-08-01"
}
```

**Response:**
```json
{
    "status": true,
    "message": "Job created successfully",
    "data": {
        "jobId": "uuid",
        "title": "Frontend Developer",
        "token": "abc123",
        "applicant_link": "http://localhost:5000/apply/abc123"
    }
}
```

### Candidate Apply
**POST** `/api/apply/:token` — `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| name | Text | Candidate name |
| email | Text | Candidate email |
| phone | Text | Candidate phone |
| resume | File (PDF) | Resume file, max 5MB |

### Evaluate All Applicants
**POST** `/api/jobs/:jobId/evaluate` — requires `Authorization: Bearer <token>`

**Response:**
```json
{
    "status": true,
    "message": "Evaluation completed successfully",
    "data": [
        {
            "name": "Jane Doe",
            "email": "jane@gmail.com",
            "phone": "1234567890",
            "matchScore": 85,
            "evaluation": {
                "matchScore": 85,
                "strengths": ["Strong React experience", "Good communication skills"],
                "missingSkills": ["TypeScript", "Docker"],
                "recommendations": ["Add TypeScript projects", "Learn containerization", "Highlight team projects"],
                "summary": "Strong candidate with relevant frontend experience..."
            }
        }
    ]
}
```

## Validations

- HR password must be 6-20 characters
- Only PDF resumes accepted
- Maximum resume size: 5MB
- Job deadline must be a future date
- Candidates cannot apply to the same job twice
- Apply link expires when job deadline passes or status is closed
