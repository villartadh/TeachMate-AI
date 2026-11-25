import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              TeachMate AI
            </h1>

            <p className="text-sm text-gray-500">
              Your AI Teaching Assistant
            </p>
          </div>

          <button className="rounded-lg border px-4 py-2 text-sm">
            Profile
          </button>

        </div>
      </header>


      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            What would you like to create?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Create lesson plans, worksheets, quizzes, and
            learning materials with the help of AI.
          </p>

        </div>


        {/* Tool Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Lesson Planner */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="text-4xl">
              📚
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Lesson Planner
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Create structured lesson plans for your classes.
            </p>

            <Link
                href="/lesson-planner"
                className="mt-6 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
                  Create Lesson
            </Link>

          </div>


          {/* Worksheet */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="text-4xl">
              📝
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Worksheet Maker
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Generate classroom worksheets and activities.
            </p>

            <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Create Worksheet
            </button>

          </div>


          {/* Quiz */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="text-4xl">
              ❓
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Quiz Maker
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Create quizzes with answer keys.
            </p>

            <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Create Quiz
            </button>

          </div>


          {/* Reviewer */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="text-4xl">
              📖
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Reviewer Maker
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Turn learning materials into study reviewers.
            </p>

            <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Create Reviewer
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}
