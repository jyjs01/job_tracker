import { z } from "zod";

export const jobPostingFormSchema = z.object({
  title: z.string().min(1, "공고 제목을 입력해주세요."),
  jobCategory: z.string().min(1, "직무 분야를 선택해주세요."),
  employmentType: z.string().min(1, "고용 형태를 선택해주세요."),
  location: z.string().min(1, "근무 지역을 입력해주세요."),
  responsibilities: z.string().min(1, "주요 업무를 입력해주세요."),
  requirements: z.string().min(1, "지원 요건을 입력해주세요."),
  preferred: z.string().optional(),
  benefits: z.string().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "마감일 형식이 올바르지 않습니다.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  source: z.string().optional(),
  url: z
    .string()
    .url("올바른 URL 형식이 아닙니다.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  memo: z.string().optional(),
});

export type JobPostingFormValues = z.infer<typeof jobPostingFormSchema>;
