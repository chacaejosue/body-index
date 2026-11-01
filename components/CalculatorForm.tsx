"use client";

import React, { useState } from "react";
import {
  UserProfile,
  SexoBiologico,
  NivelActividad,
  ObjetivoCalorico,
  MetodoTMB,
} from "@/lib/types";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

interface Props {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export function CalculatorForm({ profile, onChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (field: keyof UserProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const nivelesActividad: { key: NivelActividad; label: string; pal: string }[] = [
    { key: "sedentario", label: "Sedentario", pal: "1.2" },
    { key: "ligero", label: "Ligero", pal: "1.38" },
    { key: "moderado", label: "Moderado", pal: "1.55" },
    { key: "fuerte", label: "Activo", pal: "1.73" },
    { key: "muy_fuerte", label: "Atleta", pal: "1.9" },
  ];

  const objetivos: { key: ObjetivoCalorico; label: string; delta: string }[] = [
    { key: "deficit_agresivo", label: "Déficit -25%", delta: "-25%" },
    { key: "deficit_moderado", label: "Déficit -15%", delta: "-15%" },
    { key: "mantenimiento", label: "Mantenimiento", delta: "0%" },
    { key: "superavit_ligero", label: "Superávit +10%", delta: "+10%" },
    { key: "superavit_volumen", label: "Volumen +15%", delta: "+15%" },
  ];

  const guiaActividad: Record<NivelActividad, { titulo: string; desc: string }> = {
    sedentario: {
      titulo: "Sedentario",
      desc: "Trabajo de escritorio / estudio, poco o ningún ejercicio.",
    },
    ligero: {
      titulo: "Ligero",
      desc: "Ejercicio ligero 1 a 2 días por semana o caminatas activas.",
    },
    moderado: {
      titulo: "Moderado",
      desc: "Entrenamiento en gimnasio o deporte 3 a 5 días por semana.",
    },
    fuerte: {
      titulo: "Activo",
      desc: "Ejercicio intenso 6 a 7 días por semana o empleo físico activo.",
    },
    muy_fuerte: {
      titulo: "Atleta",
      desc: "Doble sesión diaria o atletas de competición de alto nivel.",
    },
  };

  const guiaObjetivo: Record<ObjetivoCalorico, { titulo: string; desc: string }> = {
    deficit_agresivo: {
      titulo: "Déficit Agresivo (-25%)",
      desc: "Pérdida rápida (~0.6 - 0.8 kg/sem). Solo para periodos breves.",
    },
    deficit_moderado: {
      titulo: "Déficit Moderado (-15%)",
      desc: "Pérdida de grasa sostenible (~0.35 - 0.5 kg/sem) protegiendo el músculo.",
    },
    mantenimiento: {
      titulo: "Mantenimiento (0%)",
      desc: "Peso estable. Óptimo para recomposición corporal, fuerza y rendimiento.",
    },
    superavit_ligero: {
      titulo: "Superávit Controlado (+10%)",
      desc: "Volumen limpio (~0.2 - 0.3 kg/sem) maximizando síntesis muscular.",
    },
    superavit_volumen: {
      titulo: "Superávit Fuerte (+15%)",
      desc: "Volumen avanzado y fuerza (~0.35 - 0.5 kg/sem).",
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-5 sm:space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
          Entrada de Datos
        </h2>
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600">métrico / si</span>
      </div>

      {/* Sexo Biológico - Segmented Switch */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Sexo Biológico</label>
        <div className="grid grid-cols-2 gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/60">
          <button
            type="button"
            onClick={() => update("sexo", "masculino")}
            className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              profile.sexo === "masculino"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-sm font-semibold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Masculino
          </button>
          <button
            type="button"
            onClick={() => update("sexo", "femenino")}
            className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              profile.sexo === "femenino"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-sm font-semibold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Femenino
          </button>
        </div>
      </div>

      {/* Sliders e Inputs con Stepper Numérico: Edad, Peso, Estatura */}
      <div className="space-y-4">
        {/* Edad */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Edad</label>
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => update("edad", Math.max(14, profile.edad - 1))}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold select-none"
                title="Restar 1 año"
              >
                −
              </button>
              <div className="flex items-center gap-1 px-1">
                <input
                  type="number"
                  min={14}
                  max={95}
                  value={profile.edad}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) update("edad", Math.min(95, Math.max(14, val)));
                  }}
                  className="w-8 text-center bg-transparent text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">años</span>
              </div>
              <button
                type="button"
                onClick={() => update("edad", Math.min(95, profile.edad + 1))}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold select-none"
                title="Sumar 1 año"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min={14}
            max={90}
            step={1}
            value={profile.edad}
            onChange={(e) => update("edad", Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Peso (deslizamiento de 1 kg en 1 kg y anotación libre con decimales) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Peso Corporal</label>
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => update("peso_kg", Math.max(30, Number((profile.peso_kg - 1).toFixed(1))))}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold select-none"
                title="Restar 1 kg"
              >
                −
              </button>
              <div className="flex items-center gap-1 px-1">
                <input
                  type="number"
                  min={30}
                  max={250}
                  step={0.1}
                  value={profile.peso_kg}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) update("peso_kg", Math.min(250, Math.max(30, val)));
                  }}
                  className="w-12 text-center bg-transparent text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">kg</span>
              </div>
              <button
                type="button"
                onClick={() => update("peso_kg", Math.min(250, Number((profile.peso_kg + 1).toFixed(1))))}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold select-none"
                title="Sumar 1 kg"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min={35}
            max={180}
            step={1}
            value={profile.peso_kg}
            onChange={(e) => update("peso_kg", Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Estatura */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Estatura</label>
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => update("estatura_m", Math.max(1.3, Number((profile.estatura_m - 0.01).toFixed(2))))}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold select-none"
                title="Restar 1 cm"
              >
                −
              </button>
              <div className="flex items-center gap-1 px-1">
                <input
                  type="number"
                  min={130}
                  max={230}
                  step={1}
                  value={Math.round(profile.estatura_m * 100)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) update("estatura_m", Math.min(2.3, Math.max(1.3, val / 100)));
                  }}
                  className="w-10 text-center bg-transparent text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">cm</span>
              </div>
              <button
                type="button"
                onClick={() => update("estatura_m", Math.min(2.3, Number((profile.estatura_m + 0.01).toFixed(2))))}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold select-none"
                title="Sumar 1 cm"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min={1.3}
            max={2.25}
            step={0.005}
            value={profile.estatura_m}
            onChange={(e) => update("estatura_m", Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Nivel de Actividad */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-baseline text-xs">
          <label className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Actividad Física Semanal</label>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Frecuencia deportiva</span>
        </div>
        <div className="grid grid-cols-5 gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/60">
          {nivelesActividad.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => update("nivel_actividad", n.key)}
              className={`py-1.5 px-1 rounded-md text-[11px] text-center transition-all duration-150 ${
                profile.nivel_actividad === n.key
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title={`Factor de Actividad: ${n.pal}`}
            >
              {n.label}
            </button>
          ))}
        </div>
        {/* Guía dinámica contextual */}
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 leading-snug">
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {guiaActividad[profile.nivel_actividad].titulo}:
          </span>{" "}
          <span>{guiaActividad[profile.nivel_actividad].desc}</span>
        </div>
      </div>

      {/* Objetivo */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline text-xs">
          <label className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Objetivo Calórico</label>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Ajuste energético</span>
        </div>
        <div className="grid grid-cols-5 gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/60">
          {objetivos.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => update("objetivo", o.key)}
              className={`py-1.5 px-1 rounded-md text-[11px] text-center font-mono transition-all duration-150 ${
                profile.objetivo === o.key
                  ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-300 font-semibold shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {o.delta}
            </button>
          ))}
        </div>
        {/* Guía dinámica de objetivo */}
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-amber-500/5 dark:bg-amber-400/5 p-2.5 rounded-lg border border-amber-500/20 dark:border-amber-400/15 leading-snug">
          <span className="font-semibold text-amber-700 dark:text-amber-300">
            {guiaObjetivo[profile.objetivo].titulo}:
          </span>{" "}
          <span>{guiaObjetivo[profile.objetivo].desc}</span>
        </div>
      </div>

      {/* Botón mediciones avanzadas con animación soft */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 py-1 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            <span className="font-medium">Parámetros avanzados (cintura, % grasa y método)</span>
            {(profile.cintura_cm !== undefined || profile.porcentaje_grasa !== undefined || (profile.metodo_tmb_preferido && profile.metodo_tmb_preferido !== "auto")) && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-medium">
                activo
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
              showAdvanced ? "rotate-180 text-emerald-500" : "text-zinc-400"
            }`}
          />
        </button>

        {/* Acordeón con animación fluida en CSS Grid */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showAdvanced
              ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden space-y-4">
            {/* Cintura */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Cintura</span>
                  {profile.cintura_cm !== undefined && (
                    <button
                      type="button"
                      onClick={() => update("cintura_cm", undefined)}
                      className="text-[10px] text-zinc-400 hover:text-rose-500 underline"
                      title="Quitar cintura"
                    >
                      quitar
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => update("cintura_cm", Math.max(50, (profile.cintura_cm || 80) - 1))}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
                  >
                    −
                  </button>
                  <div className="flex items-center gap-1 px-1">
                    <input
                      type="number"
                      min={50}
                      max={160}
                      value={profile.cintura_cm || ""}
                      placeholder="Opcional"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        update("cintura_cm", isNaN(val) ? undefined : val);
                      }}
                      className="w-14 text-center bg-transparent text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">cm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => update("cintura_cm", Math.min(160, (profile.cintura_cm || 80) + 1))}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={55}
                max={140}
                value={profile.cintura_cm || 80}
                onChange={(e) => update("cintura_cm", Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* % Grasa */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Grasa Corporal</span>
                  {profile.porcentaje_grasa !== undefined && (
                    <button
                      type="button"
                      onClick={() => update("porcentaje_grasa", undefined)}
                      className="text-[10px] text-zinc-400 hover:text-rose-500 underline"
                      title="Quitar porcentaje de grasa"
                    >
                      quitar
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => update("porcentaje_grasa", Math.max(4, Number(((profile.porcentaje_grasa || 15) - 0.5).toFixed(1))))}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
                  >
                    −
                  </button>
                  <div className="flex items-center gap-1 px-1">
                    <input
                      type="number"
                      min={4}
                      max={55}
                      step={0.1}
                      value={profile.porcentaje_grasa || ""}
                      placeholder="Opcional"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        update("porcentaje_grasa", isNaN(val) ? undefined : val);
                      }}
                      className="w-14 text-center bg-transparent text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => update("porcentaje_grasa", Math.min(55, Number(((profile.porcentaje_grasa || 15) + 0.5).toFixed(1))))}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={6}
                max={45}
                step={0.5}
                value={profile.porcentaje_grasa || 16}
                onChange={(e) => update("porcentaje_grasa", Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Método TMB */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Ecuación TMB</label>
              <select
                value={profile.metodo_tmb_preferido || "auto"}
                onChange={(e) => update("metodo_tmb_preferido", e.target.value as MetodoTMB)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-md p-1.5 text-xs outline-none focus:border-zinc-500 cursor-pointer"
              >
                <option value="auto">Automática (Masa magra o Mifflin)</option>
                <option value="mifflin_st_jeor">Mifflin-St Jeor (Ecuación 1990)</option>
                <option value="katch_mc_ardle">Katch-McArdle (Masa Libre de Grasa)</option>
                <option value="oxford_henry">Oxford / Henry (FAO/OMS)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
