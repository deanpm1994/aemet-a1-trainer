# Physics Syllabus 2-18 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the verified BOE Physics block by importing topics 2 through 18 from Annex I while keeping the same source-owned subset loader and `/topics` preference path.

**Architecture:** Reuse the existing `BOE-A-2026-1292` manifest, checked-in subset source, and official-content import parser. Extend the subset data with Physics topics 2 through 18, then tighten tests and docs so Mathematics and Physics are explicitly complete while the rest of the syllabus remains only partially imported.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Markdown docs, existing official-content import helpers.

---

## File Structure

- Modify `apps/web/lib/official-syllabus-subset.ts`: extend the checked-in BOE subset with Physics topics 2 through 18.
- Modify `apps/web/lib/official-syllabus-subset.test.ts`: add TDD coverage for the full Physics 1-18 sequence and new total subset count.
- Modify `apps/web/lib/notion-topics.test.ts`: update the subset-preference assertion to the larger total and full Physics range.
- Modify `docs/PROJECT_MEMORY.md`: record that Physics is now fully imported from BOE Annex I and point the next syllabus step to Meteorology and Climatology.
- Modify `docs/DATA_MODEL.md`: update the checked-in subset description so it states Mathematics and Physics are complete.

## Task 1: Complete the Verified Physics Block

**Files:**
- Modify: `apps/web/lib/official-syllabus-subset.ts`
- Modify: `apps/web/lib/official-syllabus-subset.test.ts`

- [ ] **Step 1: Write the failing tests for the full Physics 1-18 import**

