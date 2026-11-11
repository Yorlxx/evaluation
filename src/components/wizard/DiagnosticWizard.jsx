import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, ShieldCheck } from 'lucide-react';
import StepLogistics from './StepLogistics';
import StepExperience from './StepExperience';
import StepQuiz from './StepQuiz';
import WizardProgress from './WizardProgress';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { EMPTY_FORM, QUIZ } from '../../lib/constants';
import { resolveQuiz } from '../../lib/diagnostic';
import { guardarDiagnostico } from '../../lib/api';
import { saveLastResult } from '../../lib/resultStorage';

const STEP_COPY = {
  1: {
    eyebrow: 'Paso 1 · Logística y equipamiento',
    title: 'Cuéntanos cómo te organizas',
    description: 'Con estos datos elegiremos un horario viable y prepararemos los materiales de práctica.',
  },
  2: {
    eyebrow: 'Paso 2 · Experiencia previa',
    title: '¿Qué tanto has explorado?',
    description: 'No evaluamos tu experiencia aquí: la usamos para saber desde dónde acompañarte.',
  },
  3: {
    eyebrow: 'Paso 3 · Mini-quiz de conocimiento',
    title: 'Pongamos a prueba tu lógica',
    description: 'Seis preguntas sobre las bases de Java. Si algo no lo sabes, elige tu mejor intuición.',
  },
};

const FIELD_IDS = {
  nombreCompleto: 'nombreCompleto',
  grado: 'grado-group',
  dias: 'dias-group',
  franjas: 'dias-group',
  equipo: 'equipo-group',
  conexion: 'conexion-group',
  experiencia: 'experiencia-0',
};

function validateLogistics(form) {
  const errors = {};
  if (form.nombreCompleto.trim().length < 3) {
    errors.nombreCompleto = 'Escribe tu nombre completo (mínimo 3 caracteres).';
  }
  if (!form.grado) errors.grado = 'Selecciona tu grado académico.';
  if (form.dias.length === 0) errors.dias = 'Selecciona al menos un día disponible.';
  if (form.franjas.length === 0) errors.franjas = 'Selecciona al menos una franja horaria.';
  if (!form.equipo) errors.equipo = 'Indica con qué equipo cuentas para practicar.';
  if (!form.conexion) errors.conexion = 'Indica tu situación de conexión a internet.';
  return errors;
}

function validateExperience(form) {
  const errors = {};
  if (!form.experiencia) errors.experiencia = 'Elige la opción que mejor describa tu experiencia.';
  return errors;
}

function focusError(errors) {
  const firstKey = Object.keys(errors)[0];
  const id = FIELD_IDS[firstKey];
  if (!id) return;
  window.setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      element.focus({ preventScroll: true });
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 40);
}

