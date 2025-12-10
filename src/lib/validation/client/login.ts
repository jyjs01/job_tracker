
export type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export type LoginFormResult =
  | { ok: true; data: LoginFormValues }
  | { ok: false; error: string };

  
export function parseLoginForm(form: HTMLFormElement): LoginFormResult {
  const formData = new FormData(form);

  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { ok: false, error: "이메일과 비밀번호를 모두 입력해주세요." };
  }

  // 아주 간단한 형식 체크 (원하면 더 강화 가능)
  if (!email.includes("@")) {
    return { ok: false, error: "이메일 형식을 확인해주세요." };
  }

  return {
    ok: true,
    data: { email, password, remember },
  };
}
