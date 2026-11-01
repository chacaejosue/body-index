"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CalculationReport } from "@/lib/types";
import {
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  Heart,
  Flame,
  Target,
  Utensils,
  Lightbulb,
} from "lucide-react";

interface Props {
  report: CalculationReport;
  isOpen: boolean;
  onClose: () => void;
}

export function ResultsReaderModal({ report, isOpen, onClose }: Props) {
  const { perfil, imc, tmb, get } = report;
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Detener voz al cerrar
  useEffect(() => {
    if (!isOpen && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Generador de lectura e interpretación de resultados
  const narrative = useMemo(() => {
    const esHombre = perfil.sexo === "masculino";
    const etiquetaHombreMujer = esHombre ? "un hombre" : "una mujer";

    // 1. Diagnóstico corporal
    let textoIMC = "";
    if (imc.clasificacion_oms.toLowerCase().includes("normal")) {
      textoIMC = `Tu Índice de Masa Corporal es de ${imc.imc_estandar.toFixed(1)} kg/m², lo que indica que te encuentras en un rango de peso saludable. Para tu estatura de ${perfil.estatura_m.toFixed(2)} m, un peso de referencia equilibrado se sitúa entre ${imc.peso_minimo_saludable_kg} y ${imc.peso_maximo_saludable_kg} kg.`;
    } else if (imc.clasificacion_oms.toLowerCase().includes("sobrepeso")) {
      textoIMC = `Tu IMC es de ${imc.imc_estandar.toFixed(1)} kg/m². Recuerda que el IMC clásico no diferencia entre masa muscular y grasa. Tu rango ponderal de referencia saludable está entre ${imc.peso_minimo_saludable_kg} y ${imc.peso_maximo_saludable_kg} kg.`;
    } else if (imc.clasificacion_oms.toLowerCase().includes("obesidad")) {
      textoIMC = `Tu IMC se sitúa en ${imc.imc_estandar.toFixed(1)} kg/m². Más allá de un número en la báscula, lo importante es mejorar hábitos sostenibles paso a paso. Tu rango de referencia saludable se encuentra entre ${imc.peso_minimo_saludable_kg} y ${imc.peso_maximo_saludable_kg} kg.`;
    } else {
      textoIMC = `Tu IMC es de ${imc.imc_estandar.toFixed(1)} kg/m², ubicándose en la franja de peso bajo. Tu rango sugerido de equilibrio saludable es entre ${imc.peso_minimo_saludable_kg} y ${imc.peso_maximo_saludable_kg} kg.`;
    }

    if (imc.rfm_grasa_estimada) {
      textoIMC += ` Además, según la relación entre tu estatura y cintura (fórmula RFM del Cedars-Sinai), tu grasa corporal estimada es de aproximadamente ${imc.rfm_grasa_estimada}%, un valor que refleja mejor tu composición real que la báscula sola.`;
    }

    // 2. Metabolismo
    const textoTMB = `Tu cuerpo consume aproximadamente ${tmb.tmb_kcal.toFixed(0)} calorías al día solo por mantenerte con vida (respirar, latidos del corazón y regeneración celular). Es tu umbral de seguridad: nunca deberías comer por debajo de este valor de forma prolongada. Al sumar tus actividades diarias y entrenamientos (${perfil.nivel_actividad}), tu gasto total diario alcanza unas ${get.get_mantenimiento_kcal.toFixed(0)} calorías. Si consumieras exactamente esa cantidad, tu peso permanecería estable.`;

    // 3. Meta y ritmo
    const diff = get.diferencia_calorica_kcal;
    let textoObjetivo = "";
    if (diff === 0) {
      textoObjetivo = `Como tu meta es mantenimiento (${get.calorias_objetivo_kcal.toFixed(0)} kcal/día), tu cuerpo se mantendrá en equilibrio. Es el escenario ideal para recomposición corporal: perder algo de grasa y ganar tono muscular sin variaciones bruscas de peso.`;
    } else if (diff < 0) {
      textoObjetivo = `Para tu objetivo de pérdida de grasa, tu meta diaria sugerida es de ${get.calorias_objetivo_kcal.toFixed(0)} calorías (un déficit controlado de ${Math.abs(diff).toFixed(0)} kcal). A este ritmo, es razonable esperar una reducción de grasa sostenible de entre 0.3 y 0.6 kg por semana, protegiendo tu masa muscular y energía.`;
    } else {
      textoObjetivo = `Para tu objetivo de ganancia muscular, tu meta diaria sugerida es de ${get.calorias_objetivo_kcal.toFixed(0)} calorías (un superávit controlado de +${diff.toFixed(0)} kcal). Esto proporciona la energía extra necesaria para construir nuevo tejido muscular en tus entrenamientos sin acumular grasa excesiva.`;
    }

    // 4. Plato y macros
    const ratioGKg = (get.macronutrientes.proteinas_g / perfil.peso_kg).toFixed(1);
    const textoMacros = `Para cubrir tus ${get.calorias_objetivo_kcal.toFixed(0)} kcal diarias de manera óptima según las guías internacionales (ISSN), tu reparto recomendado es:
• Proteínas (${get.macronutrientes.proteinas_g.toFixed(0)}g o ${ratioGKg} g/kg): Esenciales para reparar y conservar tus músculos y mantenerte saciado (pollo, pescado, huevos, legumbres, tofu o lácteos).
• Grasas saludables (${get.macronutrientes.grasas_g.toFixed(0)}g): Vitales para el equilibrio hormonal y absorción de vitaminas (aceite de oliva, aguacate, frutos secos y semillas).
• Carbohidratos (${get.macronutrientes.carbohidratos_g.toFixed(0)}g): Tu principal combustible para el cerebro y el rendimiento deportivo (arroz, patatas, avena, frutas y verduras).`;

    // Texto continuo para síntesis de voz y copiado
    const textoCompleto = `Aquí tienes la lectura interpretativa de tus resultados calculados en BodyIndex.

Eres ${etiquetaHombreMujer} de ${perfil.edad} años, con una estatura de ${perfil.estatura_m.toFixed(2)} metros y un peso de ${perfil.peso_kg} kilogramos.

1. Tu complexión corporal:
${textoIMC}

2. Tu motor metabólico:
${textoTMB}

3. Tu plan y calorías recomendadas:
${textoObjetivo}

4. Cómo repartir tus alimentos:
${textoMacros}

Consejo clave: la constancia en tus hábitos y una buena hidratación valen más que cualquier dieta restrictiva temporal.`;

    return {
      textoIMC,
      textoTMB,
      textoObjetivo,
      textoMacros,
      textoCompleto,
    };
  }, [perfil, imc, tmb, get]);

  // Manejo de lectura en voz alta nativa
  const handleToggleVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel(); // Limpiar colas previas
      const utterance = new SpeechSynthesisUtterance(narrative.textoCompleto);
      utterance.lang = "es-ES";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Buscar voz en español si está disponible
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
      if (spanishVoice) utterance.voice = spanishVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(narrative.textoCompleto);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error("Error al copiar texto:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera del modal */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Lectura de tus Resultados
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Resumen interpretativo de tus métricas calculadas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable con estilo limpio */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {/* Tarjeta 1: Complexión corporal */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
              <Heart className="w-4 h-4 text-rose-500" />
              <h3>1. Tu Complexión y Rango de Peso</h3>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {narrative.textoIMC}
            </p>
          </div>

          {/* Tarjeta 2: Motor metabólico */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3>2. Tu Motor Metabólico (TMB y Gasto Total)</h3>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {narrative.textoTMB}
            </p>
          </div>

          {/* Tarjeta 3: Objetivo y ritmo */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
              <Target className="w-4 h-4 text-emerald-500" />
              <h3>3. Tu Meta Diaria y Qué Esperar</h3>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {narrative.textoObjetivo}
            </p>
          </div>

          {/* Tarjeta 4: Macronutrientes y mesa */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
              <Utensils className="w-4 h-4 text-blue-500" />
              <h3>4. Cómo Armar tu Plato (Macronutrientes)</h3>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line font-sans">
              {narrative.textoMacros}
            </p>
          </div>

          {/* Consejo de Oro */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-amber-700 dark:text-amber-300">Regla de oro:</strong> Este informe es una estimación cuantitativa y educativa basada en literatura científica. Ningún número reemplaza escuchar a tu cuerpo, priorizar alimentos no procesados y consultar a un profesional de la salud o nutrición.
            </p>
          </div>
        </div>

        {/* Barra de acciones inferior */}
        <div className="p-3.5 sm:p-4 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2">
            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                  isSpeaking
                    ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                    : "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700"
                }`}
                title={isSpeaking ? "Pausar lectura de voz" : "Escuchar lectura en voz alta"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Detener voz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Escuchar en voz alta</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 text-xs font-medium transition-colors shadow-sm active:scale-95"
              title="Copiar resumen al portapapeles"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar resumen</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-all shadow-sm active:scale-95 ml-auto"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
