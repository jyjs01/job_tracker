import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/src/lib/mongodb";
import type {
  ApplicationDocument,
  ApplicationRow,
  CreateApplicationArgs,
  ApplicationStatus,
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

function toObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export async function getApplications(userId: string): Promise<ApplicationRow[]> {
  const { db } = await connectToDatabase();

  const docs = await db
    .collection<ApplicationDocument>("applications")
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .toArray();

  return docs.map(toRow);
}

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

export async function getApplicationById(
  userId: string,
  id: string
): Promise<ApplicationRow | null> {
  const { db } = await connectToDatabase();

  if (ObjectId.isValid(id)) {
    const byId = await db
      .collection<ApplicationDocument>("applications")
      .findOne({ _id: new ObjectId(id), user_id: userId });

    if (byId) return toRow(byId);
  }

  const byJobPosting = await db
    .collection<ApplicationDocument>("applications")
    .findOne({ job_posting_id: id, user_id: userId });

  if (!byJobPosting) return null;
  return toRow(byJobPosting);
}


export async function updateApplicationById(
  userId: string,
  id: string,
  updates: {
    status?: ApplicationStatus;
    appliedAt?: string | null;
    memo?: string | null;
  }
): Promise<ApplicationRow | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;

  const now = new Date();

  const $set: Partial<ApplicationDocument> & { updated_at: Date } = {
    updated_at: now,
  };

  if (typeof updates.status !== "undefined") $set.status = updates.status;
  if (typeof updates.memo !== "undefined") $set.memo = updates.memo ?? null;

  if (typeof updates.appliedAt !== "undefined") {
    $set.applied_at = updates.appliedAt ? new Date(updates.appliedAt) : null;
  }

  const { db } = await connectToDatabase();

  const result = await db
    .collection<ApplicationDocument>("applications")
    .updateOne({ _id: objectId, user_id: userId }, { $set });

  if (result.matchedCount === 0) return null;

  const updated = await db
    .collection<ApplicationDocument>("applications")
    .findOne({ _id: objectId, user_id: userId });

  if (!updated) return null;
  return toRow(updated);
}

export async function deleteApplicationById(
  userId: string,
  id: string
): Promise<boolean | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;

  const { db } = await connectToDatabase();

  const result = await db
    .collection<ApplicationDocument>("applications")
    .deleteOne({ _id: objectId, user_id: userId });

  return result.deletedCount > 0;
}
