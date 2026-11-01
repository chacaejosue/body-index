"""Pruebas de integración para la fachada central de BodyIndex."""

from src.core.models import (
    PerfilUsuarioInput,
    SexoBiologico,
    NivelActividad,
    ObjetivoCalorico,
    MetodoTMB,
)
from src.core.calculadora import generar_reporte_completo


def test_generar_reporte_completo():
    perfil = PerfilUsuarioInput(
        edad=26,
        peso_kg=74.0,
        estatura_m=1.76,
        sexo=SexoBiologico.MASCULINO,
        nivel_actividad=NivelActividad.MODERADO,
        objetivo=ObjetivoCalorico.DEFICIT_MODERADO,
        cintura_cm=82.0,
        porcentaje_grasa=16.0,
    )

    reporte = generar_reporte_completo(perfil)

    # IMC
    assert reporte.imc.imc_estandar == 23.89
    assert reporte.imc.clasificacion_oms == "Peso normal (Saludable)"
    assert reporte.imc.rfm_grasa_estimada is not None

    # TMB (auto seleccionó Katch-McArdle por haber provisto porcentaje de grasa)
    assert reporte.tmb.metodo_utilizado == MetodoTMB.KATCH_MC_ARDLE
    assert reporte.tmb.masa_magra_kg is not None

    # GET
    assert reporte.get.get_mantenimiento_kcal > 1500
    assert reporte.get.calorias_objetivo_kcal < reporte.get.get_mantenimiento_kcal
    assert reporte.get.macronutrientes.proteinas_g > 0
