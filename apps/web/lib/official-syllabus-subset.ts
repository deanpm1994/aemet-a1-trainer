import {
  mapImportedSyllabusTopicToTopic,
  parseOfficialSyllabusTopicRecord,
} from "./official-content-import";
import type { Topic } from "./types";

type LoadedOfficialSyllabusSubset =
  | { ok: true; topics: Topic[] }
  | {
      ok: false;
      issues: Array<{ index: number; field: string; message: string }>;
    };

export const officialSyllabusSubsetSource = [
  {
    block: "Mathematics",
    officialNumber: "1",
    officialTitle:
      "Matrices y determinantes. Propiedades y operaciones elementales. Determinación de la matriz inversa y del rango de una matriz. Diagonalización. Valores y vectores propios. Polinomio característico. Teorema Espectral para matrices reales y simétricas.",
    normalizedTitle:
      "Matrices y determinantes Propiedades y operaciones elementales Determinacion de la matriz inversa y del rango de una matriz Diagonalizacion Valores y vectores propios Polinomio caracteristico Teorema Espectral para matrices reales y simetricas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "2",
    officialTitle:
      "Sistemas de ecuaciones lineales. Representación matricial. Resolución de sistemas de ecuaciones lineales: Método de Gauss y regla de Cramer. Teorema de Rouché-Fröbenius. Métodos iterativos de resolución de sistemas de ecuaciones: Jacobi y Gauss-Seidel.",
    normalizedTitle:
      "Sistemas de ecuaciones lineales Representacion matricial Resolucion de sistemas de ecuaciones lineales Metodo de Gauss y regla de Cramer Teorema de Rouche Frobenius Metodos iterativos de resolucion de sistemas de ecuaciones Jacobi y Gauss Seidel",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "3",
    officialTitle:
      "Funciones de varias variables. Límites y continuidad. Derivadas parciales y diferenciabilidad. Regla de la cadena. Derivadas de orden superior. Teorema de Taylor. Máximos y mínimos. Extremos condicionados: Método de los multiplicadores de Lagrange.",
    normalizedTitle:
      "Funciones de varias variables Limites y continuidad Derivadas parciales y diferenciabilidad Regla de la cadena Derivadas de orden superior Teorema de Taylor Maximos y minimos Extremos condicionados Metodo de los multiplicadores de Lagrange",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "4",
    officialTitle:
      "Campos escalares y vectoriales. Operadores diferenciales y sus propiedades: gradiente, divergencia, rotacional y laplaciano. Campos conservativos: Potencial escalar. Campos solenoidales: Potencial vectorial. Campos laplacianos: Ecuación de Laplace.",
    normalizedTitle:
      "Campos escalares y vectoriales Operadores diferenciales y sus propiedades gradiente divergencia rotacional y laplaciano Campos conservativos Potencial escalar Campos solenoidales Potencial vectorial Campos laplacianos Ecuacion de Laplace",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "5",
    officialTitle:
      "Integrales de línea y de superficie en campos escalares y vectoriales. Integral de un campo escalar. Circulación y flujo de un campo vectorial. Teorema de Green. Teorema de la divergencia o de Gauss y teorema de Stokes.",
    normalizedTitle:
      "Integrales de linea y de superficie en campos escalares y vectoriales Integral de un campo escalar Circulacion y flujo de un campo vectorial Teorema de Green Teorema de la divergencia o de Gauss y teorema de Stokes",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "6",
    officialTitle:
      "Definición y propiedades algebraicas de los números complejos. Fórmula de Moivre. Ecuaciones con números complejos. Funciones elementales de variable compleja. Derivabilidad: Ecuaciones de Cauchy–Riemann.",
    normalizedTitle:
      "Definicion y propiedades algebraicas de los numeros complejos Formula de Moivre Ecuaciones con numeros complejos Funciones elementales de variable compleja Derivabilidad Ecuaciones de Cauchy Riemann",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "7",
    officialTitle:
      "Ecuaciones diferenciales ordinarias de primer orden. Métodos elementales de integración: ecuaciones de variables separadas, ecuaciones homogéneas, ecuaciones exactas, ecuaciones lineales, ecuación de Bernoulli y ecuación de Riccati.",
    normalizedTitle:
      "Ecuaciones diferenciales ordinarias de primer orden Metodos elementales de integracion ecuaciones de variables separadas ecuaciones homogeneas ecuaciones exactas ecuaciones lineales ecuacion de Bernoulli y ecuacion de Riccati",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "8",
    officialTitle:
      "Ecuaciones diferenciales ordinarias lineales de segundo orden. Ecuaciones homogéneas. Ecuaciones no homogéneas. Método de variación de constantes. Ecuaciones con coeficientes constantes. Solución por medio de series: Método de Fröbenius.",
    normalizedTitle:
      "Ecuaciones diferenciales ordinarias lineales de segundo orden Ecuaciones homogeneas Ecuaciones no homogeneas Metodo de variacion de constantes Ecuaciones con coeficientes constantes Solucion por medio de series Metodo de Frobenius",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "9",
    officialTitle:
      "Sistemas de ecuaciones diferenciales de primer orden. Sistemas homogéneos. Sistemas no homogéneos. Método de variación de constantes. Sistemas lineales con coeficientes constantes. Exponencial de una matriz.",
    normalizedTitle:
      "Sistemas de ecuaciones diferenciales de primer orden Sistemas homogeneos Sistemas no homogeneos Metodo de variacion de constantes Sistemas lineales con coeficientes constantes Exponencial de una matriz",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "1",
    officialTitle:
      "Cinemática y dinámica del punto material. Sistemas de referencia. Vectores posición, velocidad y aceleración. Componentes intrínsecas de la aceleración. Movimiento relativo: Transformaciones de Galileo y aceleración de Coriolis. Leyes de Newton. Teoremas del momento lineal y angular. Trabajo y energía. Campos de fuerzas conservativas. Teorema de conservación de la energía mecánica. Fuerzas no conservativas y disipación de la energía.",
    normalizedTitle:
      "Cinematica y dinamica del punto material Sistemas de referencia Vectores posicion velocidad y aceleracion Componentes intrinsecas de la aceleracion Movimiento relativo Transformaciones de Galileo y aceleracion de Coriolis Leyes de Newton Teoremas del momento lineal y angular Trabajo y energia Campos de fuerzas conservativas Teorema de conservacion de la energia mecanica Fuerzas no conservativas y disipacion de la energia",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "1",
    officialTitle:
      "Estructura física de la atmósfera. Distribución vertical de variables físicas fundamentales: Densidad, presión y temperatura. Características principales de las capas de la atmósfera. Atmósfera estándar y gradientes térmicos verticales asociados.",
    normalizedTitle:
      "Estructura fisica de la atmosfera Distribucion vertical de variables fisicas fundamentales Densidad presion y temperatura Caracteristicas principales de las capas de la atmosfera Atmosfera estandar y gradientes termicos verticales asociados",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "1",
    officialTitle:
      "Sistema operativo Windows. Sistemas operativos de la familia Linux. Gestión de ficheros, directorios y permisos. Variables de entorno. Intérpretes de comandos (shells) y Comandos principales. Programación con shell scripts.",
    normalizedTitle:
      "Sistema operativo Windows Sistemas operativos de la familia Linux Gestion de ficheros directorios y permisos Variables de entorno Interpretes de comandos shells y Comandos principales Programacion con shell scripts",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "1",
    officialTitle:
      "El Régimen jurídico del personal al servicio de las Administraciones públicas. El texto refundido de la Ley del Estatuto Básico del Empleado Público y otras normas: Tipos de empleados públicos y derechos y deberes del personal al servicio de la Administración Pública. Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas.",
    normalizedTitle:
      "El Regimen juridico del personal al servicio de las Administraciones publicas El texto refundido de la Ley del Estatuto Basico del Empleado Publico y otras normas Tipos de empleados publicos y derechos y deberes del personal al servicio de la Administracion Publica Ley 53 1984 de 26 de diciembre de incompatibilidades del personal al servicio de las Administraciones Publicas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
];

export function loadOfficialSyllabusSubset(): LoadedOfficialSyllabusSubset {
  const issues: Array<{ index: number; field: string; message: string }> = [];
  const topics = officialSyllabusSubsetSource.flatMap((record, index) => {
    const parsed = parseOfficialSyllabusTopicRecord(record);

    if (!parsed.ok) {
      issues.push(
        ...parsed.issues.map((issue) => ({
          index,
          field: issue.field,
          message: issue.message,
        })),
      );
      return [];
    }

    return [mapImportedSyllabusTopicToTopic(parsed.record)];
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, topics };
}
