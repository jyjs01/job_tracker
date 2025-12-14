import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/src/lib/mongodb";
import { JobPostingDocument } from "@/src/types/jobPostings";
import { CreateJobPostingBodyInput } from "@/src/lib/validation/jobPostings";

async function getJobPostingsCollection() {
  const { db } = await connectToDatabase();
  return db.collection<JobPostingDocument>("job_postings");
}

type ListJobPostingsOptions = {
  userId?: string;
};

export async function listJobPostings(options: ListJobPostingsOptions = {}) {
  const collection = await getJobPostingsCollection();

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
  const collection = await getJobPostingsCollection();

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


export async function getJobPostingById(id: string) {
  const collection = await getJobPostingsCollection();

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const doc = await collection.findOne({ _id: objectId });

  if (!doc) return null;

  return {
    ...doc,
    id: doc._id.toString(),
  };
}