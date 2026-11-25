import OpenAI from "openai";
import { parseLessonPlanJson } from "@/lib/lesson-plan";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const required = ["gradeLevel", "subject", "topic", "competency", "format"] as const;
    if (required.some((key) => typeof input[key] !== "string" || !(input[key] as string).trim())) {
      return Response.json({ success: false, error: "All lesson fields are required." }, { status: 400 });
    }

    const gradeLevel = (input.gradeLevel as string).trim();
    const subject = (input.subject as string).trim();
    const topic = (input.topic as string).trim();
    const competency = (input.competency as string).trim();
    const format = (input.format as string).trim();

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return Response.json({ success: false, error: "AI generation is not configured. Set OPENAI_API_KEY in the server environment and restart TeachMate." }, { status: 503 });
    }
    const openai = new OpenAI({ apiKey });
    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: `
You are TeachMate AI, an AI teaching assistant designed to help teachers create accurate, age-appropriate, practical, and classroom-ready lesson plans.

Create a lesson plan using the information below.

Grade Level: ${gradeLevel}
Subject: ${subject}
Topic: ${topic}
Learning Competency: ${competency}
Lesson Plan Format: ${format}

Important instructions:

- Follow the specified grade level.
- Follow the specified subject.
- Use the teacher-provided learning competency.
- Do not invent an official curriculum competency.
- Make the objectives measurable and appropriate for the grade level.
- Make activities practical for a real classroom.
- Use clear professional language.
- Make the lesson coherent from objectives through assessment.
- If the requested format is ILAW, organize the content so it can later be adapted into an ILAW lesson plan.
- If the requested format is DLL, organize the content so it can later be adapted into a DLL.
      `,

      text: {
        format: {
          type: "json_schema",
          name: "teachmate_lesson_plan",
          strict: true,

          schema: {
            type: "object",

            properties: {
              learningCompetency: {
                type: "string",
              },

              objectives: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              learnerContext: {
                type: "string",
              },

              materials: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              preLesson: {
                type: "string",
              },

              learningExperience: {
                type: "string",
              },

              guidedPractice: {
                type: "string",
              },

              independentPractice: {
                type: "string",
              },

              assessment: {
                type: "string",
              },

              assignment: {
                type: "string",
              },

              remediation: {
                type: "string",
              },

              enrichment: {
                type: "string",
              },
            },

            required: [
              "learningCompetency",
              "objectives",
              "learnerContext",
              "materials",
              "preLesson",
              "learningExperience",
              "guidedPractice",
              "independentPractice",
              "assessment",
              "assignment",
              "remediation",
              "enrichment",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const lessonPlan = parseLessonPlanJson(response.output_text);
    if (!lessonPlan) {
      console.error("OpenAI returned an invalid LessonPlan payload.");
      return Response.json(
        { success: false, error: "The generated lesson plan was invalid. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({ success: true, lessonPlan });

  } catch {
    console.error("Lesson generation failed.");

    return Response.json(
      {
        success: false,
        error: "Failed to generate lesson plan.",
      },
      {
        status: 500,
      }
    );
  }
}