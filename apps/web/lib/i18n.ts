export type Locale = "es" | "en";

export type TranslationKey =
  | "app.description"
  | "app.home.antiHallucination.body"
  | "app.home.antiHallucination.item.mockData"
  | "app.home.antiHallucination.item.monitoring"
  | "app.home.antiHallucination.item.officialDates"
  | "app.home.antiHallucination.title"
  | "app.home.description"
  | "app.home.next.item.calendar"
  | "app.home.next.item.questions"
  | "app.home.next.item.supabase"
  | "app.home.next.title"
  | "app.home.title"
  | "app.nav.calendar"
  | "app.nav.calendar.description"
  | "app.nav.dashboard"
  | "app.nav.dashboard.description"
  | "app.nav.focus"
  | "app.nav.focus.description"
  | "app.nav.monitoring"
  | "app.nav.monitoring.description"
  | "app.nav.questions"
  | "app.nav.questions.description"
  | "app.nav.resources"
  | "app.nav.resources.description"
  | "app.nav.settings"
  | "app.nav.settings.description"
  | "app.nav.topics"
  | "app.nav.topics.description"
  | "app.shell.phase"
  | "app.shell.tagline"
  | "contentReadiness.empty.empty"
  | "contentReadiness.empty.detail"
  | "contentReadiness.empty.loaded"
  | "contentReadiness.empty.pending"
  | "contentReadiness.empty.privateReady"
  | "contentReadiness.empty.title"
  | "contentReadiness.label"
  | "contentReadiness.officialReady.detail"
  | "contentReadiness.officialReady.title"
  | "contentReadiness.pending.detail"
  | "contentReadiness.pending.title"
  | "contentReadiness.privateReady.detail"
  | "contentReadiness.privateReady.title"
  | "contentReadiness.stat.officialReady"
  | "contentReadiness.stat.pending"
  | "contentReadiness.stat.total"
  | "contentReadiness.stat.verified"
  | "sourceState.fallbackConfig"
  | "sourceState.fallbackError"
  | "sourceState.live";

type Dictionary = Record<TranslationKey, string>;

export type RouteCard = {
  href: string;
  title: string;
  description: string;
};

export const DEFAULT_LOCALE: Locale = "es";

