# JavaLab · Diagnóstico y Panel Docente

Aplicación web para el diagnóstico inicial y la gestión pedagógica del programa de **Proyección Social 2026 · Programación en Java (6 sesiones)**.

Incluye un formulario guiado para estudiantes, calificación automática, un panel docente protegido con PIN y persistencia en Supabase. Si Supabase no está configurado, la app funciona en **modo local de demostración** usando `localStorage`.

---

## Demo rápida

| Elemento | Valor |
| --- | --- |
| Inicio del diagnóstico | `http://localhost:5173/` |
| Modo sin Supabase | Datos locales de demostración |
| Perfiles de ejemplo | Botón **Cargar 3 perfiles de ejemplo** en el panel |

> En modo local, los datos viven únicamente en el navegador actual. En producción, configura Supabase para persistir los diagnósticos de forma centralizada.

---

## Funcionalidades

### Estudiante
- Wizard de 3 pasos con validación y barra de progreso.
- Registro de datos logísticos: nombre, grado, disponibilidad, equipo e internet.
- Pregunta de experiencia previa con detalle opcional.
- Mini-quiz de 6 preguntas sobre Java (tipos de datos, cadenas, condicionales, predicción de salida, bucles y arreglos).
- Calificación automática de 0 a 6 y asignación de nivel.
- Pantalla de confirmación con ruta personalizada de las 6 sesiones y opción de imprimir.

### Docente (acceso con PIN)
- **Reporte maestro:** total de estudiantes (meta 3), promedio, nivel predominante, semáforo de equipos e internet, distribución por nivel y recomendación pedagógica adaptativa.
- **Respuestas detalladas:** desglose de aciertos/errores por pregunta, logística, búsqueda, eliminación de registros y actualización manual.
- **Matriz de horarios:** cruce de disponibilidad, mejor franja sugerida con cobertura, alternativas, tabla por día/franja y propuesta de horario copiable.

### Detalles de experiencia
- Diseño responsive con Tailwind CSS 4.
- Iconografía consistente con Lucide.
- Estados de carga, botones deshabilitados durante peticiones y mensajes de error claros.
- Accesibilidad básica: foco visible, etiquetas, roles y cierre con `Escape`.

---

## Niveles y puntaje

| Aciertos | Nivel | Enfoque sugerido |
| --- | --- | --- |
| 0 – 2 | **Nivel 0 · Desde Cero** | Fundamentos, sintaxis, lógica y confianza |
| 3 – 4 | **Nivel 1 · Intermedio** | Refuerzo de condicionales, bucles y arreglos |
| 5 – 6 | **Nivel 2 · Avanzado** | Retos, casos límite, cadenas, matrices y recursión |

Si hay empate entre niveles, el reporte toma el **nivel promedio del grupo** y lo marca como *lectura conservadora*.

---

## Stack

- **React 19** + **Vite 8**
- **React Router 7**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **Lucide React**
- **Supabase JS 2**

---

## Inicio local

Requisitos: Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/`.

### Modo demostración

Sin variables de entorno, la app arranca en modo local:

- Los diagnósticos se guardan en `localStorage` con la clave `javalab:diagnosticos:v1`.
- El panel muestra la etiqueta **Modo local**.
- El botón de datos de ejemplo crea 3 perfiles (Nivel 0, 1 y 2) con horarios compatibles.

---

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Abre **SQL Editor** y ejecuta completo el archivo [`supabase/schema.sql`](supabase/schema.sql).
   - También está incluido como comentario al inicio de `src/lib/supabaseClient.js`.
3. Copia `.env.example` a `.env` y completa las credenciales:

```env
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

También se aceptan los nombres `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. `vite.config.js` se encarga de exponerlos como `process.env.REACT_APP_*`, tal como los consume el cliente.

4. Reinicia el servidor de desarrollo.

La etiqueta del panel cambiará a **Supabase conectado**. El botón de datos de ejemplo se desactiva para no mezclar datos locales con la base real.

### Esquema de datos

Tabla `public.respuestas_diagnostico`:

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` | Generado con `gen_random_uuid()` |
| `created_at` | `timestamptz` | Fecha del diagnóstico |
| `nombre_completo` | `text` | Entre 3 y 120 caracteres |
| `grado` | `text` | `4to de secundaria` / `5to de secundaria` |
| `disponibilidad_dias` | `text[]` | Al menos un día válido |
| `disponibilidad_franjas` | `text[]` | `Mañana`, `Tarde`, `Noche` |
| `disponibilidad_detalle` | `text` | Comentario opcional |
| `equipo` | `text` | PC propia, compartida o sin equipo |
| `conexion_internet` | `text` | Estable, inestable o sin internet |
| `experiencia_previa` | `text` | Nivel declarado por el estudiante |
| `experiencia_detalle` | `text` | Comentario opcional |
| `puntaje` | `smallint` | 0 a 6 |
| `nivel` | `text` | Uno de los tres niveles |
| `respuestas` | `jsonb` | Desglose completo del quiz |

