import { z } from "zod";

const yyyyMmDd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다.");

export const applicationStatusSchema = z.enum([
  "준비",
  "지원 완료",
  "서류 합격",
  "면접 진행",
  "합격",
  "불합격",
]);

export const createApplicationSchema = z.object({
  jobPostingId: z.string().min(1, "jobPostingId가 필요합니다."),
  status: applicationStatusSchema,
  appliedAt: yyyyMmDd.optional().nullable(),
  memo: z.string().max(5000).optional().nullable(),
});

export const createApplicationsSchema = createApplicationSchema;

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
