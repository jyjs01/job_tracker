import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/CheckBox";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">회원가입</h1>
        <p className="mt-1 text-xs text-slate-500">
          JobTracker 계정을 새로 생성합니다.
        </p>

        <form className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              이름
            </label>
            <Input id="name" type="text" placeholder="이름을 입력해주세요." />
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
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
            />
          </div>

          <div className="mt-1 text-xs text-slate-600">
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox />
              <span>개인정보 처리방침에 동의합니다.</span>
            </label>
          </div>

          <Button type="submit" size="lg" fullWidth>
            회원가입
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
