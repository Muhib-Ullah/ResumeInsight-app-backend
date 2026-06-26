-- CreateTable
CREATE TABLE "HR" (
    "hrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HR_pkey" PRIMARY KEY ("hrId")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "hrId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "applicantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "matchScore" INTEGER,
    "evaluation" JSONB,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("applicantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "HR_email_key" ON "HR"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job_token_key" ON "Job"("token");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_hrId_fkey" FOREIGN KEY ("hrId") REFERENCES "HR"("hrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;
