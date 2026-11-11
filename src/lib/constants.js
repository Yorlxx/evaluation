import {
  Blocks,
  Code2,
  Laptop,
  MonitorOff,
  Moon,
  Sprout,
  Sun,
  Sunset,
  Users,
  Wifi,
  WifiOff,
  Signal,
} from 'lucide-react';

export const ADMIN_PIN = '2020';

export const GRADES = [
  {
    value: '4to de secundaria',
    label: '4to de secundaria',
    hint: 'Tercer año de secundaria en curso',
    short: '4to',
  },
  {
    value: '5to de secundaria',
    label: '5to de secundaria',
    hint: 'Último año de secundaria',
    short: '5to',
  },
];

export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const DAYS_SHORT = {
  Lunes: 'Lun',
  Martes: 'Mar',
  Miércoles: 'Mié',
  Jueves: 'Jue',
  Viernes: 'Vie',
  Sábado: 'Sáb',
};

export const TIME_SLOTS = [
  {
    value: 'Mañana',
    label: 'Mañana',
    time: '08:00 – 10:00',
    icon: Sun,
    description: 'Ideal para empezar el día',
  },
  {
    value: 'Tarde',
    label: 'Tarde',
    time: '14:00 – 16:00',
    icon: Sunset,
    description: 'Después del colegio',
  },
  {
    value: 'Noche',
    label: 'Noche',
    time: '18:00 – 20:00',
    icon: Moon,
    description: 'Con más tranquilidad',
  },
];

export const EQUIPMENT_OPTIONS = [
  {
    value: 'PC/Laptop propia',
    label: 'PC / Laptop propia',
    hint: 'Puedo practicar en mi equipo',
    icon: Laptop,
    tone: 'emerald',
  },
  {
    value: 'PC/Laptop compartida',
    label: 'PC / Laptop compartida',
    hint: 'La comparto con mi familia',
    icon: Users,
    tone: 'amber',
  },
  {
    value: 'Sin equipo',
    label: 'Sin equipo',
    hint: 'Necesito apoyo para practicar',
    icon: MonitorOff,
    tone: 'rose',
  },
];

export const INTERNET_OPTIONS = [
  {
    value: 'Estable',
    label: 'Internet estable',
    hint: 'Puedo seguir clases sin cortes',
    icon: Wifi,
    tone: 'emerald',
  },
  {
    value: 'Inestable / Solo datos móviles',
    label: 'Inestable o datos',
    hint: 'Dependo de datos móviles',
    icon: Signal,
    tone: 'amber',
  },
  {
    value: 'Sin internet',
    label: 'Sin internet',
    hint: 'Solo puedo practicar offline',
    icon: WifiOff,
    tone: 'rose',
  },
];

export const EXPERIENCE_OPTIONS = [
  {
    value: 'Nunca he programado',
    label: 'Nunca he programado',
    hint: 'Empezaré desde cero, sin problema.',
    icon: Sprout,
    tone: 'amber',
  },
  {
    value: 'Nociones en Scratch o pseudocódigo',
    label: 'Nociones en Scratch o pseudocódigo',
    hint: 'Ya entiendo ideas como decisiones y repeticiones.',
    icon: Blocks,
    tone: 'sky',
  },
  {
    value: 'Programación previa (Java, Python, C++...)',
    label: 'Programación previa',
    hint: 'He escrito programas en Java, Python, C++ u otro lenguaje.',
    icon: Code2,
    tone: 'emerald',
  },
];

