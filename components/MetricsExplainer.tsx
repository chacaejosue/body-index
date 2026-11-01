"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Flame,
  Activity,
  Apple,
  Dna,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Topic {
  id: string;
  tabLabel: string;
  titulo: string;
  subtitulo: string;
  badge: string;
  icon: any;
  color: string;
  queEs: string;
  porQueImporta: string;
  datoClave: string;
}

export function MetricsExplainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>("tmb");

  const topics: Topic[] = [
    {
      id: "tmb",
      tabLabel: "TMB Basal",
      titulo: "TMB Basal (Tasa Metabólica Basal)",
      subtitulo: "El gasto calórico en reposo absoluto para mantenerte con vida",
      badge: "Gasto Vital",
      icon: Flame,
      color: "text-amber-500",
      queEs:
        "Es la cantidad mínima de kilocalorías que tu organismo requiere en 24 horas solo para asegurar las funciones vitales vegetativas: latidos del corazón, respiración pulmonar, actividad neuronal, filtrado de los riñones e intercambio iónico celular.",
      porQueImporta:
        "Representa entre el 60% y el 75% de todo lo que quemas al día. Es tu umbral de seguridad biológica: nunca es recomendable pautar dietas por debajo de tu TMB por periodos prolongados sin control médico, ya que provocaría ralentización tiroidea y pérdida severa de masa muscular.",
      datoClave:
        "Si proporcionaste tu porcentaje de grasa, calculamos tu TMB con la ecuación Katch-McArdle, aislando el tejido adiposo inactivo y calculando sobre tu masa celular activa.",
    },
    {
      id: "get",
      tabLabel: "Gasto Total",
      titulo: "Gasto Total (GET / TDEE)",
      subtitulo: "Tu gasto calórico diario total sumando todo tu movimiento",
      badge: "Punto de Equilibrio",
      icon: Activity,
      color: "text-emerald-500",
      queEs:
        "El Gasto Energético Total (TDEE, por sus siglas en inglés) es la sumatoria de tu Tasa Basal (TMB) + el Efecto Térmico de la Comida (TEF) + el Gasto por Actividad (ejercicio y movimiento cotidiano).",
      porQueImporta:
        "Es tu punto de equilibrio o calorías de mantenimiento. Si tu ingesta coincide con tu GET, tu peso corporal se mantendrá estable.",
      datoClave:
        "Cualquier objetivo (déficit para perder grasa o superávit para ganar músculo) se calcula aplicando un porcentaje seguro directamente sobre este valor.",
    },
    {
      id: "tef",
      tabLabel: "Efecto TEF",
      titulo: "Efecto Térmico de los Alimentos (TEF)",
      subtitulo: "La energía que gasta tu sistema digestivo en asimilar la comida",
      badge: "~10% del Gasto",
      icon: Apple,
      color: "text-orange-500",
      queEs:
        "Masticar, segregar enzimas digestivas, digerir, absorber nutrientes en el intestino y almacenarlos requiere energía mecánica y química. Ese costo metabólico es el TEF (Thermogenic Effect of Food).",
      porQueImporta:
        "No todos los alimentos cuestan lo mismo de procesar. Las proteínas demandan entre un 20% y un 30% de sus propias calorías solo para ser asimiladas, mientras que los carbohidratos consumen 5-10% y las grasas apenas 0-3%.",
      datoClave:
        "Una dieta con aporte suficiente de proteína ayuda a elevar tu gasto calórico diario de forma natural e incrementa notablemente la saciedad posprandial.",
    },
    {
      id: "actividad",
      tabLabel: "Actividad",
      titulo: "Gasto por Actividad (EAT + NEAT)",
      subtitulo: "Entrenamientos estructurados vs. movimiento espontáneo diario",
      badge: "Movimiento",
      icon: Sparkles,
      color: "text-blue-500",
      queEs:
        "Se compone de dos partes: el ejercicio voluntario planificado (EAT: pesas, running, clases dirigidas) y el movimiento no atribuible al ejercicio (NEAT: pasos diarios, subir escaleras, estar de pie, tareas del hogar).",
      porQueImporta:
        "El NEAT es el factor más modificable del gasto metabólico. Una persona con trabajo activo y 10.000 pasos diarios puede quemar entre 400 y 800 kcal más que alguien con hábitos sedentarios.",
      datoClave:
        "Aumentar tu actividad diaria no deportiva (caminar más en vez de usar el auto) suele ser más sostenible y eficaz a largo plazo que extenuarse en sesiones esporádicas de gimnasio.",
    },
    {
      id: "rfm",
      tabLabel: "Grasa RFM",
      titulo: "Grasa Relativa RFM vs. IMC Tradicional",
      subtitulo: "Por qué el IMC falla en personas activas y cómo la cintura lo corrige",
      badge: "Composición",
      icon: Scale,
      color: "text-indigo-500",
      queEs:
        "El IMC tradicional (peso / talla²) no distingue entre masa muscular magra y grasa. El índice RFM (Relative Fat Mass), desarrollado por el Cedars-Sinai Medical Center en 2018, utiliza la relación entre tu estatura y el perímetro de tu cintura para estimar la adiposidad corporal real.",
      porQueImporta:
        "La grasa abdominal (visceral) es la directamente vinculada al riesgo cardiovascular y metabólico. La RFM tiene una correlación del 90% con densitometrías de cuerpo entero DXA.",
      datoClave:
        "Un deportista musculoso puede figurar como 'sobrepeso' en el IMC clásico, pero su RFM mostrará un porcentaje de grasa atlético y saludable.",
    },
    {
      id: "macros",
      tabLabel: "Macros",
      titulo: "Reparto de Macronutrientes (ISSN)",
      subtitulo: "Cómo cada nutriente cumple una función bioquímica irremplazable",
      badge: "Nutrición",
      icon: Dna,
      color: "text-teal-500",
      queEs:
        "Tu cuerpo no solo necesita calorías neutras, sino bloques funcionales específicos: Proteínas (aminoácidos estructurales), Grasas (lípidos hormonales) y Carbohidratos (glucosa energética).",
      porQueImporta:
        "Las pautas de la Sociedad Internacional de Nutrición Deportiva (ISSN) priorizan suficiente proteína (1.6 a 2.2 g/kg) para preservar músculo durante la pérdida de grasa o maximizar la síntesis proteica miofibrilar.",
      datoClave:
        "Las grasas nunca deben reducirse a cero: son indispensables para sintetizar hormonas como la testosterona, el estrógeno y absorber vitaminas liposolubles (A, D, E y K).",
    },
  ];

  const currentTopic = topics.find((t) => t.id === activeTopic) || topics[0];
  const CurrentIcon = currentTopic.icon;

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              ¿Qué significan estas métricas?
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Guía fisiológica y nutricional para interpretar tus resultados y entender tu metabolismo
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ease-out shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-emerald-500" : ""
          }`}
        />
      </button>

      {/* Acordeón con animación suave en CSS Grid */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 border-t border-zinc-200 dark:border-zinc-800/80"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="p-4 sm:p-5 space-y-4">
            {/* Botones de selección de tema: 3 columnas perfectamente simétricas y legibles sin cortes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-zinc-100/80 dark:bg-zinc-900/80 p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60">
              {topics.map((topic) => {
                const Icon = topic.icon;
                const isSelected = activeTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveTopic(topic.id)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-start gap-2.5 ${
                      isSelected
                        ? "bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700/80 text-zinc-950 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? topic.color : "text-zinc-400 dark:text-zinc-500"}`} />
                    <span className="truncate">{topic.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Tarjeta de Contenido Educativo Seleccionado */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3 transition-all duration-200">
              <div className="flex items-start justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <CurrentIcon className={`w-5 h-5 ${currentTopic.color}`} />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {currentTopic.titulo}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {currentTopic.subtitulo}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                  {currentTopic.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed pt-1">
                {/* Columna 1: Definición */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono block">
                    ¿Qué significa exactamente?
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {currentTopic.queEs}
                  </p>
                </div>

                {/* Columna 2: Aplicación Práctica */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono block">
                    ¿Por qué es clave para tus decisiones?
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {currentTopic.porQueImporta}
                  </p>
                </div>
              </div>

              {/* Tip / Nota Científica */}
              <div className="mt-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-zinc-900 dark:text-zinc-200">En tu plan:</strong>{" "}
                  {currentTopic.datoClave}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
