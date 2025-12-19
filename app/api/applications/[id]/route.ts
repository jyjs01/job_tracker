import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { createApplicationSchema } from "@/src/lib/validation/applications";
import { getCurrentUser } from "@/src/lib/auth";
import {
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
} from "@/src/services/applicationsService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getApplicationById(user.id, id);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const parsed = createApplicationSchema
    .pick({ status: true, appliedAt: true, memo: true })
    .partial()
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await updateApplicationById(user.id, id, {
    status: parsed.data.status,
    appliedAt:
      typeof parsed.data.appliedAt === "undefined"
        ? undefined
        : parsed.data.appliedAt,
    memo:
      typeof parsed.data.memo === "undefined" ? undefined : parsed.data.memo,
  });

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated }, { status: 200 });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await deleteApplicationById(user.id, id);

  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
