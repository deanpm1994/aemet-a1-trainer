import type { Topic } from "./types";

export type TopicStudyCard = {
  topicId: string;
  label: "Material didáctico no oficial";
  objectives: string[];
  checklist: string[];
  reviewPrompts: string[];
  richNotes: string[];
};

const RICH_NOTE_BLOCKS = new Set(["Mathematics", "Meteorology and Climatology"]);

const RICH_NOTES_BY_TOPIC_ID: Record<string, string[]> = {
  "physics-1": ["Separa cinemática, fuerzas y energía.", "Dibuja ejes y diagrama de fuerzas antes de plantear ecuaciones.", "Comprueba unidades, signo y caso límite."],
  "physics-2": ["Distingue centro de masas y movimiento relativo interno.", "Aplica conservación de momento, energía y momento angular por separado.", "Relaciona el resultado con el sólido rígido y su momento de inercia."],
  "physics-3": ["Relaciona fuerza, campo, potencial y energía gravitatoria.", "Traza líneas de campo y usa simetría antes de integrar.", "Contrasta órbita ligada, escape y campo terrestre."],
  "physics-4": ["Compara descripción euleriana y lagrangiana.", "Identifica tensor, balance y volumen de control usado.", "Verifica cada término de conservación con sus unidades."],
  "physics-5": ["Separa estática, cinemática y rotación del fluido.", "Dibuja líneas de corriente, trayectorias y vorticidad en casos simples.", "Explica cuándo aplicar Pascal, Arquímedes o Kelvin."],
  "physics-6": ["Parte de conservación de masa y cantidad de movimiento.", "Indica hipótesis: viscosidad, compresibilidad y régimen de flujo.", "Usa Reynolds para justificar aproximación laminar o turbulenta."],
  "physics-7": ["Relaciona posición, velocidad, aceleración y fase.", "Compara oscilación libre, amortiguada y forzada.", "Explica resonancia desde transferencia y disipación de energía."],
  "physics-8": ["Distingue propagación, superposición y condición de contorno.", "Deriva relaciones entre frecuencia, longitud de onda y velocidad.", "Representa nodos, vientres y cambio Doppler con un esquema."],
  "physics-9": ["Relaciona carga, fuerza, campo, potencial y energía.", "Elige Coulomb o Gauss según la simetría.", "Diferencia conductor, dieléctrico y vacío en el modelo."],
  "physics-10": ["Relaciona carga en movimiento, corriente y campo magnético.", "Dibuja orientación con regla de la mano y flujo magnético.", "Separa Biot-Savart, Ampère y Ohm por condiciones de uso."],
  "physics-11": ["Explica inducción como cambio de flujo y sentido de Lenz.", "Conecta Maxwell con conservación y propagación de energía.", "Interpreta el vector de Poynting en un ejemplo físico."],
  "physics-12": ["Relaciona ecuación de ondas, espectro y tipo de frente.", "Distingue velocidad de fase y de grupo.", "Comprueba dirección de energía y momento de la radiación."],
  "physics-13": ["Separa condiciones de interferencia y régimen de difracción.", "Dibuja diferencia de camino y patrón observado.", "Compara límites de Fraunhofer y caso de interferencia ideal."],
  "physics-14": ["Define sistema, estado, proceso y convención de signos.", "Escribe primer principio antes de sustituir ecuaciones de estado.", "Clasifica transformación y revisa trabajo, calor y energía interna."],
  "physics-15": ["Distingue reversibilidad, rendimiento y producción de entropía.", "Representa ciclo de Carnot y sus focos térmicos.", "Explica por qué Clausius limita conversión de calor en trabajo."],
  "physics-16": ["Relaciona variables naturales con cada potencial termodinámico.", "Usa diferencial fundamental para deducir condición de equilibrio.", "Separa estabilidad local, equilibrio y representación elegida."],
  "physics-17": ["Diferencia orden de transición y discontinuidad relevante.", "Relaciona pendiente de coexistencia con Clausius-Clapeyron.", "Interpreta diagrama de fases antes de usar una ecuación."],
  "physics-18": ["Separa mecanismos de interacción radiación-materia.", "Relaciona ley de Kirchhoff, Planck, Stefan-Boltzmann y Wien.", "Comprueba unidades espectrales y límites de cuerpo negro."],
  "informatics-and-communications-1": ["Compara responsabilidades de Windows, Linux y shell.", "Practica rutas, permisos y variables de entorno con ejemplos cortos.", "Lee un shell script identificando entrada, control de flujo y efectos."],
  "informatics-and-communications-2": ["Distingue compilación, interpretación y tiempo de ejecución.", "Relaciona objeto, clase, estado y comportamiento.", "Compara una solución procedural con una orientada a objetos."],
  "informatics-and-communications-3": ["Relaciona tipo de problema con estructura de datos y lenguaje.", "Divide un programa en entrada, transformación, salida y manejo de errores.", "Escribe caso de prueba para flujo normal y fallo esperado."],
  "informatics-and-communications-4": ["Separa estructura HTML, comportamiento JavaScript y datos.", "Recorre una estructura de control indicando entradas y salida.", "Identifica dónde capturar y comunicar un error de ejecución."],
  "informatics-and-communications-5": ["Distingue datos, modelo, consulta y sistema gestor.", "Compara modelo relacional, orientado a objetos y NoSQL por caso de uso.", "Describe entidad, relación, restricción y consulta de un ejemplo."],
  "informatics-and-communications-6": ["Elige tabla, lista, árbol o grafo según operaciones dominantes.", "Compara coste conceptual de buscar, ordenar y recorrer.", "Traza una llamada recursiva y su condición de parada."],
  "informatics-and-communications-7": ["Dibuja capas OSI y sitúa TCP/IP como modelo práctico.", "Relaciona medio, topología, interfaz, protocolo y servicio.", "Sigue un paquete por capas sin confundir dirección y aplicación."],
  "informatics-and-communications-8": ["Distingue dato raster, vectorial, espacial y temático.", "Relaciona geometría, atributos, referencia espacial y consulta.", "Formula un análisis espacial y explica su salida esperada."],
  "informatics-and-communications-9": ["Relaciona Internet con arquitectura, protocolos y servicios.", "Distingue funcionamiento de red, servicio de aplicación y tendencia tecnológica.", "Explica recorrido básico desde cliente hasta servicio remoto."],
  "informatics-and-communications-10": ["Relaciona amenaza, control de acceso y mecanismo de protección.", "Distingue confidencialidad, integridad, autenticidad y disponibilidad.", "Compara cifrado, firma, cortafuegos y VPN por objetivo."],
  "general-common-1": ["Ordena Constitución, derechos, garantías y reforma.", "Distingue titularidad, garantía y suspensión de derechos.", "Resume una relación institucional con vocabulario preciso."],
  "general-common-2": ["Relaciona composición, funciones y controles de las Cortes.", "Ordena fases básicas de elaboración de una ley.", "Distingue tratado, control parlamentario y Defensor del Pueblo."],
  "general-common-3": ["Separa composición, designación y funciones del Gobierno.", "Relaciona Gobierno con Cortes, Corona y Administración.", "Explica un mecanismo de responsabilidad política."],
  "general-common-4": ["Dibuja niveles de Administración y sector público institucional.", "Relaciona principio constitucional con órgano o función.", "Distingue asesoramiento, control y gestión administrativa."],
  "general-common-5": ["Compara Estado, comunidad autónoma y entidad local.", "Relaciona estatuto, competencia y organización territorial.", "Explica un supuesto competencial sin inventar norma aplicable."],
  "general-common-6": ["Ordena antecedentes, tratados, instituciones y Derecho de la Unión.", "Relaciona institución, competencia y proceso decisorio.", "Compara efecto del Derecho de la Unión y ordenamiento interno."],
  "general-common-7": ["Construye pirámide de fuentes y marca límites reglamentarios.", "Distingue ley, decreto-ley, decreto legislativo y reglamento.", "Resuelve un caso identificando fuente y jerarquía."],
  "general-common-8": ["Separa elemento, validez, eficacia y revisión del acto.", "Ordena vías de anulación, revocación y control.", "Usa principio de legalidad para revisar un supuesto."],
  "general-common-9": ["Dibuja fases del procedimiento y sus hitos.", "Distingue revisión de oficio, recurso administrativo y contencioso.", "Relaciona Ley 39/2015 y 40/2015 por materia."],
  "general-common-10": ["Ordena preparación, adjudicación, ejecución y extinción.", "Relaciona tipo contractual, procedimiento y garantía.", "Identifica cuándo analizar recurso especial sin concluir un caso real."],
  "general-common-11": ["Distingue limitación, servicio, fomento y control.", "Relaciona forma de gestión con finalidad pública.", "Resume una ayuda pública indicando objeto y control."],
  "general-common-12": ["Separa responsabilidad patrimonial y potestad sancionadora.", "Ordena requisitos, procedimiento, decisión y garantía.", "Distingue daño indemnizable de infracción administrativa."],
  "general-common-13": ["Clasifica empleados públicos y su régimen básico.", "Relaciona derecho, deber, incompatibilidad y disciplina.", "Resuelve un supuesto identificando categoría y garantía."],
  "general-common-14": ["Ordena elaboración, aprobación, ejecución y control presupuestario.", "Relaciona estabilidad con sostenibilidad financiera.", "Distingue presupuesto estatal y marco económico europeo."],
  "general-common-15": ["Separa función interventora, control financiero y fiscalización externa.", "Relaciona órgano de control con objeto y momento de actuación.", "Explica papel de contabilidad pública en rendición de cuentas."],
  "general-common-16": ["Ordena diseño, ejecución y evaluación de políticas públicas.", "Relaciona transparencia, participación y rendición de cuentas.", "Define un indicador de resultado sin atribuir datos oficiales."],
  "general-common-17": ["Distingue igualdad, violencia de género, discapacidad y dependencia.", "Relaciona política, población destinataria y medida pública.", "Evita mezclar principios de protección con procedimientos concretos."],
  "general-common-18": ["Separa principios, derechos, obligaciones y régimen sancionador.", "Relaciona responsable, interesado, autoridad y supervisor.", "Analiza un tratamiento de datos por finalidad, minimización y seguridad."],
  "general-common-19": ["Relaciona Agenda 2030, objetivos y tres dimensiones de sostenibilidad.", "Distingue antecedente, objetivo y mecanismo de seguimiento.", "Vincula una medida pública con impacto económico, social y ambiental."],
  "general-common-20": ["Distingue organismo, cometido, programa y sistema satelital.", "Relaciona organización de defensa con explotación meteorológica europea.", "Explica cadena institucional sin asumir prestaciones no citadas."],
  "general-common-21": ["Relaciona ECMWF, Copernicus, C3S y CAMS por función.", "Distingue producción de predicción, datos y servicio climático.", "Traza flujo conceptual desde observación hasta servicio."],
  "general-common-22": ["Ordena convenio, estructura, plan estratégico y programas de OMM.", "Relaciona órgano, función y actividad internacional.", "Resume una contribución de OMM sin inventar acuerdos vigentes."],
  "general-common-23": ["Separa igualdad, violencia, infancia, discapacidad y dependencia.", "Relaciona norma, ámbito de protección y garantía.", "Practica respuesta estructurada sin sustituir lectura de texto legal."],
};

function firstSentence(value: string): string {
  return value.split(".")[0]?.trim() || value;
}

export function getTopicStudyCard(topic: Topic): TopicStudyCard {
  const subject = firstSentence(topic.officialTitle);

  return {
    topicId: topic.id,
    label: "Material didáctico no oficial",
    objectives: [`Explicar con precisión: ${subject}.`],
    checklist: [
      "Leer el título oficial completo.",
      "Definir los conceptos principales con tus propias palabras.",
      "Resolver una pregunta ligada al tema.",
    ],
    reviewPrompts: ["¿Qué parte del título oficial no puedes explicar todavía?"],
    richNotes: RICH_NOTES_BY_TOPIC_ID[topic.id] ?? (RICH_NOTE_BLOCKS.has(topic.block)
      ? [
          "Divide el título oficial en conceptos y relaciones antes de memorizar.",
          "Anota una definición, un procedimiento y una aplicación para cada concepto.",
        ]
      : []),
  };
}

export function buildTopicStudyCards(topics: Topic[]): TopicStudyCard[] {
  return topics.map(getTopicStudyCard);
}