export const QUIZ = [
  {
    id: 'q1',
    topic: 'Tipos de datos',
    question:
      'Necesitas guardar el precio de un producto con decimales, por ejemplo 19.99. ¿Qué tipo de dato de Java es el más adecuado?',
    code: null,
    monoOptions: true,
    options: ['int', 'double', 'boolean', 'char'],
    correctIndex: 1,
    explanation:
      'double almacena números con parte decimal. int solo guarda enteros y char un único carácter.',
  },
  {
    id: 'q2',
    topic: 'Cadenas de texto',
    question: '¿Cuál de estos valores corresponde a un String en Java?',
    code: null,
    monoOptions: true,
    options: ['Juan', '"Juan"', "'J'", '42'],
    correctIndex: 1,
    explanation:
      'Un String se escribe entre comillas dobles. Las comillas simples se reservan para un char.',
  },
  {
    id: 'q3',
    topic: 'Condicionales',
    question:
      'Quieres mostrar "Aprobado" cuando la nota sea 11 o más. ¿Qué operador completa correctamente la condición?',
    code: 'int nota = 14;\nif (nota ___ 11) {\n    System.out.println("Aprobado");\n}',
    monoOptions: true,
    options: ['>', '>=', '==', '!='],
    correctIndex: 1,
    explanation:
      'El operador >= significa "mayor o igual que". Así se incluye exactamente la nota 11.',
  },
  {
    id: 'q4',
    topic: 'Predicción de salida',
    question: 'Observa el código. ¿Qué se imprime en la consola?',
    code: 'int puntos = 7;\n\nif (puntos >= 10) {\n    System.out.println("Nivel alto");\n} else {\n    System.out.println("Sigue practicando");\n}',
    monoOptions: false,
    options: ['Nivel alto', 'Sigue practicando', '7', 'Error de compilación'],
    correctIndex: 1,
    explanation:
      'Como 7 no es mayor o igual que 10, se ejecuta la rama else y se imprime "Sigue practicando".',
  },
  {
    id: 'q5',
    topic: 'Bucles',
    question:
      '¿Qué expresión completa el bucle para mostrar los números del 1 al 5 en orden?',
    code: 'for (int i = 1; i <= 5; ___ ) {\n    System.out.print(i + " ");\n}',
    monoOptions: true,
    options: ['i++', 'i--', 'i += 2', 'i = 0'],
    correctIndex: 0,
    explanation:
      'i++ aumenta el contador de uno en uno. Con i-- el bucle no avanzaría y con i += 2 se saltaría números.',
  },
  {
    id: 'q6',
    topic: 'Arreglos',
    question: 'Dado el arreglo, ¿qué valor se almacena en edades[0]?',
    code: 'int[] edades = {15, 16, 17};',
    monoOptions: true,
    options: ['15', '16', '17', '0'],
    correctIndex: 0,
    explanation:
      'En Java los índices comienzan en 0. Por eso edades[0] guarda el primer valor del arreglo: 15.',
  },
];

