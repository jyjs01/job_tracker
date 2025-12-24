import type { InterviewStatus } from "@/src/types/interviews";

export type ScheduleItem = {
  id: string;
  scheduledAt: string;
  date: string;
  time: string;
  company: string;
  position: string;
  roundOrType: string;
  place: "online" | "offline";
  status: InterviewStatus;
};