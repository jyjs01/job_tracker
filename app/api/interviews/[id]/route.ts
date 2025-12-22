// app/api/interviews/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/src/lib/auth";
import {
  getInterviewById,
  updateInterviewById,
  deleteInterviewById,
} from "@/src/services/interviewsService";
import { updateInterviewSchema } from "@/src/lib/validation/interviews";

type Params = { id: string };

export async function GET(
  _: Request,
  context: { params: Promise<Params> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params; // ✅ 중요

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "올바르지 않은 일정 ID입니다." }, { status: 400 });
    }

    const data = await getInterviewById(id, user.id);
    if (!data) {
      return NextResponse.json({ error: "일정을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/interviews/[id]] Error:", error);
    return NextResponse.json(
      { error: "일정 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params; // ✅ 중요

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "올바르지 않은 일정 ID입니다." }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateInterviewSchema.safeParse(body);

    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten();
      return NextResponse.json(
        { error: "요청 데이터가 올바르지 않습니다.", fieldErrors, formErrors },
        { status: 400 }
      );
    }

    const updated = await updateInterviewById(id, user.id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "일정을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/interviews/[id]] Error:", error);
    return NextResponse.json(
      { error: "일정을 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<Params> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params; // ✅ 중요

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "올바르지 않은 일정 ID입니다." }, { status: 400 });
    }

    const ok = await deleteInterviewById(id, user.id);
    if (!ok) {
      return NextResponse.json({ error: "일정을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ data: true });
  } catch (error) {
    console.error("[DELETE /api/interviews/[id]] Error:", error);
    return NextResponse.json(
      { error: "일정을 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
