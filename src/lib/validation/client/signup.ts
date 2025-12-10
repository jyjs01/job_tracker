
export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
};

export type SignupFormResult =
  | { ok: true; data: SignupFormValues }
  | { ok: false; error: string };


  
export function parseAndValidateSignupForm(
  form: HTMLFormElement
): SignupFormResult {
  const formData = new FormData(form);

  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const passwordConfirm = formData.get("passwordConfirm")?.toString() ?? "";
  const agree = formData.get("agree") === "on";

  // 클라이언트 쪽 간단 검증
  if (!name || !email || !password || !passwordConfirm) {
    return { ok: false, error: "모든 필드를 입력해주세요." };
  }

  if (password.length < 8) {
    return { ok: false, error: "비밀번호는 8자 이상이어야 합니다." };
  }

  if (password !== passwordConfirm) {
    return {
      ok: false,
      error: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    };
  }

  if (!agree) {
    return {
      ok: false,
      error: "개인정보 처리방침에 동의해야 회원가입이 가능합니다.",
    };
  }

  return {
    ok: true,
    data: { name, email, password, passwordConfirm, agree },
  };
}
