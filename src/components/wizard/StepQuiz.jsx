import { AlertTriangle, CheckCircle, ListChecks } from 'lucide-react';
import { QUIZ } from '../../lib/constants';
import { cn } from '../../lib/utils';
import CodeBlock from '../ui/CodeBlock';

export default function StepQuiz({ answers, onAnswer, index, setIndex, error }) {
  const question = QUIZ[index];
  const answeredCount = QUIZ.filter((item) => Number.isInteger(answers[item.id])).length;
  const selectedIndex = answers[question.id];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            Mini-quiz de conocimiento
          </div>
          <h3 className="mt-1.5 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Pregunta {index + 1} de {QUIZ.length}
          </h3>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">
          <span className={cn('h-1.5 w-1.5 rounded-full', answeredCount === QUIZ.length ? 'bg-emerald-500' : 'bg-indigo-500')} />
          {answeredCount} de {QUIZ.length} respondidas
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-[width] duration-500 ease-out"
          style={{ width: `${(answeredCount / QUIZ.length) * 100}%` }}
        />
      </div>

      <div className="mt-4 flex items-center gap-1.5" aria-label="Navegación de preguntas">
        {QUIZ.map((item, itemIndex) => {
          const answered = Number.isInteger(answers[item.id]);
          const current = itemIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Ir a la pregunta ${itemIndex + 1}: ${item.topic}`}
              aria-current={current ? 'step' : undefined}
              title={item.topic}
              className={cn(
                'grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                current
                  ? 'bg-slate-950 text-white ring-2 ring-slate-950 ring-offset-2'
                  : answered
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              )}
            >
              {answered && !current ? <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" /> : itemIndex + 1}
            </button>
          );
        })}
        <span className="ml-1 hidden text-[10px] font-medium text-slate-400 sm:inline">
          Puedes moverte entre preguntas
        </span>
      </div>

      <div
        key={question.id}
        className="mt-5 animate-fade-in rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600 ring-1 ring-indigo-100">
            {question.topic}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Nivel {index <= 1 ? 'básico' : index <= 3 ? 'intermedio' : 'avanzado'}</span>
        </div>

        <h4 className="mt-3 text-[15px] font-bold leading-snug text-slate-900 sm:text-base">
          {question.question}
        </h4>

        <CodeBlock code={question.code} />

        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={`Opciones para ${question.topic}`}>
          {question.options.map((option, optionIndex) => {
            const selected = selectedIndex === optionIndex;
            const letter = String.fromCharCode(65 + optionIndex);
            return (
              <label
                key={option}
                className={cn(
                  'group flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2',
                  selected
                    ? 'border-indigo-500 bg-white shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <input
                  type="radio"
                  name={`quiz-${question.id}`}
                  value={optionIndex}
                  checked={selected}
                  onChange={() => onAnswer(question.id, optionIndex)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold transition-colors',
                    selected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  )}
                >
                  {letter}
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 font-semibold text-slate-700',
                    question.monoOptions ? 'font-mono text-[12px] sm:text-[13px]' : 'text-[13px] sm:text-sm'
                  )}
                >
                  {option}
                </span>
                {selected ? <CheckCircle className="h-4.5 w-4.5 shrink-0 text-indigo-600" aria-hidden="true" /> : null}
              </label>
            );
          })}
        </div>

        {error ? (
          <p className="mt-3 flex items-start gap-1.5 text-xs font-semibold text-rose-600" role="alert">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}
      </div>

      <p className="mt-3 text-center text-[10px] text-slate-400">
        Tu resultado se calcula automáticamente al enviar las 6 respuestas.
      </p>
    </div>
  );
}
