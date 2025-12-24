import { ObjectId } from "mongodb";

export type JobPostingDocument = {
  _id?: ObjectId;
  userId: string;

  companyName: string;
  companyIndustry?: string;
  companyHomepageUrl?: string;

  title: string;
  position?: string;
  source?: string;
  url?: string;
  dueDate?: Date;

  employmentType?: string;
  location?: string;
  career?: string;
  salary?: string;

  responsibilities?: string;
  requirements?: string;
  preferred?: string;
  benefits?: string;

  memo?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type JobPostingWithId = JobPostingDocument & {
  id: string;
};

// API/화면에서 쓰는 표준 형태
export type JobPostingDTO = {
  id: string;
  userId: string;

  companyName: string;
  companyIndustry?: string;
  companyHomepageUrl?: string;

  title: string;
  position?: string;
  source?: string;
  url?: string;

  dueDate?: string;

  employmentType?: string;
  location?: string;
  career?: string;
  salary?: string;

  responsibilities?: string;
  requirements?: string;
  preferred?: string;
  benefits?: string;

  memo?: string;

  createdAt: string;
  updatedAt?: string;
};

// 목록 화면에서 쓸 “얇은 타입”
export type JobPostingListItem = Pick<
  JobPostingDTO,
  "id" | "title" | "companyName" | "position" | "employmentType" | "source" | "location" | "dueDate"
>;

export type DeadlineFilter = "전체" | "마감 지남" | "마감 임박" | "여유 있음";
export type SourceFilter = "전체" | "사람인" | "잡코리아" | "회사 채용 홈페이지";

export type FieldErrors = Record<string, string[]>;
export type ApiErrorResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
  formErrors?: string[];
  details?: {
    fieldErrors?: FieldErrors;
    formErrors?: string[];
  };
};