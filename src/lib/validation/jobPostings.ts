import { z } from "zod";

export const createJobPostingSchema = z.object({

  title: z.string().min(1, "공고 제목은 필수입니다."),
  position: z.string().optional(),
  source: z.string().optional(),
  url: z.string().url("URL 형식이 올바르지 않습니다.").optional(),
  career: z.string().optional(),
  salary: z.string().optional(),
  companyName: z.string().min(1, "회사명은 필수입니다."),
  companyIndustry: z.string().optional(),
  companyHomepageUrl: z
    .string()
    .url("유효한 URL 형식이 아닙니다.")
    .optional()
    .or(z.literal("")),


  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD여야 합니다.")
    .optional(),

  employmentType: z.string().optional(),
  location: z.string().optional(),

  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  preferred: z.string().optional(),
  benefits: z.string().optional(),

  memo: z.string().optional(),
});

export type CreateJobPostingBodyInput = z.infer<
  typeof createJobPostingSchema
>;
