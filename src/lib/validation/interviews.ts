import { z } from "zod";

export const interviewStatusSchema = z.enum(["예정", "합격", "불합격"]);

const objectIdLikeSchema = z
  .string()
  .min(1, "필수 값입니다.")
  .refine((v) => /^[a-fA-F0-9]{24}$/.test(v), "유효한 id 형식이 아닙니다.");

const isoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .or(z.string().datetime()) // offset 없는 ISO도 허용
  .or(z.string().min(1).refine((v) => !Number.isNaN(new Date(v).getTime()), "유효한 날짜 형식이 아닙니다."));

export const createInterviewSchema = z.object({
  userId: z.string().min(1, "userId는 필수입니다."),
  jobPostingId: objectIdLikeSchema,
  applicationId: objectIdLikeSchema,

  type: z.string().min(1, "type은 필수입니다.").max(60, "type은 60자 이하여야 합니다."),
  scheduledAt: z
    .union([isoDateTimeSchema, z.null()])
    .default(null),
  location: z
    .string()
    .trim()
    .max(200, "location은 200자 이하여야 합니다.")
    .nullable()
    .default(null),

  status: interviewStatusSchema,
  memo: z
    .string()
    .trim()
    .max(2000, "memo는 2000자 이하여야 합니다.")
    .nullable()
    .default(null),
});

export const updateInterviewSchema = z.object({
  jobPostingId: objectIdLikeSchema.optional(),
  applicationId: objectIdLikeSchema.optional(),

  type: z.string().min(1).max(60).optional(),
  scheduledAt: z.union([isoDateTimeSchema, z.null()]).optional(),
  location: z.string().trim().max(200).nullable().optional(),

  status: interviewStatusSchema.optional(),
  memo: z.string().trim().max(2000).nullable().optional(),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type InterviewStatus = z.infer<typeof interviewStatusSchema>;
