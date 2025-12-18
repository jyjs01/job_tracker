"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import type { ApplicationRow, ApplicationStatus } from "@/src/types/applications";
import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";
import Input from "@/src/components/ui/Input";

type JobPostingApiRow = {
  id?: string;
  _id?: string;
  company_name?: string;
  companyName?: string;
  position?: string;
  url?: string;
};

type ScheduleType = "면접" | "과제";

type ScheduleItem = {
  id: string;
  type: ScheduleType;
  badge: string;
  title: string;
  dateText: string;
  meta?: string;
  memo?: string;
};

const STATUS_OPTIONS: ApplicationStatus[] = [
  "준비",
  "지원 완료",
  "서류 합격",
  "면접 진행",
  "합격",
  "불합격",
];

function toDateInputValue(v: string | null) {
  if (!v) return "";
  return v.includes("T") ? v.slice(0, 10) : v;
}

function badgeStyle(type: ScheduleType) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold";
  if (type === "면접") return `${base} border-blue-200 bg-blue-50 text-blue-700`;
  return `${base} border-slate-200 bg-slate-50 text-slate-700`;
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const applicationId = params?.id;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [status, setStatus] = useState<ApplicationStatus>("준비");
  const [appliedAt, setAppliedAt] = useState("");
  const [memo, setMemo] = useState("");

  const scheduleItems: ScheduleItem[] = useMemo(
    () => [
      {
        id: "s1",
        type: "면접",
        badge: "1차 면접",
        title: "기술 면접",
        dateText: "2025-01-22 14:00",
        meta: "면접관: 김개발 팀장, 이프론트 시니어",
        memo: "React, JavaScript 기본기 위주로 질문받음. 프로젝트 경험에 대해 자세히 설명.",
      },
      {
        id: "s2",
        type: "과제",
        badge: "과제 제출",
        title: "코딩 테스트",
        dateText: "2025-01-25까지",
        meta: "온라인 과제",
        memo: "React로 Todo 앱 구현. Redux 사용 필수. 3일 내 제출.",
      },
      {
        id: "s3",
        type: "면접",
        badge: "2차 면접 예정",
        title: "임원 면접",
        dateText: "2025-01-30 10:00",
        meta: "면접관: 박CTO, 최팀장",
        memo: "문화 적합성 및 비전 면접 예정",
      },
    ],
    []
  );

  const fetchDetail = async () => {
    if (!applicationId) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const appRes = await axios.get(`/api/applications/${applicationId}`);
      const app = appRes.data?.data as ApplicationRow;

      const postingsRes = await axios.get("/api/job-postings");
      const jobPostings = (postingsRes.data?.data ?? []) as JobPostingApiRow[];

      const posting = jobPostings.find((jp) => {
        const id = String(jp.id ?? jp._id ?? "");
        return id === app.jobPostingId;
      });

      const cName =
        posting?.company_name ?? posting?.companyName ?? "회사명 미기입";
      const pos = posting?.position ?? "-";
      const url = posting?.url ?? "";

      setCompanyName(cName);
      setPosition(pos);
      setJobUrl(url);

      setStatus(app.status);
      setAppliedAt(toDateInputValue(app.appliedAt));
      setMemo(app.memo ?? "");
    } catch (err: unknown) {
      console.error("지원 상세 불러오기 오류:", err);
      setErrorMsg("지원 상세 정보를 불러오는 중 오류가 발생했습니다.");
      setCompanyName("");
      setPosition("");
      setJobUrl("");
      setStatus("준비");
      setAppliedAt("");
      setMemo("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const onClickEdit = () => setIsEditing(true);

  const onClickSave = async () => {
    if (!applicationId) return;

    try {
      const payload: Partial<{
        status: ApplicationStatus;
        appliedAt: string | null;
        memo: string | null;
      }> = {
        status,
        appliedAt: appliedAt ? appliedAt : null,
        memo: memo ? memo : null,
      };

      const res = await axios.patch(
        `/api/applications/${applicationId}`,
        payload
      );
      const updated = res.data?.data as ApplicationRow;

      setStatus(updated.status);
      setAppliedAt(toDateInputValue(updated.appliedAt));
      setMemo(updated.memo ?? "");

      setIsEditing(false);
      alert("저장 완료!");
    } catch (err: unknown) {
      console.error("지원 상세 저장 오류:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const onClickDelete = async () => {
    if (!applicationId) return;
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    try {
      await axios.delete(`/api/applications/${applicationId}`);
      router.push("/applications");
    } catch (err: unknown) {
      console.error("지원 삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const readOnlyBox =
    "h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 flex items-center";

  if (loading) {
    return (
      <main className="px-6 py-6">
        <div className="text-sm text-slate-500">불러오는 중...</div>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="px-6 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="back"
          >
            ←
          </Link>
          <div className="text-sm font-semibold text-slate-900">지원 상세</div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-rose-600">{errorMsg}</p>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" onClick={fetchDetail}>
              다시 시도
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push("/applications")}
            >
              목록으로
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="back"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">지원 상세</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={onClickEdit}
            disabled={isEditing}
          >
            수정
          </Button>
          <Button
            variant="primary"
            size="md"
            type="button"
            onClick={onClickSave}
            disabled={!isEditing}
          >
            저장
          </Button>
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={onClickDelete}
          >
            삭제
          </Button>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-[11px] font-medium text-slate-500">회사명</p>
            <div className={`mt-2 ${readOnlyBox}`}>
              <span className="truncate">{companyName || "-"}</span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <FilterSelect
              label="지원 상태"
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              disabled={!isEditing}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </FilterSelect>
          </div>

          <div className="lg:col-span-8">
            <p className="text-[11px] font-medium text-slate-500">포지션</p>
            <div className={`mt-2 ${readOnlyBox}`}>
              <span className="truncate">{position || "-"}</span>
            </div>
          </div>

          <div className="lg:col-span-12">
            <p className="text-[11px] font-medium text-slate-500">공고 링크</p>
            <div className="mt-2 flex items-center gap-2">
              <div className={readOnlyBox}>
                <span className="truncate">{jobUrl || "-"}</span>
              </div>
              <a
                href={jobUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                aria-label="open-link"
              >
                ↗
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium text-slate-500">지원 날짜</p>
            <Input
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              className="mt-2 disabled:bg-slate-50 disabled:text-slate-500"
              disabled={!isEditing}
            />
          </div>

          <div className="lg:col-span-12">
            <p className="text-[11px] font-medium text-slate-500">메모</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={8}
              className={
                "mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none " +
                "placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
                "disabled:bg-slate-50 disabled:text-slate-500"
              }
              disabled={!isEditing}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">
            면접 및 과제 일정
          </div>
          <Button variant="primary" size="md" type="button">
            + 면접/과제 일정 추가
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={badgeStyle(item.type)}>{item.badge}</span>
                    <span className="text-xs font-medium text-slate-500">
                      {item.dateText}
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {item.title}
                  </div>

                  {item.meta && (
                    <div className="mt-1 text-xs text-slate-500">
                      {item.meta}
                    </div>
                  )}

                  {item.memo && (
                    <div className="mt-2 text-xs text-slate-600">{item.memo}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" type="button" aria-label="edit">
                    ✎
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    aria-label="delete"
                  >
                    🗑
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
