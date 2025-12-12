import Link from "next/link";
import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";

type JobPostingRow = {
  id: number;
  company: string;
  companyInitial: string;
  industry: string;
  title: string;
  position: string;
  stacks: string[];
  location: string;
  dueDate: string;
  statusLabel: string;
  statusTone: "default" | "success" | "warning" | "danger";
};

const jobPostings: JobPostingRow[] = [
  {
    id: 1,
    company: "네이버",
    companyInitial: "N",
    industry: "IT 서비스",
    title: "프론트엔드 개발자",
    position: "React, TypeScript 경험자",
    stacks: ["React", "TypeScript"],
    location: "판교",
    dueDate: "2025-01-15",
    statusLabel: "서류 합격",
    statusTone: "success",
  },
  {
    id: 2,
    company: "카카오",
    companyInitial: "K",
    industry: "IT 서비스",
    title: "백엔드 개발자",
    position: "Java, Spring 기반",
    stacks: ["Java", "Spring"],
    location: "성남",
    dueDate: "2025-01-10",
    statusLabel: "지원 완료",
    statusTone: "default",
  },
  {
    id: 3,
    company: "라인",
    companyInitial: "L",
    industry: "메신저 서비스",
    title: "데이터 엔지니어",
    position: "Python, Spark 경험",
    stacks: ["Python", "Spark"],
    location: "강남",
    dueDate: "2025-01-20",
    statusLabel: "면접 예정",
    statusTone: "warning",
  },
  {
    id: 4,
    company: "토스",
    companyInitial: "T",
    industry: "핀테크",
    title: "풀스택 개발자",
    position: "React, Node.js",
    stacks: ["React", "Node.js"],
    location: "선릉",
    dueDate: "2025-01-05",
    statusLabel: "불합격",
    statusTone: "danger",
  },
  {
    id: 5,
    company: "배달의민족",
    companyInitial: "B",
    industry: "O2O 서비스",
    title: "모바일 개발자",
    position: "iOS, Swift 경험",
    stacks: ["iOS", "Swift"],
    location: "을지로",
    dueDate: "2025-01-25",
    statusLabel: "관련 없음",
    statusTone: "default",
  },
];

const statusToneClass: Record<JobPostingRow["statusTone"], string> = {
  default: "border-slate-200 bg-slate-50 text-slate-600",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  danger: "border-rose-100 bg-rose-50 text-rose-700",
};

export default function JobPostingsPage() {
  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              채용 공고 관리
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              지원할 공고를 등록하고 한 곳에서 관리해 보세요.
            </p>
          </div>

          {/* 공고 등록 버튼 */}
          <Link href="/job-postings/post">
            <Button
                variant="primary"
                size="md"
                className="rounded-full gap-1 shadow-sm"
            >
                <span className="text-sm">＋</span>
                <span className="text-xs">공고 등록</span>
            </Button>
          </Link>
        </div>

        {/* 필터 카드 */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-900">필터</h2>
            <Button variant="text" size="sm" className="text-[11px]">
              초기화
            </Button>
          </div>

          <div className="grid gap-4 px-6 py-4 md:grid-cols-3">
            <div className="space-y-1">
              <FilterSelect label="마감일 상태" defaultValue="전체">
                <option>전체</option>
                <option>마감 지남</option>
                <option>마감 임박</option>
                <option>여유 있음</option>
              </FilterSelect>
            </div>

            <div className="space-y-1">
              <FilterSelect label="소스" defaultValue="전체">
                <option>전체</option>
                <option>공식 홈페이지</option>
                <option>채용 플랫폼</option>
                <option>지인 추천</option>
              </FilterSelect>
            </div>

            <div className="space-y-1">
              <FilterSelect label="지원 상태" defaultValue="전체">
                <option>전체</option>
                <option>지원 전</option>
                <option>지원 완료</option>
                <option>서류 합격</option>
                <option>면접 예정</option>
                <option>불합격</option>
              </FilterSelect>
            </div>
          </div>
        </section>

        {/* 공고 목록 카드 */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                채용 공고 목록
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                등록한 채용 공고를 한눈에 확인해 보세요.
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              총 {jobPostings.length}개 공고
            </p>
          </div>

          {/* 테이블 헤더 */}
          <div className="hidden items-center px-6 py-3 text-[11px] font-medium text-slate-400 lg:flex">
            <div className="flex-[1.6]">회사명</div>
            <div className="flex-[1.8]">포지션</div>
            <div className="flex-[1.4]">기술 스택</div>
            <div className="flex-1">근무지</div>
            <div className="flex-1">마감일</div>
            <div className="flex-1">지원 상태</div>
            <div className="w-8 text-right" />
          </div>

          {/* 채용 공고 */}
          <div>
            {jobPostings.map((job) => (
              <div
                key={job.id}
                className="flex flex-col border-t border-slate-100 px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 lg:flex-row lg:items-center lg:px-6"
              >
                {/* 회사 */}
                <div className="flex flex-1 items-start gap-3 lg:flex-[1.6]">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                    {job.companyInitial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-900">
                      {job.company}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-400">
                      {job.industry}
                    </span>
                  </div>
                </div>

                {/* 포지션 */}
                <div className="mt-2 flex-1 lg:mt-0 lg:flex-[1.8]">
                  <p className="text-xs font-medium text-slate-900">
                    {job.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {job.position}
                  </p>
                </div>

                {/* 스택 */}
                <div className="mt-2 flex-1 lg:mt-0 lg:flex-[1.4]">
                  <div className="flex flex-wrap gap-1">
                    {job.stacks.map((stack) => (
                      <span
                        key={stack}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 근무지 */}
                <div className="mt-2 flex-1 text-[11px] text-slate-500 lg:mt-0 lg:flex-1">
                  {job.location}
                </div>

                {/* 마감일 */}
                <div className="mt-1 flex-1 text-[11px] text-slate-500 lg:mt-0 lg:flex-1">
                  {job.dueDate}
                </div>

                {/* 상태 */}
                <div className="mt-2 flex-1 lg:mt-0 lg:flex-1">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusToneClass[job.statusTone]}`}
                  >
                    {job.statusLabel}
                  </span>
                </div>

                {/* 보기 아이콘 버튼 */}
                <div className="mt-2 flex w-full justify-end lg:mt-0 lg:w-auto lg:text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-8 rounded-full p-0 text-sm text-slate-400 hover:text-slate-600 whitespace-nowrap"
                    aria-label="공고 상세 보기"
                  >
                    <span>상세</span>
                    <span className="ml-2 text-xs">›</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 페이징 */}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400 lg:px-6">
            <p>1-5 of 24 results</p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-md px-0 text-xs"
              >
                ‹
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-7 w-7 rounded-md px-0 text-xs"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-md px-0 text-xs text-slate-600"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-md px-0 text-xs text-slate-600"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-md px-0 text-xs"
              >
                ›
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
