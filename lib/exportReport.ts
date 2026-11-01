import { CalculationReport } from "./types";

/**
 * Renderiza el Informe de Estimación Metabólica y Composición en un canvas 2D
 * de alta resolución (1200 x 1680 px) con formato clínico-gráfico A4.
 */
export function generateReportCanvas(report: CalculationReport): HTMLCanvasElement | null {
  const { perfil, imc, tmb, get: getMetrics } = report;

  const width = 1200;
  const height = 1680;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // ==========================================
  // 1. FONDO EJECUTIVO Y MARCO
  // ==========================================
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Borde perimetral refinado
  ctx.beginPath();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5;
  ctx.roundRect(28, 28, width - 56, height - 56, 16);
  ctx.stroke();

  // Banda de seguridad en la cabecera
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(28, 28, width - 56, 12, [16, 16, 0, 0]);
  ctx.fill();

  // ==========================================
  // 2. CABECERA INSTITUCIONAL CON LOGO VECTORIAL
  // ==========================================
  ctx.save();
  ctx.translate(64, 60);
  const scale = 0.082;
  ctx.scale(scale, scale);

  // Gradiente del semicírculo simétrico
  const archGrad = ctx.createLinearGradient(150, 650, 850, 650);
  archGrad.addColorStop(0, "#00a86b");
  archGrad.addColorStop(0.25, "#10b981");
  archGrad.addColorStop(0.48, "#84cc16");
  archGrad.addColorStop(0.7, "#facc15");
  archGrad.addColorStop(0.88, "#f97316");
  archGrad.addColorStop(1, "#ea580c");

  ctx.beginPath();
  ctx.strokeStyle = archGrad;
  ctx.lineWidth = 96;
  ctx.lineCap = "round";
  const pathArch = new Path2D("M 152 650 A 375 375 0 1 1 848 650");
  ctx.stroke(pathArch);

  // Gradiente de la silueta humana
  const bodyGrad = ctx.createLinearGradient(500, 200, 500, 865);
  bodyGrad.addColorStop(0, "#0b726b");
  bodyGrad.addColorStop(0.45, "#0d9488");
  bodyGrad.addColorStop(0.75, "#059669");
  bodyGrad.addColorStop(1, "#10b981");

  // Cabeza con respiro natural
  ctx.beginPath();
  ctx.fillStyle = "#0f766e";
  ctx.arc(500, 395, 80, 0, 2 * Math.PI);
  ctx.fill();

  // Cuerpo
  ctx.beginPath();
  ctx.fillStyle = bodyGrad;
  const pathBody = new Path2D(`
    M 500 514
    C 472 514 380 456 284 411
    C 256 399 240 417 252 437
    C 260 450 274 466 294 476
    C 334 502 376 544 415 598
    C 428 622 436 652 448 698
    C 460 746 470 798 482 842
    C 488 858 512 858 518 842
    C 530 798 540 746 552 698
    C 564 652 572 622 585 598
    C 624 544 666 502 706 476
    C 726 466 740 450 748 437
    C 760 417 744 399 716 411
    C 620 456 528 514 500 514
    Z
  `);
  ctx.fill(pathBody);
  ctx.restore();

  // Textos de Marca
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("BodyIndex", 165, 96);

  ctx.fillStyle = "#059669";
  ctx.font = "bold 12px ui-monospace, monospace";
  ctx.fillText("ESTIMACIÓN DE COMPOSICIÓN & BALANCE ENERGÉTICO", 165, 120);

  ctx.fillStyle = "#64748b";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Ecuaciones & Literatura Científica: OMS • Oxford University • ISSN", 165, 138);

  // Metadatos del Documento (Derecha)
  const reportId = "BI-" + Math.abs(Math.sin(perfil.peso_kg * perfil.edad) * 100000).toFixed(0).padStart(6, "0");
  const fechaStr = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  ctx.textAlign = "right";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 15px -apple-system, sans-serif";
  ctx.fillText("INFORME DE ESTIMACIÓN METABÓLICA", width - 64, 88);

  ctx.fillStyle = "#64748b";
  ctx.font = "12px ui-monospace, monospace";
  ctx.fillText(`FOLIO: ${reportId}`, width - 64, 110);
  ctx.fillText(`FECHA: ${fechaStr}`, width - 64, 128);
  ctx.fillText("ENFOQUE: Estimación Cuantitativa", width - 64, 146);
  ctx.textAlign = "left";

  // Línea divisoria
  ctx.beginPath();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.moveTo(64, 168);
  ctx.lineTo(width - 64, 168);
  ctx.stroke();

  // Helper para dibujar encabezados de sección con barra de acento
  function drawSectionHeader(y: number, title: string, tag?: string) {
    ctx!.beginPath();
    ctx!.fillStyle = "#059669";
    ctx!.roundRect(64, y, 4, 20, 2);
    ctx!.fill();

    ctx!.fillStyle = "#0f172a";
    ctx!.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx!.fillText(title, 78, y + 15);

    if (tag) {
      ctx!.textAlign = "right";
      ctx!.fillStyle = "#059669";
      ctx!.font = "bold 11px 'Courier New', monospace";
      ctx!.fillText(tag, width - 64, y + 15);
      ctx!.textAlign = "left";
    }
  }

  // ==========================================
  // 3. SECCIÓN 1: FICHA ANTROPOMÉTRICA DEL USUARIO
  // ==========================================
  drawSectionHeader(195, "1. Perfil Antropométrico & Estilo de Vida", "CÓDIGO SI");

  const bioY = 230;
  const bioW = width - 128;
  const bioH = 78;

  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.roundRect(64, bioY, bioW, bioH, 10);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.stroke();

  const bioItems = [
    { label: "SEXO BIOLÓGICO", val: perfil.sexo === "masculino" ? "Masculino" : "Femenino" },
    { label: "EDAD", val: `${perfil.edad} años` },
    { label: "PESO CORPORAL", val: `${perfil.peso_kg.toFixed(1)} kg` },
    { label: "ESTATURA", val: `${(perfil.estatura_m * 100).toFixed(0)} cm (${perfil.estatura_m.toFixed(2)}m)` },
    {
      label: "ACTIVIDAD SEMANAL",
      val: perfil.nivel_actividad.toUpperCase(),
      sub: "Factor PAL",
    },
    {
      label: "COMPOSICIÓN GRASA",
      val: perfil.porcentaje_grasa ? `${perfil.porcentaje_grasa}%` : (imc.rfm_grasa_estimada ? `~${imc.rfm_grasa_estimada}% RFM` : "Estimación estándar"),
    },
  ];

  const colBioW = bioW / bioItems.length;
  bioItems.forEach((item, i) => {
    const colX = 64 + i * colBioW + 16;
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 10px ui-monospace, monospace";
    ctx.fillText(item.label, colX, bioY + 28);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 15px -apple-system, sans-serif";
    ctx.fillText(item.val, colX, bioY + 54);
  });

  // ==========================================
  // 4. SECCIÓN 2: ANÁLISIS ANTROPOMÉTRICO (IMC & COMPOSICIÓN)
  // ==========================================
  drawSectionHeader(335, "2. Análisis Antropométrico & Rango Ponderal", "OMS • OXFORD");

  const diagY = 370;
  const cardW = (width - 128 - 24) / 2;
  const cardH = 145;

  // Tarjeta 2A: IMC Estándar OMS + Barra Semáforo
  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.roundRect(64, diagY, cardW, cardH, 10);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#475569";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.fillText("ÍNDICE DE MASA CORPORAL (OMS)", 84, diagY + 28);

  ctx.fillStyle = imc.color_semaforo;
  ctx.font = "bold 12px -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(imc.clasificacion_oms.split(" (")[0], 64 + cardW - 20, diagY + 28);
  ctx.textAlign = "left";

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 38px 'Segoe UI', -apple-system, sans-serif";
  ctx.fillText(imc.imc_estandar.toFixed(1), 84, diagY + 76);

  ctx.fillStyle = "#64748b";
  ctx.font = "14px 'Segoe UI', sans-serif";
  ctx.fillText("kg/m²", 84 + 110, diagY + 76);

  // Barra de Semáforo OMS debajo del valor
  const barY = diagY + 98;
  const barX = 84;
  const barW = cardW - 40;
  const barH = 8;

  // Segmentos: Bajo (<18.5), Normal (18.5-24.9), Sobrepeso (25-29.9), Obesidad (>=30)
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW * 0.22, barH, [4, 0, 0, 4]);
  ctx.fill();

  ctx.fillStyle = "#10b981";
  ctx.fillRect(barX + barW * 0.22, barY, barW * 0.28, barH);

  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(barX + barW * 0.50, barY, barW * 0.25, barH);

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.roundRect(barX + barW * 0.75, barY, barW * 0.25, barH, [0, 4, 4, 0]);
  ctx.fill();

  // Marcador del usuario en la barra
  const imcNorm = Math.min(40, Math.max(15, imc.imc_estandar));
  const markerRatio = (imcNorm - 15) / (40 - 15);
  const markerX = barX + barW * markerRatio;

  ctx.beginPath();
  ctx.fillStyle = "#0f172a";
  ctx.arc(markerX, barY + barH / 2, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText(`Rango normopeso saludable: ${imc.peso_minimo_saludable_kg} - ${imc.peso_maximo_saludable_kg} kg`, 84, diagY + 130);

  // Tarjeta 2B: Nuevo IMC de Oxford & Estimación Grasa
  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.roundRect(64 + cardW + 24, diagY, cardW, cardH, 10);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#475569";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.fillText("NUEVO IMC OXFORD & ADIPOSIDAD", 64 + cardW + 44, diagY + 28);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 38px 'Segoe UI', -apple-system, sans-serif";
  ctx.fillText(imc.nuevo_imc_trefethen.toFixed(1), 64 + cardW + 44, diagY + 76);

  ctx.fillStyle = "#64748b";
  ctx.font = "14px 'Segoe UI', sans-serif";
  ctx.fillText("kg/m² (Oxford)", 64 + cardW + 44 + 110, diagY + 76);

  ctx.fillStyle = "#334155";
  ctx.font = "12px -apple-system, sans-serif";
  ctx.fillText(`Masa Grasa RFM: ${imc.rfm_grasa_estimada ? `${imc.rfm_grasa_estimada}%` : "Estimación estándar"}`, 64 + cardW + 44, diagY + 108);

  ctx.fillStyle = "#64748b";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText(`Corrección alométrica exponencial (Trefethen 2013) para volumen 3D`, 64 + cardW + 44, diagY + 130);

  // ==========================================
  // 5. SECCIÓN 3: BALANCE ENERGÉTICO Y CINÉTICA METABÓLICA
  // ==========================================
  drawSectionHeader(545, "3. Cinética Metabólica & Balance Energético", "KCAL / DÍA");

  const metabY = 580;
  const metabW = width - 128;
  const metabH = 260;

  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.roundRect(64, metabY, metabW, metabH, 10);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cabecera de la tabla metabólica
  ctx.fillStyle = "#f1f5f9";
  ctx.beginPath();
  ctx.roundRect(64, metabY, metabW, 36, [10, 10, 0, 0]);
  ctx.fill();

  ctx.fillStyle = "#475569";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.fillText("COMPONENTE METABÓLICO", 84, metabY + 23);
  ctx.fillText("MECANISMO FISIOLÓGICO", 380, metabY + 23);
  ctx.textAlign = "right";
  ctx.fillText("GASTO DIARIO", width - 180, metabY + 23);
  ctx.fillText("% DEL GET", width - 84, metabY + 23);
  ctx.textAlign = "left";

  const getKcal = getMetrics.get_mantenimiento_kcal;
  const metodoLabel =
    tmb.metodo_utilizado === "katch_mc_ardle"
      ? "Katch-McArdle (Masa Libre de Grasa)"
      : tmb.metodo_utilizado === "oxford_henry"
      ? "Oxford / Henry (FAO/OMS)"
      : "Mifflin-St Jeor (1990)";

  const tmbPct = getKcal > 0 ? (tmb.tmb_kcal / getKcal) * 100 : 65;
  const tefPct = getKcal > 0 ? (getMetrics.tef_estimado_kcal / getKcal) * 100 : 10;
  const actPct = getKcal > 0 ? (getMetrics.gasto_actividad_kcal / getKcal) * 100 : 25;

  const filasMetab = [
    {
      comp: "Tasa Metabólica Basal (TMB)",
      mecanismo: metodoLabel,
      kcal: `${tmb.tmb_kcal.toFixed(0)} kcal`,
      pct: `${tmbPct.toFixed(0)}%`,
    },
    {
      comp: "Efecto Térmico de Alimentos (TEF)",
      mecanismo: "Costo energético de digestión y absorción (~10%)",
      kcal: `~${getMetrics.tef_estimado_kcal.toFixed(0)} kcal`,
      pct: `${tefPct.toFixed(0)}%`,
    },
    {
      comp: "Termogénesis por Actividad",
      mecanismo: "Gasto de ejercicio programado (EAT) + movimiento espontáneo (NEAT)",
      kcal: `~${getMetrics.gasto_actividad_kcal.toFixed(0)} kcal`,
      pct: `${actPct.toFixed(0)}%`,
    },
  ];

  filasMetab.forEach((f, idx) => {
    const rowY = metabY + 36 + idx * 42 + 26;
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillText(f.comp, 84, rowY);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText(f.mecanismo, 380, rowY);

    ctx.textAlign = "right";
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px ui-monospace, monospace";
    ctx.fillText(f.kcal, width - 180, rowY);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px ui-monospace, monospace";
    ctx.fillText(f.pct, width - 84, rowY);
    ctx.textAlign = "left";

    // Línea divisoria suave
    ctx.beginPath();
    ctx.strokeStyle = "#e2e8f0";
    ctx.moveTo(84, rowY + 14);
    ctx.lineTo(width - 84, rowY + 14);
    ctx.stroke();
  });

  // Resumen del Objetivo Prescrito (Fondo destacado)
  const destY = metabY + 168;
  ctx.beginPath();
  ctx.fillStyle = "#0f172a";
  ctx.roundRect(74, destY, metabW - 20, 80, 8);
  ctx.fill();

  const diffKcal = getMetrics.diferencia_calorica_kcal;
  const objetivoTitulo =
    diffKcal === 0
      ? "MANTENIMIENTO ENERGÉTICO (0%)"
      : diffKcal < 0
      ? `DÉFICIT CALÓRICO (${diffKcal.toFixed(0)} kcal / día)`
      : `SUPERÁVIT CALÓRICO (+${diffKcal.toFixed(0)} kcal / día)`;

  const pronosticoText =
    diffKcal === 0
      ? "Ritmo estimado: Peso estable (0.0 kg/semana) • Recomposición corporal"
      : diffKcal < -450
      ? "Ritmo estimado: Quema de grasa rápida (~0.6 - 0.8 kg/semana) • Vigilar fuerza"
      : diffKcal < 0
      ? "Ritmo estimado: Quema de grasa óptima (~0.35 - 0.5 kg/semana) • Preservación muscular"
      : diffKcal <= 300
      ? "Ritmo estimado: Ganancia muscular controlada (~0.2 - 0.3 kg/semana) • Volumen limpio"
      : "Ritmo estimado: Volumen avanzado y ganancia de masa (~0.35 - 0.5 kg/semana)";

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.fillText(objetivoTitulo, 94, destY + 30);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px 'Segoe UI', -apple-system, sans-serif";
  ctx.fillText(getMetrics.calorias_objetivo_kcal.toFixed(0), 94, destY + 66);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px 'Segoe UI', sans-serif";
  ctx.fillText("kcal objetivo / día", 94 + 115, destY + 66);

  ctx.textAlign = "right";
  ctx.fillStyle = "#facc15";
  ctx.font = "bold 12px -apple-system, sans-serif";
  ctx.fillText(pronosticoText, width - 94, destY + 48);
  ctx.textAlign = "left";

  // ==========================================
  // 6. SECCIÓN 4: DISTRIBUCIÓN DE MACRONUTRIENTES (ISSN)
  // ==========================================
  drawSectionHeader(870, "4. Distribución de Macronutrientes (Guías ISSN)", "GRAMOS & G/KG");

  const macroY = 905;
  const macroW = width - 128;
  const macroH = 295;

  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.roundRect(64, macroY, macroW, macroH, 10);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cabecera tabla de macronutrientes (columnas equilibradas para dar amplitud al rol)
  ctx.fillStyle = "#f1f5f9";
  ctx.beginPath();
  ctx.roundRect(64, macroY, macroW, 36, [10, 10, 0, 0]);
  ctx.fill();

  ctx.fillStyle = "#475569";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.fillText("MACRONUTRIENTE", 84, macroY + 23);
  ctx.fillText("GRAMOS", 270, macroY + 23);
  ctx.fillText("ENERGÍA", 380, macroY + 23);
  ctx.fillText("% CAL", 495, macroY + 23);
  ctx.fillText("RATIO (G/KG)", 595, macroY + 23);
  ctx.fillText("ROL FISIOLÓGICO CLAVE", 730, macroY + 23);

  const totalMacroKcal =
    getMetrics.macronutrientes.proteinas_kcal +
    getMetrics.macronutrientes.grasas_kcal +
    getMetrics.macronutrientes.carbohidratos_kcal;

  const protP = totalMacroKcal > 0 ? (getMetrics.macronutrientes.proteinas_kcal / totalMacroKcal) * 100 : 25;
  const grasP = totalMacroKcal > 0 ? (getMetrics.macronutrientes.grasas_kcal / totalMacroKcal) * 100 : 25;
  const carbP = totalMacroKcal > 0 ? (getMetrics.macronutrientes.carbohidratos_kcal / totalMacroKcal) * 100 : 50;

  const peso = perfil.peso_kg;
  const protRatio = (getMetrics.macronutrientes.proteinas_g / peso).toFixed(1);
  const grasRatio = (getMetrics.macronutrientes.grasas_g / peso).toFixed(1);
  const carbRatio = (getMetrics.macronutrientes.carbohidratos_g / peso).toFixed(1);

  const macrosData = [
    {
      nombre: "Proteínas",
      color: "#059669",
      g: `${getMetrics.macronutrientes.proteinas_g.toFixed(0)} g`,
      kcal: `${getMetrics.macronutrientes.proteinas_kcal.toFixed(0)} kcal`,
      pct: `${protP.toFixed(0)}%`,
      ratio: `${protRatio} g/kg`,
      rol: "Síntesis proteica miofibrilar y preservación muscular",
    },
    {
      nombre: "Grasas Saludables",
      color: "#d97706",
      g: `${getMetrics.macronutrientes.grasas_g.toFixed(0)} g`,
      kcal: `${getMetrics.macronutrientes.grasas_kcal.toFixed(0)} kcal`,
      pct: `${grasP.toFixed(0)}%`,
      ratio: `${grasRatio} g/kg`,
      rol: "Soporte hormonal, salud celular y vitaminas A, D, E, K",
    },
    {
      nombre: "Carbohidratos",
      color: "#2563eb",
      g: `${getMetrics.macronutrientes.carbohidratos_g.toFixed(0)} g`,
      kcal: `${getMetrics.macronutrientes.carbohidratos_kcal.toFixed(0)} kcal`,
      pct: `${carbP.toFixed(0)}%`,
      ratio: `${carbRatio} g/kg`,
      rol: "Combustible glucídico primario para fuerza y SNC",
    },
  ];

  macrosData.forEach((m, idx) => {
    const rowY = macroY + 36 + idx * 56 + 32;

    // Indicador circular
    ctx.beginPath();
    ctx.fillStyle = m.color;
    ctx.arc(90, rowY - 4, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 14px -apple-system, sans-serif";
    ctx.fillText(m.nombre, 104, rowY);

    ctx.font = "bold 15px ui-monospace, monospace";
    ctx.fillText(m.g, 270, rowY);

    ctx.fillStyle = "#64748b";
    ctx.font = "13px ui-monospace, monospace";
    ctx.fillText(m.kcal, 380, rowY);

    ctx.font = "bold 13px ui-monospace, monospace";
    ctx.fillText(m.pct, 495, rowY);

    ctx.fillStyle = m.color;
    ctx.font = "bold 13px ui-monospace, monospace";
    ctx.fillText(m.ratio, 595, rowY);

    ctx.fillStyle = "#475569";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText(m.rol, 730, rowY);

    // Divisor
    ctx.beginPath();
    ctx.strokeStyle = "#e2e8f0";
    ctx.moveTo(84, rowY + 18);
    ctx.lineTo(width - 84, rowY + 18);
    ctx.stroke();
  });

  // Barra gráfica tricolor de macros
  const macroBarY = macroY + 225;
  const macroBarW = macroW - 40;
  const macroBarH = 12;

  ctx.beginPath();
  ctx.fillStyle = "#059669";
  ctx.roundRect(84, macroBarY, (macroBarW * protP) / 100, macroBarH, [6, 0, 0, 6]);
  ctx.fill();

  ctx.fillStyle = "#d97706";
  ctx.fillRect(84 + (macroBarW * protP) / 100, macroBarY, (macroBarW * grasP) / 100, macroBarH);

  ctx.beginPath();
  ctx.fillStyle = "#2563eb";
  ctx.roundRect(
    84 + (macroBarW * (protP + grasP)) / 100,
    macroBarY,
    (macroBarW * carbP) / 100,
    macroBarH,
    [0, 6, 6, 0]
  );
  ctx.fill();

  ctx.fillStyle = "#64748b";
  ctx.font = "11px ui-monospace, monospace";
  ctx.fillText(`PROTEÍNAS: ${protP.toFixed(0)}%`, 84, macroBarY + 30);
  ctx.fillText(`GRASAS: ${grasP.toFixed(0)}%`, 84 + (macroBarW * protP) / 100, macroBarY + 30);
  ctx.textAlign = "right";
  ctx.fillText(`CARBOHIDRATOS: ${carbP.toFixed(0)}%`, width - 84, macroBarY + 30);
  ctx.textAlign = "left";

  // ==========================================
  // 7. SECCIÓN 5: PAUTAS PRÁCTICAS & GUÍA DE HIDRATACIÓN
  // ==========================================
  drawSectionHeader(1225, "5. Pautas Prácticas & Guía de Hidratación", "ACSM • ISSN");

  const recY = 1260;
  const recW = width - 128;
  const recH = 185;

  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.roundRect(64, recY, recW, recH, 10);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.stroke();

  const aguaL = (perfil.peso_kg * 0.035).toFixed(1);
  const pautas = [
    {
      titulo: `Hidratación Sugerida (${aguaL} L / día)`,
      desc: `Ingesta hídrica diaria recomendada basada en 35 ml/kg de peso corporal. Aumentar 500-750 ml en días de calor o entrenamiento intenso.`,
    },
    {
      titulo: "Distribución de Proteína",
      desc: "Repartir la proteína en 3 a 5 ingestas diarias de 25 a 35g para optimizar la síntesis proteica muscular (vía mTOR) y mantener la saciedad.",
    },
    {
      titulo: "Monitoreo y Progresión",
      desc: "Medir peso promedio semanal en ayunas. Reajustar la meta energética cada 3 a 4 semanas para compensar la adaptación metabólica.",
    },
  ];

  pautas.forEach((p, idx) => {
    const pX = 84 + idx * ((recW - 40) / 3);
    const pW = (recW - 60) / 3;

    ctx.fillStyle = "#059669";
    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillText(p.titulo, pX, recY + 35);

    ctx.fillStyle = "#475569";
    ctx.font = "12px -apple-system, sans-serif";

    // Text wrap manual de 2 líneas
    const words = p.desc.split(" ");
    let line = "";
    let lineY = recY + 60;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > pW && n > 0) {
        ctx.fillText(line, pX, lineY);
        line = words[n] + " ";
        lineY += 18;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, pX, lineY);
  });

  // ==========================================
  // 8. PIE DE PÁGINA & AVISO LEGAL
  // ==========================================
  const footY = 1490;
  ctx.beginPath();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.moveTo(64, footY);
  ctx.lineTo(width - 64, footY);
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText(
    "Aviso Legal: Documento generado algorítmicamente con fines informativos y de estimación cuantitativa referencial.",
    64,
    footY + 24
  );
  ctx.fillText(
    "Consensos científicos: Mifflin et al. (1990), Katch & McArdle (1996), Oxford/FAO/OMS (2005), Trefethen (2013), ISSN Guidelines (2017).",
    64,
    footY + 42
  );
  ctx.fillText(
    "Privacidad: Análisis computado íntegramente en el navegador del usuario. Cero almacenamiento externo de datos biométricos.",
    64,
    footY + 60
  );

  // Sello digital a la derecha
  ctx.textAlign = "right";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 12px ui-monospace, monospace";
  ctx.fillText("BODYINDEX CALCULATION ENGINE", width - 64, footY + 24);
  ctx.fillStyle = "#059669";
  ctx.font = "11px ui-monospace, monospace";
  ctx.fillText("VERIFICADO • CÁLCULO LOCAL VÁLIDO", width - 64, footY + 42);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px ui-monospace, monospace";
  ctx.fillText("HTTPS://BODYINDEX.APP", width - 64, footY + 60);
  ctx.textAlign = "left";

  return canvas;
}

/**
 * Genera y descarga el Informe de Estimación Metabólica como archivo PNG de alta resolución.
 */
export async function downloadReportImage(report: CalculationReport): Promise<void> {
  const canvas = generateReportCanvas(report);
  if (!canvas) return;

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const sanitize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.download = `BodyIndex_Informe_Metabolico_${sanitize(report.perfil.sexo)}_${report.perfil.peso_kg}kg.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Abre el diálogo de impresión nativo del navegador configurado para guardar en PDF
 * o imprimir en hoja A4 exacta, con el mismo diseño ejecutivo del informe descargable.
 */
export async function printReportDocument(report: CalculationReport): Promise<void> {
  const canvas = generateReportCanvas(report);
  if (!canvas) return;

  const dataUrl = canvas.toDataURL("image/png");

  // Crear un iframe invisible para aislar la hoja A4 de cualquier elemento residual de la interfaz web
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>BodyIndex - Informe de Estimación Metabólica</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 0;
        }
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        img {
          width: 100%;
          height: auto;
          max-height: 100vh;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <img id="print-sheet" src="${dataUrl}" alt="Informe BodyIndex" />
    </body>
    </html>
  `);
  doc.close();

  const printImg = doc.getElementById("print-sheet") as HTMLImageElement;
  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Error al imprimir el documento:", e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2500);
    }
  };

  if (printImg && printImg.complete) {
    setTimeout(triggerPrint, 150);
  } else if (printImg) {
    printImg.onload = () => setTimeout(triggerPrint, 150);
  } else {
    setTimeout(triggerPrint, 250);
  }
}
