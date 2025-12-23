import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { createInterviewSchema } from "@/src/lib/validation/interviews";
import { createInterview, listInterviewsByUserId } from "@/src/services/interviewsService";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rows = await listInterviewsByUserId(user.id);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (err) {
    console.error("GET /api/interviews error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // userId는 클라이언트 값을 신뢰하지 말고 서버에서 주입
    const parsed = createInterviewSchema.safeParse({
      ...body,
      userId: user.id,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation Error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const created = await createInterview(parsed.data);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/interviews error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
