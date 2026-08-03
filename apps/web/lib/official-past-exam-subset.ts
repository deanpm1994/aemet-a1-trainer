import {
  mapImportedPastExamQuestionToQuestion,
  validateOfficialPastExamQuestionRecord,
} from "./official-content-import";
import type { Question } from "./types";

type LoadedOfficialPastExamSubset =
  | { ok: true; questions: Question[] }
  | {
      ok: false;
      issues: Array<{ index: number; field: string; message: string }>;
    };

const questionSourceUrl2018 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/cuestionario_primerejercicio_libre_cs_meteorologos_tcm30-498497.pdf";

const answerSourceUrl2018 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/plantilla_definitiva_notas_1ejercicio_libre_cs_meteorologos_tcm30-498798.pdf";

const questionSourceUrl2017 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/primer_ejercicio_v2_tcm30-437875.pdf";

const answerSourceUrl2017 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/resolucion2017__plantillarespuestas_definitiva_pe_sello_tcm30-439946.pdf";

const questionSourceUrl2016 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/cuestionario_tcm30-96165.pdf";

const answerSourceUrl2016 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/resolucion__correccionplantilladefc_sup_meteorologos_libre_sf-fp_tcm30-96168.pdf";

const questionSourceUrl2015 =
  "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias/ex_met_lib_2015.pdf";

const answerSourceUrl2015 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/plantilla_ejercicio1_meteorologos_libre_tcm30-94710.pdf";

const questionSourceUrl2014 =
  "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias/ex_met_lib_2014.pdf";

const answerSourceUrl2014 =
  "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/servicios/empleo-publico/plantilla%20respuestas_tcm30-92321.pdf";

const commonSourceFields2018 = {
  sourceExam: "AEMET A1 acceso libre primer ejercicio",
  sourceYear: 2018,
  sourceName: "MITECO",
  sourceUrl: questionSourceUrl2018,
  retrievedAt: "2026-07-09",
  verificationStatus: "verified" as const,
  answerSourceStatus: "official" as const,
  answerSourceUrl: answerSourceUrl2018,
  answerRetrievedAt: "2026-07-09",
  topicIds: [],
  difficulty: 3,
};

const commonSourceFields2017 = {
  sourceExam: "AEMET A1 acceso libre primer ejercicio",
  sourceYear: 2017,
  sourceName: "MITECO",
  sourceUrl: questionSourceUrl2017,
  retrievedAt: "2026-07-09",
  verificationStatus: "verified" as const,
  answerSourceStatus: "official" as const,
  answerSourceUrl: answerSourceUrl2017,
  answerRetrievedAt: "2026-07-09",
  topicIds: [],
  difficulty: 3,
};

const commonSourceFields2016 = {
  sourceExam: "AEMET A1 acceso libre primer ejercicio",
  sourceYear: 2016,
  sourceName: "MITECO",
  sourceUrl: questionSourceUrl2016,
  retrievedAt: "2026-07-09",
  verificationStatus: "verified" as const,
  answerSourceStatus: "official" as const,
  answerSourceUrl: answerSourceUrl2016,
  answerRetrievedAt: "2026-07-09",
  topicIds: [],
  difficulty: 3,
};

const commonSourceFields2015 = {
  sourceExam: "AEMET A1 acceso libre primer ejercicio",
  sourceYear: 2015,
  sourceName: "AEMET",
  sourceUrl: questionSourceUrl2015,
  retrievedAt: "2026-07-09",
  verificationStatus: "verified" as const,
  answerSourceStatus: "official" as const,
  answerSourceUrl: answerSourceUrl2015,
  answerRetrievedAt: "2026-07-09",
  topicIds: [],
  difficulty: 3,
};

const commonSourceFields2014 = {
  sourceExam: "AEMET A1 acceso libre primer ejercicio",
  sourceYear: 2014,
  sourceName: "AEMET",
  sourceUrl: questionSourceUrl2014,
  retrievedAt: "2026-07-11",
  verificationStatus: "verified" as const,
  answerSourceStatus: "official" as const,
  answerSourceUrl: answerSourceUrl2014,
  answerRetrievedAt: "2026-07-11",
  topicIds: [],
  difficulty: 3,
};

