"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/CheckBox";
import { parseAndValidateSignupForm } from "@/src/lib/validation/client/signup";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = parseAndValidateSignupForm(e.currentTarget);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const { name, email, password } = result.data;

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 서버에서 온 message 또는 zod errors 중 하나 보여주기
        if (data?.errors) {
          const firstField = Object.keys(data.errors)[0];
          const firstMessage = data.errors[firstField]?.[0];
          setError(firstMessage || data.message || "회원가입에 실패했습니다.");
        } else {
          setError(data.message || "회원가입에 실패했습니다.");
        }
        return;
      }

      // 성공 시 로그인 페이지로 이동
      // TODO: 토스트 넣고 싶으면 여기에서
      router.push("/login");
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
        <h1 className="text-xl font-semibold text-slate-900">회원가입</h1>
        <p className="mt-1 text-xs text-slate-500">
          JobTracker 계정을 새로 생성합니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              이름
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="이름을 입력해주세요."
            />
          </div>

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
              placeholder="8자 이상 영문/숫자 조합으로 입력해주세요."
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              비밀번호 확인
            </label>
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
            />
          </div>

          <div className="mt-1 text-xs text-slate-600">
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox id="agree" name="agree" />
              <span>개인정보 처리방침에 동의합니다.</span>
            </label>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="mt-1 text-xs text-red-500">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "회원가입 중..." : "회원가입"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          이미 계정이 있다면{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
          으로 이동해주세요.
        </p>
      </div>
    </main>
  );
}
