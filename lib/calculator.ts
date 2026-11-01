import {
  UserProfile,
  ResultadoIMC,
  ResultadoTMB,
  ResultadoGET,
  CalculationReport,
  DistribucionMacros,
} from "./types";

export function calculateIMC(profile: UserProfile): ResultadoIMC {
  const { peso_kg, estatura_m, sexo, cintura_cm } = profile;
  const imc_estandar = Number((peso_kg / (estatura_m * estatura_m)).toFixed(2));

  let clasificacion_oms = "Peso normal (Saludable)";
  let color_semaforo = "#10b981";

  if (imc_estandar < 18.5) {
    clasificacion_oms = "Bajo peso";
    color_semaforo = "#38bdf8";
  } else if (imc_estandar < 25.0) {
    clasificacion_oms = "Peso normal (Saludable)";
    color_semaforo = "#10b981";
  } else if (imc_estandar < 30.0) {
    clasificacion_oms = "Sobrepeso";
    color_semaforo = "#f59e0b";
  } else if (imc_estandar < 35.0) {
    clasificacion_oms = "Obesidad Grado 1 (Moderada)";
    color_semaforo = "#f97316";
  } else if (imc_estandar < 40.0) {
    clasificacion_oms = "Obesidad Grado 2 (Severa)";
    color_semaforo = "#ef4444";
  } else {
    clasificacion_oms = "Obesidad Grado 3 (Mórbida)";
    color_semaforo = "#b91c1c";
  }

  const nuevo_imc_trefethen = Number(
    (1.3 * peso_kg / Math.pow(estatura_m, 2.5)).toFixed(2)
  );
  const peso_minimo_saludable_kg = Number((18.5 * estatura_m * estatura_m).toFixed(1));
  const peso_maximo_saludable_kg = Number((24.9 * estatura_m * estatura_m).toFixed(1));

  let rfm_grasa_estimada: number | null = null;
  let whtr_cintura_estatura: number | null = null;
  let riesgo_cardiometabolico: string | null = null;

  if (cintura_cm && cintura_cm > 0) {
    const constante = sexo === "masculino" ? 64.0 : 76.0;
    const rfm = constante - 20.0 * ((estatura_m * 100.0) / cintura_cm);
    rfm_grasa_estimada = Number(Math.max(3.0, Math.min(rfm, 70.0)).toFixed(1));

    whtr_cintura_estatura = Number((cintura_cm / (estatura_m * 100.0)).toFixed(3));
    if (whtr_cintura_estatura < 0.4) {
      riesgo_cardiometabolico = "Bajo peso / Posible masa grasa insuficiente";
    } else if (whtr_cintura_estatura < 0.5) {
      riesgo_cardiometabolico = "Bajo riesgo cardiometabólico (Saludable)";
    } else if (whtr_cintura_estatura < 0.6) {
      riesgo_cardiometabolico = "Riesgo cardiometabólico incrementado";
    } else {
      riesgo_cardiometabolico = "Riesgo cardiometabólico muy alto";
    }
  }

  return {
    imc_estandar,
    clasificacion_oms,
    color_semaforo,
    nuevo_imc_trefethen,
    peso_minimo_saludable_kg,
    peso_maximo_saludable_kg,
    rfm_grasa_estimada,
    whtr_cintura_estatura,
    riesgo_cardiometabolico,
  };
}

