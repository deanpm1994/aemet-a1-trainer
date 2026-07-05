import type { VerificationStatus } from "./types";

export type OfficialCountdownDate = {
  label: string;
  date: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
};

export type CountdownState = "no_verified_date" | "future" | "today" | "past";

export type CountdownStatus = {
  label: string;
  value: string;
  detail: string;
  sourceNote: string;
  state: CountdownState;
};

type CountdownStatusInput = {
  officialDate: OfficialCountdownDate | null;
  today: string;
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

const noVerifiedDateStatus: CountdownStatus = {
  label: "Cuenta atrás oficial",
  value: "Sin fecha verificada",
  detail:
    "La próxima convocatoria o fecha de examen aparecerá aquí solo cuando exista una fuente oficial verificada.",
  sourceNote: "Fuente: TODO_VERIFY_OFFICIAL_SOURCE",
  state: "no_verified_date",
};

function getDayDelta(date: string, today: string): number {
  return Math.round(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      millisecondsPerDay,
  );
}

export function buildCountdownStatus({
  officialDate,
  today,
}: CountdownStatusInput): CountdownStatus {
  if (!officialDate || officialDate.verificationStatus !== "verified") {
    return noVerifiedDateStatus;
  }

  const dayDelta = getDayDelta(officialDate.date, today);
  const sourceNote = `Fuente verificada: ${officialDate.sourceUrl} · Recuperado: ${officialDate.retrievedAt}`;

  if (dayDelta > 0) {
    return {
      label: officialDate.label,
      value: `${dayDelta} días`,
      detail: `Fecha oficial verificada: ${officialDate.date}.`,
      sourceNote,
      state: "future",
    };
  }

  if (dayDelta === 0) {
    return {
      label: officialDate.label,
      value: "Hoy",
      detail: `Fecha oficial verificada: ${officialDate.date}.`,
      sourceNote,
      state: "today",
    };
  }

  return {
    label: officialDate.label,
    value: `Hace ${Math.abs(dayDelta)} días`,
    detail: `Fecha oficial verificada pasada: ${officialDate.date}.`,
    sourceNote,
    state: "past",
  };
}