const dictionaries: Record<Locale, Dictionary> = {
  es: {
    "app.description":
      "Planificador, temario, práctica de preguntas y apoyo de concentración para preparar AEMET A1.",
    "app.home.antiHallucination.body":
      "La aplicación mantiene separada la preparación privada de la información oficial verificada.",
    "app.home.antiHallucination.item.mockData":
      "Los datos iniciales están marcados como no verificados o pendientes de revisión.",
    "app.home.antiHallucination.item.monitoring":
      "La monitorización es manual hasta que existan tareas oficiales automatizadas.",
    "app.home.antiHallucination.item.officialDates":
      "Las fechas oficiales aparecerán solo cuando estén respaldadas por fuentes verificadas.",
    "app.home.antiHallucination.title": "Protocolo anti-alucinación",
    "app.home.description":
      "Esta primera versión se centra en la estructura: rutas, persistencia de estudio, señales de progreso y reglas estrictas antes de importar datos oficiales.",
    "app.home.next.item.calendar": "Convertir el calendario semanal en una lista diaria editable.",
    "app.home.next.item.questions": "Importar preguntas de exámenes anteriores con metadatos de fuente.",
    "app.home.next.item.supabase": "Usar Supabase para identidad, progreso y sesiones persistentes.",
    "app.home.next.title": "Siguientes bloques de construcción",
    "app.home.title": "Sistema de preparación AEMET A1",
    "app.nav.calendar": "Calendario",
    "app.nav.calendar.description":
      "Planificador editable de la semana actual basado en el horario de estudio de mañana.",
    "app.nav.dashboard": "Panel",
    "app.nav.dashboard.description":
      "Misión de la mañana, horas semanales, progreso y estado de monitorización.",
    "app.nav.focus": "Concentración",
    "app.nav.focus.description":
      "Sesión con temporizador, decisiones de revisión y registro de resultados.",
    "app.nav.monitoring": "Monitorización",
    "app.nav.monitoring.description":
      "Estado manual de BOE/AEMET hasta que exista automatización.",
    "app.nav.questions": "Preguntas",
    "app.nav.questions.description":
      "Banco de preguntas preparado para sincronización, con fallback local y metadatos de revisión.",
    "app.nav.resources": "Recursos",
    "app.nav.resources.description":
      "Bibliografía y recursos de estudio con contexto de acceso y verificación.",
    "app.nav.settings": "Ajustes",
    "app.nav.settings.description":
      "Configuración futura de perfil, integraciones, verificación y recordatorios.",
    "app.nav.topics": "Temario",
    "app.nav.topics.description":
      "Lista de temas preparada para Notion, con fallback local explícito.",
    "app.shell.phase": "Fase base",
    "app.shell.tagline":
      "Sistema PWA de estudio para la oposición AEMET Grupo A1. Los datos oficiales aún no están cargados.",
    "contentReadiness.empty.empty": "Vacío",
    "contentReadiness.empty.detail":
      "Añade temas oficiales verificados o elementos iniciales de práctica antes de usar el flujo de estudio.",
    "contentReadiness.empty.loaded": "Cargados",
    "contentReadiness.empty.pending": "Pendientes",
    "contentReadiness.empty.privateReady": "Preparado",
    "contentReadiness.empty.title": "Sin contenido cargado",
    "contentReadiness.label": "Preparación del contenido de estudio",
    "contentReadiness.officialReady.detail":
      "Todos los temas y preguntas cargados están verificados con metadatos de fuente. Continúa con el seguimiento normal de estudio.",
    "contentReadiness.officialReady.title": "Contenido oficial verificado",
    "contentReadiness.pending.detail":
      "Usa la app para planificar, concentrarte y registrar progreso. La redacción oficial del temario y las fuentes de preguntas anteriores aún necesitan verificación antes de tratarse como oficiales.",
    "contentReadiness.pending.title": "Verificación oficial pendiente",
    "contentReadiness.privateReady.detail":
      "Usa la app para planificar, concentrarte y registrar progreso. La verificación oficial sigue pendiente.",
    "contentReadiness.privateReady.title": "Preparado para estudio privado",
    "contentReadiness.stat.officialReady": "Listos como oficiales",
    "contentReadiness.stat.pending": "Pendientes de revisión oficial",
    "contentReadiness.stat.total": "Elementos cargados",
    "contentReadiness.stat.verified": "Verificados",
    "sourceState.fallbackConfig": "Fallback local: falta configuración de Notion.",
    "sourceState.fallbackError": "Fallback local: no se pudo sincronizar Notion.",
    "sourceState.live": "Datos sincronizados desde Notion.",
  },
  en: {
    "app.description":
      "Study planner, topic checklist, question practice, and focus support for AEMET A1 preparation.",
    "app.home.antiHallucination.body":
      "The app keeps private preparation separate from verified official information.",
    "app.home.antiHallucination.item.mockData":
      "Starter data is intentionally marked unverified or needs review.",
    "app.home.antiHallucination.item.monitoring":
      "Monitoring is manual until official-source jobs actually exist.",
    "app.home.antiHallucination.item.officialDates":
      "Official dates appear only when backed by verified source records.",
    "app.home.antiHallucination.title": "Anti-hallucination protocol",
    "app.home.description":
      "This first version focuses on structure: routes, study persistence, progress signals, and strict rules before any official data import.",
    "app.home.next.item.calendar": "Turn the weekly calendar into an editable daily checklist.",
    "app.home.next.item.questions": "Import past-exam questions with source metadata.",
    "app.home.next.item.supabase": "Use Supabase for identity, progress, and persisted sessions.",
    "app.home.next.title": "Next build blocks",
    "app.home.title": "AEMET A1 preparation system",
    "app.nav.calendar": "Calendar",
    "app.nav.calendar.description":
      "Editable current-week planner built around the morning study schedule.",
    "app.nav.dashboard": "Dashboard",
    "app.nav.dashboard.description":
      "Morning mission, weekly hours, progress, and monitoring status.",
    "app.nav.focus": "Focus",
    "app.nav.focus.description":
      "Timer-driven focus session with review decisions and output tracking.",
    "app.nav.monitoring": "Monitoring",
    "app.nav.monitoring.description":
      "Manual BOE/AEMET monitoring status until automation exists.",
    "app.nav.questions": "Questions",
    "app.nav.questions.description":
      "Live-capable question bank with explicit local fallback and review metadata.",
    "app.nav.resources": "Resources",
    "app.nav.resources.description":
      "Study resources from bibliography data with explicit access and verification context.",
    "app.nav.settings": "Settings",
    "app.nav.settings.description":
      "Future profile, integrations, verification, and reminders setup.",
    "app.nav.topics": "Topics",
    "app.nav.topics.description":
      "Live-capable Notion-backed topic checklist with explicit local fallback.",
    "app.shell.phase": "Foundation phase",
    "app.shell.tagline":
      "PWA-first study system scaffold for the AEMET Grupo A1 opposition. Official data is not loaded yet.",
    "contentReadiness.empty.empty": "Empty",
    "contentReadiness.empty.detail":
      "Add verified official syllabus topics or starter practice items before using the study flow.",
    "contentReadiness.empty.loaded": "Loaded",
    "contentReadiness.empty.pending": "Pending",
    "contentReadiness.empty.privateReady": "Ready",
    "contentReadiness.empty.title": "No content loaded",
    "contentReadiness.label": "Study content readiness",
    "contentReadiness.officialReady.detail":
      "All loaded topics and questions are verified with source metadata. Continue normal study tracking.",
    "contentReadiness.officialReady.title": "Verified official content",
    "contentReadiness.pending.detail":
      "Use the app for planning, focus sessions, and progress tracking. Official syllabus wording and past-question sources still need verification before being treated as official.",
    "contentReadiness.pending.title": "Official verification pending",
    "contentReadiness.privateReady.detail":
      "Use the app for planning, focus sessions, and progress tracking. Official verification remains pending.",
    "contentReadiness.privateReady.title": "Ready for private study",
    "contentReadiness.stat.officialReady": "Official-ready",
    "contentReadiness.stat.pending": "Pending official review",
    "contentReadiness.stat.total": "Loaded items",
    "contentReadiness.stat.verified": "Verified",
    "sourceState.fallbackConfig": "Local fallback: Notion configuration is missing.",
    "sourceState.fallbackError": "Local fallback: Notion sync could not complete.",
    "sourceState.live": "Data synced from Notion.",
  },
};

