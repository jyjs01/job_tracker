import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/src/lib/mongodb";
import { JobPostingDocument } from "@/src/types/jobPostings";
import { CreateJobPostingBodyInput } from "@/src/lib/validation/jobPostings";

async function getJobPostingsCollection() {
  const { db } = await connectToDatabase();
  return db.collection<JobPostingDocument>("job_postings");
}

// 채용 공고 조회
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


// 채용 공고 등록
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
    career: input.career,
    salary: input.salary,
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


// 채용 공고 상세
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


export type UpdateJobPostingInput = Partial<CreateJobPostingInput>;

// 채용 공고 수정
export async function updateJobPosting(
  id: string,
  input: UpdateJobPostingInput,
  userId: string
) {
  const collection = await getJobPostingsCollection();
  const objectId = new ObjectId(id);

  const set: Partial<JobPostingDocument> = {};

  if (typeof input.title === "string") {
    set.title = input.title;
  }
  if (typeof input.position === "string" || input.position === null) {
    set.position = input.position ?? undefined;
  }
  if (typeof input.career === "string" || input.career === null) {
    set.career = input.career ?? undefined;
  }
  if (typeof input.salary === "string" || input.salary === null) {
    set.salary = input.salary ?? undefined;
  }
  if (typeof input.source === "string" || input.source === null) {
    set.source = input.source ?? undefined;
  }
  if (typeof input.url === "string" || input.url === null) {
    set.url = input.url ?? undefined;
  }
  if (typeof input.employmentType === "string" || input.employmentType === null) {
    set.employmentType = input.employmentType ?? undefined;
  }
  if (typeof input.location === "string" || input.location === null) {
    set.location = input.location ?? undefined;
  }

  if (typeof input.responsibilities === "string" || input.responsibilities === null) {
    set.responsibilities = input.responsibilities ?? undefined;
  }
  if (typeof input.requirements === "string" || input.requirements === null) {
    set.requirements = input.requirements ?? undefined;
  }
  if (typeof input.preferred === "string" || input.preferred === null) {
    set.preferred = input.preferred ?? undefined;
  }
  if (typeof input.benefits === "string" || input.benefits === null) {
    set.benefits = input.benefits ?? undefined;
  }
  if (typeof input.memo === "string" || input.memo === null) {
    set.memo = input.memo ?? undefined;
  }

  if (input.dueDate) {
    set.dueDate = new Date(input.dueDate);
  } else if (input.dueDate === null) {
    set.dueDate = undefined;
  }

  // 변경할 필드가 하나도 없으면, 그냥 기존 문서 찾아서 리턴
  if (Object.keys(set).length === 0) {
    const existing = await collection.findOne({ _id: objectId, userId });
    if (!existing) return null;
    return {
      ...existing,
      id: existing._id?.toString(),
    };
  }

  const result = await collection.findOneAndUpdate(
    { _id: objectId, userId },
    { $set: set },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  const doc = result;

  return {
    ...doc,
    id: doc._id?.toString(),
  };
}