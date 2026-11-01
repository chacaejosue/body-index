"""Pruebas unitarias para el módulo de Gasto Energético Total y macronutrientes."""

import pytest
from src.core.models import NivelActividad, ObjetivoCalorico
from src.core.get import (
    calcular_get,
    calcular_calorias_objetivo,
    calcular_macronutrientes,
    calcular_gasto_energetico,
)


def test_calcular_get_moderado():
    # TMB = 1715.0, Moderado = 1.55 -> 1715 * 1.55 = 2658.25
    get = calcular_get(1715.0, NivelActividad.MODERADO)
    assert get == 2658.25


def test_calcular_calorias_objetivo_deficit():
    # Mantenimiento = 2000.0, Déficit moderado (-15%) -> 2000 * 0.85 = 1700.0
    meta, diff = calcular_calorias_objetivo(2000.0, ObjetivoCalorico.DEFICIT_MODERADO)
    assert meta == 1700.0
    assert diff == -300.0


def test_calcular_macronutrientes_coherencia_calorica():
    # 70 kg, 2000 kcal en mantenimiento
    macros = calcular_macronutrientes(70.0, 2000.0, ObjetivoCalorico.MANTENIMIENTO)
    # Proteína: 70 * 1.8 = 126 g (504 kcal)
    # Grasa: 70 * 0.9 = 63 g (567 kcal)
    # Carbohidratos: (2000 - 504 - 567) = 929 kcal / 4 = 232.2 g
    assert macros.proteinas_g == 126.0
    assert macros.grasas_g == 63.0
    assert 230.0 <= macros.carbohidratos_g <= 235.0

    suma_kcal = macros.proteinas_kcal + macros.grasas_kcal + macros.carbohidratos_kcal
    assert abs(suma_kcal - 2000.0) < 5.0


def test_calcular_gasto_energetico_completo():
    res = calcular_gasto_energetico(
        tmb_kcal=1715.0,
        peso_kg=74.0,
        nivel_actividad=NivelActividad.MODERADO,
        objetivo=ObjetivoCalorico.MANTENIMIENTO,
    )
    assert res.get_mantenimiento_kcal == 2658.25
    assert res.tef_estimado_kcal > 0
    assert res.calorias_objetivo_kcal == 2658.25
    assert res.macronutrientes.proteinas_g > 0
