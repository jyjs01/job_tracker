import type { ObjectId } from "mongodb";

export type ApplicationStatus =
  | "준비"
  | "지원 완료"
  | "서류 합격"
  | "면접 진행"
  | "합격"
  | "불합격";

export type ApplicationDocument = {
  _id: ObjectId;
  user_id: string;
  job_posting_id: string;
  status: ApplicationStatus;
  applied_at: Date | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
};

export type ApplicationRow = {
  id: string;
  userId: string;
  jobPostingId: string;
  status: ApplicationStatus;
  appliedAt: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};

// 얇은 타입
export type ApplicationListItem = Pick<
  ApplicationRow,
  "id" | "jobPostingId" | "status" | "appliedAt"
>;


export type CreateApplicationArgs = {
  userId: string;
  jobPostingId: string;
  status: ApplicationStatus;
  appliedAt: string | null;
  memo: string | null;
};
