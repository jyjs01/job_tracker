import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/CheckBox";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">로그인</h1>
        <p className="mt-1 text-xs text-slate-500">
          JobTracker 계정으로 로그인해주세요.
        </p>

        <form className="mt-6 flex flex-col gap-4">
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
              placeholder="비밀번호를 입력해주세요."
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox />
              <span>로그인 상태 유지</span>
            </label>
            {/* 텍스트 버튼처럼 보이게 */}
            <Button variant="text" size="sm">
              비밀번호를 잊으셨나요?
            </Button>       
          </div>

          <Button type="submit" size="lg" fullWidth>
            로그인
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          아직 계정이 없다면{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            회원가입
          </Link>
          을 진행해주세요.
        </p>
      </div>
    </main>
  );
}
