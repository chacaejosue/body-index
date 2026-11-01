"""Módulo de cálculo de la Tasa Metabólica Basal (TMB / BMR)."""

from .models import SexoBiologico, MetodoTMB, ResultadoTMB


def calcular_tmb_mifflin_st_jeor(
    peso_kg: float,
    estatura_m: float,
    edad: int,
    sexo: SexoBiologico
) -> float:
    """Calcula la TMB usando la ecuación de Mifflin-St Jeor (1990).
    
    Considerada la ecuación de referencia más confiable para población general por la AND.
    Hombres: 10 * peso + 6.25 * estatura_cm - 5 * edad + 5
    Mujeres: 10 * peso + 6.25 * estatura_cm - 5 * edad - 161
    """
    estatura_cm = estatura_m * 100.0
    base = (10.0 * peso_kg) + (6.25 * estatura_cm) - (5.0 * edad)
    tmb = base + 5.0 if sexo == SexoBiologico.MASCULINO else base - 161.0
    return round(tmb, 2)


def calcular_tmb_katch_mc_ardle(peso_kg: float, porcentaje_grasa: float) -> tuple[float, float]:
    """Calcula la TMB basada en la masa libre de grasa (FFM / Masa Magra).
    
    Ecuación: 370 + 21.6 * Masa Magra (kg).
    Independiente de la edad y sexo al calcular sobre el tejido metabólicamente activo.
    """
    if not (3.0 <= porcentaje_grasa <= 70.0):
        raise ValueError("El porcentaje de grasa debe estar entre 3% y 70%.")
    masa_magra_kg = round(peso_kg * (1.0 - (porcentaje_grasa / 100.0)), 2)
    tmb = round(370.0 + (21.6 * masa_magra_kg), 2)
    return tmb, masa_magra_kg


def calcular_tmb_oxford_henry(peso_kg: float, edad: int, sexo: SexoBiologico) -> float:
    """Calcula la TMB mediante las ecuaciones de Oxford / Henry (2005 - FAO/OMS/UNU).
    
    Estudio multinacional moderno que actualizó las fórmulas de Harris-Benedict y Schofield.
    """
    if sexo == SexoBiologico.MASCULINO:
        if edad < 18:
            tmb = (17.686 * peso_kg) + 658.2
        elif edad < 30:
            tmb = (15.057 * peso_kg) + 692.2
        elif edad < 60:
            tmb = (11.472 * peso_kg) + 873.1
        else:
            tmb = (11.711 * peso_kg) + 587.7
    else:  # FEMENINO
        if edad < 18:
            tmb = (13.384 * peso_kg) + 692.6
        elif edad < 30:
            tmb = (14.818 * peso_kg) + 486.6
        elif edad < 60:
            tmb = (8.126 * peso_kg) + 845.6
        else:
            tmb = (9.082 * peso_kg) + 658.5

    return round(tmb, 2)


def calcular_tmb(
    peso_kg: float,
    estatura_m: float,
    edad: int,
    sexo: SexoBiologico,
    porcentaje_grasa: float | None = None,
    metodo_preferido: MetodoTMB = MetodoTMB.AUTO
) -> ResultadoTMB:
    """Calcula la TMB seleccionando la ecuación óptima o la preferida por el usuario."""
    # Determinación del método efectivo
    metodo_efectivo = metodo_preferido
    if metodo_efectivo == MetodoTMB.AUTO:
        metodo_efectivo = (
            MetodoTMB.KATCH_MC_ARDLE
            if porcentaje_grasa is not None
            else MetodoTMB.MIFFLIN_ST_JEOR
        )

    # Si se solicitó Katch-McArdle pero no hay grasa, degradar a Mifflin-St Jeor
    if metodo_efectivo == MetodoTMB.KATCH_MC_ARDLE and porcentaje_grasa is None:
        metodo_efectivo = MetodoTMB.MIFFLIN_ST_JEOR

    masa_magra: float | None = None

    if metodo_efectivo == MetodoTMB.KATCH_MC_ARDLE and porcentaje_grasa is not None:
        tmb, masa_magra = calcular_tmb_katch_mc_ardle(peso_kg, porcentaje_grasa)
        nombre = "Katch-McArdle (Especializada por Masa Magra)"
    elif metodo_efectivo == MetodoTMB.OXFORD_HENRY:
        tmb = calcular_tmb_oxford_henry(peso_kg, edad, sexo)
        nombre = "Oxford / Henry (Estándar FAO/OMS/UNU 2005)"
    else:
        tmb = calcular_tmb_mifflin_st_jeor(peso_kg, estatura_m, edad, sexo)
        metodo_efectivo = MetodoTMB.MIFFLIN_ST_JEOR
        nombre = "Mifflin-St Jeor (Ecuación General 1990)"

    return ResultadoTMB(
        tmb_kcal=tmb,
        metodo_utilizado=metodo_efectivo,
        nombre_metodo=nombre,
        masa_magra_kg=masa_magra,
    )