export default function DiagnosticWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [quizError, setQuizError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const cardRef = useRef(null);
  const lastNavigationRef = useRef({ step: 1, questionIndex: 0 });

  useEffect(() => {
    const previous = lastNavigationRef.current;
    if (previous.step === step && previous.questionIndex === questionIndex) return;
    lastNavigationRef.current = { step, questionIndex };

    const node = cardRef.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [step, questionIndex]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
    setSubmitError('');
  };

  const toggleArray = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].includes(value)
        ? previous[field].filter((item) => item !== value)
        : [...previous[field], value],
    }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionIndex }));
    setQuizError('');
    setSubmitError('');
  };

  const goBack = () => {
    setQuizError('');
    setSubmitError('');
    if (step === 3 && questionIndex > 0) {
      setQuestionIndex((index) => index - 1);
      return;
    }
    if (step > 1) {
      setErrors({});
      setStep((current) => current - 1);
    }
  };

  const submitQuiz = async () => {
    const missingIndex = QUIZ.findIndex((question) => !Number.isInteger(answers[question.id]));
    if (missingIndex >= 0) {
      setQuestionIndex(missingIndex);
      setQuizError('Responde esta pregunta para completar el diagnóstico.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const quiz = resolveQuiz(answers);
      const payload = {
        nombre_completo: form.nombreCompleto.trim(),
        grado: form.grado,
        disponibilidad_dias: form.dias,
        disponibilidad_franjas: form.franjas,
        disponibilidad_detalle: form.disponibilidadDetalle.trim() || null,
        equipo: form.equipo,
        conexion_internet: form.conexion,
        experiencia_previa: form.experiencia,
        experiencia_detalle: form.experienciaDetalle.trim() || null,
        puntaje: quiz.puntaje,
        nivel: quiz.nivel.label,
        respuestas: quiz.respuestas,
      };

      const saved = await guardarDiagnostico(payload);
      const result = {
        record: saved.data,
        source: saved.source,
        total: QUIZ.length,
      };
      saveLastResult(result);
      navigate('/confirmacion', { state: result });
    } catch (error) {
      setSubmitError(
        error?.message ||
          'No pudimos guardar tu diagnóstico. Revisa tu conexión e inténtalo nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrimary = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (step === 1) {
      const nextErrors = validateLogistics(form);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        focusError(nextErrors);
        return;
      }
      setErrors({});
      setStep(2);
      return;
    }

    if (step === 2) {
      const nextErrors = validateExperience(form);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        focusError(nextErrors);
        return;
      }
      setErrors({});
      setStep(3);
      return;
    }

    if (!Number.isInteger(answers[QUIZ[questionIndex].id])) {
      setQuizError('Selecciona una respuesta para continuar.');
      return;
    }

    if (questionIndex < QUIZ.length - 1) {
      setQuizError('');
      setQuestionIndex((index) => index + 1);
      return;
    }

    const missingIndex = QUIZ.findIndex((question) => !Number.isInteger(answers[question.id]));
    if (missingIndex >= 0) {
      setQuestionIndex(missingIndex);
      setQuizError('Aún falta responder una pregunta. Complétala para enviar.');
      return;
    }

    await submitQuiz();
  };

  const copy = STEP_COPY[step];
  const isLastQuestion = step === 3 && questionIndex === QUIZ.length - 1;
  const answeredCount = QUIZ.filter((question) => Number.isInteger(answers[question.id])).length;
  const primaryLabel =
    step === 1
      ? 'Continuar a experiencia'
      : step === 2
        ? 'Comenzar mini-quiz'
        : isLastQuestion
          ? 'Enviar diagnóstico'
          : 'Siguiente pregunta';

  return (
    <div ref={cardRef} id="diagnostico-card" className="scroll-mt-28">
      <div className="surface overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-indigo-50/50 px-5 py-5 sm:px-7 sm:py-6">
          <WizardProgress step={step} />
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
              {copy.eyebrow}
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[28px]">
              {copy.title}
            </h2>
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <form onSubmit={handlePrimary} noValidate aria-busy={submitting}>
            <fieldset disabled={submitting} className="m-0 min-w-0 border-0 p-0">
              <div key={step} className="animate-fade-up">
                {step === 1 ? (
                  <StepLogistics
                    form={form}
                    updateField={updateField}
                    toggleArray={toggleArray}
                    errors={errors}
                  />
                ) : null}
                {step === 2 ? (
                  <StepExperience form={form} updateField={updateField} errors={errors} />
                ) : null}
                {step === 3 ? (
                  <StepQuiz
                    answers={answers}
                    onAnswer={handleAnswer}
                    index={questionIndex}
                    setIndex={(index) => {
                      setQuestionIndex(index);
                      setQuizError('');
                    }}
                    error={quizError}
                  />
                ) : null}
              </div>
            </fieldset>

            {submitError ? (
              <Alert
                variant="error"
                title="No pudimos guardar tu diagnóstico"
                className="mt-5"
              >
                {submitError} Si el problema continúa, avisa a tu facilitador.
              </Alert>
            ) : null}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={goBack} disabled={submitting} className="sm:px-4">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {step === 3 && questionIndex > 0 ? 'Pregunta anterior' : 'Volver'}
                </Button>
              ) : (
                <span />
              )}

              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <Button
                  type="submit"
                  size="lg"
                  loading={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? 'Guardando diagnóstico...' : primaryLabel}
                  {!submitting ? (
                    isLastQuestion ? (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    )
                  ) : null}
                </Button>
                <span className="text-center text-[10px] text-slate-400 sm:text-right">
                  {step === 3
                    ? `${answeredCount} de ${QUIZ.length} respondidas · puedes volver antes de enviar`
                    : 'Tus datos solo se usan para adaptar el programa.'}
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
        Diagnóstico confidencial · Proyección Social JavaLab 2026
      </div>
    </div>
  );
}
