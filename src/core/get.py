"""Módulo de cálculo de Gasto Energético Total (GET / TDEE) y estimación de macronutrientes."""

from .models import (
    NivelActividad,
    ObjetivoCalorico,
    DistribucionMacros,
    ResultadoGET,
)


def calcular_get(tmb_kcal: float, nivel_actividad: NivelActividad) -> float:
    """Calcula el Gasto Energético Total de mantenimiento (GET / TDEE).
    
    Aplica el coeficiente PAL (Physical Activity Level) recomendado por la FAO/OMS.
    """
    if tmb_kcal <= 0:
        raise ValueError("La TMB debe ser un valor positivo.")
    return round(tmb_kcal * nivel_actividad.factor_pal, 2)


def calcular_calorias_objetivo(
    get_mantenimiento_kcal: float,
    objetivo: ObjetivoCalorico
) -> tuple[float, float]:
    """Ajusta las calorías diarias de acuerdo con el objetivo corporal."""
    meta = round(get_mantenimiento_kcal * objetivo.factor_ajuste, 2)
    diferencia = round(meta - get_mantenimiento_kcal, 2)
    return meta, diferencia


def calcular_macronutrientes(
    peso_kg: float,
    calorias_meta_kcal: float,
    objetivo: ObjetivoCalorico
) -> DistribucionMacros:
    """Distribuye las calorías diarias en proteínas, grasas y carbohidratos.
    
    Basado en los consensos de la Sociedad Internacional de Nutrición Deportiva (ISSN):
    - Proteína: 2.0 g/kg en déficit (protección muscular) y 1.8 g/kg en mantenimiento/volumen.
    - Grasa: 0.9 g/kg para salud hormonal y celular.
    - Carbohidratos: Cubre el remanente calórico energético.
    """
    # 1. Proteínas (4 kcal/g)
    ratio_prot = 2.0 if "deficit" in objetivo.value else 1.8
    prot_g = round(peso_kg * ratio_prot, 1)
    prot_kcal = round(prot_g * 4.0, 1)

    # 2. Grasas (9 kcal/g)
    ratio_grasa = 0.9
    grasa_g = round(peso_kg * ratio_grasa, 1)
    grasa_kcal = round(grasa_g * 9.0, 1)

    # 3. Carbohidratos (4 kcal/g)
    calorias_restantes = max(0.0, calorias_meta_kcal - prot_kcal - grasa_kcal)
    carbs_g = round(calorias_restantes / 4.0, 1)
    carbs_kcal = round(carbs_g * 4.0, 1)

    return DistribucionMacros(
        proteinas_g=prot_g,
        proteinas_kcal=prot_kcal,
        grasas_g=grasa_g,
        grasas_kcal=grasa_kcal,
        carbohidratos_g=carbs_g,
        carbohidratos_kcal=carbs_kcal,
    )


def calcular_gasto_energetico(
    tmb_kcal: float,
    peso_kg: float,
    nivel_actividad: NivelActividad,
    objetivo: ObjetivoCalorico
) -> ResultadoGET:
    """Genera el reporte metabólico completo de gasto calórico y reparto de macronutrientes."""
    get_mantenimiento = calcular_get(tmb_kcal, nivel_actividad)
    calorias_meta, diff = calcular_calorias_objetivo(get_mantenimiento, objetivo)

    # Desglose fisiológico
    tef = round(get_mantenimiento * 0.10, 2)  # Efecto térmico de los alimentos ~10%
    gasto_actividad = round(max(0.0, get_mantenimiento - tmb_kcal - tef), 2)  # NEAT + EAT

    macros = calcular_macronutrientes(peso_kg, calorias_meta, objetivo)

    return ResultadoGET(
        get_mantenimiento_kcal=get_mantenimiento,
        tef_estimado_kcal=tef,
        gasto_actividad_kcal=gasto_actividad,
        objetivo_seleccionado=objetivo,
        calorias_objetivo_kcal=calorias_meta,
        diferencia_calorica_kcal=diff,
        macronutrientes=macros,
    )
