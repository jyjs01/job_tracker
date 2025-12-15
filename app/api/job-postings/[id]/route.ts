import { NextResponse } from "next/server";
import { getJobPostingById, updateJobPosting, deleteJobPosting } from "@/src/services/jobPostingsService";
import { createJobPostingSchema } from "@/src/lib/validation/jobPostings";
import { getCurrentUser } from "@/src/lib/auth";

type Params = Promise<{ id: string }>;

// 채용 공고 단건 조회
export async function GET(
  _request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "잘못된 요청입니다. id가 필요합니다." },
        { status: 400 }
      );
    }

    const jobPosting = await getJobPostingById(id);

    if (!jobPosting) {
      return NextResponse.json(
        { error: "해당 채용 공고를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: jobPosting });
  } catch (error) {
    console.error("[GET /api/job-postings/:id] Error:", error);
    return NextResponse.json(
      { error: "채용 공고를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


// 채용 공고 수정
export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "잘못된 요청입니다. id가 필요합니다." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const json = await request.json();

    // 생성 스키마를 기반으로 부분 업데이트 허용
    const parsed = createJobPostingSchema.partial().safeParse(json);

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

    const updated = await updateJobPosting(id, parsed.data, user.id);

    if (!updated) {
      return NextResponse.json(
        { error: "수정할 채용 공고를 찾을 수 없거나 권한이 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/job-postings/:id] Error:", error);
    return NextResponse.json(
      { error: "채용 공고를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


// 채용 공고 삭제
export async function DELETE(
  _request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "잘못된 요청입니다. id가 필요합니다." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const deleted = await deleteJobPosting(id, user.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "삭제할 채용 공고를 찾을 수 없거나 권한이 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/job-postings/:id] Error:", error);
    return NextResponse.json(
      { error: "채용 공고를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}