import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/src/lib/mongodb";
import type {
  ApplicationDocument,
  ApplicationRow,
  CreateApplicationArgs,
} from "@/src/types/applications";

function toRow(doc: ApplicationDocument): ApplicationRow {
  return {
    id: doc._id.toString(),
    userId: doc.user_id,
    jobPostingId: doc.job_posting_id,
    status: doc.status,
    appliedAt: doc.applied_at ? doc.applied_at.toISOString().slice(0, 10) : null,
    memo: doc.memo ?? null,
    createdAt: doc.created_at.toISOString(),
    updatedAt: doc.updated_at.toISOString(),
  };
}

// 지원 이력 불러오기
export async function getApplications(userId: string): Promise<ApplicationRow[]> {
  const { db } = await connectToDatabase();

  const docs = await db
    .collection<ApplicationDocument>("applications")
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .toArray();

  return docs.map(toRow);
}


// 지원 이력 추가하기
export async function createApplication(
  args: CreateApplicationArgs
): Promise<ApplicationRow> {
  const { db } = await connectToDatabase();

  const now = new Date();

  const doc = {
    user_id: args.userId,
    job_posting_id: args.jobPostingId,
    status: args.status,
    applied_at: args.appliedAt ? new Date(args.appliedAt) : null,
    memo: args.memo ?? null,
    created_at: now,
    updated_at: now,
  };

  const result = await db
    .collection<Omit<ApplicationDocument, "_id">>("applications")
    .insertOne(doc);

  const created: ApplicationDocument = {
    _id: result.insertedId as ObjectId,
    ...doc,
  };

  return toRow(created);
}
