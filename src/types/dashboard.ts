import { InterviewItem } from "@/src/components/dashboard/InterviewCard";
import { ClosingJobItem } from "@/src/components/dashboard/ClosingJobCard";

export type JsonObject = Record<string, unknown>;

export type DashboardVM = {
  stats: {
    totalApplications: number;
    passedDocs: number;
    passRate: string;
    weeklyApplied: number;
    thisWeekInterviews: number;
  };
  upcomingInterviews: InterviewItem[];
  closingJobs: ClosingJobItem[];
};