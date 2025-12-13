import { NextResponse } from "next/server";
import { listJobPostings, createJobPosting } from "@/src/services/jobPostingsService";
import { createJobPostingSchema } from "@/src/lib/validation/jobPostings";
import { getCurrentUser } from "@/src/lib/auth";

// 채용 공고 불러오기
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const data = await listJobPostings({ userId: user.id });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/job-postings] Error:", error);
    return NextResponse.json(
      { error: "채용 공고 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


// 채용 공고 등록하기
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const json = await request.json();

    const parsed = createJobPostingSchema.safeParse(json);

    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten();

      return NextResponse.json(
        {
          error: "요청 데이터가 올바르지 않습니다.",
          fieldErrors,
          formErrors,
        },
        { status: 400 }
      );
    }

    const created = await createJobPosting({
      ...parsed.data,
      userId: user.id,
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/job-postings] Error:", error);
    return NextResponse.json(
      { error: "채용 공고를 저장하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
