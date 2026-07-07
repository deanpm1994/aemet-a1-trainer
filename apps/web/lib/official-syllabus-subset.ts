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