export const LEVELS = {
  0: {
    level: 0,
    label: 'Nivel 0 - Desde Cero',
    short: 'Desde Cero',
    range: '0 a 2 aciertos',
    eyebrow: 'Punto de partida',
    description:
      'Requiere iniciar la Sesión 01 desde conceptos básicos, variables y diagramas.',
    message:
      'No necesitas experiencia previa: tu ruta empezará desde la lógica y las bases de Java, con acompañamiento cercano en cada paso.',
    nextStep:
      'Empezaremos con un ejemplo cotidiano, un diagrama y tu primer programa con variables. No necesitas saber nada de código todavía.',
    colors: {
      hexFrom: '#f59e0b',
      hexTo: '#f43f5e',
      badge: 'bg-amber-50 text-amber-800 ring-amber-200',
      dot: 'bg-amber-500',
      text: 'text-amber-700',
      soft: 'bg-amber-50',
      border: 'border-amber-200',
      gradient: 'from-amber-500 to-rose-500',
      bar: 'bg-gradient-to-r from-amber-400 to-rose-500',
    },
    roadmap: [
      {
        title: 'Sesiones 01 – 02',
        detail: 'Algoritmos, variables, tipos de datos y condicionales con diagramas y ejemplos cotidianos.',
      },
      {
        title: 'Sesiones 03 – 04',
        detail: 'Bucles y arreglos con trazas en papel, práctica guiada y ejercicios cortos.',
      },
      {
        title: 'Sesiones 05 – 06',
        detail: 'Primer contacto con cadenas, matrices y recursión, priorizando comprensión sobre velocidad.',
      },
    ],
  },
  1: {
    level: 1,
    label: 'Nivel 1 - Intermedio',
    short: 'Intermedio',
    range: '3 a 4 aciertos',
    eyebrow: 'En camino',
    description:
      'Repaso rápido de condicionales e intensificar Bucles y Arreglos.',
    message:
      'Ya tienes una base para decidir y reconocer estructuras. Tu ruta hará un repaso express y pondrá el foco en automatizar y organizar datos.',
    nextStep:
      'Haremos un repaso rápido de decisiones y luego pasarás a resolver retos con bucles y arreglos, explicando la lógica de cada solución.',
    colors: {
      hexFrom: '#0ea5e9',
      hexTo: '#2563eb',
      badge: 'bg-sky-50 text-sky-800 ring-sky-200',
      dot: 'bg-sky-500',
      text: 'text-sky-700',
      soft: 'bg-sky-50',
      border: 'border-sky-200',
      gradient: 'from-sky-500 to-blue-600',
      bar: 'bg-gradient-to-r from-sky-400 to-blue-600',
    },
    roadmap: [
      {
        title: 'Sesiones 01 – 02',
        detail: 'Repaso express de variables y condicionales, con más tiempo para dominar bucles y contadores.',
      },
      {
        title: 'Sesiones 03 – 04',
        detail: 'Arreglos y cadenas con práctica incremental, búsquedas y recorridos explicados paso a paso.',
      },
      {
        title: 'Sesiones 05 – 06',
        detail: 'Matrices y recursión con retos guiados, comparando soluciones con bucles.',
      },
    ],
  },
  2: {
    level: 2,
    label: 'Nivel 2 - Avanzado',
    short: 'Avanzado',
    range: '5 a 6 aciertos',
    eyebrow: 'Listo para acelerar',
    description:
      'Listos para acelerar hacia Cadenas, Matrices y Recursión.',
    message:
      'Tu lógica ya resuelve las estructuras base. Aprovecharás el programa para profundizar con retos, casos límite y problemas de mayor complejidad.',
    nextStep:
      'Empezarás con un reto integrador para demostrar tu lógica y avanzar hacia problemas de mayor complejidad, con espacio para comparar soluciones.',
    colors: {
      hexFrom: '#10b981',
      hexTo: '#0d9488',
      badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
      soft: 'bg-emerald-50',
      border: 'border-emerald-200',
      gradient: 'from-emerald-500 to-teal-600',
      bar: 'bg-gradient-to-r from-emerald-400 to-teal-600',
    },
    roadmap: [
      {
        title: 'Sesiones 01 – 02',
        detail: 'Consolidación con retos integradores de variables, decisiones y bucles; menos explicación, más autonomía.',
      },
      {
        title: 'Sesiones 03 – 04',
        detail: 'Arreglos y cadenas orientados a problemas tipo concurso, con pruebas de casos límite.',
      },
      {
        title: 'Sesiones 05 – 06',
        detail: 'Matrices y recursión con problemas reto, análisis de eficiencia y explicación de soluciones.',
      },
    ],
  },
};

export const LEVEL_LIST = [LEVELS[0], LEVELS[1], LEVELS[2]];

export const SESSION_PLAN = [
  {
    number: '01',
    title: 'Introducción a Java y condicionales',
    short: 'Variables, datos y decisiones',
    icon: 'terminal',
  },
  {
    number: '02',
    title: 'Bucles y automatización',
    short: 'Repetir con for y while',
    icon: 'repeat',
  },
  {
    number: '03',
    title: 'Arreglos y datos',
    short: 'Guardar y recorrer listas',
    icon: 'list',
  },
  {
    number: '04',
    title: 'Cadenas de caracteres',
    short: 'Texto, length() y charAt()',
    icon: 'text',
  },
  {
    number: '05',
    title: 'Matrices',
    short: 'Filas, columnas y bucles anidados',
    icon: 'grid',
  },
  {
    number: '06',
    title: 'Recursión y cierre',
    short: 'Caso base y llamadas',
    icon: 'recursion',
  },
];

