import { saveQuestionAttemptAction } from "@/app/actions/question-actions";
import { PracticalCaseRunner } from "@/components/practical-case-runner";
import { loadQuestionPracticeContext } from "@/lib/question-practice-context";

type PracticalSessionPageProps = {
  searchParams: Promise<{ id?: string; oep?: string; paper?: string }>;
};

export default async function PracticalSessionPage({ searchParams }: PracticalSessionPageProps) {
  const query = await searchParams;
  const { questions, canPersist } = await loadQuestionPracticeContext();
  const practical = questions
    .filter((question) => question.type === "practical_case")
    .filter((question) => query.id ? question.id === query.id : true)
    .filter((question) => query.oep ? String(question.oepYear) === query.oep : true)
    .filter((question) => query.paper ? question.caseGroup === query.paper : true)
    .sort((left, right) => left.questionNumber.localeCompare(right.questionNumber, undefined, { numeric: true }));

  if (practical.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
        <section className="max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-semibold">No hay ejercicios prácticos elegibles</h1>
          <p className="mt-3 text-sm">
            Solo se publican enunciados verificados que ya tengan una solución modelo no oficial revisada,
            rúbrica y fuentes de apoyo.
          </p>
          <a className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-white" href="/questions">
            Volver al banco
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <PracticalCaseRunner
        canPersist={canPersist}
        onSaveAttempt={saveQuestionAttemptAction}
        questions={practical}
      />
    </main>
  );
}