export function getSupportedLocale(locale: string | undefined): Locale {
  return locale === "en" || locale === "es" ? locale : DEFAULT_LOCALE;
}

export function getDictionary(locale: string | undefined): Dictionary {
  return dictionaries[getSupportedLocale(locale)];
}

export function t(locale: string | undefined, key: TranslationKey): string {
  return getDictionary(locale)[key];
}

export function routeCards(locale: string | undefined): RouteCard[] {
  return [
    {
      href: "/dashboard",
      title: t(locale, "app.nav.dashboard"),
      description: t(locale, "app.nav.dashboard.description"),
    },
    {
      href: "/topics",
      title: t(locale, "app.nav.topics"),
      description: t(locale, "app.nav.topics.description"),
    },
    {
      href: "/questions",
      title: t(locale, "app.nav.questions"),
      description: t(locale, "app.nav.questions.description"),
    },
    {
      href: "/resources",
      title: t(locale, "app.nav.resources"),
      description: t(locale, "app.nav.resources.description"),
    },
    {
      href: "/calendar",
      title: t(locale, "app.nav.calendar"),
      description: t(locale, "app.nav.calendar.description"),
    },
    {
      href: "/focus",
      title: t(locale, "app.nav.focus"),
      description: t(locale, "app.nav.focus.description"),
    },
    {
      href: "/monitoring",
      title: t(locale, "app.nav.monitoring"),
      description: t(locale, "app.nav.monitoring.description"),
    },
    {
      href: "/settings",
      title: t(locale, "app.nav.settings"),
      description: t(locale, "app.nav.settings.description"),
    },
  ];
}