export function calculateTMB(profile: UserProfile): ResultadoTMB {
  const { peso_kg, estatura_m, edad, sexo, porcentaje_grasa, cintura_cm, metodo_tmb_preferido } = profile;

  let metodo = metodo_tmb_preferido || "auto";

  // Determinar porcentaje de grasa efectivo
  let grasaEfectiva = porcentaje_grasa;
  if (!grasaEfectiva && cintura_cm && cintura_cm > 0) {
    // Si no tiene % grasa pero tiene cintura, estimar RFM
    const constante = sexo === "masculino" ? 64.0 : 76.0;
    grasaEfectiva = Number((constante - 20.0 * ((estatura_m * 100.0) / cintura_cm)).toFixed(1));
  }

  // Si el usuario eligió Katch-McArdle pero no hay grasa, usar referencia promedio (15% M, 23% F)
  if (metodo === "katch_mc_ardle" && !grasaEfectiva) {
    grasaEfectiva = sexo === "masculino" ? 15.0 : 23.0;
  }

  if (metodo === "auto") {
    metodo = grasaEfectiva ? "katch_mc_ardle" : "mifflin_st_jeor";
  }

  let tmb_kcal = 0;
  let nombre_metodo = "";
  let masa_magra_kg: number | null = null;

  if (metodo === "katch_mc_ardle" && grasaEfectiva) {
    masa_magra_kg = Number((peso_kg * (1.0 - grasaEfectiva / 100.0)).toFixed(1));
    tmb_kcal = Number((370.0 + 21.6 * masa_magra_kg).toFixed(0));
    nombre_metodo = "Katch-McArdle (Masa Magra)";
  } else if (metodo === "oxford_henry") {
    if (sexo === "masculino") {
      tmb_kcal =
        edad < 18
          ? 17.686 * peso_kg + 658.2
          : edad < 30
          ? 15.057 * peso_kg + 692.2
          : edad < 60
          ? 11.472 * peso_kg + 873.1
          : 11.711 * peso_kg + 587.7;
    } else {
      tmb_kcal =
        edad < 18
          ? 13.384 * peso_kg + 692.6
          : edad < 30
          ? 14.818 * peso_kg + 486.6
          : edad < 60
          ? 8.126 * peso_kg + 845.6
          : 9.082 * peso_kg + 658.5;
    }
    tmb_kcal = Number(tmb_kcal.toFixed(0));
    nombre_metodo = "Oxford / Henry (FAO/OMS/UNU)";
  } else {
    // Mifflin-St Jeor
    const base = 10.0 * peso_kg + 6.25 * (estatura_m * 100.0) - 5.0 * edad;
    tmb_kcal = Number((sexo === "masculino" ? base + 5.0 : base - 161.0).toFixed(0));
    metodo = "mifflin_st_jeor";
    nombre_metodo = "Mifflin-St Jeor (Ecuación 1990)";
  }

  return {
    tmb_kcal,
    metodo_utilizado: metodo,
    nombre_metodo,
    masa_magra_kg,
  };
}

export function calculateGET(
  tmb_kcal: number,
  profile: UserProfile
): ResultadoGET {
  const { peso_kg, nivel_actividad, objetivo } = profile;

  const factoresPAL: Record<string, number> = {
    sedentario: 1.2,
    ligero: 1.375,
    moderado: 1.55,
    fuerte: 1.725,
    muy_fuerte: 1.9,
  };

  const factoresAjuste: Record<string, number> = {
    deficit_agresivo: 0.75,
    deficit_moderado: 0.85,
    mantenimiento: 1.0,
    superavit_ligero: 1.1,
    superavit_volumen: 1.15,
  };

  const pal = factoresPAL[nivel_actividad] || 1.55;
  const get_mantenimiento_kcal = Number((tmb_kcal * pal).toFixed(0));

  const ajuste = factoresAjuste[objetivo] || 1.0;
  const calorias_objetivo_kcal = Number((get_mantenimiento_kcal * ajuste).toFixed(0));
  const diferencia_calorica_kcal = Number((calorias_objetivo_kcal - get_mantenimiento_kcal).toFixed(0));

  const tef_estimado_kcal = Number((get_mantenimiento_kcal * 0.1).toFixed(0));
  const gasto_actividad_kcal = Number(
    Math.max(0, get_mantenimiento_kcal - tmb_kcal - tef_estimado_kcal).toFixed(0)
  );

  // Macronutrientes (ISSN)
  const ratioProt = objetivo.includes("deficit") ? 2.0 : 1.8;
  const proteinas_g = Number((peso_kg * ratioProt).toFixed(0));
  const proteinas_kcal = Number((proteinas_g * 4).toFixed(0));

  const grasas_g = Number((peso_kg * 0.9).toFixed(0));
  const grasas_kcal = Number((grasas_g * 9).toFixed(0));

  const carbsKcal = Math.max(0, calorias_objetivo_kcal - proteinas_kcal - grasas_kcal);
  const carbohidratos_g = Number((carbsKcal / 4).toFixed(0));
  const carbohidratos_kcal = Number((carbohidratos_g * 4).toFixed(0));

  const macronutrientes: DistribucionMacros = {
    proteinas_g,
    proteinas_kcal,
    grasas_g,
    grasas_kcal,
    carbohidratos_g,
    carbohidratos_kcal,
  };

  return {
    get_mantenimiento_kcal,
    tef_estimado_kcal,
    gasto_actividad_kcal,
    objetivo_seleccionado: objetivo,
    calorias_objetivo_kcal,
    diferencia_calorica_kcal,
    macronutrientes,
  };
}

export function generateReport(profile: UserProfile): CalculationReport {
  const imc = calculateIMC(profile);
  const tmb = calculateTMB(profile);
  const get = calculateGET(tmb.tmb_kcal, profile);

  return {
    perfil: profile,
    imc,
    tmb,
    get,
  };
}
