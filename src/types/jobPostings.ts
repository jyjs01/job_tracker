import { ObjectId } from "mongodb";

export type JobPostingDocument = {
  _id?: ObjectId;
  userId: string;

  title: string;
  position?: string;
  source?: string;
  url?: string;
  dueDate?: Date;
  employmentType?: string;
  location?: string;

  responsibilities?: string;
  requirements?: string;
  preferred?: string;
  benefits?: string;

  memo?: string;
  createdAt: Date;
};