Replace `apps/web/lib/official-syllabus-subset.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Physics topics 1 through 18", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(39);

    const physicsTopics = result.topics.filter((topic) => topic.block === "Physics");

    expect(physicsTopics).toHaveLength(18);
    expect(physicsTopics.map((topic) => topic.officialNumber)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
    ]);
    expect(physicsTopics[17]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(physicsTopics[17]?.retrievedAt).toBe("2026-07-06");
    expect(physicsTopics[17]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalPhysicsTopic = officialSyllabusSubsetSource.find(
      (topic) => topic.block === "Physics" && topic.officialNumber === "18",
    );

    expect(finalPhysicsTopic).toBeDefined();
    expect(finalPhysicsTopic?.officialTitle).not.toBe(
      finalPhysicsTopic?.normalizedTitle,
    );
    expect(finalPhysicsTopic?.officialTitle).toContain(".");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: FAIL because the current subset contains 22 topics and only Physics topic 1.

- [ ] **Step 3: Extend the checked-in BOE subset with Physics topics 2 through 18**

Update `apps/web/lib/official-syllabus-subset.ts` by inserting these records after Physics topic `1` and before the Meteorology and Climatology topic:

```ts
  {
    block: "Physics",
    officialNumber: "2",
    officialTitle:
      "Cinemática y dinámica de un sistema de partículas. Centro de masas. Teorema de conservación del momento lineal: Colisiones. Momento angular de un sistema de partículas. Energía cinética de un sistema de partículas. Conservación de energía de un sistema de partículas. Características y aplicaciones al sólido rígido. Cálculo del momento de inercia.",
    normalizedTitle:
      "Cinematica y dinamica de un sistema de particulas Centro de masas Teorema de conservacion del momento lineal Colisiones Momento angular de un sistema de particulas Energia cinetica de un sistema de particulas Conservacion de energia de un sistema de particulas Caracteristicas y aplicaciones al solido rigido Calculo del momento de inercia",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "3",
    officialTitle:
      "Ley de Newton de la gravitación universal. Campos de fuerzas gravitatorias. Energía potencial y potencial gravitatorio. Teorema de Gauss y líneas de campo. Leyes de Kepler. Energía mecánica en sistemas gravitatorios: órbitas cerradas y abiertas. Campo gravitatorio terrestre.",
    normalizedTitle:
      "Ley de Newton de la gravitacion universal Campos de fuerzas gravitatorias Energia potencial y potencial gravitatorio Teorema de Gauss y lineas de campo Leyes de Kepler Energia mecanica en sistemas gravitatorios orbitas cerradas y abiertas Campo gravitatorio terrestre",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "4",
    officialTitle:
      "Cinemática y dinámica de medios continuos. Descripciones de Euler y de Lagrange. Tensor de deformación y de velocidad de deformación. Tensor de esfuerzos. Leyes de conservación de la masa, energía y momento lineal y angular. Teorema de transporte.",
    normalizedTitle:
      "Cinematica y dinamica de medios continuos Descripciones de Euler y de Lagrange Tensor de deformacion y de velocidad de deformacion Tensor de esfuerzos Leyes de conservacion de la masa energia y momento lineal y angular Teorema de transporte",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "5",
    officialTitle:
      "Fluidos: clasificación. Estática: Principios de Pascal y Arquímedes. Cinemática de fluidos irrotacionales: Potencial de velocidades. Trayectorias y líneas de corriente. Función de corriente. Rotación del fluido: Vorticidad y circulación. Teorema de Kelvin.",
    normalizedTitle:
      "Fluidos clasificacion Estatica Principios de Pascal y Arquimedes Cinematica de fluidos irrotacionales Potencial de velocidades Trayectorias y lineas de corriente Funcion de corriente Rotacion del fluido Vorticidad y circulacion Teorema de Kelvin",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "6",
    officialTitle:
      "Ecuaciones Fundamentales de la dinámica de fluidos. Leyes de conservación. Ecuación de continuidad. Ecuación de Navier-Stokes. Soluciones analíticas de la ecuación de Navier-Stokes. Flujo incompresible. Ecuación de Euler y ecuación de Bernoulli. Regímenes laminar y turbulento. Número de Reynolds.",
    normalizedTitle:
      "Ecuaciones Fundamentales de la dinamica de fluidos Leyes de conservacion Ecuacion de continuidad Ecuacion de Navier Stokes Soluciones analiticas de la ecuacion de Navier Stokes Flujo incompresible Ecuacion de Euler y ecuacion de Bernoulli Regimenes laminar y turbulento Numero de Reynolds",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "7",
    officialTitle:
      "Oscilaciones. Cinemática de movimiento armónico simple. Dinámica y energía de las oscilaciones armónicas. Oscilaciones amortiguadas, oscilaciones forzadas y concepto de resonancia.",
    normalizedTitle:
      "Oscilaciones Cinematica de movimiento armonico simple Dinamica y energia de las oscilaciones armonicas Oscilaciones amortiguadas oscilaciones forzadas y concepto de resonancia",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "8",
    officialTitle:
      "Movimiento ondulatorio: Concepto y tipos de ondas. Ondas periódicas. La ecuación de ondas en una dimensión. Velocidad de propagación. Energía e intensidad de una onda. Superposición de ondas armónicas. Ondas estacionarias. Modos normales. Efecto Doppler.",
    normalizedTitle:
      "Movimiento ondulatorio Concepto y tipos de ondas Ondas periodicas La ecuacion de ondas en una dimension Velocidad de propagacion Energia e intensidad de una onda Superposicion de ondas armonicas Ondas estacionarias Modos normales Efecto Doppler",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "9",
    officialTitle:
      "El campo electrostático en el vacío. Carga eléctrica. Ley de Coulomb. Concepto de campo eléctrico y líneas de campo. Teorema de Gauss y aplicaciones. Energía potencial y potencial eléctrico. Medios conductores y dieléctricos. Energía electrostática.",
    normalizedTitle:
      "El campo electrostatico en el vacio Carga electrica Ley de Coulomb Concepto de campo electrico y lineas de campo Teorema de Gauss y aplicaciones Energia potencial y potencial electrico Medios conductores y dielectricos Energia electrostatica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "10",
    officialTitle:
      "El campo magnetostático en el vacío. Movimiento de partículas cargadas en campos magnéticos: Fuerza de Lorentz. Líneas de campo y flujo magnético. Fuerza sobre una corriente. Campo magnético creado por una corriente: Ley de Biot–Savart. Densidad de corriente y ecuación de continuidad: Ley de Ohm. Ley de Ampère. Potencial magnético vector y potencial magnético escalar. Energía magnetostática.",
    normalizedTitle:
      "El campo magnetostatico en el vacio Movimiento de particulas cargadas en campos magneticos Fuerza de Lorentz Lineas de campo y flujo magnetico Fuerza sobre una corriente Campo magnetico creado por una corriente Ley de Biot Savart Densidad de corriente y ecuacion de continuidad Ley de Ohm Ley de Ampere Potencial magnetico vector y potencial magnetico escalar Energia magnetostatica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "11",
    officialTitle:
      "Campos electromagnéticos en el vacío. Inducción electromagnética: Ley de Faraday–Lenz. Autoinducción e inducción mutua. Ecuaciones de Maxwell. Energía electromagnética. Expresión general de la energía electromagnética. Teorema de Poynting.",
    normalizedTitle:
      "Campos electromagneticos en el vacio Induccion electromagnetica Ley de Faraday Lenz Autoinduccion e induccion mutua Ecuaciones de Maxwell Energia electromagnetica Expresion general de la energia electromagnetica Teorema de Poynting",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "12",
    officialTitle:
      "Ecuación de ondas para campos electromagnéticos. Espectro electromagnético. Ondas electromagnéticas en el vacío. Ondas planas y esféricas. Ondas monocromáticas: velocidad de fase y de grupo. Energía y momento de una onda electromagnética. Radiación de onda electromagnética.",
    normalizedTitle:
      "Ecuacion de ondas para campos electromagneticos Espectro electromagnetico Ondas electromagneticas en el vacio Ondas planas y esfericas Ondas monocromaticas velocidad de fase y de grupo Energia y momento de una onda electromagnetica Radiacion de onda electromagnetica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "13",
    officialTitle:
      "Interferencia y difracción. Condiciones para la interferencia. Leyes de Fresnel para la difracción. Difracción de Fraunhofer.",
    normalizedTitle:
      "Interferencia y difraccion Condiciones para la interferencia Leyes de Fresnel para la difraccion Difraccion de Fraunhofer",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "14",
    officialTitle:
      "Sistemas, variables y procesos termodinámicos. Funciones de estado. Principio cero. Concepto de temperatura absoluta. Primer principio de la termodinámica: Energía interna, trabajo y calor. Coeficientes de dilatación y compresibilidad. Transformaciones politrópicas en gases ideales.",
    normalizedTitle:
      "Sistemas variables y procesos termodinamicos Funciones de estado Principio cero Concepto de temperatura absoluta Primer principio de la termodinamica Energia interna trabajo y calor Coeficientes de dilatacion y compresibilidad Transformaciones politropicas en gases ideales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "15",
    officialTitle:
      "Segundo principio de la termodinámica. Máquinas térmicas. Teorema y ciclo de Carnot. Escala Kelvin de temperaturas. Teorema de Clausius. Concepto de entropía. Entropía e irreversibilidad. Principio de aumento de entropía.",
    normalizedTitle:
      "Segundo principio de la termodinamica Maquinas termicas Teorema y ciclo de Carnot Escala Kelvin de temperaturas Teorema de Clausius Concepto de entropia Entropia e irreversibilidad Principio de aumento de entropia",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "16",
    officialTitle:
      "Formalismo termodinámico para sistemas cerrados. Ecuación fundamental de la Termodinámica. Representaciones entrópica y energética. Representaciones alternativas. Potenciales termodinámicos. Condiciones de equilibrio y estabilidad.",
    normalizedTitle:
      "Formalismo termodinamico para sistemas cerrados Ecuacion fundamental de la Termodinamica Representaciones entropica y energetica Representaciones alternativas Potenciales termodinamicos Condiciones de equilibrio y estabilidad",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "17",
    officialTitle:
      "Cambios de fase de primer orden: Ecuación de Clausius-Clapeyron. Diagrama de compresibilidad generalizado. Cambios de fase de segundo orden: Ecuaciones de Ehrenfest.",
    normalizedTitle:
      "Cambios de fase de primer orden Ecuacion de Clausius Clapeyron Diagrama de compresibilidad generalizado Cambios de fase de segundo orden Ecuaciones de Ehrenfest",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "18",
    officialTitle:
      "Fundamentos de radiación electromagnética. Procesos físicos característicos: Emisión, absorción, dispersión, reflexión y transmisión. Ley de Kirchoff. Radiación del cuerpo negro: Ley de Planck, ley de Stefan-Boltzmann y ley de desplazamiento de Wien. Emisión térmica de cuerpos reales.",
    normalizedTitle:
      "Fundamentos de radiacion electromagnetica Procesos fisicos caracteristicos Emision absorcion dispersion reflexion y transmision Ley de Kirchoff Radiacion del cuerpo negro Ley de Planck ley de Stefan Boltzmann y ley de desplazamiento de Wien Emision termica de cuerpos reales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: PASS with 2 tests in `apps/web/lib/official-syllabus-subset.test.ts`.

- [ ] **Step 5: Commit the completed Physics block**

```bash
git add apps/web/lib/official-syllabus-subset.ts apps/web/lib/official-syllabus-subset.test.ts
git commit -m "feat(import): complete physics syllabus block"
```

## Task 2: Update Loader Assertions and Project Status

**Files:**
- Modify: `apps/web/lib/notion-topics.test.ts`
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/DATA_MODEL.md`

- [ ] **Step 1: Write the failing loader assertions for the completed Physics block**

Update the `prefers imported verified syllabus subset topics before fallback topics` test in `apps/web/lib/notion-topics.test.ts` to:

```ts
  it("prefers imported verified syllabus subset topics before fallback topics", async () => {
    const result = await loadTopicsSource({
      env: {},
      fallbackTopics: [],
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.topics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(result.topics).toHaveLength(39);
    expect(
      result.topics
        .filter((topic) => topic.block === "Physics")
        .map((topic) => topic.officialNumber),
    ).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
    ]);
  });
```

- [ ] **Step 2: Run the loader test to verify it fails**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: FAIL because the imported subset count is still 22 and Physics only runs through topic 1.

- [ ] **Step 3: Update docs to state Mathematics and Physics are complete**

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics block (topics 1 through 18) plus one verified starter topic in each remaining block; this remains a partial subset, not a full verified syllabus
```

with:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks (topics 1 through 18 in both) plus one verified starter topic in each remaining block; this remains a partial subset, not a full verified syllabus
```

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Continue the BOE Annex I syllabus import with Physics as the next recommended block, then proceed through the remaining blocks in controlled verified batches before treating all topic blocks as official-ready
```

with:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology as the next recommended block, then proceed through Informatics and Communications and General/Common in controlled verified batches before treating all topic blocks as official-ready
```

Edit `docs/DATA_MODEL.md` by replacing:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics block plus one verified starter topic in each remaining syllabus block.
```

with:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks plus one verified starter topic in each remaining syllabus block.
```

- [ ] **Step 4: Run the updated loader test to verify it passes**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: PASS for the updated imported-subset preference path and existing fallback/live-path coverage.

- [ ] **Step 5: Run branch verification**

Run:
- `npm --prefix apps/web test -- official-syllabus-subset`
- `npm --prefix apps/web test -- notion-topics`
- `npm --prefix apps/web test`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`

Expected:
- PASS for `official-syllabus-subset.test.ts`
- PASS for `notion-topics.test.ts`
- PASS for the full Vitest suite
- PASS for lint
- PASS for production build

- [ ] **Step 6: Commit loader and docs updates**

```bash
git add apps/web/lib/notion-topics.test.ts docs/PROJECT_MEMORY.md docs/DATA_MODEL.md
git commit -m "docs(import): record complete physics syllabus"
```

## Self-Review

- Spec coverage: the plan covers only the approved scope: Physics topics 2 through 18, completed Physics coverage, loader assertions, and status docs.
- Placeholder scan: no unresolved placeholders or vague “handle later” instructions remain.
- Type consistency: all file paths, function names, and test targets match the current repo structure and the existing official import flow.