export const GROUP_GUIDANCE = {
  0: {
    headline: 'Construir bases firmes antes de acelerar',
    summary:
      'El grupo necesita comprender la lógica antes de escribir más código. La Sesión 01 debe iniciar desde algoritmo, variables y diagramas; conviene dedicar más tiempo a leer, predecir y explicar resultados.',
    pace: 'Ritmo pausado · 60% práctica guiada',
    focus: 'Variables, tipos de datos y condicionales',
    goal: 'Escribir y explicar un programa con if/else de forma autónoma.',
    actions: [
      'Usar diagramas y ejemplos cotidianos antes de cada bloque de código.',
      'Trabajar en parejas y revisar la salida esperada antes de ejecutar.',
      'Cerrar cada sesión con una traza corta en papel y una pregunta de metacognición.',
    ],
    sessionNotes: [
      'Iniciar desde algoritmo, entrada-proceso-salida y diagramas. Explicar variables paso a paso; dejar switch como opcional.',
      'Trabajar for con trazas en papel antes de programar. Usar contadores simples y revisar siempre la condición de parada.',
      'Dibujar los índices y recorrer el arreglo con el dedo antes del código. Priorizar máximo, mínimo y promedio.',
      'Enseñar length() y charAt() con recorridos cortos. Introducir equals() desde el primer ejemplo.',
      'Dibujar una matriz 3×3 y ubicar coordenadas antes de los bucles anidados.',
      'Presentar recursión con trazas en papel y un solo caso base claro. Cerrar con repaso de bucles y arreglos.',
    ],
  },
  1: {
    headline: 'Repaso breve y foco en bucles y arreglos',
    summary:
      'El grupo ya reconoce variables y decisiones. Conviene hacer un repaso express de condicionales en la Sesión 01 y reforzar bucles y arreglos con práctica incremental antes de avanzar a temas nuevos.',
    pace: 'Ritmo equilibrado · 50% práctica',
    focus: 'Bucles, arreglos y depuración',
    goal: 'Resolver un ejercicio combinando condicionales, bucles y arreglos, y explicar la salida.',
    actions: [
      'Convertir el repaso de condicionales en un reto corto de predicción de salida.',
      'Aumentar el tiempo de práctica de bucles y arreglos con casos de dificultad creciente.',
      'Pedir que cada estudiante explique una decisión de su código al terminar la sesión.',
    ],
    sessionNotes: [
      'Repaso express con un reto de condicionales; no detenerse demasiado en conceptos ya resueltos.',
      'Intensificar for y while con contadores, acumuladores y detección de ciclos infinitos.',
      'Priorizar arreglos: recorrido con for, búsqueda secuencial y cálculo de máximo/promedio.',
      'Trabajar cadenas con ejercicios de conteo y comparación usando equals().',
      'Introducir matrices con recorridos guiados y verificación de índices.',
      'Abordar recursión con factorial y trazas; comparar con la versión iterativa.',
    ],
  },
  2: {
    headline: 'Acelerar hacia retos y temas avanzados',
    summary:
      'El grupo demuestra una base sólida. La Sesión 01 puede convertirse en un repaso desafiante; conviene destinar más tiempo a cadenas, matrices y recursión, incorporando problemas tipo concurso y pruebas de casos límite.',
    pace: 'Ritmo ágil · 40% teoría / 60% retos',
    focus: 'Cadenas, matrices y recursión',
    goal: 'Resolver un problema nuevo, probar casos límite y explicar la solución ante el grupo.',
    actions: [
      'Plantear retos abiertos con más de una solución válida y comparar enfoques.',
      'Incluir pruebas de casos límite y análisis de errores frecuentes.',
      'Reservar la última parte de cada sesión para que el estudiante explique su solución.',
    ],
    sessionNotes: [
      'Compactar el repaso de bases con un reto integrador de variables, decisiones y operadores.',
      'Profundizar bucles con problemas de acumulación, series y validación de entrada.',
      'Llevar arreglos a búsquedas, ordenamientos iniciales y problemas de dos recorridos.',
      'Trabajar cadenas con subcadenas, conteo de vocales y comparaciones; exigir pruebas propias.',
      'Resolver matrices con recorridos, sumas y búsquedas; introducir retos de tableros.',
      'Cerrar recursión con factorial, Fibonacci y comparación de eficiencia con bucles.',
    ],
  },
};