El SQL incluye índices por fecha, nivel y puntaje, además de restricciones `CHECK` para mantener la integridad de las opciones.

---

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build en el puerto 4173 |

---

## Probar en línea con un túnel temporal

Para compartir una demo rápida (por ejemplo, para una aprobación) sin desplegar:

```bash
# Terminal 1: app en local
npm run dev

# Terminal 2: túnel rápido de Cloudflare
cloudflared tunnel --url http://localhost:5173 --no-autoupdate
```

Cloudflare mostrará una URL `https://algo-algo.trycloudflare.com`. `vite.config.js` ya permite hosts de `.trycloudflare.com`, por lo que el túnel funciona sin configuración adicional.

> El túnel rápido es temporal: cambia cada vez que lo inicias y deja de funcionar si apagas la PC o cierras los procesos. Para una URL fija, usa un túnel con nombre de Cloudflare o despliega en Vercel/Cloudflare Pages.

En modo local, los datos se guardan por navegador. Para que el panel se vea con información durante la demo, pulsa **Cargar 3 perfiles de ejemplo**. Si necesitas que los envíos de otros dispositivos aparezcan centralizados, configura Supabase antes de compartir la URL.

---

## Despliegue

El proyecto incluye `vercel.json` con rewrites a `index.html` para que React Router funcione en rutas directas.

### 1. Subir a GitHub

El archivo `.env` está en `.gitignore` y **no se sube**. Solo se versiona `.env.example` con valores de ejemplo.

1. Crea un repositorio vacío en [github.com/new](https://github.com/new) (sin README ni `.gitignore`, porque ya existen localmente).
2. Desde esta carpeta:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Si Git pide autenticación, usa el navegador (Git Credential Manager) o un token personal. Nunca uses tu contraseña de GitHub.

Verifica antes de subir que `.env` no aparece en `git status`. Si alguna vez lo subes por error, rota las claves en Supabase.

### 2. Importar en Vercel

1. Entra a [vercel.com](https://vercel.com) con la cuenta de GitHub que tiene acceso al repositorio.
2. **Add New → Project → Import Git Repository**.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. En **Environment Variables** agrega, para Production y Preview:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Despliega.

Las variables se insertan en el build, así que si las cambias después debes hacer **Redeploy**.

> La cuenta de GitHub con la que inicias sesión en Supabase es independiente de la cuenta de Vercel. No afecta al despliegue ni al plan gratuito. Lo único importante es que Vercel tenga acceso al repositorio donde está el código.

### 3. Notas sobre el plan gratuito

- **Vercel Hobby** es gratuito para proyectos personales y sin fines comerciales.
- **Supabase Free** es gratuito, pero los proyectos se pausan tras varios días sin actividad; se pueden reactivar desde el panel.
- No necesitas la misma cuenta de GitHub en ambos servicios.

---

## Estructura

```text
src/
  App.jsx                  Rutas, header/footer y estado del panel
  pages/
    Home.jsx               Landing + wizard
    Confirmation.jsx       Resultado y ruta personalizada
  components/
    wizard/                Pasos, progreso y mini-quiz
    admin/                 Login PIN, reporte, respuestas y horarios
    ui/                    Botones, badges, alertas, spinner, etc.
  lib/
    constants.js           Quiz, niveles, plan de sesiones y demo
    diagnostic.js          Puntaje, estadísticas y matriz de horarios
    api.js                 CRUD Supabase / localStorage
    supabaseClient.js      Cliente, SQL de referencia y errores amigables
supabase/
  schema.sql               SQL completo para Supabase
```

---

## Seguridad

El PIN del panel y las políticas RLS abiertas están pensados para una **demostración**. El PIN se valida en el cliente y la clave `anon` es pública. Cambia `ADMIN_PIN` en `src/lib/constants.js` antes de publicar el proyecto.

Para producción se recomienda:

- Reemplazar el PIN por autenticación real (Supabase Auth).
- Mover lecturas y eliminaciones a RPC o políticas RLS basadas en roles.
- No permitir `select`/`delete` anónimos sobre los diagnósticos.
- Usar variables de entorno del proveedor de despliegue y rotar la clave si se expone.

---

## Créditos

Material base: plan de **Proyección Social · Algoritmos y Programación en Java · 6 sesiones**.
