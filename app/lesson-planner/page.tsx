"use client";

import { useState } from "react";
import type { LessonPlan } from "@/types/lesson-plan";

export default function LessonPlanner() {
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [competency, setCompetency] = useState("");
  const [format, setFormat] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLessonPlan, setEditedLessonPlan] =
  useState<LessonPlan | null>(null);


  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isGenerating) return;

    setSubmitted(false);
    setLessonPlan(null);
    setEditedLessonPlan(null);
    setIsEditing(false);
    setErrorMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradeLevel, subject, topic, competency, format }),
      });

      const data: unknown = await response.json();
      if (!data || typeof data !== "object") throw new Error("Invalid server response.");
      const result = data as { success?: boolean; lessonPlan?: LessonPlan; error?: string };

      if (!response.ok || !result.success || !result.lessonPlan) {
        throw new Error(result.error || "Failed to generate lesson plan.");
      }

      setLessonPlan(result.lessonPlan);
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate lesson plan.");
    } finally {
      setIsGenerating(false);
    }
  }

  function startEditing() {
    if (!lessonPlan) {
      return;
    }

    setEditedLessonPlan({
      ...lessonPlan,
      objectives: [...lessonPlan.objectives],
      materials: [...lessonPlan.materials],
    });

    setIsEditing(true);
  }

  function saveChanges() {
    if (!editedLessonPlan) {
      return;
    }

    setLessonPlan(editedLessonPlan);
    setEditedLessonPlan(null);
    setIsEditing(false);
  }

  function cancelEditing() {
    setEditedLessonPlan(null);
    setIsEditing(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        
        <h1 className="text-3xl font-bold text-gray-900">
          Lesson Planner
        </h1>

        <p className="mt-2 text-gray-600">
          Create an AI-powered lesson plan.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-white p-6 shadow"
        >

          {/* Grade Level */}
          <label className="block font-medium text-gray-700">
            Grade Level
          </label>

          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            required
          >
            <option value="">Select Grade Level</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
          </select>


          {/* Subject */}
          <label className="mt-5 block font-medium text-gray-700">
            Subject
          </label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            required
          >
            <option value="">Select Subject</option>
            <option value="English">English</option>
            <option value="Filipino">Filipino</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Araling Panlipunan">Araling Panlipunan</option>
            <option value="GMRC">GMRC</option>
          </select>


          {/* Topic */}
          <label className="mt-5 block font-medium text-gray-700">
            Topic
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Pang-abay"
            className="mt-2 w-full rounded-lg border p-3"
            required
          />


          {/* Learning Competency */}
          <label className="mt-5 block font-medium text-gray-700">
            Learning Competency
          </label>

          <textarea
            value={competency}
            onChange={(e) => setCompetency(e.target.value)}
            placeholder="Enter the learning competency..."
            rows={4}
            className="mt-2 w-full rounded-lg border p-3"
            required
          />


          {/* Format */}
          <label className="mt-5 block font-medium text-gray-700">
            Lesson Plan Format
          </label>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            required
          >
            <option value="">Select Format</option>
            <option value="ILAW">ILAW</option>
            <option value="DLL">DLL</option>
          </select>


          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? "Generating…" : "Generate Lesson Plan"}
          </button>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

        </form>


        {/* Generated Lesson Plan */}
        {submitted && lessonPlan && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">

            <h2 className="text-3xl font-bold text-gray-900">
              Generated Lesson Plan
            </h2>
            <div className="mt-4 flex gap-3">

              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Edit Lesson Plan
                </button>
              )}

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              )}

            </div>

            <p className="mt-2 text-gray-500">
              AI-generated lesson plan based on your selected information.
            </p>


            {/* Lesson Information */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Lesson Information
              </h3>

              <div className="mt-3 rounded-lg bg-gray-50 p-4 text-gray-700">

                <p>
                  <strong>Grade Level:</strong> {gradeLevel}
                </p>

                <p className="mt-2">
                  <strong>Subject:</strong> {subject}
                </p>

                <p className="mt-2">
                  <strong>Topic:</strong> {topic}
                </p>

                <p className="mt-2">
                  <strong>Format:</strong> {format}
                </p>

              </div>

            </section>


            {/* Learning Competency */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Learning Competency
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.learningCompetency}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      learningCompetency: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 text-gray-700">
                  {lessonPlan?.learningCompetency}
                </p>
              )}

            </section>


            {/* Objectives */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Learning Objectives
              </h3>

              {isEditing && editedLessonPlan ? (
                <div className="mt-3 space-y-3">

                  {editedLessonPlan.objectives.map(
                    (objective: string, index: number) => (
                      <textarea
                        key={index}
                        value={objective}
                        onChange={(e) => {
                          const updatedObjectives = [
                            ...editedLessonPlan.objectives,
                          ];

                          updatedObjectives[index] = e.target.value;

                          setEditedLessonPlan({
                            ...editedLessonPlan,
                            objectives: updatedObjectives,
                          });
                        }}
                        rows={3}
                        className="w-full rounded-lg border p-3 text-gray-700"
                      />
                    )
                  )}

                </div>
              ) : (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">

                  {lessonPlan?.objectives.map(
                    (objective: string, index: number) => (
                      <li key={index}>
                        {objective}
                      </li>
                    )
                  )}

                </ul>
              )}

            </section>


            {/* Learner Context */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Learner Context
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.learnerContext}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      learnerContext: e.target.value,
                    })
                  }
                  rows={5}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-wrap text-gray-700">
                  {lessonPlan.learnerContext}
                </p>
              )}

            </section>


            {/* Materials */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Learning Materials
              </h3>

              {isEditing && editedLessonPlan ? (
                <div className="mt-3 space-y-3">

                  {editedLessonPlan.materials.map(
                    (material: string, index: number) => (
                      <textarea
                        key={index}
                        value={material}
                        onChange={(e) => {
                          const updatedMaterials = [
                            ...editedLessonPlan.materials,
                          ];

                          updatedMaterials[index] = e.target.value;

                          setEditedLessonPlan({
                            ...editedLessonPlan,
                            materials: updatedMaterials,
                          });
                        }}
                        rows={2}
                        className="w-full rounded-lg border p-3 text-gray-700"
                      />
                    )
                  )}

                </div>
              ) : (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">

                  {lessonPlan?.materials?.map(
                    (material: string, index: number) => (
                      <li key={index}>
                        {material}
                      </li>
                    )
                  )}

                </ul>
              )}

            </section>


            {/* Pre-Lesson */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Pre-Lesson Activity
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.preLesson}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      preLesson: e.target.value,
                    })
                  }
                  rows={6}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 text-gray-700">
                  {lessonPlan?.preLesson}
                </p>
              )}

            </section>


            {/* Learning Experience */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Learning Experience
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.learningExperience}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      learningExperience: e.target.value,
                    })
                  }
                  rows={8}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.learningExperience}
                </p>
              )}

            </section>


            {/* Guided Practice */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Guided Practice
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.guidedPractice}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      guidedPractice: e.target.value,
                    })
                  }
                  rows={8}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.guidedPractice}
                </p>
              )}

            </section>


            {/* Independent Practice */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Independent Practice
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.independentPractice}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      independentPractice: e.target.value,
                    })
                  }
                  rows={8}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.independentPractice}
                </p>
              )}

            </section>


            {/* Assessment */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Assessment
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.assessment}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      assessment: e.target.value,
                    })
                  }
                  rows={8}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.assessment}
                </p>
              )}

            </section>


            {/* Assignment */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Assignment
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.assignment}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      assignment: e.target.value,
                    })
                  }
                  rows={6}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.assignment}
                </p>
              )}

            </section>


            {/* Remediation */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Remediation
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.remediation}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      remediation: e.target.value,
                    })
                  }
                  rows={6}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.remediation}
                </p>
              )}

            </section>


            {/* Enrichment */}
            <section className="mt-8">

              <h3 className="text-xl font-bold text-blue-700">
                Enrichment
              </h3>

              {isEditing && editedLessonPlan ? (
                <textarea
                  value={editedLessonPlan.enrichment}
                  onChange={(e) =>
                    setEditedLessonPlan({
                      ...editedLessonPlan,
                      enrichment: e.target.value,
                    })
                  }
                  rows={6}
                  className="mt-3 w-full rounded-lg border p-3 text-gray-700"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {lessonPlan.enrichment}
                </p>
              )}

            </section>

          </div>
        )}

      </div>
    </main>
  );
}