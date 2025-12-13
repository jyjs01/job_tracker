import { connectToDatabase } from "@/src/lib/mongodb";
import { JobPostingDocument } from "@/src/types/jobPostings";
import { CreateJobPostingBodyInput } from "@/src/lib/validation/jobPostings";

type ListJobPostingsOptions = {
  userId?: string;
};

export async function listJobPostings(options: ListJobPostingsOptions = {}) {
  const { db } = await connectToDatabase();
  const collection = db.collection<JobPostingDocument>("job_postings");

  const filter: Partial<JobPostingDocument> = {};
  if (options.userId) {
    filter.userId = options.userId;
  }

  const docs = await collection
    .find(filter)
    .sort({ dueDate: 1, createdAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    ...doc,
    id: doc._id?.toString(),
  }));
}

export type CreateJobPostingInput = CreateJobPostingBodyInput & {
  userId: string;
};

export async function createJobPosting(input: CreateJobPostingInput) {
  const { db } = await connectToDatabase();
  const collection = db.collection<JobPostingDocument>("job_postings");

  const now = new Date();

  const doc: JobPostingDocument = {
    userId: input.userId,
    title: input.title,
    position: input.position,
    source: input.source,
    url: input.url,
    employmentType: input.employmentType,
    location: input.location,
    responsibilities: input.responsibilities,
    requirements: input.requirements,
    preferred: input.preferred,
    benefits: input.benefits,
    memo: input.memo,
    createdAt: now,
  };

  if (input.dueDate) {
    doc.dueDate = new Date(input.dueDate);
  }

  const result = await collection.insertOne(doc);

  return {
    ...doc,
    id: result.insertedId.toString(),
  };
}
