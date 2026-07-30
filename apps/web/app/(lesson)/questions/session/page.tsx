import { QuizRunner } from "@/components/quiz-runner";
import { hideQuestionAction, saveQuestionAttemptAction } from "@/app/actions/question-actions";
import { loadQuestionPracticeContext } from "@/lib/question-practice-context";
import { getSessionQuestions, selectTopicQuestions, type PracticeSessionSize } from "@/lib/quiz";

type QuestionSessionPageProps = {
  searchParams: Promise<{ mode?: string; topic?: string; size?: string }>;
};

function parseSessionSize(size: string | undefined): PracticeSessionSize {
  if (size === "50") return 50;
  return size === "survival" ? "survival" : 20;
}

export default async function QuestionSessionPage({ searchParams }: QuestionSessionPageProps) {
  const query = await searchParams;
  const { questions, canPersist } = await loadQuestionPracticeContext();
  const sessionSize = parseSessionSize(query.size);
  const pool = query.topic
    ? selectTopicQuestions(questions, query.topic)
    : query.mode === "random"
      ? questions
      : [];
  const seed = Number.parseInt(new Date().toISOString().slice(0, 10).replaceAll("-", ""), 10);
  const sessionQuestions = getSessionQuestions(pool, sessionSize, seed);

  if (sessionQuestions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
        <section className="w-full max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h1 className="text-xl font-semibold">No hay preguntas para esta sesión</h1>
          <p className="mt-3 text-sm">El tema seleccionado todavía no tiene preguntas históricas oficiales disponibles, o has ocultado las disponibles.</p>
          <a className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white" href="/questions">Volver a preguntas</a>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <QuizRunner
        canPersist={canPersist}
        onHideQuestion={hideQuestionAction}
        onSaveAttempt={saveQuestionAttemptAction}
        questions={sessionQuestions}
        sessionSize={sessionSize}
      />
    </main>
  );
}
