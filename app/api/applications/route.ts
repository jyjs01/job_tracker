import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { createApplicationSchema } from "@/src/lib/validation/applications";
import { createApplication, getApplications } from "@/src/services/applicationsService";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const applications = await getApplications(user.id);

    return NextResponse.json({ data: applications });
  } catch (error) {
    console.error("[GET /api/applications] Error:", error);
    return NextResponse.json(
      { error: "지원 이력을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "요청 데이터가 올바르지 않습니다.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const created = await createApplication({
      userId: user.id,
      jobPostingId: parsed.data.jobPostingId,
      status: parsed.data.status,
      appliedAt: parsed.data.appliedAt ?? null,
      memo: parsed.data.memo ?? null,
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/applications] Error:", error);
    return NextResponse.json(
      { error: "지원 이력을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
