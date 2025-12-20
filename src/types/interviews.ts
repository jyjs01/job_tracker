import type { ObjectId } from "mongodb";

export type InterviewStatus = "예정" | "합격" | "불합격";

export type InterviewDocument = {
  _id: ObjectId;
  user_id: string;
  job_posting_id: string;
  application_id: string;

  type: string;
  scheduled_at: Date | null; 
  location: string | null;

  status: InterviewStatus;
  memo: string | null;

  created_at: Date;
  updated_at: Date;
};

export type InterviewRow = {
  id: string;
  userId: string;
  jobPostingId: string;
  applicationId: string;

  type: string;
  scheduledAt: string | null;
  location: string | null;

  status: InterviewStatus;
  memo: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateInterviewArgs = {
  userId: string;
  jobPostingId: string;
  applicationId: string;

  type: string;
  scheduledAt: string | null;
  location: string | null;

  status: InterviewStatus;
  memo: string | null;
};