const officialPastExamSubsetRecords = [
  {
    ...commonSourceFields2014,
    questionNumber: "1",
    statement: "El rotacional de un campo vectorial plano tal que en el punto de coordenadas polares (r, θ), r > 0, el vector del campo tiene módulo 1 y está dirigido según la perpendicular al radio en sentido contrario a las agujas del reloj vale:",
    options: ["A) 1/r", "B) -1/r²", "C) 0", "D) r"],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "2",
    statement: "El flujo correspondiente al potencial complejo Ω(z) = i ln z es de tipo:",
    options: ["A) uniforme", "B) con una fuente", "C) con un sumidero", "D) con circulación"],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "3",
    statement: "Suponga que un conjunto de variables aleatorias tiene matriz de covarianzas diagonal, con ningún valor nulo en la diagonal. Indique la respuesta verdadera:",
    options: ["A) La primera componente principal es la variable con más varianza", "B) La primera componente principal es la variable con menos varianza", "C) La última componente principal es nula", "D) La correlación entre la primera y la segunda componente principal es distinta de cero"],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-15",
    answerRetrievedAt: "2026-07-15",
    questionNumber: "4",
    statement: "Suponga que tiene dos datos a y b, 0 < a < b, para los que se postula que proceden de una población con función de densidad que es uniforme entre 0 y θ y con valor cero en el resto, U[0, θ]. ¿Cuál es el estimador de máxima verosimilitud de θ?",
    options: ["A) 1", "B) (a+b)²", "C) (a+b)/2", "D) b"],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "5",
    statement: "Sean X, Y y Z tres variables aleatorias incorrelacionadas de varianza unidad. Se definen los dos conjuntos de variables aleatorias A = {X, Y}, B = {Y + Z}. La primera correlación canónica entre los conjuntos A y B vale:",
    options: ["A) 0", "B) (1/2)⁰·⁵", "C) 1/3", "D) 1"],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "6",
    statement: "Sean X e Y dos variables aleatorias con funciones de densidad que son uniformes entre 0 y 1 y con valores cero en el resto, U[0,1], independientes entre sí. La probabilidad P(X + Y ≤ 3/2) vale:",
    options: ["A) 1", "B) 7/8", "C) 3/8", "D) 1/2"],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-15",
    answerRetrievedAt: "2026-07-15",
    questionNumber: "7",
    statement: "Un conjunto de N datos, xᵢ, i = 1, ..., N, tiene distribución simétrica bimodal y su varianza es 100. Además se sabe que ∑ᵢ₌₁ᴺ (xᵢ − a)² es mínima cuando a = 20. El coeficiente de variación de Pearson de estos datos vale:",
    options: ["A) 1", "B) 2", "C) 0.5", "D) 0.1"],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "8",
    statement: "Una variable aleatoria tiene distribución normal N(20, 4). Si se eligen de forma independiente tres valores de esa variable, la probabilidad de que los tres sean mayores que 20 es:",
    options: ["A) 0.5", "B) 0.25", "C) 0.125", "D) 0.375"],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "9",
    statement: "En un experimento aleatorio, los sucesos A y B verifican P(A) = 0.4, P(B) = 0.6, P(B/A) = 0.5. Entonces:",
    options: ["A) A y B son independientes", "B) A y B son incompatibles", "C) P(A/B) = 1/3", "D) P(A U B) = 0.5"],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2014,
    questionNumber: "10",
    statement: "Dados dos conjuntos de datos X e Y, se sabe que su coeficiente de correlación lineal es ρ = -0.7, que la media de X es 0, que el valor absoluto de la pendiente de la recta de regresión de Y sobre X es 1/3 y que esa recta pasa por el punto (1, 2/3). Entonces, la media de Y vale:",
    options: ["A) 1", "B) 1/3", "C) -2/3", "D) 0"],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "13",
    statement: "Seleccione la afirmación correcta:",
    options: [
      "A) La convolución de dos funciones en el dominio del tiempo es igual al producto de las transformadas de Fourier de las funciones en el dominio de la frecuencia.",
      "B) La transformada de Fourier de la convolución de dos funciones en el dominio del tiempo es igual al producto de las transformadas de Fourier de las funciones en el dominio de la frecuencia.",
      "C) La transformada de Fourier del producto de dos funciones en el dominio del tiempo es igual a la transformada de Fourier de la convolución de las funciones en el dominio de la frecuencia.",
      "D) El producto de dos funciones en el dominio del tiempo es igual a la convolución de las transformadas de Fourier de las funciones en el dominio de la frecuencia.",
    ],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "15",
    statement: "En un giro de sentido antihorario en el hemisferio norte, la fuerza de Coriolis está dirigida en:",
    options: [
      "A) el mismo sentido que la fuerza centrífuga, con una magnitud directamente proporcional al cuadrado de la velocidad lineal.",
      "B) el mismo sentido que la fuerza centrífuga, con una magnitud directamente proporcional a la velocidad lineal.",
      "C) el sentido opuesto a la fuerza centrífuga, con una magnitud directamente proporcional al cuadrado de la velocidad lineal.",
      "D) el sentido opuesto a la fuerza centrífuga, con una magnitud directamente proporcional a la velocidad lineal.",
    ],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "16",
    statement: "Sabiendo que el momento de inercia de una barra delgada respecto a un eje perpendicular que pasa por su centro es 1/12 ML², siendo M su masa y L su longitud, seleccione la expresión del correspondiente momento de inercia respecto a un eje perpendicular a la barra que pasa por su extremo.",
    options: ["A) 1/3 ML²", "B) 1/6 ML²", "C) 1/24 ML²", "D) 1/36 ML²"],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "17",
    statement: "La formulación lagrangiana de las leyes de la Mecánica presupone que el estado mecánico del sistema está determinado dando:",
    options: ["A) sólo sus coordenadas generalizadas.", "B) sus coordenadas y velocidades generalizadas.", "C) sólo sus velocidades generalizadas.", "D) sus coordenadas y aceleraciones generalizadas."],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "18",
    statement: "El cuadrado de la velocidad de escape con la cual debe lanzarse un cuerpo desde la superficie de la Tierra es:",
    options: ["A) inversamente proporcional a la masa de la Tierra.", "B) inversamente proporcional a la aceleración de la gravedad en superficie.", "C) inversamente proporcional a la constante de gravitación universal.", "D) directamente proporcional a la masa de la Tierra e inversamente proporcional al radio de la misma."],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "19",
    statement: "Marque la respuesta correcta referente a la viscosidad de los fluidos:",
    options: [
      "A) La variación de la viscosidad con la presión y la temperatura es igual en los gases que en los líquidos: disminuye al aumentar esas condiciones.",
      "B) La viscosidad de la mayoría de los fluidos es constante al variar la temperatura y la presión.",
      "C) Al disminuir la presión y la temperatura, la viscosidad de los gases aumenta.",
      "D) En la mayoría de los fluidos líquidos la viscosidad aumenta al aumentar la presión y disminuye al aumentar la temperatura.",
    ],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "20",
    statement: "La ecuación de continuidad de un fluido incompresible establece que:",
    options: ["A) la energía mecánica total se conserva en el fluido.", "B) la divergencia de la velocidad es igual a cero.", "C) el rotacional de la velocidad es igual a cero.", "D) el momento lineal se conserva en el fluido."],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "21",
    statement: "En la atmósfera terrestre, la zona donde mayoritariamente el flujo tiene un carácter más turbulento es:",
    options: ["A) la capa límite atmosférica diurna.", "B) la atmósfera libre.", "C) la estratosfera.", "D) la subcapa laminar."],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "22",
    statement: "La ecuación de Bernoulli en los fluidos representa:",
    options: ["A) la conservación del momento lineal.", "B) la conservación del momento angular.", "C) la conservación de la masa.", "D) la conservación de la energía."],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "27",
    statement: "En un cambio de fase reversible del agua, se mantiene constante:",
    options: ["A) la entalpía.", "B) la función de Gibbs.", "C) la energía interna.", "D) la entropía."],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "28",
    statement: "Considere la expansión isoterma de un gas ideal hasta que iguale la presión exterior (patm). ¿Cómo debería ser el proceso para que la energía intercambiada entre el gas y el exterior en forma de trabajo fuera máxima?",
    options: ["A) Proceso de expansión brusca contra la presión exterior.", "B) Proceso cuasiestático.", "C) Proceso isoentrópico sin fenómenos disipativos.", "D) Proceso adiabático cuasiestático."],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "29",
    statement: "Sea la ecuación PVγ = cte, donde P y V son la presión y el volumen de un gas, γ = cp/cv, con cp y cv los valores del calor específico del gas a presión y volumen constante, respectivamente. Esta ecuación es válida:",
    options: ["A) para cualquier proceso adiabático.", "B) solo para procesos adiabáticos de gases ideales.", "C) solo para procesos adiabáticos reversibles.", "D) solo para procesos adiabáticos reversibles de gases ideales."],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "30",
    statement: "¿Cuál será la variación de entropía que experimentan 2 moles de He, suponiendo que se comporta como gas perfecto monoatómico, cuando su volumen se triplica y su presión se divide por tres?",
    options: ["A) ΔS = 2R ln 3", "B) ΔS = 2R ln(2/3)", "C) ΔS = −2R ln 3", "D) ΔS = 0"],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "31",
    statement: "Por una espira circular de una vuelta pasa una corriente eléctrica. Si con el mismo hilo conductor se hace otra espira circular de dos vueltas, la inducción magnética en el centro producida por la misma corriente es:",
    options: ["A) la misma que en el primer caso.", "B) la cuarta parte que en el primer caso.", "C) la mitad que en el primer caso.", "D) cuatro veces mayor que en el primer caso."],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2014,
    retrievedAt: "2026-07-12",
    answerRetrievedAt: "2026-07-12",
    questionNumber: "32",
    statement: "La ecuación de Navier-Stokes:",
    options: ["A) solo es válida para un flujo turbulento.", "B) solo es válida para un flujo laminar.", "C) es válida tanto para un flujo laminar como turbulento.", "D) solo es válida para un fluido incompresible e irrotacional."],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "33",
    statement: "¿Qué ley establece que la potencia emitida por unidad de área por un cuerpo negro es directamente proporcional a la cuarta potencia de la temperatura absoluta del citado cuerpo?",
    options: ["A) Ley de Kirchhoff.", "B) Ley de Planck.", "C) Ley de Stefan-Boltzmann.", "D) Ley de Wien."], correctAnswer: "C",
  },
  {
    ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "34",
    statement: "En el Sistema Internacional, la radiancia se expresa en:",
    options: ["A) W · sr⁻¹", "B) W · nm⁻¹", "C) W · m⁻² · K⁻¹", "D) W · m⁻² · sr⁻¹"], correctAnswer: "D",
  },
  {
    ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "35",
    statement: "La disminución media de la temperatura en la troposfera terrestre por cada kilómetro que se asciende en ella es:",
    options: ["A) 9.8 ºC", "B) 6.5 ºC", "C) 0.0098 ºC", "D) 0.0065 ºC"], correctAnswer: "B",
  },
  {
    ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "36",
    statement: "Entre los gases atmosféricos indicados, marque el que absorbe las radiaciones más energéticas:",
    options: ["A) Oxígeno", "B) Dióxido de carbono", "C) Óxido nitroso", "D) Ozono"], correctAnswer: "A",
  },
  { ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "37", statement: "En relación con el porcentaje en volumen de los gases en la troposfera, elija la frase correcta:", options: ["A) El nitrógeno molecular tiene una importante variación con la altura.", "B) El oxígeno molecular tiene una importante variación con la altura.", "C) El dióxido de carbono tiene una importante variación con la altura.", "D) El vapor de agua tiene una importante variación con la altura."], correctAnswer: "D" },
  { ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "38", statement: "Cuando tenemos estratificación estable con aire seco, la temperatura potencial:", options: ["A) disminuye con la altura.", "B) se mantiene constante con la altura.", "C) aumenta con la altura.", "D) depende de la cizalladura del viento que haya."], correctAnswer: "C" },
  { ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "39", statement: "El ritmo de disminución de la temperatura con la altura en una masa de aire húmedo que asciende adiabáticamente hasta llegar al nivel de condensación es:", options: ["A) siempre menor que en una masa de aire seco.", "B) igual que en una masa de aire seco.", "C) menor cuanto menor sea la humedad específica de la masa de aire.", "D) mayor que en una masa de aire seco."], correctAnswer: "A" },
  { ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "40", statement: "Cuando ocurre el llamado “efecto Föhn” se conserva:", options: ["A) la temperatura seudopotencial equivalente.", "B) la temperatura adiabática del termómetro húmedo.", "C) la temperatura potencial virtual.", "D) la temperatura adiabática equivalente."], correctAnswer: "A" },
  { ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "41", statement: "En un ascenso adiabático (sin saturación), la temperatura del punto de rocío:", options: ["A) disminuye ≅ 9.8 º/km.", "B) disminuye ≅ 1.6 º/km.", "C) disminuye ≅ 6.5 º/km.", "D) es constante."], correctAnswer: "B" },
  { ...commonSourceFields2014, retrievedAt: "2026-07-12", answerRetrievedAt: "2026-07-12", questionNumber: "42", statement: "El intervalo de bruma en una niebla radiativa es:", options: ["A) el tiempo que tarda en disiparse la bruma y que depende de la concentración inicial de gotitas de agua.", "B) el tiempo entre bruma y niebla, y que depende de la concentración inicial de vapor de agua.", "C) el descenso de temperatura que implica una condensación de 0.5 gramos de vapor de agua en 1 m3 de aire.", "D) la cantidad de vapor de agua a condensar para que la visibilidad horizontal sea inferior a 1 km."], correctAnswer: "C" },
  {
    ...commonSourceFields2018,
    questionNumber: "8",
    statement: "Señale la afirmación correcta:",
    options: [
      "A) La distribución hipergeométrica se utiliza en el muestreo de una población finita sin reemplazamiento.",
      "B) La distribución hipergeométrica se utiliza en el muestreo de una población finita con reemplazamiento.",
      "C) La distribución hipergeométrica se aproxima a la distribución binomial si el tamaño de la población no es grande.",
      "D) La distribución hipergeométrica no se aproxima a ninguna distribución.",
    ],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2018,
    questionNumber: "10",
    statement:
      "Señale la afirmación correcta. El coeficiente de correlación de Pearson sirve para estudiar:",
    options: [
      "A) La relación lineal entre dos variables de cualquier tipo.",
      "B) La relación exponencial entre dos variables cuantitativas.",
      "C) La relación lineal entre dos variables dicotómicas.",
      "D) La relación lineal entre dos variables cuantitativas.",
    ],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2018,
    questionNumber: "13",
    statement: "Señale la afirmación correcta. En el análisis clúster:",
    options: [
      "A) El número de los grupos es conocido a priori, pero no la composición de los mismos.",
      "B) El número y la composición de los grupos no es conocido a priori.",
      "C) Se clasifican variables en un número pequeño de grupos, de forma que las observaciones pertenecientes a un grupo sean disimilares entre sí y muy similares al resto.",
      "D) Se clasifican variables en un número pequeño de grupos, de forma que las observaciones pertenecientes a un grupo sean disimilares entre sí y muy disimilares al resto.",
    ],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2018,
    questionNumber: "17",
    statement: "¿Cuántos momentos de inercia pueden considerarse en un cuerpo?",
    options: [
      "A) 1, porque el momento de inercia solo depende de la forma del cuerpo.",
      "B) Infinitos, porque varían con el eje que se considere.",
      "C) 3, porque para cada cuerpo, sin importar su forma, en el espacio hay tres direcciones mutuamente perpendiculares que constituyen los ejes principales de inercia.",
      "D) Depende del cuerpo que se considere.",
    ],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2018,
    questionNumber: "19",
    statement: "Señale la afirmación incorrecta respecto a la cinemática de fluidos:",
    options: [
      "A) Las líneas de corriente son tangentes al campo de velocidades para un tiempo fijo.",
      "B) Las líneas de corriente coinciden con las trayectorias de las partículas en un fluido en régimen estacionario.",
      "C) Las trayectorias de dos partículas se pueden cortar en un instante dado.",
      "D) Dos líneas de corriente se pueden cortar en un instante dado.",
    ],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2017,
    questionNumber: "12",
    statement: "El rango intercuartílico de una muestra es:",
    options: [
      "A) Una medida de posición.",
      "B) Una medida de dispersión.",
      "C) Una medida de forma.",
      "D) Un momento central.",
    ],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2017,
    questionNumber: "13",
    statement:
      "Suponga que desea contrastar dos hipótesis H0 y H1 a la vista de unos datos D. En un enfoque bayesiano, suponga que las probabilidades a priori de las dos hipótesis son iguales, y que la razón de las verosimilitudes de los datos D condicionadas a H0 y H1 respectivamente, p(D | H0)/ p(D | H1), vale 1/3. Entonces se puede afirmar que la razón de probabilidades a posteriori, p(H0|D)/p(H1|D), vale:",
    options: ["A) 3", "B) 1", "C) 1/3", "D) 1/9"],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2017,
    questionNumber: "14",
    statement:
      "La función de autocorrelación de un proceso de medias móviles MA(q) necesariamente cumple:",
    options: [
      "A) Vale 1 para retraso 1.",
      "B) Vale 0 para retraso q+1.",
      "C) Está comprendida entre -1/q y 1/q para retraso igual a q.",
      "D) Es monótonamente decreciente con el retraso.",
    ],
    correctAnswer: "B",
  },
  {
    ...commonSourceFields2017,
    questionNumber: "15",
    statement:
      "Dadas dos variables aleatorias X e Y, con la misma varianza V y covarianza C, se tiene que cov(X + Y, X - Y) vale:",
    options: ["A) 2C", "B) 2V", "C) 0", "D) V-C"],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2017,
    questionNumber: "16",
    statement:
      "En relación a la dinámica de los sistemas de partículas en un sistema de referencia inercial, seleccione la respuesta correcta:",
    options: [
      "A) El impulso total comunicado a un sistema es igual a la variación de su momento lineal, esto es, a la variación del momento lineal de su centro de masas.",
      "B) Si el momento respecto a un punto de las fuerzas exteriores que actúan sobre un sistema es nulo, el momento angular del sistema respecto a ese punto también lo es.",
      "C) El momento angular total de un sistema es siempre igual al momento angular de su centro de masas.",
      "D) El centro de masas de un sistema está en reposo o en movimiento rectilíneo uniforme sólo y exclusivamente si no actúan fuerzas exteriores.",
    ],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2016,
    questionNumber: "14",
    statement:
      "Suponga que realiza 1000 aplicaciones de un test estadístico cumpliéndose en todas la hipótesis nula, trabajando al nivel de significación 0.05. Entonces, se puede afirmar que:",
    options: [
      "A) la hipótesis nula será falsa en aproximadamente 50 casos.",
      "B) la hipótesis alternativa será falsa en aproximadamente 50 casos.",
      "C) el test será significativo en aproximadamente 50 casos.",
      "D) el test no será aplicable en aproximadamente 50 casos.",
    ],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2016,
    questionNumber: "15",
    statement:
      "Dada una muestra x₁, x₂, ..., xₙ, el estadístico D que minimiza la suma de cuadrados ∑ᵢ₌₁ⁿ(xᵢ - D)² es:",
    options: ["A) la media", "B) la mediana", "C) la moda", "D) la varianza"],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2016,
    questionNumber: "16",
    statement:
      "Dadas dos variables aleatorias X e Y independientes, ambas con distribución uniforme en [0, 1], la probabilidad P(X+Y ≥ 1.5) vale:",
    options: ["A) 0.225", "B) 0.0625", "C) 0.125", "D) 0.5"],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2016,
    questionNumber: "17",
    statement:
      "Señale la afirmación correcta. En el análisis de componentes principales:",
    options: [
      "A) los nuevos factores serán una combinación lineal de variables originales y serán independientes entre sí.",
      "B) los nuevos factores serán una combinación lineal de variables originales y no serán independientes entre sí.",
      "C) se estudia las relaciones que se presentan entre variables no correlacionadas.",
      "D) la interpretación de los factores viene dada a priori.",
    ],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2016,
    questionNumber: "20",
    statement:
      "Indique la afirmación correcta. Dada la serie temporal Xₜ, t= 1, 2, ..., que satisface Xₜ = α · Xₜ₋₁ + Zₜ, donde Zₜ es un ruido blanco gaussiano, y α una constante.",
    options: [
      "A) Cuanto mayor es α, mayor es el coeficiente de autocorrelación con retardo 1.",
      "B) Xₜ es un proceso de medias móviles de primer orden.",
      "C) α debe ser estrictamente positivo para que Xₜ sea estacionaria.",
      "D) Zₜ no tiene función de autocorrelación.",
    ],
    correctAnswer: "A",
  },
  {
    ...commonSourceFields2015,
    questionNumber: "19",
    statement:
      "En un proceso de nucleación heterogénea la curva de Köhler, que proporciona la razón de saturación de equilibrio en función del tamaño de las gotitas de disolución, indica que:",
    options: [
      "A) para radios muy pequeños de gotitas de disolución, prevalece el efecto de curvatura al de disolución, por lo que, para humedades inferiores al 100%, estas gotitas tienden a evaporarse.",
      "B) para gotitas con radios mayores que r*, para que la gotita crezca, es necesario un aumento de la razón de saturación ambiental.",
      "C) las gotitas con radios ligeramente inferiores a r* crecen a causa de un aumento de la humedad relativa.",
      "D) la razón de saturación crítica es inferior a 1",
    ],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2015,
    questionNumber: "20",
    statement:
      "¿En qué condiciones se localiza a mayor profundidad la termoclina en el Pacífico tropical oriental durante los meses de enero a febrero?:",
    options: [
      "A) Cuando la circulación de Walker es más intensa.",
      "B) Durante un episodio La Niña.",
      "C) Durante un episodio El Niño.",
      "D) En condiciones normales, sin situación Niño ni Niña.",
    ],
    correctAnswer: "C",
  },
  {
    ...commonSourceFields2015,
    questionNumber: "21",
    statement:
      "Considerando una onda electromagnética que se propaga en un medio dispersivo y homogéneo, indique cuál de las siguientes afirmaciones es correcta:",
    options: [
      "A) La velocidad de fase de la onda electromagnética en dicho medio es independiente de su frecuencia.",
      "B) Cuando la velocidad de grupo es menor que la velocidad de fase se produce la dispersión anómala.",
      "C) Cuando la velocidad de grupo es mayor que la velocidad de fase se produce la dispersión normal.",
      "D) La ecuación de onda de Maxwell se reemplaza por la ecuación de onda con un término disipativo.",
    ],
    correctAnswer: "D",
  },
  {
    ...commonSourceFields2015,
    questionNumber: "22",
    statement:
      "Un piloto vuela en el hemisferio norte con viento de cola dentro de una corriente en chorro del frente polar. En un determinado momento la temperatura exterior empieza a disminuir rápidamente al tiempo que la turbulencia aumenta significativamente. ¿Con qué maniobra logrará el piloto salir de la zona de turbulencia lo más rápidamente posible?",
    options: [
      "A) Corrigiendo el rumbo hacia el norte.",
      "B) Corrigiendo el rumbo hacia el sur.",
      "C) Perdiendo altura.",
      "D) Ganando altura.",
    ],
    correctAnswer: "B",
  },
];

