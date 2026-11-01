"""Motor de cálculo científico BodyIndex v2."""

from .models import (
    SexoBiologico,
    NivelActividad,
    ObjetivoCalorico,
    MetodoTMB,
    PerfilUsuarioInput,
    ResultadoIMC,
    ResultadoTMB,
    ResultadoGET,
    DistribucionMacros,
    ReporteCompletoBodyIndex,
)
from .imc import (
    calcular_imc_estandar,
    clasificar_imc_oms,
    calcular_nuevo_imc_trefethen,
    calcular_rfm,
    calcular_whtr,
    analizar_imc,
)
from .tmb import (
    calcular_tmb_mifflin_st_jeor,
    calcular_tmb_katch_mc_ardle,
    calcular_tmb_oxford_henry,
    calcular_tmb,
)
from .get import (
    calcular_get,
    calcular_calorias_objetivo,
    calcular_macronutrientes,
    calcular_gasto_energetico,
)

from .calculadora import generar_reporte_completo

__all__ = [
    "SexoBiologico",
    "NivelActividad",
    "ObjetivoCalorico",
    "MetodoTMB",
    "PerfilUsuarioInput",
    "ResultadoIMC",
    "ResultadoTMB",
    "ResultadoGET",
    "DistribucionMacros",
    "ReporteCompletoBodyIndex",
    "generar_reporte_completo",
    "calcular_imc_estandar",
    "clasificar_imc_oms",
    "calcular_nuevo_imc_trefethen",
    "calcular_rfm",
    "calcular_whtr",
    "analizar_imc",
    "calcular_tmb_mifflin_st_jeor",
    "calcular_tmb_katch_mc_ardle",
    "calcular_tmb_oxford_henry",
    "calcular_tmb",
    "calcular_get",
    "calcular_calorias_objetivo",
    "calcular_macronutrientes",
    "calcular_gasto_energetico",
]
