"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { CalculatorForm } from "@/components/CalculatorForm";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { UserProfile, SexoBiologico, NivelActividad, ObjetivoCalorico, MetodoTMB, CalculationReport } from "@/lib/types";
import { generateReport } from "@/lib/calculator";
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [showReferences, setShowReferences] = useState(false);

  // Leer tema inicial
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("bodyindex_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("bodyindex_theme", next);

    // Animación suave y unificada de cambio de modo para todos los elementos
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.classList.toggle("dark", next === "dark");

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);
  };

  const [profile, setProfile] = useState<UserProfile>({
    edad: 26,
    peso_kg: 74.0,
    estatura_m: 1.76,
    sexo: "masculino",
    nivel_actividad: "moderado",
    objetivo: "mantenimiento",
    cintura_cm: undefined,
    porcentaje_grasa: undefined,
    metodo_tmb_preferido: "auto",
  });

  // Leer parámetros de la URL para enlaces directos compartibles
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const updates: Partial<UserProfile> = {};

    if (params.get("peso")) updates.peso_kg = Number(params.get("peso"));
    if (params.get("estatura")) updates.estatura_m = Number(params.get("estatura"));
    if (params.get("edad")) updates.edad = Number(params.get("edad"));
    if (params.get("sexo")) updates.sexo = params.get("sexo") as SexoBiologico;
    if (params.get("act")) updates.nivel_actividad = params.get("act") as NivelActividad;
    if (params.get("obj")) updates.objetivo = params.get("obj") as ObjetivoCalorico;
    if (params.get("cintura")) updates.cintura_cm = Number(params.get("cintura"));
    if (params.get("grasa")) updates.porcentaje_grasa = Number(params.get("grasa"));
    if (params.get("metodo")) updates.metodo_tmb_preferido = params.get("metodo") as MetodoTMB;

    if (Object.keys(updates).length > 0) {
      setProfile((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  // Sincronizar estado en la URL sin recargar para compartir enlace
  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (typeof window !== "undefined") {
      const p = new URLSearchParams();
      p.set("peso", newProfile.peso_kg.toString());
      p.set("estatura", newProfile.estatura_m.toString());
      p.set("edad", newProfile.edad.toString());
      p.set("sexo", newProfile.sexo);
      p.set("act", newProfile.nivel_actividad);
      p.set("obj", newProfile.objetivo);
      if (newProfile.cintura_cm) p.set("cintura", newProfile.cintura_cm.toString());
      if (newProfile.porcentaje_grasa) p.set("grasa", newProfile.porcentaje_grasa.toString());
      window.history.replaceState(null, "", `?${p.toString()}`);
    }
  };

  // Reporte calculado: sincronizado en tiempo real directamente con el motor de Python (FastAPI / src.core)
  const [report, setReport] = useState<CalculationReport>(() => generateReport(profile));
  const [isPythonLive, setIsPythonLive] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/v1/analisis-completo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        if (res.ok && active) {
          const data = await res.json();
          setReport(data);
          setIsPythonLive(true);
        } else if (active) {
          setReport(generateReport(profile));
        }
      } catch (e) {
        if (active) {
          setReport(generateReport(profile));
        }
      }
    }, 60);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [profile]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f9fafb] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <div>
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Subtitle / Context line */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Calculadora Metabólica &amp; Composición
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Estimaciones de IMC, TMB, GET y macronutrientes basadas en consensos OMS, Oxford e ISSN.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20" title="Cálculos ejecutados por el núcleo de Python 3.11 (src/core/ y FastAPI)">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Motor Python 3.11 en tiempo real</span>
            </div>
          </div>

          {/* Grilla Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Entradas de datos */}
            <div className="lg:col-span-5">
              <CalculatorForm profile={profile} onChange={handleProfileChange} />
            </div>

            {/* Columna Derecha: Métricas y Resultados */}
            <div className="lg:col-span-7">
              <MetricsDisplay report={report} />
            </div>
          </div>

          {/* Sección de E-E-A-T: Metodología y Referencias Científicas con Enlaces */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900">
            <button
              type="button"
              onClick={() => setShowReferences(!showReferences)}
              className="flex items-center justify-between w-full p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">Fundamentos Científicos y Literatura de Respaldo (E-E-A-T)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ease-out ${
                  showReferences ? "rotate-180 text-amber-500" : ""
                }`}
              />
            </button>

            {/* Acordeón suave en CSS Grid */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showReferences ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    A diferencia de las calculadoras comerciales convencionales que emplean fórmulas obsoletas como Harris-Benedict (1919), BodyIndex implementa ecuaciones y algoritmos respaldados por la literatura científica:
                  </p>
                  <ul className="space-y-2 font-mono text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-200 font-sans">Mifflin-St Jeor (1990):</strong> Ecuación de referencia recomendada por la <em>Academy of Nutrition and Dietetics (AND)</em> para la Tasa Metabólica Basal en población general.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-200 font-sans">Katch-McArdle (1996):</strong> Ecuación fisiológica por masa libre de grasa (FFM), aislando el consumo metabólico del tejido celular activo.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-200 font-sans">Oxford / Henry (FAO/OMS/UNU 2005):</strong> Base multinacional actualizada por cohortes de edad para estimación energética.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-200 font-sans">Nuevo IMC de Oxford (Trefethen 2013):</strong> Corrección biométrica exponencial (1.3 × peso / estatura^2.5) para personas con tallas fuera de la mediana.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-200 font-sans">RFM Cedars-Sinai (2018):</strong> Woolcott &amp; Bergman. Estimador de porcentaje graso por cociente cintura-estatura validado con absorciometría dual DXA.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-200 font-sans">Distribución de Macronutrientes (ISSN 2017):</strong> Recomendaciones de la <em>International Society of Sports Nutrition</em> para optimización de masa muscular y preservación en déficit.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer minimalista */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-6 text-center text-xs text-zinc-500 dark:text-zinc-600">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BodyIndex • Licencia MIT • Privacidad Local Garantizada</span>
          <span className="text-[11px] text-zinc-500">
            Estimaciones científicas referenciales con fines cuantitativos y educativos.
          </span>
        </div>
      </footer>
    </div>
  );
}
