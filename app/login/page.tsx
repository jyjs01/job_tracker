"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/CheckBox";
import { parseLoginForm } from "@/src/lib/validation/client/login";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = parseLoginForm(e.currentTarget);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const { email, password } = result.data;

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          const firstField = Object.keys(data.errors)[0];
          const firstMessage = data.errors[firstField]?.[0];
          setError(
            firstMessage || data.message || "로그인에 실패했습니다."
          );
        } else {
          setError(data.message || "로그인에 실패했습니다.");
        }
        return;
      }

      // 로그인 성공 시 이동 (원하는 경로로 바꿔도 됨)
      router.push("/dashboard"); // TODO: 실제 대시보드 경로에 맞게 수정
    } catch (err) {
      console.error(err);
      setError("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">로그인</h1>
        <p className="mt-1 text-xs text-slate-500">
          JobTracker 계정으로 로그인해주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="이메일 주소를 입력해주세요."
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox id="remember" name="remember" />
              <span>로그인 상태 유지</span>
            </label>

            <Button type="button" variant="text" size="sm">
              비밀번호를 잊으셨나요?
            </Button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="mt-1 text-xs text-red-500">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          아직 계정이 없다면{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            회원가입
          </Link>
          을 진행해주세요.
        </p>
      </div>
    </main>
  );
}
