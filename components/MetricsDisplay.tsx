"use client";

import React, { useState } from "react";
import { CalculationReport } from "@/lib/types";
import { downloadReportImage, printReportDocument } from "@/lib/exportReport";
import { Download, Printer, Check, Flame, Target, Share2, Sparkles } from "lucide-react";
import { MetricsExplainer } from "@/components/MetricsExplainer";
import { ResultsReaderModal } from "@/components/ResultsReaderModal";

interface Props {
  report: CalculationReport;
}

export function MetricsDisplay({ report }: Props) {
  const { imc, tmb, get } = report;
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReader, setShowReader] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error("Error al copiar enlace:", e);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadReportImage(report);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (e) {
      console.error("Error al exportar:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setPrinting(true);
      await printReportDocument(report);
    } catch (e) {
      console.error("Error al preparar impresión:", e);
    } finally {
      setPrinting(false);
    }
  };

  // Formateador amigable de nombres de métodos científicos
  const formatMetodoTMB: Record<string, { label: string; desc: string }> = {
    katch_mc_ardle: {
      label: "Katch-McArdle",
      desc: tmb.masa_magra_kg ? `Masa magra: ${tmb.masa_magra_kg} kg` : "Por masa libre de grasa",
    },
    mifflin_st_jeor: {
      label: "Mifflin-St Jeor",
      desc: "Ecuación 1990",
    },
    oxford_henry: {
      label: "Oxford / Henry",
      desc: "Consenso FAO/OMS/UNU",
    },
    auto: {
      label: "Automática",
      desc: "Selección óptima",
    },
  };

  const infoMetodo = formatMetodoTMB[tmb.metodo_utilizado] || {
    label: tmb.metodo_utilizado,
    desc: "Cálculo metabólico",
  };

  const etiquetaIMC = (() => {
    const raw = imc.clasificacion_oms.toLowerCase();
    if (raw.includes("bajo")) return "Bajo peso";
    if (raw.includes("normal")) return "Normopeso";
    if (raw.includes("sobrepeso")) return "Sobrepeso";
    if (raw.includes("grado 1")) return "Obesidad I";
    if (raw.includes("grado 2")) return "Obesidad II";
    if (raw.includes("grado 3")) return "Obesidad III";
    return imc.clasificacion_oms.split(" (")[0];
  })();

  const totalMacroKcal =
    get.macronutrientes.proteinas_kcal +
    get.macronutrientes.grasas_kcal +
    get.macronutrientes.carbohidratos_kcal;

  const pctProt = totalMacroKcal > 0 ? (get.macronutrientes.proteinas_kcal / totalMacroKcal) * 100 : 30;
  const pctGrasa = totalMacroKcal > 0 ? (get.macronutrientes.grasas_kcal / totalMacroKcal) * 100 : 30;
  const pctCarbs = totalMacroKcal > 0 ? (get.macronutrientes.carbohidratos_kcal / totalMacroKcal) * 100 : 40;

  // Formato claro y compacto para el ajuste del objetivo calórico
  const diffKcal = get.diferencia_calorica_kcal;
  const objetivoBadge =
    diffKcal === 0
      ? {
          text: "Mantenimiento",
          pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
        }
      : diffKcal < 0
      ? {
          text: `Déficit ${Math.abs(diffKcal).toFixed(0)} kcal`,
          pill: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
        }
      : {
          text: `Superávit +${diffKcal.toFixed(0)} kcal`,
          pill: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
        };

  return (
    <div className="space-y-4">
      {/* Barra de Acciones / Exportación */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
          Resultados Calculados
        </span>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Compartir enlace */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs font-medium transition-colors bg-white dark:bg-zinc-900/50 shadow-sm"
            title="Copiar enlace con tus datos"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartir</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={printing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs font-medium transition-colors bg-white dark:bg-zinc-900/50 shadow-sm active:scale-95 disabled:opacity-50"
            title="Imprimir o guardar como PDF en formato A4 exacto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{printing ? "Generando..." : "Imprimir / PDF"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Descargar informe de estimación en alta resolución (PNG)"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>¡Descargado!</span>
              </>
            ) : downloading ? (
              <span>Generando...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Descargar Informe (PNG)</span>
                <span className="sm:hidden">Descargar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resumen Principal de 3 Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* IMC */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
              IMC
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 whitespace-nowrap"
              style={{
                backgroundColor: `${imc.color_semaforo}15`,
                borderColor: `${imc.color_semaforo}35`,
                color: imc.color_semaforo,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: imc.color_semaforo }}
              />
              <span>{etiquetaIMC}</span>
            </span>
          </div>

          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono num-tabular">
              {imc.imc_estandar.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1.5">kg/m²</span>
          </div>

          <div className="text-[11px] text-zinc-500 flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-2 font-mono">
            <span>normopeso</span>
            <span className="text-zinc-700 dark:text-zinc-300">{imc.peso_minimo_saludable_kg} - {imc.peso_maximo_saludable_kg}kg</span>
          </div>
        </div>

        {/* TMB (Basal) */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
              TMB
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0 whitespace-nowrap font-sans">
              <Flame className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{infoMetodo.label}</span>
            </span>
          </div>

          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono num-tabular">
              {tmb.tmb_kcal.toFixed(0)}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1.5">kcal / día</span>
          </div>

          <div className="text-[11px] text-zinc-500 flex justify-between items-center border-t border-zinc-100 dark:border-zinc-900 pt-2 font-mono">
            <span>reposo</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-sans font-medium truncate ml-1">{tmb.masa_magra_kg ? `Masa magra ${tmb.masa_magra_kg}kg` : infoMetodo.desc}</span>
          </div>
        </div>

        {/* Meta Calórica Diaria */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
              Meta
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 whitespace-nowrap font-sans ${objetivoBadge.pill}`}
            >
              <Target className="w-3 h-3 shrink-0" />
              <span>{objetivoBadge.text}</span>
            </span>
          </div>

          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-amber-600 dark:text-amber-200 font-mono num-tabular">
              {get.calorias_objetivo_kcal.toFixed(0)}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1.5">kcal / día</span>
          </div>

          <div className="text-[11px] text-zinc-500 flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-2 font-mono">
            <span>mantenimiento</span>
            <span className="text-zinc-700 dark:text-zinc-300">{get.get_mantenimiento_kcal.toFixed(0)} kcal</span>
          </div>
        </div>
      </div>

      {/* Proyección de Ritmo Semanal y Lectura de Resultados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
          <span className="font-medium">
            {diffKcal === 0 && "Ritmo estimado: Peso estable (0.0 kg/sem) • Recomposición corporal"}
            {diffKcal < -450 && "Ritmo estimado: ~0.6 a 0.8 kg perdidos / sem (Déficit agresivo)"}
            {diffKcal < 0 && diffKcal >= -450 && "Ritmo estimado: ~0.35 a 0.5 kg perdidos / sem (Pérdida de grasa óptima)"}
            {diffKcal > 0 && diffKcal <= 300 && "Ritmo estimado: +0.2 a 0.3 kg / sem (Volumen limpio controlado)"}
            {diffKcal > 300 && "Ritmo estimado: +0.35 a 0.5 kg / sem (Superávit para fuerza y masa)"}
          </span>
          <span className="text-[11px] font-mono opacity-80 shrink-0 hidden md:inline ml-1">
            ({diffKcal === 0 ? "0 kcal" : diffKcal < 0 ? `${diffKcal.toFixed(0)} kcal/d` : `+${diffKcal.toFixed(0)} kcal/d`})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowReader(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition-all shrink-0 border border-amber-500/30 shadow-xs active:scale-95"
          title="Abrir lectura interpretativa de tus resultados"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Leer mis resultados</span>
        </button>
      </div>

      {/* Barra de Distribución y Macronutrientes */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
            Reparto de Macronutrientes
          </span>
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">ISSN Guidelines</span>
        </div>

        {/* Barra ultra delgada */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden flex gap-0.5">
            <div className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-l-full transition-all duration-200" style={{ width: `${pctProt}%` }} />
            <div className="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-200" style={{ width: `${pctGrasa}%` }} />
            <div className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-r-full transition-all duration-200" style={{ width: `${pctCarbs}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
            <span>P {pctProt.toFixed(0)}%</span>
            <span>G {pctGrasa.toFixed(0)}%</span>
            <span>C {pctCarbs.toFixed(0)}%</span>
          </div>
        </div>

        {/* Valores numéricos */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40">
            <div className="flex items-baseline justify-between mb-0.5">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Proteínas</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {(get.macronutrientes.proteinas_g / report.perfil.peso_kg).toFixed(1)} g/kg
              </span>
            </div>
            <span className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-100 num-tabular">
              {get.macronutrientes.proteinas_g.toFixed(0)}g
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">
              {get.macronutrientes.proteinas_kcal.toFixed(0)} kcal
            </span>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">Grasas</span>
            <span className="text-lg font-mono font-semibold text-amber-600 dark:text-amber-300 num-tabular">
              {get.macronutrientes.grasas_g.toFixed(0)}g
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">
              {get.macronutrientes.grasas_kcal.toFixed(0)} kcal
            </span>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">Carbohidratos</span>
            <span className="text-lg font-mono font-semibold text-zinc-700 dark:text-zinc-300 num-tabular">
              {get.macronutrientes.carbohidratos_g.toFixed(0)}g
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">
              {get.macronutrientes.carbohidratos_kcal.toFixed(0)} kcal
            </span>
          </div>
        </div>
      </div>

      {/* Desglose metabólico secundario con tarjetas estructuradas y simétricas */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Nuevo IMC</span>
            <span className="text-base font-mono font-semibold text-zinc-900 dark:text-zinc-100 num-tabular">
              {imc.nuevo_imc_trefethen.toFixed(1)}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-sans mt-0.5">Ajuste Oxford 3D</span>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Efecto TEF</span>
            <span className="text-base font-mono font-semibold text-zinc-900 dark:text-zinc-100 num-tabular">
              ~{get.tef_estimado_kcal.toFixed(0)} <span className="text-[10px] font-normal text-zinc-400 font-sans">kcal</span>
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-sans mt-0.5">Digestión (~10%)</span>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Gasto Actividad</span>
            <span className="text-base font-mono font-semibold text-zinc-900 dark:text-zinc-100 num-tabular">
              ~{get.gasto_actividad_kcal.toFixed(0)} <span className="text-[10px] font-normal text-zinc-400 font-sans">kcal</span>
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-sans mt-0.5">EAT + NEAT diario</span>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-900 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Grasa Relativa</span>
            <span className="text-base font-mono font-semibold text-zinc-900 dark:text-zinc-100 num-tabular">
              {imc.rfm_grasa_estimada ? `${imc.rfm_grasa_estimada}%` : "—"}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-sans mt-0.5">Cintura / Estatura</span>
          </div>
        </div>
      </div>

      {/* Sección Educativa "¿Qué significan estas métricas?" */}
      <MetricsExplainer />

      {/* Modal Interactivo de Lectura de Resultados */}
      <ResultsReaderModal
        report={report}
        isOpen={showReader}
        onClose={() => setShowReader(false)}
      />
    </div>
  );
}
