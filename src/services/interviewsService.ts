import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/src/lib/mongodb";
import type {
  CreateInterviewArgs,
  InterviewDocument,
  InterviewRow,
  InterviewStatus,
} from "@/src/types/interviews";

const COLLECTION = "interviews";

function requireObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }
  return new ObjectId(id);
}

function toIso(d: Date | null | undefined) {
  return d ? d.toISOString() : null;
}

function parseDateOrNull(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function docToRow(doc: InterviewDocument): InterviewRow {
  return {
    id: doc._id.toString(),
    userId: doc.user_id,
    jobPostingId: doc.job_posting_id,
    applicationId: doc.application_id,

    type: doc.type,
    scheduledAt: toIso(doc.scheduled_at),
    location: doc.location ?? null,

    status: doc.status,
    memo: doc.memo ?? null,

    createdAt: doc.created_at.toISOString(),
    updatedAt: doc.updated_at.toISOString(),
  };
}

export type UpdateInterviewArgs = Partial<{
  jobPostingId: string;
  applicationId: string;
  type: string;
  scheduledAt: string | null;
  location: string | null;
  status: InterviewStatus;
  memo: string | null;
}>;

export async function createInterview(args: CreateInterviewArgs): Promise<InterviewRow> {
  const { db } = await connectToDatabase();
  const now = new Date();

  const doc: Omit<InterviewDocument, "_id"> = {
    user_id: args.userId,
    job_posting_id: args.jobPostingId,
    application_id: args.applicationId,

    type: args.type,
    scheduled_at: parseDateOrNull(args.scheduledAt),
    location: args.location ?? null,

    status: args.status,
    memo: args.memo ?? null,

    created_at: now,
    updated_at: now,
  };

  const result = await db
    .collection<Omit<InterviewDocument, "_id">>(COLLECTION)
    .insertOne(doc);

  const inserted: InterviewDocument = {
    _id: result.insertedId,
    ...doc,
  };

  return docToRow(inserted);
}

export async function listInterviewsByUserId(userId: string): Promise<InterviewRow[]> {
  const { db } = await connectToDatabase();

  const docs = await db
    .collection<InterviewDocument>(COLLECTION)
    .find({ user_id: userId })
    .sort({ scheduled_at: 1, created_at: -1 })
    .toArray();

  return docs.map(docToRow);
}

export async function listInterviewsByApplicationId(
  userId: string,
  applicationId: string
): Promise<InterviewRow[]> {
  const { db } = await connectToDatabase();

  const docs = await db
    .collection<InterviewDocument>(COLLECTION)
    .find({ user_id: userId, application_id: applicationId })
    .sort({ scheduled_at: 1, created_at: -1 })
    .toArray();

  return docs.map(docToRow);
}

export async function getInterviewById(id: string, userId: string): Promise<InterviewRow | null> {
  const { db } = await connectToDatabase();
  const _id = requireObjectId(id);

  const doc = await db
    .collection<InterviewDocument>(COLLECTION)
    .findOne({ _id, user_id: userId });

  return doc ? docToRow(doc) : null;
}

export async function updateInterviewById(
  id: string,
  userId: string,
  patch: UpdateInterviewArgs
): Promise<InterviewRow | null> {
  const { db } = await connectToDatabase();
  const _id = requireObjectId(id);

  const updateDoc: Partial<InterviewDocument> = {
    updated_at: new Date(),
  };

  if (patch.jobPostingId !== undefined) updateDoc.job_posting_id = patch.jobPostingId;
  if (patch.applicationId !== undefined) updateDoc.application_id = patch.applicationId;
  if (patch.type !== undefined) updateDoc.type = patch.type;
  if (patch.scheduledAt !== undefined) updateDoc.scheduled_at = parseDateOrNull(patch.scheduledAt);
  if (patch.location !== undefined) updateDoc.location = patch.location ?? null;
  if (patch.status !== undefined) updateDoc.status = patch.status;
  if (patch.memo !== undefined) updateDoc.memo = patch.memo ?? null;

  const result = await db
    .collection<InterviewDocument>(COLLECTION)
    .findOneAndUpdate(
      { _id, user_id: userId },
      { $set: updateDoc },
      { returnDocument: "after" }
    );

  return result ? docToRow(result) : null;
}

export async function deleteInterviewById(id: string, userId: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const _id = requireObjectId(id);

  const result = await db
    .collection<InterviewDocument>(COLLECTION)
    .deleteOne({ _id, user_id: userId });

  return result.deletedCount === 1;
}
