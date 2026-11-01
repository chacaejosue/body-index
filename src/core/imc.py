"""Módulo de cálculo de IMC, Trefethen, RFM y relación cintura-estatura."""

from .models import SexoBiologico, ResultadoIMC


def calcular_imc_estandar(peso_kg: float, estatura_m: float) -> float:
    """Calcula el Índice de Masa Corporal clásico de Quetelet (kg/m²)."""
    if estatura_m <= 0:
        raise ValueError("La estatura debe ser mayor a 0.")
    if peso_kg <= 0:
        raise ValueError("El peso debe ser mayor a 0.")
    return round(peso_kg / (estatura_m ** 2), 2)


def clasificar_imc_oms(imc: float) -> tuple[str, str]:
    """Clasificación oficial según los rangos establecidos por la OMS."""
    if imc < 18.5:
        return "Bajo peso", "#38bdf8"                       # Azul cielo
    if imc < 25.0:
        return "Peso normal (Saludable)", "#10b981"         # Esmeralda / Verde
    if imc < 30.0:
        return "Sobrepeso", "#f59e0b"                       # Ámbar / Amarillo
    if imc < 35.0:
        return "Obesidad Grado 1 (Moderada)", "#f97316"     # Naranja
    if imc < 40.0:
        return "Obesidad Grado 2 (Severa)", "#ef4444"       # Rojo
    return "Obesidad Grado 3 (Mórbida)", "#b91c1c"          # Rojo carmesí


def calcular_nuevo_imc_trefethen(peso_kg: float, estatura_m: float) -> float:
    """Calcula el Nuevo IMC formulado por Nick Trefethen (Universidad de Oxford, 2013).
    
    Ajusta la distorsión del exponente 2 en personas altas y bajas usando exponente 2.5.
    Fórmula: 1.3 * peso_kg / (estatura_m ** 2.5)
    """
    if estatura_m <= 0 or peso_kg <= 0:
        raise ValueError("Estatura y peso deben ser valores positivos.")
    return round(1.3 * peso_kg / (estatura_m ** 2.5), 2)


def calcular_rfm(estatura_m: float, cintura_cm: float, sexo: SexoBiologico) -> float:
    """Calcula la Masa Grasa Relativa (RFM - Cedars-Sinai Medical Center, 2018).
    
    Validado como un predictor de grasa corporal más exacto que el IMC en adultos.
    Hombres: 64 - (20 * (estatura_m * 100 / cintura_cm))
    Mujeres: 76 - (20 * (estatura_m * 100 / cintura_cm))
    """
    if cintura_cm <= 0 or estatura_m <= 0:
        raise ValueError("Estatura y cintura deben ser valores positivos.")
    estatura_cm = estatura_m * 100.0
    constante = 64.0 if sexo == SexoBiologico.MASCULINO else 76.0
    rfm = constante - (20.0 * (estatura_cm / cintura_cm))
    return round(max(3.0, min(rfm, 70.0)), 2)


def calcular_whtr(estatura_m: float, cintura_cm: float) -> tuple[float, str]:
    """Calcula el Índice Cintura-Estatura (WHtR - Waist-to-Height Ratio).
    
    Mide la adiposidad central y el riesgo cardiovascular. Límite preventivo universal: 0.50.
    """
    if cintura_cm <= 0 or estatura_m <= 0:
        raise ValueError("Estatura y cintura deben ser valores positivos.")
    whtr = round(cintura_cm / (estatura_m * 100.0), 3)
    if whtr < 0.40:
        riesgo = "Bajo peso / Posible masa grasa insuficiente"
    elif whtr < 0.50:
        riesgo = "Bajo riesgo cardiometabólico (Saludable)"
    elif whtr < 0.60:
        riesgo = "Riesgo cardiometabólico incrementado (Sobrepeso abdominal)"
    else:
        riesgo = "Riesgo cardiometabólico muy alto (Adiposidad central severa)"
    return whtr, riesgo


def analizar_imc(
    peso_kg: float,
    estatura_m: float,
    sexo: SexoBiologico,
    cintura_cm: float | None = None
) -> ResultadoIMC:
    """Consolida el análisis completo de IMC y métricas antropométricas."""
    imc_std = calcular_imc_estandar(peso_kg, estatura_m)
    clasificacion, color = clasificar_imc_oms(imc_std)
    nuevo_imc = calcular_nuevo_imc_trefethen(peso_kg, estatura_m)

    # Rango de peso saludable para IMC 18.5 y 24.9
    peso_min = round(18.5 * (estatura_m ** 2), 2)
    peso_max = round(24.9 * (estatura_m ** 2), 2)

    rfm = None
    whtr = None
    riesgo = None

    if cintura_cm is not None:
        rfm = calcular_rfm(estatura_m, cintura_cm, sexo)
        whtr, riesgo = calcular_whtr(estatura_m, cintura_cm)

    return ResultadoIMC(
        imc_estandar=imc_std,
        clasificacion_oms=clasificacion,
        color_semaforo=color,
        nuevo_imc_trefethen=nuevo_imc,
        peso_minimo_saludable_kg=peso_min,
        peso_maximo_saludable_kg=peso_max,
        rfm_grasa_estimada=rfm,
        whtr_cintura_estatura=whtr,
        riesgo_cardiometabolico=riesgo,
    )
