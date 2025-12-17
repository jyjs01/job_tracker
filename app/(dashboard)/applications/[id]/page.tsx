"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ApplicationStatus } from "@/src/types/applications";
import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";
import Input from "@/src/components/ui/Input";

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

const SOURCE_OPTIONS = ["사람인", "잡코리아", "회사 홈페이지"];
type ApplicationSource = (typeof SOURCE_OPTIONS)[number];

function badgeStyle(type: ScheduleType) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold";
  if (type === "면접") return `${base} border-blue-200 bg-blue-50 text-blue-700`;
  return `${base} border-slate-200 bg-slate-50 text-slate-700`;
}

export default function ApplicationDetailPage() {
  const [isEditing, setIsEditing] = useState(false);

  const [companyName] = useState("네이버");
  const [position] = useState("프론트엔드 개발자");
  const [status, setStatus] = useState<ApplicationStatus>("지원 완료");
  const [jobUrl] = useState("https://careers.naver.com/job/detail/123");

  const [appliedAt, setAppliedAt] = useState("2025-01-15");
  const [source, setSource] = useState<ApplicationSource>("사람인");
  const [memo, setMemo] = useState(
    "React, TypeScript 강점 중심으로 지원. 포트폴리오 프로젝트 3개 제출함."
  );

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

  const onClickEdit = () => setIsEditing(true);

  const onClickSave = () => {
    setIsEditing(false);
    alert("저장 동작은 다음 단계에서 API로 연결하면 돼!");
  };

  const readOnlyBox =
    "h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 flex items-center";

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
                href={jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                aria-label="open-link"
              >
                ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">지원 정보</div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
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

          <div className="lg:col-span-6">
            <FilterSelect
              label="지원 경로"
              value={source}
              onChange={(e) => setSource(e.target.value as ApplicationSource)}
              disabled={!isEditing}
            >
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </FilterSelect>
          </div>

          <div className="lg:col-span-12">
            <p className="text-[11px] font-medium text-slate-500">메모</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={6}
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
                    <div className="mt-1 text-xs text-slate-500">{item.meta}</div>
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
