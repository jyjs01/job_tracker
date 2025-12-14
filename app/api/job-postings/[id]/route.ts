import { NextResponse } from "next/server";
import { getJobPostingById } from "@/src/services/jobPostingsService";

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