/**
 * App-owned syllabus links. They classify the subject assessed without changing
 * source-owned exam wording, options, answer keys, or provenance.
 */
const historicQuestionTopicMappings: Record<string, string[]> = {
  "2014-1": ["mathematics-4"], "2014-2": ["mathematics-6"], "2014-3": ["mathematics-17"],
  "2014-4": ["mathematics-15"], "2014-5": ["mathematics-13"], "2014-6": ["mathematics-13"],
  "2014-7": ["mathematics-12"], "2014-8": ["mathematics-14"],
  "2014-9": ["mathematics-13"], "2014-10": ["mathematics-17"], "2014-13": ["mathematics-11"],
  "2014-15": ["physics-1"], "2014-16": ["physics-2"], "2014-17": ["physics-1"],
  "2014-18": ["physics-3"], "2014-19": ["physics-6"], "2014-20": ["physics-6"],
  "2014-21": ["meteorology-and-climatology-8"], "2014-22": ["physics-6"],
  "2014-27": ["physics-12"], "2014-28": ["physics-12"], "2014-29": ["physics-12"],
  "2014-30": ["physics-12"], "2014-31": ["physics-14"], "2014-32": ["physics-6"],
  "2014-33": ["physics-16"], "2014-34": ["physics-16"], "2014-35": ["meteorology-and-climatology-1"],
  "2014-36": ["meteorology-and-climatology-6"], "2014-37": ["meteorology-and-climatology-1"],
  "2014-38": ["meteorology-and-climatology-8"], "2014-39": ["meteorology-and-climatology-8"],
  "2014-40": ["meteorology-and-climatology-8"], "2014-41": ["meteorology-and-climatology-8"],
  "2014-42": ["meteorology-and-climatology-18"],
  "2015-19": ["meteorology-and-climatology-18"], "2015-20": ["meteorology-and-climatology-42"],
  "2015-21": ["physics-17"], "2015-22": ["meteorology-and-climatology-26"],
  "2016-14": ["mathematics-16"], "2016-15": ["mathematics-12"], "2016-16": ["mathematics-13"],
  "2016-17": ["mathematics-17"], "2016-20": ["mathematics-18"],
  "2017-12": ["mathematics-12"], "2017-13": ["mathematics-13"], "2017-14": ["mathematics-18"],
  "2017-15": ["mathematics-13"], "2017-16": ["physics-2"],
  "2018-8": ["mathematics-14"], "2018-10": ["mathematics-17"], "2018-13": ["mathematics-17"],
  "2018-17": ["physics-2"], "2018-19": ["physics-5"],
};

export const officialPastExamSubsetSource = officialPastExamSubsetRecords.map((question) => ({
  ...question,
  topicIds: historicQuestionTopicMappings[`${question.sourceYear}-${question.questionNumber}`] ?? [],
}));

export function loadOfficialPastExamSubset(): LoadedOfficialPastExamSubset {
  const questions: Question[] = [];
  const issues: Array<{ index: number; field: string; message: string }> = [];

  officialPastExamSubsetSource.forEach((record, index) => {
    const result = validateOfficialPastExamQuestionRecord(record);

    if (!result.ok) {
      issues.push(
        ...result.issues.map((issue) => ({
          index,
          field: issue.field,
          message: issue.message,
        })),
      );
      return;
    }

    questions.push(mapImportedPastExamQuestionToQuestion(result.record));
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, questions };
}