export const LOGISTICS_ALERTS = {
  noEquipment:
    'Asignar una laptop compartida o el equipo del aula y organizar parejas para la práctica.',
  sharedEquipment:
    'Planificar momentos de práctica individual en el aula y compartir apuntes/código entre sesiones.',
  noInternet:
    'Preparar una carpeta offline con JDK, editor y ejercicios; no depender de plataformas en línea.',
  unstableInternet:
    'Descargar materiales y usar un editor local; dejar tareas cortas que puedan completarse sin conexión.',
  goodConnectivity:
    'Aprovechar la conexión estable para retos en línea y seguimiento asincrónico entre sesiones.',
};

export const DEMO_STUDENTS = [
  {
    nombre_completo: 'Valeria Ríos Quispe',
    grado: '5to de secundaria',
    disponibilidad_dias: ['Lunes', 'Miércoles', 'Viernes'],
    disponibilidad_franjas: ['Tarde', 'Noche'],
    disponibilidad_detalle: 'Los sábados por la mañana también me funcionan si hay que recuperar.',
    equipo: 'PC/Laptop propia',
    conexion_internet: 'Estable',
    experiencia_previa: 'Nociones en Scratch o pseudocódigo',
    experiencia_detalle:
      'Hice un proyecto pequeño en Scratch y entiendo las decisiones, pero nunca escribí Java.',
    answers: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 0 },
    daysAgo: 2,
  },
  {
    nombre_completo: 'Mateo Fernández Huamán',
    grado: '4to de secundaria',
    disponibilidad_dias: ['Martes', 'Jueves', 'Viernes'],
    disponibilidad_franjas: ['Mañana', 'Tarde'],
    disponibilidad_detalle: 'Prefiero la tarde porque salgo del colegio a las 13:00.',
    equipo: 'PC/Laptop compartida',
    conexion_internet: 'Inestable / Solo datos móviles',
    experiencia_previa: 'Programación previa (Java, Python, C++...)',
    experiencia_detalle:
      'Hice ejercicios básicos en Python en el colegio: variables, if y un poco de while.',
    answers: { q1: 1, q2: 1, q3: 0, q4: 1, q5: 1, q6: 1 },
    daysAgo: 1,
  },
  {
    nombre_completo: 'Camila Torres Salazar',
    grado: '5to de secundaria',
    disponibilidad_dias: ['Lunes', 'Viernes', 'Sábado'],
    disponibilidad_franjas: ['Mañana', 'Tarde'],
    disponibilidad_detalle: 'Los sábados puedo desde las 9:00; entre semana prefiero la tarde. Necesito avisar con anticipación.',
    equipo: 'PC/Laptop propia',
    conexion_internet: 'Estable',
    experiencia_previa: 'Nunca he programado',
    experiencia_detalle: 'Me interesa aprender desde cero y practicar con calma.',
    answers: { q1: 0, q2: 1, q3: 0, q4: 0, q5: 1, q6: 1 },
    daysAgo: 0,
  },
];

export const EMPTY_FORM = {
  nombreCompleto: '',
  grado: '',
  dias: [],
  franjas: [],
  disponibilidadDetalle: '',
  equipo: '',
  conexion: '',
  experiencia: '',
  experienciaDetalle: '',
};
