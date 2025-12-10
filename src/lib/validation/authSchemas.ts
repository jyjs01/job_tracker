import { z } from "zod";

/** 회원가입 스키마 */
export const signupSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("이메일 형식을 확인해주세요."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(64, "비밀번호는 64자 이하여야 합니다."),
});

export type SignupInput = z.infer<typeof signupSchema>;



/** 로그인 스키마 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("이메일 형식을 확인해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginInput = z.infer<typeof loginSchema>;
