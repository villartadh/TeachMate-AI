import type { LessonPlan } from "@/types/lesson-plan";

const stringFields: (keyof Omit<LessonPlan, "objectives" | "materials">)[] = [
  "learningCompetency", "learnerContext", "preLesson", "learningExperience",
  "guidedPractice", "independentPractice", "assessment", "assignment",
  "remediation", "enrichment",
];

export function isLessonPlan(value: unknown): value is LessonPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Record<string, unknown>;
  if (!stringFields.every((key) => typeof plan[key] === "string")) return false;
  return ["objectives", "materials"].every(
    (key) => Array.isArray(plan[key]) && (plan[key] as unknown[]).every((item) => typeof item === "string"),
  );
}

export function parseLessonPlanJson(value: string): LessonPlan | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return isLessonPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
