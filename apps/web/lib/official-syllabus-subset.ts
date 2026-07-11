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
    block: "Mathematics",
    officialNumber: "10",
    officialTitle:
      "Ecuaciones en derivadas parciales de primer y segundo orden. Clasificación. Método de separación de variables para su resolución. Aplicación a problemas clásicos: Ecuación del calor, ecuación de ondas y ecuación de Laplace.",
    normalizedTitle:
      "Ecuaciones en derivadas parciales de primer y segundo orden Clasificacion Metodo de separacion de variables para su resolucion Aplicacion a problemas clasicos Ecuacion del calor ecuacion de ondas y ecuacion de Laplace",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "11",
    officialTitle:
      "Series de Fourier. Series trigonométricas de Fourier. Conjuntos de funciones ortogonales. Integral de Fourier. Teorema de convolución. Interpretación física y aplicaciones. La transformada discreta de Fourier.",
    normalizedTitle:
      "Series de Fourier Series trigonometricas de Fourier Conjuntos de funciones ortogonales Integral de Fourier Teorema de convolucion Interpretacion fisica y aplicaciones La transformada discreta de Fourier",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "12",
    officialTitle:
      "Fundamentos de estadística descriptiva. Variables estadísticas. Distribución de frecuencias y representaciones gráficas. Medidas de posición, dispersión y forma. Momentos respecto del origen y centrales. Función generatriz de momentos.",
    normalizedTitle:
      "Fundamentos de estadistica descriptiva Variables estadisticas Distribucion de frecuencias y representaciones graficas Medidas de posicion dispersion y forma Momentos respecto del origen y centrales Funcion generatriz de momentos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "13",
    officialTitle:
      "Sucesos aleatorios. Concepto y propiedades fundamentales de la probabilidad. Probabilidad condicionada. Teorema de Bayes. Variables aleatorias. Variables discretas. Función de probabilidad. Variables continuas. Función de densidad. Esperanza matemática. Varianza. Función característica y función generatriz de momentos. Variables aleatorias bidimensionales. Distribuciones marginales y condicionadas. Covarianza y correlación. Teorema de Tchebychev.",
    normalizedTitle:
      "Sucesos aleatorios Concepto y propiedades fundamentales de la probabilidad Probabilidad condicionada Teorema de Bayes Variables aleatorias Variables discretas Funcion de probabilidad Variables continuas Funcion de densidad Esperanza matematica Varianza Funcion caracteristica y funcion generatriz de momentos Variables aleatorias bidimensionales Distribuciones marginales y condicionadas Covarianza y correlacion Teorema de Tchebychev",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "14",
    officialTitle:
      "Distribuciones estadísticas. Principales distribuciones estadísticas discretas y continuas: discreta uniforme, binomial, Poisson, continua uniforme, normal, ji cuadrado, t de Student y F de Fisher.",
    normalizedTitle:
      "Distribuciones estadisticas Principales distribuciones estadisticas discretas y continuas discreta uniforme binomial Poisson continua uniforme normal ji cuadrado t de Student y F de Fisher",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "15",
    officialTitle:
      "Inferencia estadística I. Estimación puntual de parámetros. Distribución de un estimador en el muestreo: Propiedades. Media y varianza muestrales. Método de máxima verosimilitud. Método de momentos. Estimación por intervalos: Conceptos básicos. Intervalos para media y varianza de una población normal. Intervalo para la diferencia de medias y el cociente de varianzas para dos poblaciones normales independientes.",
    normalizedTitle:
      "Inferencia estadistica I Estimacion puntual de parametros Distribucion de un estimador en el muestreo Propiedades Media y varianza muestrales Metodo de maxima verosimilitud Metodo de momentos Estimacion por intervalos Conceptos basicos Intervalos para media y varianza de una poblacion normal Intervalo para la diferencia de medias y el cociente de varianzas para dos poblaciones normales independientes",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "16",
    officialTitle:
      "Inferencia estadística II. Contrastes de hipótesis: Principales características. Fases de un contraste de hipótesis. Tipos de errores y significación. Contrastes bilaterales y unilaterales. Contrastes de la media y la varianza de una población normal. Contrastes de igualdad de medias e igualdad de varianzas de dos poblaciones normales.",
    normalizedTitle:
      "Inferencia estadistica II Contrastes de hipotesis Principales caracteristicas Fases de un contraste de hipotesis Tipos de errores y significacion Contrastes bilaterales y unilaterales Contrastes de la media y la varianza de una poblacion normal Contrastes de igualdad de medias e igualdad de varianzas de dos poblaciones normales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "17",
    officialTitle:
      "Variables estadísticas bidimensionales. Covarianza y coeficiente de correlación. Análisis de regresión. Regresión lineal simple: Método de mínimos cuadrados. Coeficientes de regresión. Varianza residual.",
    normalizedTitle:
      "Variables estadisticas bidimensionales Covarianza y coeficiente de correlacion Analisis de regresion Regresion lineal simple Metodo de minimos cuadrados Coeficientes de regresion Varianza residual",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "18",
    officialTitle:
      "Tratamiento numérico de los problemas matemáticos. Errores por truncamiento y cancelación, orden de aproximación, condicionamiento y estabilidad. Interpolación en una variable: interpolación de Taylor, interpolación de Lagrange y fórmula de Newton. Derivación e integración numéricas. Resolución numérica de ecuaciones diferenciales.",
    normalizedTitle:
      "Tratamiento numerico de los problemas matematicos Errores por truncamiento y cancelacion orden de aproximacion condicionamiento y estabilidad Interpolacion en una variable interpolacion de Taylor interpolacion de Lagrange y formula de Newton Derivacion e integracion numericas Resolucion numerica de ecuaciones diferenciales",
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
    block: "Meteorology and Climatology",
    officialNumber: "2",
    officialTitle:
      "Composición química de la atmósfera. Composición isotópica. Ozonosfera. Variabilidad de la composición atmosférica.",
    normalizedTitle:
      "Composicion quimica de la atmosfera Composicion isotopica Ozonosfera Variabilidad de la composicion atmosferica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "3",
    officialTitle:
      "La radiación en la atmósfera. Radiación solar y terrestre. Procesos de absorción, emisión y dispersión. Balance radiativo terrestre.",
    normalizedTitle:
      "La radiacion en la atmosfera Radiacion solar y terrestre Procesos de absorcion emision y dispersion Balance radiativo terrestre",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "4",
    officialTitle:
      "Ecuación de estado del aire atmosférico. Ecuaciones fundamentales de la estática atmosférica. Espesor de una capa atmosférica.",
    normalizedTitle:
      "Ecuacion de estado del aire atmosferico Ecuaciones fundamentales de la estatica atmosferica Espesor de una capa atmosferica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "5",
    officialTitle:
      "El agua en la atmósfera. Evaporación y condensación. Tensión de vapor. Variación de la temperatura de cambio de fase con la temperatura. Humedad absoluta, específica, relativa y razón de mezcla. Punto de rocío. Balance hídrico.",
    normalizedTitle:
      "El agua en la atmosfera Evaporacion y condensacion Tension de vapor Variacion de la temperatura de cambio de fase con la temperatura Humedad absoluta especifica relativa y razon de mezcla Punto de rocio Balance hidrico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "6",
    officialTitle:
      "Procesos adiabáticos en la atmósfera. El gradiente adiabático seco y saturado. Estabilidad estática. Inestabilidad condicional. Índices de estabilidad.",
    normalizedTitle:
      "Procesos adiabaticos en la atmosfera El gradiente adiabatico seco y saturado Estabilidad estatica Inestabilidad condicional Indices de estabilidad",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "7",
    officialTitle:
      "Nubes. Clasificación y génesis. Nubes cumuliformes y estratiformes. Nubes altas, medias y bajas. Nieblas.",
    normalizedTitle:
      "Nubes Clasificacion y genesis Nubes cumuliformes y estratiformes Nubes altas medias y bajas Nieblas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "8",
    officialTitle:
      "Procesos microfísicos en nubes cálidas y frías. Nucleación homogénea y heterogénea. Colisión-coalescencia. Proceso Bergeron-Findeisen.",
    normalizedTitle:
      "Procesos microfisicos en nubes calidas y frias Nucleacion homogenea y heterogenea Colision coalescencia Proceso Bergeron Findeisen",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "9",
    officialTitle:
      "Precipitación. Tipos y mecanismos de formación. Intensidad y duración. Medida de la precipitación.",
    normalizedTitle:
      "Precipitacion Tipos y mecanismos de formacion Intensidad y duracion Medida de la precipitacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "10",
    officialTitle:
      "Visibilidad. Atenuación y extinción de la radiación en la atmósfera. Factores que afectan a la visibilidad. Medida instrumental de la visibilidad.",
    normalizedTitle:
      "Visibilidad Atenuacion y extincion de la radiacion en la atmosfera Factores que afectan a la visibilidad Medida instrumental de la visibilidad",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "11",
    officialTitle:
      "Meteoros. Clasificación. Litometeoros, hidrometeoros y fotometeoros. Observación meteorológica de fenómenos meteorológicos.",
    normalizedTitle:
      "Meteoros Clasificacion Litometeoros hidrometeoros y fotometeoros Observacion meteorologica de fenomenos meteorologicos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "12",
    officialTitle:
      "La ecuación de movimiento atmosférico. Principales fuerzas. Sistemas de referencia absolutos y relativos. Aproximaciones características. Escalas de movimiento. Equilibrio geostrófico, gradiente y ciclostrófico.",
    normalizedTitle:
      "La ecuacion de movimiento atmosferico Principales fuerzas Sistemas de referencia absolutos y relativos Aproximaciones caracteristicas Escalas de movimiento Equilibrio geostrofico gradiente y ciclostrofico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "13",
    officialTitle:
      "Turbulencia en la atmósfera. Capa límite atmosférica. Intercambios turbulentos. Longitud de mezcla. Parámetros característicos de la capa límite.",
    normalizedTitle:
      "Turbulencia en la atmosfera Capa limite atmosferica Intercambios turbulentos Longitud de mezcla Parametros caracteristicos de la capa limite",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "14",
    officialTitle:
      "Circulación general de la atmósfera. Células de circulación. Ondas planetarias. Corrientes en chorro. Monzones.",
    normalizedTitle:
      "Circulacion general de la atmosfera Celulas de circulacion Ondas planetarias Corrientes en chorro Monzones",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "15",
    officialTitle:
      "Masas de aire y frentes. Clasificación. Estructura. Formación y evolución. Frentes fríos, cálidos, ocluidos y estacionarios.",
    normalizedTitle:
      "Masas de aire y frentes Clasificacion Estructura Formacion y evolucion Frentes frios calidos ocluidos y estacionarios",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "16",
    officialTitle:
      "Sistemas de presión. Anticiclones y borrascas. Estructura vertical. Evolución. Ciclogénesis y frontogénesis.",
    normalizedTitle:
      "Sistemas de presion Anticiclones y borrascas Estructura vertical Evolucion Ciclogenesis y frontogenesis",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "17",
    officialTitle:
      "Convección atmosférica. Tormentas. Células convectivas. Mesoescala. Sistemas convectivos de mesoescala.",
    normalizedTitle:
      "Conveccion atmosferica Tormentas Celulas convectivas Mesoescala Sistemas convectivos de mesoescala",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "18",
    officialTitle:
      "Ciclones tropicales. Génesis, estructura y evolución. Clasificación. Riesgos asociados.",
    normalizedTitle:
      "Ciclones tropicales Genesis estructura y evolucion Clasificacion Riesgos asociados",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "19",
    officialTitle:
      "Ondas de montaña y efecto foehn. Brisas marinas y terrestres. Circulaciones locales. Influencia del relieve en el tiempo.",
    normalizedTitle:
      "Ondas de montana y efecto foehn Brisas marinas y terrestres Circulaciones locales Influencia del relieve en el tiempo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "20",
    officialTitle:
      "Interacción atmósfera-océano. Intercambios de calor, humedad y momento. Oscilación del Sur-El Niño. Variabilidad acoplada.",
    normalizedTitle:
      "Interaccion atmosfera oceano Intercambios de calor humedad y momento Oscilacion del Sur El Nino Variabilidad acoplada",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "21",
    officialTitle:
      "Fenómenos meteorológicos de impacto para la aviación I: Cizalladura y turbulencia. Causas de su formación. Tipos de turbulencia y su impacto en las aeronaves. Turbulencia por onda de montaña. Turbulencia en aire claro. Corriente en chorro y su impacto en la aviación.",
    normalizedTitle:
      "Fenomenos meteorologicos de impacto para la aviacion I Cizalladura y turbulencia Causas de su formacion Tipos de turbulencia y su impacto en las aeronaves Turbulencia por onda de montana Turbulencia en aire claro Corriente en chorro y su impacto en la aviacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "22",
    officialTitle:
      "Fenómenos meteorológicos de impacto para la aviación II: Engelamiento. Formación de hielo en las aeronaves: razón de engelamiento. Visibilidad. Reducción de visibilidad por nieblas y otros fenómenos. Tormentas y su impacto en la aviación.",
    normalizedTitle:
      "Fenomenos meteorologicos de impacto para la aviacion II Engelamiento Formacion de hielo en las aeronaves razon de engelamiento Visibilidad Reduccion de visibilidad por nieblas y otros fenomenos Tormentas y su impacto en la aviacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "23",
    officialTitle:
      "Fuerzas fundamentales de los movimientos atmosféricos. Fuerzas aparentes de los movimientos atmosféricos. Ecuación del momento en un sistema de coordenadas cartesianas en rotación.",
    normalizedTitle:
      "Fuerzas fundamentales de los movimientos atmosfericos Fuerzas aparentes de los movimientos atmosfericos Ecuacion del momento en un sistema de coordenadas cartesianas en rotacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "24",
    officialTitle:
      "Ecuaciones del momento en un sistema de coordenadas esféricas en rotación. Coordenadas naturales: Características. Ecuaciones del movimiento en coordenadas naturales. Análisis de escala de las ecuaciones del movimiento. Aproximación geostrófica e hidrostática. Número de Rossby.",
    normalizedTitle:
      "Ecuaciones del momento en un sistema de coordenadas esfericas en rotacion Coordenadas naturales Caracteristicas Ecuaciones del movimiento en coordenadas naturales Analisis de escala de las ecuaciones del movimiento Aproximacion geostrofica e hidrostatica Numero de Rossby",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "25",
    officialTitle:
      "Ecuación de continuidad: Deducciones euleriana y lagrangiana. Análisis de escala. Aproximación de Boussinesq. Ecuación de continuidad en coordenadas isobáricas. Principio de conservación de la energía aplicado a la atmósfera. Ecuación de la energía termodinámica. Análisis de escala. Ecuación de la energía termodinámica en coordenadas isobáricas.",
    normalizedTitle:
      "Ecuacion de continuidad Deducciones euleriana y lagrangiana Analisis de escala Aproximacion de Boussinesq Ecuacion de continuidad en coordenadas isobaricas Principio de conservacion de la energia aplicado a la atmosfera Ecuacion de la energia termodinamica Analisis de escala Ecuacion de la energia termodinamica en coordenadas isobaricas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "26",
    officialTitle:
      "Balance de fuerzas en la vertical. Ecuación hidrostática. Los campos de geopotencial y espesor. Fórmulas barométricas. Altura geopotencial, altura dinámica y altura geométrica.",
    normalizedTitle:
      "Balance de fuerzas en la vertical Ecuacion hidrostatica Los campos de geopotencial y espesor Formulas barometricas Altura geopotencial altura dinamica y altura geometrica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "27",
    officialTitle:
      "Ecuación del momento en coordenadas de presión. Equilibrio de fuerzas en la horizontal: Configuraciones básicas de flujo. Trayectorias y líneas de corriente: Fórmula de Blaton. Vientos inercial y ciclostrófico. Viento geostrófico. Viento del gradiente.",
    normalizedTitle:
      "Ecuacion del momento en coordenadas de presion Equilibrio de fuerzas en la horizontal Configuraciones basicas de flujo Trayectorias y lineas de corriente Formula de Blaton Vientos inercial y ciclostrofico Viento geostrofico Viento del gradiente",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "28",
    officialTitle:
      "Variación vertical del viento geostrófico. Viento térmico. Balance del viento térmico. Barotropía y baroclinidad. Principales características del viento ageostrófico.",
    normalizedTitle:
      "Variacion vertical del viento geostrofico Viento termico Balance del viento termico Barotropia y baroclinidad Principales caracteristicas del viento ageostrofico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "29",
    officialTitle:
      "Concepto de circulación. Teoremas de la circulación de Bjerknes y Kelvin. Concepto de vorticidad y su relación con la circulación. Vorticidad en coordenadas naturales. Ecuación de la vorticidad en coordenadas cartesianas: interpretación física. Análisis de escala de la ecuación de la vorticidad. Ecuación de la vorticidad en coordenadas isobáricas. Vorticidad potencial. Conservación de la vorticidad en el flujo atmosférico.",
    normalizedTitle:
      "Concepto de circulacion Teoremas de la circulacion de Bjerknes y Kelvin Concepto de vorticidad y su relacion con la circulacion Vorticidad en coordenadas naturales Ecuacion de la vorticidad en coordenadas cartesianas interpretacion fisica Analisis de escala de la ecuacion de la vorticidad Ecuacion de la vorticidad en coordenadas isobaricas Vorticidad potencial Conservacion de la vorticidad en el flujo atmosferico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "30",
    officialTitle:
      "La aproximación cuasigeostrófica. Sistemas de ecuaciones cuasigeostróficas. Predicción cuasigeostrófica: La ecuación de tendencia del geopotencial. Interpretación matemática y física de la ecuación de tendencia del geopotencial. Ecuación de la vorticidad potencial cuasigeostrófica.",
    normalizedTitle:
      "La aproximacion cuasigeostrofica Sistemas de ecuaciones cuasigeostroficas Prediccion cuasigeostrofica La ecuacion de tendencia del geopotencial Interpretacion matematica y fisica de la ecuacion de tendencia del geopotencial Ecuacion de la vorticidad potencial cuasigeostrofica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "31",
    officialTitle:
      "Obtención de la ecuación omega a partir de las ecuaciones en aproximación cuasigeostrófica. Ecuación omega cuasigeostrófica: Interpretación matemática y física. Aproximación de Trenberth. Vector Q de Hoskins. Modelo idealizado de una perturbación baroclina.",
    normalizedTitle:
      "Obtencion de la ecuacion omega a partir de las ecuaciones en aproximacion cuasigeostrofica Ecuacion omega cuasigeostrofica Interpretacion matematica y fisica Aproximacion de Trenberth Vector Q de Hoskins Modelo idealizado de una perturbacion baroclina",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "32",
    officialTitle:
      "Ondas en la atmósfera: Características principales. Ondas acústicas. Ondas de gravedad y de inercia. Ondas de Kelvin. Ondas de Rossby: Propagación en una atmósfera barotrópica y en una atmósfera baroclina. Dispersión y velocidad de grupo.",
    normalizedTitle:
      "Ondas en la atmosfera Caracteristicas principales Ondas acusticas Ondas de gravedad y de inercia Ondas de Kelvin Ondas de Rossby Propagacion en una atmosfera barotropica y en una atmosfera baroclina Dispersion y velocidad de grupo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "33",
    officialTitle:
      "Inestabilidad hidrodinámica. Inestabilidad barotrópica. Balance energético en ondas barotrópicas. Inestabilidad baroclina. Energía de las ondas baroclinas. Ciclo de vida de perturbaciones atmosféricas en latitudes medias. Inestabilidad baroclina generalizada: Ciclogénesis.",
    normalizedTitle:
      "Inestabilidad hidrodinamica Inestabilidad barotropica Balance energetico en ondas barotropicas Inestabilidad baroclina Energia de las ondas baroclinas Ciclo de vida de perturbaciones atmosfericas en latitudes medias Inestabilidad baroclina generalizada Ciclogenesis",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "34",
    officialTitle:
      "Concepto de superficie límite y frontal. Discontinuidades en superficies frontales: Presión, temperatura, densidad y velocidad. Condiciones de contorno en frentes. Fórmula de Margules. Función frontogenética. Cinemática y termodinámica de la frontogénesis. Papel frontogénico de las configuraciones de flujo.",
    normalizedTitle:
      "Concepto de superficie limite y frontal Discontinuidades en superficies frontales Presion temperatura densidad y velocidad Condiciones de contorno en frentes Formula de Margules Funcion frontogenetica Cinematica y termodinamica de la frontogenesis Papel frontogenico de las configuraciones de flujo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "35",
    officialTitle:
      "Aspectos sinópticos de las zonas frontales. Los frentes en superficie: Frente frío, frente cálido, frente estacionario y frente ocluido. Principales características de los frentes en superficie y su impacto en las condiciones meteorológicas. Anafrentes y catafrentes. Los frentes en la media y alta troposfera.",
    normalizedTitle:
      "Aspectos sinopticos de las zonas frontales Los frentes en superficie Frente frio frente calido frente estacionario y frente ocluido Principales caracteristicas de los frentes en superficie y su impacto en las condiciones meteorologicas Anafrentes y catafrentes Los frentes en la media y alta troposfera",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "36",
    officialTitle:
      "Corrientes en chorro. Aspectos observacionales de las corrientes en chorro. Cinemática y dinámica de las corrientes en chorro. Análisis cuasigeostrófico.",
    normalizedTitle:
      "Corrientes en chorro Aspectos observacionales de las corrientes en chorro Cinematica y dinamica de las corrientes en chorro Analisis cuasigeostrofico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "37",
    officialTitle:
      "Meteorología mesoescalar. Escalas espaciales y temporales. La dinámica de los sistemas de mesoescala y diferencias con la escala sinóptica. Características mesoescalares asociadas a fenómenos orográficos: forzamiento térmico, ondas de montaña y bloqueos.",
    normalizedTitle:
      "Meteorologia mesoescalar Escalas espaciales y temporales La dinamica de los sistemas de mesoescala y diferencias con la escala sinoptica Caracteristicas mesoescalares asociadas a fenomenos orograficos forzamiento termico ondas de montana y bloqueos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "38",
    officialTitle:
      "Convección profunda. Iniciación y organización de la convección. Convección multicelular y supercelular. Características generales de los sistemas convectivos de mesoescala. Impactos asociados a la convección profunda.",
    normalizedTitle:
      "Conveccion profunda Iniciacion y organizacion de la conveccion Conveccion multicelular y supercelular Caracteristicas generales de los sistemas convectivos de mesoescala Impactos asociados a la conveccion profunda",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "39",
    officialTitle:
      "Capa límite planetaria. Fricción molecular y turbulenta. Ecuaciones del movimiento en la capa límite planetaria. Tensor de Reynolds. Número de Richardson. Teoría de la longitud de mezcla y el transporte turbulento. Estructura del viento en la capa límite. Espiral o capa de Ekman.",
    normalizedTitle:
      "Capa limite planetaria Friccion molecular y turbulenta Ecuaciones del movimiento en la capa limite planetaria Tensor de Reynolds Numero de Richardson Teoria de la longitud de mezcla y el transporte turbulento Estructura del viento en la capa limite Espiral o capa de Ekman",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "40",
    officialTitle:
      "Meteorología tropical. Estructura de los movimientos a gran escala en la zona ecuatorial. Análisis de escala de los movimientos tropicales. Origen de las perturbaciones ecuatoriales. Ciclones tropicales.",
    normalizedTitle:
      "Meteorologia tropical Estructura de los movimientos a gran escala en la zona ecuatorial Analisis de escala de los movimientos tropicales Origen de las perturbaciones ecuatoriales Ciclones tropicales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "41",
    officialTitle:
      "Estructura térmica y dinámica de la estratosfera. Circulación zonal y meridional del viento en la atmósfera media. Célula de Brewer-Dobson. Ondas planetarias de propagación vertical. Calentamientos súbitos estratosféricos. Oscilación cuasibienal.",
    normalizedTitle:
      "Estructura termica y dinamica de la estratosfera Circulacion zonal y meridional del viento en la atmosfera media Celula de Brewer Dobson Ondas planetarias de propagacion vertical Calentamientos subitos estratosfericos Oscilacion cuasibienal",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "42",
    officialTitle:
      "Aproximación numérica de las ecuaciones de movimiento. Método de las diferencias finitas. Esquemas de diferenciación explícitos e implícitos. Consistencia, estabilidad y convergencia: La condición CFL. El método espectral. Modelos de ecuaciones primitivas.",
    normalizedTitle:
      "Aproximacion numerica de las ecuaciones de movimiento Metodo de las diferencias finitas Esquemas de diferenciacion explicitos e implicitos Consistencia estabilidad y convergencia La condicion CFL El metodo espectral Modelos de ecuaciones primitivas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "43",
    officialTitle:
      "Asimilación de datos. Fases del ciclo de asimilación. Esquemas de predicción deterministas y probabilistas. Alcances temporales de predicción. Predecibilidad y limitaciones. Sistemas de predicción por conjuntos: Fundamentos básicos.",
    normalizedTitle:
      "Asimilacion de datos Fases del ciclo de asimilacion Esquemas de prediccion deterministas y probabilistas Alcances temporales de prediccion Predecibilidad y limitaciones Sistemas de prediccion por conjuntos Fundamentos basicos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "44",
    officialTitle:
      "Evolución del concepto y de las definiciones de clima. El sistema climático: Componentes. Variabilidad natural del clima y escalas temporales. Estados de equilibrio climático. Variabilidad climática y cambio climático.",
    normalizedTitle:
      "Evolucion del concepto y de las definiciones de clima El sistema climatico Componentes Variabilidad natural del clima y escalas temporales Estados de equilibrio climatico Variabilidad climatica y cambio climatico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "45",
    officialTitle:
      "Paleoclimatología y dataciones no instrumentales. Principales fuentes de datos paleoclimáticos y registros históricos. Evolución del clima terrestre a lo largo de la historia de nuestro planeta.",
    normalizedTitle:
      "Paleoclimatologia y dataciones no instrumentales Principales fuentes de datos paleoclimaticos y registros historicos Evolucion del clima terrestre a lo largo de la historia de nuestro planeta",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "46",
    officialTitle:
      "Distribución global media de variables atmosféricas. Variabilidad espacial y temporal de la presión, el geopotencial, la temperatura, la precipitación y la evaporación.",
    normalizedTitle:
      "Distribucion global media de variables atmosfericas Variabilidad espacial y temporal de la presion el geopotencial la temperatura la precipitacion y la evaporacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "47",
    officialTitle:
      "Distribución global media de variables oceánicas. Variabilidad espacial y temporal de la temperatura, la salinidad y la densidad.",
    normalizedTitle:
      "Distribucion global media de variables oceanicas Variabilidad espacial y temporal de la temperatura la salinidad y la densidad",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "48",
    officialTitle:
      "Caracterización de los climas del mundo. Clasificaciones clásicas de Köppen y Thornthwaite. Aplicación a la península ibérica y archipiélago canario.",
    normalizedTitle:
      "Caracterizacion de los climas del mundo Clasificaciones clasicas de Koppen y Thornthwaite Aplicacion a la peninsula iberica y archipielago canario",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "49",
    officialTitle:
      "La Tierra: Características principales. Movimientos de la Tierra. Proyecciones cartográficas utilizadas comúnmente en Meteorología. Geografía física de España: principales unidades de relieve y cuencas hidrográficas.",
    normalizedTitle:
      "La Tierra Caracteristicas principales Movimientos de la Tierra Proyecciones cartograficas utilizadas comunmente en Meteorologia Geografia fisica de Espana principales unidades de relieve y cuencas hidrograficas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "50",
    officialTitle:
      "Balance global de energía. Balance de energía en la cima de la atmósfera: variaciones latitudinales y estacionales. Balance de energía en superficie: variaciones latitudinales. Ciclos diurno, estacional y anual. Transporte de energía latitudinal.",
    normalizedTitle:
      "Balance global de energia Balance de energia en la cima de la atmosfera variaciones latitudinales y estacionales Balance de energia en superficie variaciones latitudinales Ciclos diurno estacional y anual Transporte de energia latitudinal",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "51",
    officialTitle:
      "La circulación general de la atmósfera. Estructura media observada: Modelo tricelular. Variaciones estacionales y asimetrías zonales de la circulación tricelular. Balance de momento angular en el sistema tierra-atmósfera. Mecanismo de intercambio de momento angular.",
    normalizedTitle:
      "La circulacion general de la atmosfera Estructura media observada Modelo tricelular Variaciones estacionales y asimetrias zonales de la circulacion tricelular Balance de momento angular en el sistema tierra atmosfera Mecanismo de intercambio de momento angular",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "52",
    officialTitle:
      "La circulación general de los océanos. Corrientes oceánicas. Transporte de Ekman. Circulación termohalina. El hielo marino y su papel en la circulación termohalina.",
    normalizedTitle:
      "La circulacion general de los oceanos Corrientes oceanicas Transporte de Ekman Circulacion termohalina El hielo marino y su papel en la circulacion termohalina",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "53",
    officialTitle:
      "El ciclo hidrológico. Ecuación general del balance hídrico. Evaporación y transpiración. Balance hídrico en superficie: variaciones latitudinales.",
    normalizedTitle:
      "El ciclo hidrologico Ecuacion general del balance hidrico Evaporacion y transpiracion Balance hidrico en superficie variaciones latitudinales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "54",
    officialTitle:
      "El ciclo del carbono. Ciclos geológico y biológico. Balance de concentraciones de CO2 en la atmósfera. Principales fuentes o sumideros de CO2.",
    normalizedTitle:
      "El ciclo del carbono Ciclos geologico y biologico Balance de concentraciones de CO2 en la atmosfera Principales fuentes o sumideros de CO2",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "55",
    officialTitle:
      "Modelos climáticos: concepto y objetivo. Jerarquía de modelos. Modelos climáticos globales: modelos acoplados y modelos del sistema tierra. Ecuaciones fundamentales. Parametrizaciones.",
    normalizedTitle:
      "Modelos climaticos concepto y objetivo Jerarquia de modelos Modelos climaticos globales modelos acoplados y modelos del sistema tierra Ecuaciones fundamentales Parametrizaciones",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "56",
    officialTitle:
      "Forzamiento radiativo. Temperatura efectiva. Efecto invernadero. Sensibilidad del sistema climático ante forzamientos radiativos. Interacciones y procesos de retroalimentación en el sistema climático.",
    normalizedTitle:
      "Forzamiento radiativo Temperatura efectiva Efecto invernadero Sensibilidad del sistema climatico ante forzamientos radiativos Interacciones y procesos de retroalimentacion en el sistema climatico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "57",
    officialTitle:
      "Variabilidad interanual del clima. Interacciones océano-atmósfera I: Caracterización de los episodios ENSO. Retroalimentación de Bjerknes. Interacciones océano-atmósfera II: Caracterización de los episodios NAO y PDO.",
    normalizedTitle:
      "Variabilidad interanual del clima Interacciones oceano atmosfera I Caracterizacion de los episodios ENSO Retroalimentacion de Bjerknes Interacciones oceano atmosfera II Caracterizacion de los episodios NAO y PDO",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "58",
    officialTitle:
      "Causas externas naturales de los cambios climáticos. Parámetros orbitales: Ciclos de Milankovich. Variaciones de la potencia solar. Erupciones volcánicas y su impacto en el sistema climático.",
    normalizedTitle:
      "Causas externas naturales de los cambios climaticos Parametros orbitales Ciclos de Milankovich Variaciones de la potencia solar Erupciones volcanicas y su impacto en el sistema climatico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "59",
    officialTitle:
      "Causas externas antropogénicas de los cambios climáticos. Gases de efecto invernadero: Potencial de calentamiento global. Intensificación del efecto invernadero. Aerosoles de origen antropogénico. Modificación de la superficie por usos del suelo. Evolución y comparación de forzamientos radiativos naturales y antropogénicos.",
    normalizedTitle:
      "Causas externas antropogenicas de los cambios climaticos Gases de efecto invernadero Potencial de calentamiento global Intensificacion del efecto invernadero Aerosoles de origen antropogenico Modificacion de la superficie por usos del suelo Evolucion y comparacion de forzamientos radiativos naturales y antropogenicos",
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
    block: "Informatics and Communications",
    officialNumber: "2",
    officialTitle:
      "Lenguajes de programación. Lenguajes compilados e interpretados. Programación orientada a objetos.",
    normalizedTitle:
      "Lenguajes de programacion Lenguajes compilados e interpretados Programacion orientada a objetos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "3",
    officialTitle:
      "Lenguajes de programación para cálculo computacional: Fortran, Python y R. Estructuras de datos. Herramientas de control de flujo. Entrada y salida. Funciones. Librerías. Manejo de errores.",
    normalizedTitle:
      "Lenguajes de programacion para calculo computacional Fortran Python y R Estructuras de datos Herramientas de control de flujo Entrada y salida Funciones Librerias Manejo de errores",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "4",
    officialTitle:
      "Tecnologías web. Lenguaje de marcado de hipertexto (HTML). Conceptos y estructura básica de un documento HTML. Lenguajes de script: Javascript. Estructuras de datos. Herramientas de control de flujo. Funciones. Manejo de errores.",
    normalizedTitle:
      "Tecnologias web Lenguaje de marcado de hipertexto HTML Conceptos y estructura basica de un documento HTML Lenguajes de script Javascript Estructuras de datos Herramientas de control de flujo Funciones Manejo de errores",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "5",
    officialTitle:
      "Concepto de bases de datos: Principales componentes de un entorno de bases de datos. Sistemas de gestión de bases de datos (Relacionales; Orientados a objetos; NoSQL): Características y elementos constitutivos.",
    normalizedTitle:
      "Concepto de bases de datos Principales componentes de un entorno de bases de datos Sistemas de gestion de bases de datos Relacionales Orientados a objetos NoSQL Caracteristicas y elementos constitutivos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "6",
    officialTitle:
      "Estructuras de datos. Tablas, listas y árboles. Algoritmos: Ordenación, Búsqueda, Recursión, Grafos. Organizaciones de ficheros.",
    normalizedTitle:
      "Estructuras de datos Tablas listas y arboles Algoritmos Ordenacion Busqueda Recursion Grafos Organizaciones de ficheros",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "7",
    officialTitle:
      "Redes locales. Tipología. Medios de transmisión. Métodos de acceso. El modelo de referencia de interconexión de sistemas abiertos (OSI) de ISO. Arquitectura. Capas, interfaces y protocolos. Protocolos TCP/IP.",
    normalizedTitle:
      "Redes locales Tipologia Medios de transmision Metodos de acceso El modelo de referencia de interconexion de sistemas abiertos OSI de ISO Arquitectura Capas interfaces y protocolos Protocolos TCP IP",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "8",
    officialTitle:
      "Sistemas de Información Geográfica (SIG). Estructura de datos. Organización de la información geográfica en los SIG. Estructuras de datos de raster y vectoriales. Bases de datos espaciales y bases de datos temáticos. Análisis y modelización espacial.",
    normalizedTitle:
      "Sistemas de Informacion Geografica SIG Estructura de datos Organizacion de la informacion geografica en los SIG Estructuras de datos de raster y vectoriales Bases de datos espaciales y bases de datos tematicos Analisis y modelizacion espacial",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "9",
    officialTitle:
      "La red Internet: Arquitectura de red. Principios de funcionamiento. Servicios: Evolución, estado actual y tendencias.",
    normalizedTitle:
      "La red Internet Arquitectura de red Principios de funcionamiento Servicios Evolucion estado actual y tendencias",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "10",
    officialTitle:
      "La seguridad en redes. Control de accesos. Técnicas criptográficas. Mecanismos de firma digital. Intrusiones. Cortafuegos. Redes privadas virtuales (VPN).",
    normalizedTitle:
      "La seguridad en redes Control de accesos Tecnicas criptograficas Mecanismos de firma digital Intrusiones Cortafuegos Redes privadas virtuales VPN",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "1",
    officialTitle:
      "La Constitución Española de 1978: estructura, contenido, principios y valores fundamentales. Los derechos y deberes fundamentales: garantías y suspensión. La Corona. Reforma constitucional.",
    normalizedTitle:
      "La Constitucion Espanola de 1978 estructura contenido principios y valores fundamentales Los derechos y deberes fundamentales garantias y suspension La Corona Reforma constitucional",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "2",
    officialTitle:
      "Las Cortes Generales. Composición, atribuciones y funcionamiento. La elaboración de las leyes. Los Tratados Internacionales. El Defensor del Pueblo.",
    normalizedTitle:
      "Las Cortes Generales Composicion atribuciones y funcionamiento La elaboracion de las leyes Los Tratados Internacionales El Defensor del Pueblo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "3",
    officialTitle:
      "El Gobierno. Composición, designación, funciones y relaciones con el resto de los poderes del Estado.",
    normalizedTitle:
      "El Gobierno Composicion designacion funciones y relaciones con el resto de los poderes del Estado",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "4",
    officialTitle:
      "La Administración Pública: principios constitucionales. La Administración General del Estado: organización y régimen jurídico. El Sector Público Institucional. La Administración Consultiva. La Administración de control.",
    normalizedTitle:
      "La Administracion Publica principios constitucionales La Administracion General del Estado organizacion y regimen juridico El Sector Publico Institucional La Administracion Consultiva La Administracion de control",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "5",
    officialTitle:
      "Las Comunidades Autónomas. Los Estatutos de Autonomía. Organización política y administrativa. La delimitación de competencias entre el Estado y las Comunidades Autónomas. La Administración Local: entidades que la integran. La provincia, el municipio y la isla.",
    normalizedTitle:
      "Las Comunidades Autonomas Los Estatutos de Autonomia Organizacion politica y administrativa La delimitacion de competencias entre el Estado y las Comunidades Autonomas La Administracion Local entidades que la integran La provincia el municipio y la isla",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "6",
    officialTitle:
      "La Unión Europea: antecedentes, evolución, objetivos y naturaleza jurídica. Los Tratados originarios y modificativos. El proceso de ampliación. El Brexit. Instituciones de la Unión Europea. La participación de los Estados miembros en el proceso decisorio. El Derecho de la Unión Europea. Relación entre el Derecho de la Unión Europea y el ordenamiento jurídico de los Estados Miembros. Políticas de la Unión Europea.",
    normalizedTitle:
      "La Union Europea antecedentes evolucion objetivos y naturaleza juridica Los Tratados originarios y modificativos El proceso de ampliacion El Brexit Instituciones de la Union Europea La participacion de los Estados miembros en el proceso decisorio El Derecho de la Union Europea Relacion entre el Derecho de la Union Europea y el ordenamiento juridico de los Estados Miembros Politicas de la Union Europea",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "7",
    officialTitle:
      "Las fuentes del ordenamiento jurídico administrativo. La jerarquía de las fuentes. La ley. Las disposiciones del Ejecutivo con fuerza de ley: decreto-ley y decreto legislativo. El reglamento: concepto, clases y límites. Otras fuentes del derecho administrativo.",
    normalizedTitle:
      "Las fuentes del ordenamiento juridico administrativo La jerarquia de las fuentes La ley Las disposiciones del Ejecutivo con fuerza de ley decreto ley y decreto legislativo El reglamento concepto clases y limites Otras fuentes del derecho administrativo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "8",
    officialTitle:
      "El acto administrativo: concepto, clases y elementos. Eficacia y validez de los actos administrativos. Revisión, anulación y revocación. El principio de legalidad en la actuación administrativa.",
    normalizedTitle:
      "El acto administrativo concepto clases y elementos Eficacia y validez de los actos administrativos Revision anulacion y revocacion El principio de legalidad en la actuacion administrativa",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "9",
    officialTitle:
      "Las Leyes 39/2015, de Procedimiento Administrativo Común de las Administraciones Públicas y 40/2015, de Régimen Jurídico del Sector Público, y su normativa de desarrollo. El procedimiento administrativo común y sus fases. La revisión de los actos en vía administrativa: revisión de oficio y recursos administrativos. El recurso contencioso-administrativo.",
    normalizedTitle:
      "Las Leyes 39 2015 de Procedimiento Administrativo Comun de las Administraciones Publicas y 40 2015 de Regimen Juridico del Sector Publico y su normativa de desarrollo El procedimiento administrativo comun y sus fases La revision de los actos en via administrativa revision de oficio y recursos administrativos El recurso contencioso administrativo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "10",
    officialTitle:
      "Los contratos del sector público: concepto y clases. Preparación, adjudicación, efectos, cumplimiento y extinción. Procedimientos de contratación. Garantías. Especialidades de los contratos de obras, de concesión de obras, de concesión de servicios, de suministro y de servicios. El recurso especial en materia de contratación.",
    normalizedTitle:
      "Los contratos del sector publico concepto y clases Preparacion adjudicacion efectos cumplimiento y extincion Procedimientos de contratacion Garantias Especialidades de los contratos de obras de concesion de obras de concesion de servicios de suministro y de servicios El recurso especial en materia de contratacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "11",
    officialTitle:
      "Procedimientos y formas de la actividad administrativa. La actividad de limitación, arbitral, de servicio público y de fomento. Formas de gestión de los servicios públicos. Las ayudas públicas. La actividad administrativa de control.",
    normalizedTitle:
      "Procedimientos y formas de la actividad administrativa La actividad de limitacion arbitral de servicio publico y de fomento Formas de gestion de los servicios publicos Las ayudas publicas La actividad administrativa de control",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "12",
    officialTitle:
      "La responsabilidad patrimonial de las Administraciones Públicas. Procedimiento de responsabilidad patrimonial. La acción de responsabilidad. La potestad sancionadora de las Administraciones Públicas. Especialidades del procedimiento administrativo sancionador.",
    normalizedTitle:
      "La responsabilidad patrimonial de las Administraciones Publicas Procedimiento de responsabilidad patrimonial La accion de responsabilidad La potestad sancionadora de las Administraciones Publicas Especialidades del procedimiento administrativo sancionador",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "13",
    officialTitle:
      "Régimen jurídico del personal al servicio de las Administraciones públicas. El texto refundido de la Ley del Estatuto Básico del Empleado Público y otras normas: Tipos de empleados públicos y derechos y deberes del personal al servicio de la Administración Pública. Incompatibilidades. Régimen disciplinario.",
    normalizedTitle:
      "Regimen juridico del personal al servicio de las Administraciones publicas El texto refundido de la Ley del Estatuto Basico del Empleado Publico y otras normas Tipos de empleados publicos y derechos y deberes del personal al servicio de la Administracion Publica Incompatibilidades Regimen disciplinario",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "14",
    officialTitle:
      "El presupuesto del Estado en España: contenido, elaboración y estructura. Fases del ciclo presupuestario. Estabilidad presupuestaria y sostenibilidad financiera. La Unión Económica y Monetaria.",
    normalizedTitle:
      "El presupuesto del Estado en Espana contenido elaboracion y estructura Fases del ciclo presupuestario Estabilidad presupuestaria y sostenibilidad financiera La Union Economica y Monetaria",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "15",
    officialTitle:
      "El control del gasto público en España. Función interventora y control financiero permanente. El Tribunal de Cuentas. La contabilidad pública.",
    normalizedTitle:
      "El control del gasto publico en Espana Funcion interventora y control financiero permanente El Tribunal de Cuentas La contabilidad publica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "16",
    officialTitle:
      "Las políticas públicas: elaboración, ejecución y evaluación. La Agencia Estatal de Evaluación de Políticas Públicas. La Gobernanza pública y el Gobierno abierto: concepto y principios informadores del Gobierno Abierto: Colaboración, participación, transparencia y rendición de cuentas.",
    normalizedTitle:
      "Las politicas publicas elaboracion ejecucion y evaluacion La Agencia Estatal de Evaluacion de Politicas Publicas La Gobernanza publica y el Gobierno abierto concepto y principios informadores del Gobierno Abierto Colaboracion participacion transparencia y rendicion de cuentas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "17",
    officialTitle:
      "Políticas de igualdad y contra la violencia de género. Políticas dirigidas a la atención a personas con discapacidad y/o dependientes.",
    normalizedTitle:
      "Politicas de igualdad y contra la violencia de genero Politicas dirigidas a la atencion a personas con discapacidad y o dependientes",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "18",
    officialTitle:
      "Política de protección de datos personales. Régimen Jurídico. El Reglamento (UE) 2016/679 de 27 de abril relativo a la protección de datos personales y a la libre circulación de estos datos. Principios y derechos. Obligaciones. Régimen sancionador. El Supervisor Europeo de Protección de Datos. La Agencia Española de Protección de Datos.",
    normalizedTitle:
      "Politica de proteccion de datos personales Regimen Juridico El Reglamento UE 2016 679 de 27 de abril relativo a la proteccion de datos personales y a la libre circulacion de estos datos Principios y derechos Obligaciones Regimen sancionador El Supervisor Europeo de Proteccion de Datos La Agencia Espanola de Proteccion de Datos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "19",
    officialTitle:
      "La Agenda 2030 para el Desarrollo Sostenible y los Objetivos de Desarrollo Sostenible. Antecedentes y evolución. Sostenibilidad económica, social y ambiental.",
    normalizedTitle:
      "La Agenda 2030 para el Desarrollo Sostenible y los Objetivos de Desarrollo Sostenible Antecedentes y evolucion Sostenibilidad economica social y ambiental",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "20",
    officialTitle:
      "El Estado Mayor General del Aire y del Espacio y el Centro Nacional de Predicción de Defensa. Organización, cometidos y funciones. La Organización Europea de Explotación de Satélites Meteorológicos EUMETSAT. El Programa Espacial Europeo. Meteosat Tercera Generación.",
    normalizedTitle:
      "El Estado Mayor General del Aire y del Espacio y el Centro Nacional de Prediccion de Defensa Organizacion cometidos y funciones La Organizacion Europea de Explotacion de Satelites Meteorologicos EUMETSAT El Programa Espacial Europeo Meteosat Tercera Generacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "21",
    officialTitle:
      "El Centro Europeo de Previsiones Meteorológicas a Plazo Medio (ECMWF). Organización, cometidos y funciones. El programa Copernicus de la Comisión Europea. El Servicio de Cambio Climático de Copernicus (C3S). El Servicio de Vigilancia Atmosférica de Copernicus (CAMS).",
    normalizedTitle:
      "El Centro Europeo de Previsiones Meteorologicas a Plazo Medio ECMWF Organizacion cometidos y funciones El programa Copernicus de la Comision Europea El Servicio de Cambio Climatico de Copernicus C3S El Servicio de Vigilancia Atmosferica de Copernicus CAMS",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "22",
    officialTitle:
      "La Organización Meteorológica Mundial (OMM). Convenio fundacional. Estructura. Plan Estratégico de la OMM. Programas y actividades de la OMM.",
    normalizedTitle:
      "La Organizacion Meteorologica Mundial OMM Convenio fundacional Estructura Plan Estrategico de la OMM Programas y actividades de la OMM",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "23",
    officialTitle:
      "Políticas públicas en materia de igualdad de género, contra la violencia de género y protección integral de la infancia y la adolescencia frente a la violencia. Discapacidad y dependencia: régimen jurídico. La Ley 15/2022, de 12 de julio, integral para la igualdad de trato y la no discriminación. Ley 4/2023, de 28 de febrero, para la igualdad real y efectiva de las personas trans y para la garantía de los derechos de las personas LGTBI.",
    normalizedTitle:
      "Politicas publicas en materia de igualdad de genero contra la violencia de genero y proteccion integral de la infancia y la adolescencia frente a la violencia Discapacidad y dependencia regimen juridico La Ley 15 2022 de 12 de julio integral para la igualdad de trato y la no discriminacion Ley 4 2023 de 28 de febrero para la igualdad real y efectiva de las personas trans y para la garantia de los derechos de las personas LGTBI",
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
