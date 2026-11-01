"""Pruebas unitarias para el módulo de Tasa Metabólica Basal."""

import pytest
from src.core.models import SexoBiologico, MetodoTMB
from src.core.tmb import (
    calcular_tmb_mifflin_st_jeor,
    calcular_tmb_katch_mc_ardle,
    calcular_tmb_oxford_henry,
    calcular_tmb,
)


def test_tmb_mifflin_hombre():
    # Hombre: 74 kg, 1.76 m (176 cm), 26 años
    # 10*74 + 6.25*176 - 5*26 + 5 = 740 + 1100 - 130 + 5 = 1715.0
    tmb = calcular_tmb_mifflin_st_jeor(74.0, 1.76, 26, SexoBiologico.MASCULINO)
    assert tmb == 1715.0


def test_tmb_mifflin_mujer():
    # Mujer: 60 kg, 1.65 m (165 cm), 30 años
    # 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
    tmb = calcular_tmb_mifflin_st_jeor(60.0, 1.65, 30, SexoBiologico.FEMENINO)
    assert tmb == 1320.25


def test_tmb_katch_mc_ardle():
    # 80 kg, 15% grasa -> Masa magra = 80 * 0.85 = 68.0 kg
    # TMB = 370 + 21.6 * 68 = 370 + 1468.8 = 1838.8 kcal
    tmb, masa_magra = calcular_tmb_katch_mc_ardle(80.0, 15.0)
    assert masa_magra == 68.0
    assert tmb == 1838.8


def test_tmb_katch_mc_ardle_invalido():
    with pytest.raises(ValueError):
        calcular_tmb_katch_mc_ardle(70.0, 1.0)
    with pytest.raises(ValueError):
        calcular_tmb_katch_mc_ardle(70.0, 85.0)


def test_tmb_oxford_henry():
    # Hombre 25 años (rango 18-30): 15.057 * 70 + 692.2 = 1053.99 + 692.2 = 1746.19
    tmb = calcular_tmb_oxford_henry(70.0, 25, SexoBiologico.MASCULINO)
    assert 1740.0 <= tmb <= 1750.0


def test_calcular_tmb_selector_auto():
    # Sin grasa corporal -> usa Mifflin
    res_sin_grasa = calcular_tmb(74.0, 1.76, 26, SexoBiologico.MASCULINO)
    assert res_sin_grasa.metodo_utilizado == MetodoTMB.MIFFLIN_ST_JEOR
    assert res_sin_grasa.tmb_kcal == 1715.0

    # Con grasa corporal -> auto-selecciona Katch-McArdle
    res_con_grasa = calcular_tmb(74.0, 1.76, 26, SexoBiologico.MASCULINO, porcentaje_grasa=15.0)
    assert res_con_grasa.metodo_utilizado == MetodoTMB.KATCH_MC_ARDLE
    assert res_con_grasa.masa_magra_kg is not None
