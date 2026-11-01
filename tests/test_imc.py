"""Pruebas unitarias para el módulo de IMC y composición corporal."""

import pytest
from src.core.models import SexoBiologico
from src.core.imc import (
    calcular_imc_estandar,
    clasificar_imc_oms,
    calcular_nuevo_imc_trefethen,
    calcular_rfm,
    calcular_whtr,
    analizar_imc,
)


def test_calcular_imc_estandar_caso_normal():
    # 70 kg, 1.75 m -> 70 / (1.75^2) = 22.86
    imc = calcular_imc_estandar(70.0, 1.75)
    assert imc == 22.86


def test_calcular_imc_valores_invalidos():
    with pytest.raises(ValueError):
        calcular_imc_estandar(0, 1.75)
    with pytest.raises(ValueError):
        calcular_imc_estandar(70, 0)


def test_clasificacion_oms_rangos():
    assert clasificar_imc_oms(17.5)[0] == "Bajo peso"
    assert clasificar_imc_oms(22.0)[0] == "Peso normal (Saludable)"
    assert clasificar_imc_oms(27.5)[0] == "Sobrepeso"
    assert clasificar_imc_oms(32.0)[0] == "Obesidad Grado 1 (Moderada)"
    assert clasificar_imc_oms(37.0)[0] == "Obesidad Grado 2 (Severa)"
    assert clasificar_imc_oms(42.0)[0] == "Obesidad Grado 3 (Mórbida)"


def test_nuevo_imc_trefethen():
    # 70 kg, 1.75 m -> 1.3 * 70 / (1.75^2.5) = 22.46
    nuevo = calcular_nuevo_imc_trefethen(70.0, 1.75)
    assert 22.0 <= nuevo <= 23.0


def test_rfm_hombre_y_mujer():
    # Hombre: 1.80 m, cintura 85 cm -> 64 - (20 * 180 / 85) = 64 - 42.35 = 21.65%
    rfm_m = calcular_rfm(1.80, 85.0, SexoBiologico.MASCULINO)
    assert 21.0 <= rfm_m <= 22.0

    # Mujer: 1.65 m, cintura 70 cm -> 76 - (20 * 165 / 70) = 76 - 47.14 = 28.86%
    rfm_f = calcular_rfm(1.65, 70.0, SexoBiologico.FEMENINO)
    assert 28.0 <= rfm_f <= 29.5


def test_whtr_riesgo():
    # 1.80 m (180 cm), cintura 80 cm -> 80/180 = 0.444 (< 0.50)
    whtr, riesgo = calcular_whtr(1.80, 80.0)
    assert whtr == 0.444
    assert "Saludable" in riesgo

    # 1.70 m, cintura 100 cm -> 100/170 = 0.588 (entre 0.50 y 0.60)
    whtr_alto, riesgo_alto = calcular_whtr(1.70, 100.0)
    assert whtr_alto == 0.588
    assert "incrementado" in riesgo_alto


def test_analizar_imc_consolidado():
    res = analizar_imc(74.0, 1.76, SexoBiologico.MASCULINO, cintura_cm=82.0)
    assert res.imc_estandar == 23.89
    assert res.clasificacion_oms == "Peso normal (Saludable)"
    assert res.nuevo_imc_trefethen is not None
    assert res.rfm_grasa_estimada is not None
    assert res.whtr_cintura_estatura is not None
